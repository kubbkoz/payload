import type { MetadataRoute } from "next";

import { zaklad } from "@/hub/klient";
import { adresaWebu } from "@/hub/adresa";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const info = await zaklad().catch(() => null);
  // Projekt, ktorý ešte nie je aktívny, sa nemá indexovať — rozostavaný web
  // v Google je horší než žiadny.
  const pustit = info?.projekt.stav === "aktivny";

  return {
    rules: pustit ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" },
    sitemap: pustit ? `${adresaWebu()}/sitemap.xml` : undefined,
  };
}
