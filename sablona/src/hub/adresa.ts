/**
 * Verejná adresa tohto webu.
 *
 * Na Verceli sa dopočíta z prostredia, lokálne je to localhost a pri vlastnej
 * doméne sa vyplní premenná. Bez toho by sitemap aj náhľady odkazov ukazovali
 * na nesprávny host — a to sa zistí až vtedy, keď to niekto niekam pošle.
 */
export const adresaWebu = (): string => {
  if (process.env.NEXT_PUBLIC_WEB_URL) return process.env.NEXT_PUBLIC_WEB_URL.replace(/\/+$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
};
