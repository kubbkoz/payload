import type { Metadata } from "next";

import { StrankaCMS, metadataStranky } from "@/komponenty/StrankaCMS";

export const generateMetadata = (): Promise<Metadata> => metadataStranky("/");

export default function Domov() {
  return <StrankaCMS cesta="/" />;
}
