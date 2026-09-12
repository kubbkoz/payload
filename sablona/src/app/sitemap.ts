import type { MetadataRoute } from "next";

import { katalog, prispevky, udalosti, zoznamStranok } from "@/hub/klient";
import { adresaWebu } from "@/hub/adresa";

/**
 * Mapa stránok zo skutočného obsahu hubu, nie z ručného zoznamu.
 *
 * Keď hub nedopovie, vráti sa aspoň úvod — mapa s chybou 500 je horšia než
 * mapa s jednou položkou.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const zaklad = adresaWebu();
  const polozky: MetadataRoute.Sitemap = [{ url: zaklad, priority: 1 }];

  try {
    const [stranky, clanky, ponuka, akcie] = await Promise.all([
      zoznamStranok(),
      prispevky({ limit: 100 }),
      katalog({ limit: 100 }),
      udalosti({ limit: 100, vsetky: 1 }),
    ]);

    for (const s of stranky?.docs ?? []) {
      if (s.cesta === "/") continue;
      polozky.push({ url: `${zaklad}${s.cesta}`, lastModified: s.upravene, priority: 0.8 });
    }
    if (clanky?.docs?.length) {
      polozky.push({ url: `${zaklad}/blog`, priority: 0.7 });
      for (const c of clanky.docs) {
        polozky.push({ url: `${zaklad}/blog/${c.slug}`, lastModified: c.upravene, priority: 0.6 });
      }
    }
    if (ponuka?.docs?.length) {
      polozky.push({ url: `${zaklad}/ponuka`, priority: 0.7 });
      for (const p of ponuka.docs) {
        polozky.push({ url: `${zaklad}/ponuka/${p.slug}`, lastModified: p.upravene, priority: 0.6 });
      }
    }
    if (akcie?.docs?.length) {
      polozky.push({ url: `${zaklad}/udalosti`, priority: 0.7 });
      for (const u of akcie.docs) {
        polozky.push({ url: `${zaklad}/udalosti/${u.slug}`, lastModified: u.upravene, priority: 0.5 });
      }
    }
  } catch {
    /* hub nedostupný — mapa ostane aspoň s úvodom */
  }

  return polozky;
}
