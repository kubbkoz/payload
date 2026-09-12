import type { Metadata } from "next";

import { StrankaCMS, metadataStranky } from "@/komponenty/StrankaCMS";

type Args = { params: Promise<{ cesta: string[] }> };

const zloz = (casti: string[]) => `/${casti.map((c) => decodeURIComponent(c)).join("/")}`;

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { cesta } = await params;
  return metadataStranky(zloz(cesta));
}

/**
 * Ktorákoľvek stránka zo systému. Pevné sekcie webu (blog, ponuka, udalosti)
 * majú vlastné routy a majú prednosť — stránka s takou cestou by sa v paneli
 * dala založiť, ale na web by sa nedostala.
 */
export default async function Podstranka({ params }: Args) {
  const { cesta } = await params;
  return <StrankaCMS cesta={zloz(cesta)} />;
}
