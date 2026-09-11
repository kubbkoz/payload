/**
 * Role v rámci jedného projektu.
 *
 * Rola nie je vlastnosť používateľa, ale vlastnosť dvojice používateľ–projekt.
 * Ten istý človek môže byť správcom jedného webu a iba pozorovateľom druhého,
 * a to je presne ten prípad, pre ktorý tento systém existuje. Jediná rola,
 * ktorá stojí nad projektmi, je master — ten je prepínač na používateľovi.
 */
export const ROLY = ["spravca", "editor", "autor", "pozorovatel"] as const;

export type Rola = (typeof ROLY)[number];

/** Vyššie číslo = viac práv. Porovnáva sa ním, nie reťazcom. */
export const VAHA: Record<Rola, number> = {
  pozorovatel: 1,
  autor: 2,
  editor: 3,
  spravca: 4,
};

export const POPIS_ROL: Record<Rola, string> = {
  spravca:
    "Správca — všetok obsah projektu, nastavenia webu, navigácia, presmerovania a pozývanie ľudí k projektu.",
  editor: "Editor — vytvára, upravuje, zverejňuje a maže obsah. Nastavenia webu nevidí.",
  autor: "Autor — píše a upravuje výhradne vlastné záznamy a nesmie ich zverejniť.",
  pozorovatel: "Pozorovateľ — obsah len číta, nič nemení.",
};

export const MOZNOSTI_ROL = ROLY.map((rola) => ({
  label: `${rola.charAt(0).toUpperCase()}${rola.slice(1)}`,
  value: rola,
}));

export const staci = (ma: Rola | null | undefined, treba: Rola): boolean =>
  Boolean(ma && VAHA[ma] >= VAHA[treba]);
