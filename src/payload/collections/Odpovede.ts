import type { CollectionConfig } from "payload";

import { citatObsah, filterAktivnehoProjektu, menitObsah, spravovatProjekt } from "../access";
import { poleProjektu } from "../polia/projekt";
import { relaciaVProjekte } from "../polia/spolocne";

/**
 * Čo prišlo z webu. Zakladá sa výhradne cez endpoint /api/web/<projekt>/formular
 * — v administrácii sa odpoveď vyrobiť nedá a to je zámer: tento zoznam je
 * záznam o tom, čo naozaj prišlo, nie ďalšie miesto na písanie poznámok.
 *
 * Hodnoty sú v jednom JSON poli. Stĺpce pre ne by znamenali migráciu pri
 * každom pridanom poli formulára a formulár je vec, ktorú si obsluha mení sama.
 */
export const Odpovede: CollectionConfig = {
  slug: "odpovede",
  labels: { singular: "Odpoveď", plural: "Odpovede" },
  admin: {
    useAsTitle: "suhrn",
    defaultColumns: ["suhrn", "formular", "stav", "projekt", "createdAt"],
    group: "Interakcia",
    baseListFilter: filterAktivnehoProjektu,
    description: "Odoslané formuláre z napojených webov.",
  },
  access: {
    read: citatObsah,
    create: () => false,
    update: menitObsah,
    delete: spravovatProjekt,
  },
  defaultSort: "-createdAt",
  fields: [
    poleProjektu("autor", { readOnly: true }),
    relaciaVProjekte("formulare", {
      name: "formular",
      label: "Formulár",
      required: true,
      admin: { readOnly: true },
    }),
    {
      name: "suhrn",
      label: "Zhrnutie",
      type: "text",
      admin: { readOnly: true, description: "Prvé vyplnené pole — aby bolo v zozname vidieť, o čo ide." },
    },
    {
      name: "udaje",
      label: "Vyplnené hodnoty",
      type: "json",
      admin: { readOnly: true },
    },
    {
      type: "row",
      fields: [
        {
          name: "stav",
          label: "Stav",
          type: "select",
          defaultValue: "nove",
          options: [
            { label: "Nové", value: "nove" },
            { label: "Vybavené", value: "vybavene" },
            { label: "Spam", value: "spam" },
          ],
          admin: { width: "50%" },
        },
        {
          name: "zdroj",
          label: "Odoslané zo stránky",
          type: "text",
          admin: { width: "50%", readOnly: true },
        },
      ],
    },
    {
      name: "poznamka",
      label: "Interná poznámka",
      type: "textarea",
      admin: { description: "Vidí ju len obsluha, nikam sa neposiela." },
    },
  ],
};
