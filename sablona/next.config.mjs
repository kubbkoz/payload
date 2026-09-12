import path from "node:path";
import { fileURLToPath } from "node:url";

const koren = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bez toho si Next pri vývoji vnútri väčšieho repozitára vyberie za koreň
  // priečinok o úroveň vyššie (podľa najbližšieho lockfile) a pribalí aj
  // súbory, ktoré s webom nemajú nič spoločné.
  turbopack: { root: koren },
  poweredByHeader: false,
  compress: true,
  images: {
    // Fotky prichádzajú z úložiska hubu. Bez tejto výnimky ich next/image
    // odmietne optimalizovať a obrázky sa na webe vôbec nezobrazia.
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "cms.zjav.sk" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
