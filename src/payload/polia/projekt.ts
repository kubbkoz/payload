import { APIError } from "payload";
import type { CollectionBeforeChangeHook, CollectionBeforeValidateHook, Field } from "payload";

import {
  aktivnyProjekt,
  idZo,
  jeMaster,
  maVProjekte,
  projektyPouzivatela,
} from "../access";
import type { Rola } from "../roly";

/**
 * Pole, ktoré robí z jednej administrácie viac backendov.
 *
 * Je povinné a indexované, lebo podľa neho filtruje každý dotaz. Sedí v bočnom
 * paneli, aby bolo pri ruke a nedalo sa prehliadnuť, a ponuka v ňom je zúžená
 * na projekty, do ktorých používateľ naozaj smie zapisovať — master vidí všetky.
 *
 * Predvyplní sa z prepínača v hlavičke, prípadne z jediného projektu, ktorý
 * človek má. Kto spravuje jeden web, pole vlastne nikdy nemusí otvoriť.
 */
export const poleProjektu = (
  aspon: Rola = "autor",
  moznosti: { readOnly?: boolean } = {},
): Field => ({
  name: "projekt",
  label: "Projekt",
  type: "relationship",
  relationTo: "projekty",
  required: true,
  index: true,
  admin: {
    position: "sidebar",
    readOnly: moznosti.readOnly ?? false,
    description: "Web, ktorému tento záznam patrí. Mimo neho ho nikto neuvidí.",
  },
  defaultValue: ({ req }) => {
    const zvoleny = aktivnyProjekt(req);
    const moje = projektyPouzivatela(req?.user, aspon);
    if (zvoleny !== null) {
      if (jeMaster(req?.user)) return zvoleny;
      if (moje.some((id) => String(id) === String(zvoleny))) return zvoleny;
    }
    return moje.length === 1 ? moje[0] : undefined;
  },
  filterOptions: ({ req }) => {
    // Bez prihláseného človeka ide o serverový zápis (endpoint, hook, seed).
    // Ten je už obmedzený prístupovými právami operácie; keby sa tu vrátilo
    // `false`, Payload by pole vyhodnotil ako neplatné a zápis by padol.
    if (!req?.user) return true;
    if (jeMaster(req.user)) return true;
    const moje = projektyPouzivatela(req.user, aspon);
    return moje.length ? { id: { in: moje } } : false;
  },
  access: {
    // Presunúť hotový záznam pod iný web smie len master. Editorovi by sa tým
    // otvorila cesta, ako vyniesť obsah z projektu, do ktorého patrí.
    update: ({ req }) => jeMaster(req.user),
  },
});

/**
 * Posledná zastávka pred zápisom. `filterOptions` aj `access` sa dajú obísť
 * priamym volaním REST API, tento hook nie — beží na serveri pri každom
 * vytvorení aj úprave.
 */
export const overProjekt =
  (aspon: Rola = "autor"): CollectionBeforeValidateHook =>
  ({ data, req, operation, originalDoc }) => {
    if (!data) return data;
    if (req?.context?.preskocKontrolu) return data;

    const cielovy = idZo(data.projekt) ?? idZo(originalDoc?.projekt);
    if (cielovy === null) {
      throw new APIError("Záznam musí patriť projektu. Vyber projekt v bočnom paneli.", 400);
    }

    // Nech sa v databáze uloží id, nie celý rozbalený dokument.
    data.projekt = cielovy;

    if (!req?.user) return data;
    if (jeMaster(req.user)) return data;

    if (!maVProjekte(req.user, cielovy, aspon)) {
      throw new APIError("K tomuto projektu nemáš oprávnenie.", 403);
    }

    // Aj keď sa v tele požiadavky objaví iný projekt, úprava ostáva tam, kde bola.
    if (operation === "update" && originalDoc) {
      const povodny = idZo(originalDoc.projekt);
      if (povodny !== null && String(povodny) !== String(cielovy)) {
        throw new APIError("Presunúť záznam pod iný projekt môže len master.", 403);
      }
    }

    return data;
  };

/** Kto záznam založil. Autori podľa toho vidia a upravujú výhradne svoje. */
export const poleVytvoril: Field = {
  name: "vytvoril",
  label: "Vytvoril",
  type: "relationship",
  relationTo: "users",
  index: true,
  admin: {
    position: "sidebar",
    readOnly: true,
    description: "Doplní sa automaticky pri založení záznamu.",
  },
};

export const zapisVytvoril: CollectionBeforeChangeHook = ({ data, req, operation }) => {
  if (operation === "create" && req?.user && req.user.collection === "users") {
    return { ...data, vytvoril: req.user.id };
  }
  return data;
};

/**
 * Autor píše, ale nezverejňuje. Payload zverejňuje cez `_status`, takže sa to
 * dá strážiť jedine tu — v UI by sa tlačidlo dalo obísť volaním API.
 */
export const obmedzZverejnenie: CollectionBeforeChangeHook = ({
  data,
  req,
  originalDoc,
}) => {
  if (!req?.user || jeMaster(req.user) || req.context?.preskocKontrolu) return data;
  if (data?._status !== "published") return data;

  const projekt = idZo(data.projekt) ?? idZo(originalDoc?.projekt);
  if (maVProjekte(req.user, projekt, "editor")) return data;

  throw new APIError(
    "Na zverejnenie nemáš oprávnenie — ulož koncept a požiadaj editora projektu.",
    403,
  );
};
