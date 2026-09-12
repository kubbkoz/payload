import { randomUUID } from "crypto";

import type { CollectionConfig } from "payload";

import { jeMaster, spravovatProjekt, vytvaratVProjekte } from "../access";
import { overProjekt, poleProjektu } from "../polia/projekt";

/**
 * Strojové prístupy pre napojené weby.
 *
 * Kľúč je viazaný na jeden projekt a je výhradne na čítanie — web si obsah
 * ťahá, nikdy ho nezapisuje. Payload kľúč šifruje a pri autentifikácii ho
 * porovnáva sám, takže tu nikde neleží v čitateľnej podobe.
 *
 * Bez kľúča to ide tiež: projekt so zapnutým „obsah dostupný bez kľúča“ vydá
 * zverejnený obsah komukoľvek z povolených domén. Kľúč je pre prípady, keď má
 * obsah ostať za zámkom, alebo keď si ho ťahá server a nie prehliadač.
 */
export const ApiKlienti: CollectionConfig = {
  slug: "api-klienti",
  labels: { singular: "API kľúč", plural: "API kľúče" },
  auth: {
    useAPIKey: true,
    disableLocalStrategy: true,
  },
  admin: {
    useAsTitle: "nazov",
    defaultColumns: ["nazov", "projekt", "aktivny", "updatedAt"],
    group: "Systém",
    description:
      "Kľúče, ktorými si napojené weby ťahajú obsah. Jeden kľúč = jeden projekt, len na čítanie.",
    hidden: ({ user }) => !user || (user as { master?: boolean }).master !== true,
  },
  access: {
    read: spravovatProjekt,
    create: vytvaratVProjekte,
    update: spravovatProjekt,
    delete: ({ req }) => jeMaster(req.user),
  },
  fields: [
    poleProjektu("spravca"),
    {
      name: "nazov",
      label: "Na čo kľúč je",
      type: "text",
      required: true,
      admin: { description: 'Napr. „Produkčný web“ alebo „Náhľad na Verceli“.' },
    },
    {
      name: "aktivny",
      label: "Kľúč platí",
      type: "checkbox",
      defaultValue: true,
      admin: {
        position: "sidebar",
        description: "Vypnuté: kľúč okamžite prestane fungovať, ale ostane zapísaný.",
      },
    },
    {
      name: "poznamka",
      label: "Poznámka",
      type: "textarea",
      admin: { description: "Kde je kľúč nasadený, kto ho dostal, kedy ho vymeniť." },
    },
  ],
  hooks: {
    /**
     * Kľúč vyrobí systém, nie človek.
     *
     * Payload ho generuje v administrácii na strane prehliadača — cez REST by
     * tak vznikol záznam so zapnutým prístupom a prázdnym kľúčom, ktorý nikdy
     * nikoho nepustí a pritom vyzerá funkčne.
     *
     * Musí to byť `beforeOperation`, nie neskorší hook: z kľúča sa počíta
     * vyhľadávací index `apiKeyIndex` a robí to poľový hook, ktorý beží ešte
     * pred kolekčnými. Kľúč doplnený neskôr by index nedostal a overenie by
     * ho nikdy nenašlo — presne ten prípad, keď kľúč v paneli vidíš, ale web
     * ním neprejde.
     */
    beforeOperation: [
      async ({ args, operation, req }) => {
        if (operation !== "create" && operation !== "update") return args;
        const data = (args as { data?: Record<string, unknown> }).data;
        if (!data || data.apiKey) return args;

        if (operation === "create") {
          (args as { data?: Record<string, unknown> }).data = {
            ...data,
            enableAPIKey: true,
            apiKey: randomUUID(),
          };
          return args;
        }

        // Pri úprave sa kľúč dopĺňa len vtedy, keď sa prístup práve zapína
        // a záznam ešte žiadny kľúč nemá.
        if (data.enableAPIKey !== true) return args;
        const id = (args as { id?: number | string }).id;
        if (id === undefined) return args;

        try {
          const existujuci = await req.payload.findByID({
            collection: "api-klienti",
            id,
            depth: 0,
            req,
            overrideAccess: true,
          });
          if ((existujuci as { apiKey?: string })?.apiKey) return args;
        } catch {
          return args;
        }

        (args as { data?: Record<string, unknown> }).data = { ...data, apiKey: randomUUID() };
        return args;
      },
    ],
    beforeValidate: [overProjekt("spravca")],
  },
};
