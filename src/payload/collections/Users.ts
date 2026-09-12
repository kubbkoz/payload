import { APIError } from "payload";
import type { CollectionConfig, Where } from "payload";

import { idZo, jeMaster, jeNiekdeSpravca, projektyPouzivatela } from "../access";
import { MOZNOSTI_ROL, POPIS_ROL, ROLY } from "../roly";

/**
 * Ľudia, ktorí sa prihlasujú do administrácie.
 *
 * Podstata celého systému je v poli `pristupy`: nie je to jedna rola na
 * používateľa, ale zoznam dvojíc projekt + rola. Ten istý človek teda môže byť
 * správcom jedného webu, editorom druhého a k tretiemu sa vôbec nedostane.
 * Master je jediná rola nad projektmi a smie ju udeliť zase len master.
 *
 * Správca projektu smie pozývať ľudí k SVOJIM projektom a to je celé — hook
 * nižšie mu cudzie riadky v prístupoch vráti nedotknuté, nech si do tela
 * požiadavky napíše čokoľvek.
 */
export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Používateľ", plural: "Používatelia" },
  auth: {
    tokenExpiration: 60 * 60 * 8,
    maxLoginAttempts: 8,
    lockTime: 10 * 60 * 1000,
    useAPIKey: false,
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "meno", "master", "aktivny", "updatedAt"],
    group: "Systém",
    description:
      "Kto sa dostane do administrácie a ku ktorým projektom. Prístup sa prideľuje po projektoch.",
    hidden: ({ user }) => !jeNiekdeSpravca(user),
  },
  access: {
    // Do panelu vojde len živý účet. Deaktivovanému ostane token v prehliadači
    // dožiť, tak ho zastavíme tu, nie až pri prvom dotaze.
    admin: ({ req }) => Boolean(req.user && req.user.collection === "users" && req.user.aktivny !== false),
    read: ({ req }) => {
      const u = req.user;
      if (!u) return false;
      if (jeMaster(u)) return true;
      if (u.collection !== "users") return false;

      const spravovane = projektyPouzivatela(u, "spravca");
      const klauzuly: Where[] = [{ id: { equals: u.id } }];
      if (spravovane.length) klauzuly.push({ "pristupy.projekt": { in: spravovane } });
      return { or: klauzuly };
    },
    create: ({ req }) => jeNiekdeSpravca(req.user),
    update: ({ req }) => {
      const u = req.user;
      if (!u) return false;
      if (jeMaster(u)) return true;
      if (u.collection !== "users") return false;

      const spravovane = projektyPouzivatela(u, "spravca");
      const klauzuly: Where[] = [{ id: { equals: u.id } }];
      if (spravovane.length) klauzuly.push({ "pristupy.projekt": { in: spravovane } });
      return { or: klauzuly };
    },
    // Účet maže výhradne master. Správca projektu ho odoberie zo svojho
    // projektu — zmazať človeka, ktorý robí ešte na troch iných weboch,
    // nie je odobratie prístupu, to je škoda.
    delete: ({ req }) => jeMaster(req.user),
    unlock: ({ req }) => jeNiekdeSpravca(req.user),
  },
  fields: [
    {
      name: "meno",
      label: "Meno",
      type: "text",
      required: true,
      admin: { description: "Zobrazuje sa pri záznamoch, ktoré človek vytvoril." },
    },
    {
      type: "row",
      fields: [
        {
          name: "master",
          label: "Master — správa celého systému",
          type: "checkbox",
          defaultValue: false,
          access: {
            create: ({ req }) => jeMaster(req.user),
            update: ({ req }) => jeMaster(req.user),
          },
          admin: {
            width: "50%",
            description:
              "Vidí a mení všetky projekty vrátane zakladania nových. Prideliť to smie len iný master.",
          },
        },
        {
          name: "aktivny",
          label: "Účet je aktívny",
          type: "checkbox",
          defaultValue: true,
          admin: {
            width: "50%",
            description: "Vypnuté: človek sa neprihlási a stratí prístup všade.",
          },
        },
      ],
    },
    {
      name: "pristupy",
      label: "Prístup k projektom",
      type: "array",
      labels: { singular: "Prístup", plural: "Prístupy" },
      admin: {
        description: [
          "Ku ktorým webom sa človek dostane a čo tam smie.",
          ...ROLY.map((rola) => POPIS_ROL[rola]),
        ].join(" · "),
        condition: (data) => !data?.master,
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "projekt",
              label: "Projekt",
              type: "relationship",
              relationTo: "projekty",
              required: true,
              admin: { width: "60%" },
              filterOptions: ({ req }) => {
                if (jeMaster(req?.user)) return true;
                const moje = projektyPouzivatela(req?.user, "spravca");
                return moje.length ? { id: { in: moje } } : false;
              },
            },
            {
              name: "rola",
              label: "Rola",
              type: "select",
              required: true,
              defaultValue: "editor",
              options: MOZNOSTI_ROL,
              admin: { width: "40%" },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      /**
       * Správca projektu nesmie siahnuť na prístupy, ktoré sa jeho projektov
       * netýkajú — ani omylom, ani zámerne cez REST. Cudzie riadky sa preto
       * berú z uloženého dokumentu, nie z požiadavky, a master sa cez toto
       * pole nedá udeliť vôbec.
       */
      ({ data, req, operation, originalDoc }) => {
        if (!data || !req?.user) return data;
        if (jeMaster(req.user)) return data;
        if (req.context?.preskocKontrolu) return data;

        if (data.master) {
          throw new APIError("Rolu master smie prideliť iba iný master.", 403);
        }

        const spravovane = projektyPouzivatela(req.user, "spravca").map(String);
        const vlastnyUcet =
          operation === "update" && String(originalDoc?.id) === String(req.user.id);

        if (Array.isArray(data.pristupy)) {
          const cudzie = ((originalDoc?.pristupy ?? []) as { projekt?: unknown }[]).filter(
            (p) => !spravovane.includes(String(idZo(p?.projekt))),
          );
          const moje = (data.pristupy as { projekt?: unknown }[]).filter((p) =>
            spravovane.includes(String(idZo(p?.projekt))),
          );
          data.pristupy = [...cudzie, ...moje];
        }

        // Vlastný účet si človek smie upraviť (meno, heslo), ale nie svoje
        // vlastné oprávnenia — inak by si ich len prepísal na vyššie.
        if (vlastnyUcet && operation === "update") {
          data.pristupy = originalDoc?.pristupy ?? [];
          data.aktivny = originalDoc?.aktivny ?? true;
        }

        return data;
      },
    ],
    beforeChange: [
      /**
       * Prvý účet v prázdnom systéme je vždy master. Payload pri prázdnej auth
       * kolekcii ponúkne obrazovku „vytvor prvého používateľa“ — bez tohto by
       * z nej vyšiel človek bez jediného oprávnenia a do systému by sa už
       * nikto nedostal.
       */
      async ({ data, req, operation }) => {
        if (operation !== "create") return data;
        const { totalDocs } = await req.payload.count({
          collection: "users",
          overrideAccess: true,
        });
        if (totalDocs > 0) return data;
        return { ...data, master: true, aktivny: true };
      },
      /** Posledný master v systéme sa nesmie vypnúť ani degradovať. */
      async ({ data, req, operation, originalDoc }) => {
        const strataMastera =
          operation === "update" &&
          originalDoc?.master === true &&
          (data?.master === false || data?.aktivny === false);
        if (!strataMastera) return data;

        const ini = await req.payload.count({
          collection: "users",
          where: {
            and: [
              { master: { equals: true } },
              { aktivny: { not_equals: false } },
              { id: { not_equals: originalDoc.id } },
            ],
          },
          overrideAccess: true,
        });
        if (ini.totalDocs === 0) {
          throw new APIError(
            "Toto je posledný aktívny master. Najprv urob masterom niekoho iného.",
            400,
          );
        }
        return data;
      },
    ],
  },
};
