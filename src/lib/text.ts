/** Diakritika preč, medzery na spojovník — z „Ponuka vín“ je „ponuka-vin“. */
export const naSlug = (vstup: string): string =>
  vstup
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);

/** Cesta stránky sa normalizuje na tvar „/o-nas/tim“ — vždy s úvodným lomítkom. */
export const naCestu = (vstup: string): string => {
  const casti = vstup
    .split("/")
    .map((cast) => naSlug(cast))
    .filter(Boolean);
  return `/${casti.join("/")}`;
};

export const skratka = (text: string, dlzka = 160): string => {
  const cisty = text.replace(/\s+/g, " ").trim();
  return cisty.length <= dlzka ? cisty : `${cisty.slice(0, dlzka - 1).trimEnd()}…`;
};
