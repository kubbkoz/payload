import type { CollectionConfig } from "payload";

import { citatObsah, filterAktivnehoProjektu, ibaMaster } from "../access";
import { poleProjektu } from "../polia/projekt";

/**
 * Kto čo kedy zmenil.
 *
 * Payload síce verzuje obsah, ale verzie sú vnútri záznamu — na otázku „čo sa
 * dnes dialo na projekte X“ neodpovedajú. Toto je tá odpoveď a v systéme,
 * kde do jedného panela chodí desať ľudí z rôznych firiem, je to prvá vec,
 * po ktorej master siahne, keď niečo zmizne.
 *
 * Zapisuje sa výhradne hookom. V administrácii sa nedá vytvoriť ani upraviť.
 */
export const Zaznamy: CollectionConfig = {
  slug: "zaznamy",
  labels: { singular: "Záznam činnosti", plural: "Záznam činnosti" },
  admin: {
    useAsTitle: "nazov",
    defaultColumns: ["createdAt", "akcia", "kolekcia", "nazov", "ktoPopis", "projekt"],
    group: "Prevádzka",
    baseListFilter: filterAktivnehoProjektu,
    description: "História zmien obsahu naprieč projektmi.",
  },
  access: {
    read: citatObsah,
    create: () => false,
    update: () => false,
    delete: ibaMaster,
  },
  defaultSort: "-createdAt",
  timestamps: true,
  fields: [
    poleProjektu("autor", { readOnly: true }),
    {
      type: "row",
      fields: [
        {
          name: "akcia",
          label: "Čo sa stalo",
          type: "select",
          options: [
            { label: "Vytvorenie", value: "vytvorenie" },
            { label: "Úprava", value: "uprava" },
            { label: "Zverejnenie", value: "zverejnenie" },
            { label: "Zmazanie", value: "zmazanie" },
          ],
          admin: { width: "25%", readOnly: true },
        },
        { name: "kolekcia", label: "Kde", type: "text", admin: { width: "25%", readOnly: true } },
        { name: "nazov", label: "Záznam", type: "text", admin: { width: "50%", readOnly: true } },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "kto",
          label: "Kto",
          type: "relationship",
          relationTo: "users",
          admin: { width: "50%", readOnly: true },
        },
        {
          name: "ktoPopis",
          label: "Meno",
          type: "text",
          admin: { width: "50%", readOnly: true },
        },
      ],
    },
    { name: "zaznamId", label: "ID záznamu", type: "text", admin: { readOnly: true } },
  ],
};
