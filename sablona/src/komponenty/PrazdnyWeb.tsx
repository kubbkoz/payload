import type { Nastavenia } from "@/hub/typy";

/**
 * Čerstvo nasadený web, do ktorého ešte nikto nič nenapísal.
 *
 * Bez tohto by prvá adresa projektu vrátila 404 — technicky správne, pre
 * človeka však „web je pokazený". Pritom nie je: je napojený, len prázdny.
 * Táto obrazovka to povie a rovno ukáže, čo urobiť ako prvé.
 *
 * Zmizne sama v okamihu, keď v administrácii vznikne stránka s cestou „/".
 */
export function PrazdnyWeb({
  nastavenia,
  adresaCms,
}: {
  nastavenia: Nastavenia | null;
  adresaCms: string;
}) {
  return (
    <div className="chyba">
      <p className="chyba__kod">⌁</p>
      <h1>{nastavenia?.nazovWebu ?? "Web"} je pripravený</h1>
      <p>
        Šablóna je nasadená a napojená na administráciu. Chýba už len obsah —
        akonáhle v nej vznikne stránka s cestou <code>/</code>, objaví sa tu.
      </p>
      <ol className="prazdny__kroky">
        <li>
          Otvor <strong>Stránky → Create new</strong>, zadaj cestu <code>/</code> a pridaj
          blok <strong>Hero</strong>.
        </li>
        <li>
          V <strong>Menu</strong> založ hlavné menu, v <strong>Nastaveniach webu</strong>
          {" "}doplň logo, farby a kontakt.
        </li>
        <li>Ulož a zverejni. Web sa prekreslí sám.</li>
      </ol>
      <p>
        <a className="tlacidlo tlacidlo--hlavne" href={`${adresaCms}/admin`}>
          Otvoriť administráciu
        </a>
      </p>
    </div>
  );
}
