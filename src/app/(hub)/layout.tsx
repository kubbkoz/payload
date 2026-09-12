import type { Metadata } from "next";

import "../../styles/hub-web.css";

export const metadata: Metadata = {
  title: "ZJAV CMS — Content Hub",
  description: "Content Hub — jedna administrácia pre ľubovoľný počet napojených webov.",
  robots: { index: false, follow: false },
};

const Layout = ({ children }: { children: React.ReactNode }) => (
  <html lang="sk">
    <body>{children}</body>
  </html>
);

export default Layout;
