import Link from "next/link";

import type { Menu, Nastavenia, PolozkaMenu } from "@/hub/typy";

const odkaz = (p: PolozkaMenu): string =>
  p.typ === "stranka" ? (p.stranka?.cesta ?? "/") : (p.adresa ?? "#");

const NAZVY_SIETI: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  ine: "Odkaz",
};

/**
 * Pätička. Skladá sa výhradne z toho, čo je v administrácii — keď prevádzka
 * nevyplní otváracie hodiny, stĺpec s hodinami sa nezobrazí prázdny, ale
 * vôbec.
 */
export function Paticka({
  nastavenia,
  menu,
}: {
  nastavenia: Nastavenia;
  menu: Menu | undefined;
}) {
  const { kontakt, firemneUdaje, siete, pravne } = nastavenia;
  const rok = new Date().getFullYear();
  const maPravne = Boolean(pravne.ochranaUdajov || pravne.obchodnePodmienky);

  return (
    <footer className="paticka">
      <div className="paticka__vnutro">
        <div className="paticka__stlpec">
          <p className="paticka__nazov">{nastavenia.nazovWebu}</p>
          {nastavenia.podtitul ? <p className="paticka__podtitul">{nastavenia.podtitul}</p> : null}
          {siete.length ? (
            <ul className="paticka__siete">
              {siete.map((s, i) => (
                <li key={i}>
                  <a href={s.adresa} target="_blank" rel="noopener noreferrer">
                    {NAZVY_SIETI[s.siet] ?? s.siet}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {kontakt.email || kontakt.telefon || kontakt.adresa ? (
          <div className="paticka__stlpec">
            <h2 className="paticka__nadpis">Kontakt</h2>
            {kontakt.adresa ? <p className="paticka__adresa">{kontakt.adresa}</p> : null}
            {kontakt.telefon ? (
              <p>
                <a href={`tel:${kontakt.telefon.replace(/\s/g, "")}`}>{kontakt.telefon}</a>
              </p>
            ) : null}
            {kontakt.email ? (
              <p>
                <a href={`mailto:${kontakt.email}`}>{kontakt.email}</a>
              </p>
            ) : null}
          </div>
        ) : null}

        {kontakt.hodiny.length ? (
          <div className="paticka__stlpec">
            <h2 className="paticka__nadpis">Otvorené</h2>
            <dl className="paticka__hodiny">
              {kontakt.hodiny.map((h, i) => (
                <div key={i}>
                  <dt>{h.dni}</dt>
                  <dd>{h.cas}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        {menu?.polozky?.length ? (
          <div className="paticka__stlpec">
            <h2 className="paticka__nadpis">{menu.nazov}</h2>
            <ul className="paticka__odkazy">
              {menu.polozky.map((p, i) => (
                <li key={i}>
                  <Link
                    href={odkaz(p)}
                    {...(p.novaKarta ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {p.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="paticka__spodok">
        <p>
          © {rok} {firemneUdaje?.nazovFirmy || nastavenia.nazovWebu}
          {firemneUdaje?.ico ? ` · IČO ${firemneUdaje.ico}` : ""}
        </p>
        {maPravne ? (
          <p className="paticka__pravne">
            {pravne.ochranaUdajov ? (
              <Link href="/ochrana-osobnych-udajov">Ochrana osobných údajov</Link>
            ) : null}
            {pravne.ochranaUdajov && pravne.obchodnePodmienky ? <span aria-hidden="true"> · </span> : null}
            {pravne.obchodnePodmienky ? (
              <Link href="/obchodne-podmienky">Obchodné podmienky</Link>
            ) : null}
          </p>
        ) : null}
      </div>
    </footer>
  );
}
