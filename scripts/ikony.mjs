#!/usr/bin/env node
/**
 * Generátor `src/payload/admin/ikony.css`.
 *
 * Ikon je dvadsaťjeden a každá sa v CSS objaví dvakrát (menu + karta na
 * nástenke). Písať to ručne znamená preklep, ktorý sa prejaví tak, že jedna
 * položka ikonu jednoducho nemá — a nikto si nevšimne, ktorá. Preto sú dáta
 * tu a CSS je výstup.
 *
 * Pridanie kolekcie: dopíš slug a telo SVG do KOLEKCIE a spusti
 * `npm run ikony`.
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const koren = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const HLAVA =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ' +
  'fill="none" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">';

const uri = (telo) => {
  const svg = (HLAVA + telo + "</svg>")
    .replaceAll('"', "'")
    .replaceAll("%", "%25")
    .replaceAll("<", "%3C")
    .replaceAll(">", "%3E")
    .replaceAll("#", "%23")
    .replaceAll(" ", "%20");
  return `url("data:image/svg+xml,${svg}")`;
};

/** Nadpisy skupín v bočnom menu. Kľúč musí sedieť s `admin.group` kolekcie. */
const SKUPINY = {
  "Obsah": "<path d='M12 2.8 2.9 7.5 12 12.2l9.1-4.7Z'/><path d='m2.9 12 9.1 4.7 9.1-4.7'/><path d='m2.9 16.5 9.1 4.7 9.1-4.7'/>",
  "Štruktúra webu": "<rect x='9' y='2.8' width='6' height='4.4' rx='1'/><rect x='2.8' y='16.8' width='6' height='4.4' rx='1'/><rect x='15.2' y='16.8' width='6' height='4.4' rx='1'/><path d='M12 7.2v4.4'/><path d='M5.8 16.8v-2.6h12.4v2.6'/><path d='M12 11.6v2.6'/>",
  "Interakcia": "<path d='M20.4 12.4a7.6 7.6 0 0 1-8.2 7.56L6.4 21.2l1.24-5.8A7.6 7.6 0 1 1 20.4 12.4Z'/><path d='M9 11.2h6'/><path d='M9 14.2h3.6'/>",
  "Prevádzka": "<path d='M2.8 12.4h4.2l2-5.2 3.4 10 2.2-4.8h6.6'/>",
  "Systém": "<path d='M12 3 4.8 5.7v5.8c0 4.4 3 8.1 7.2 9.5 4.2-1.4 7.2-5.1 7.2-9.5V5.7Z'/>"
};

/** Kolekcie. Kľúč je slug kolekcie — z neho vzniká #nav-<slug> aj #card-<slug>. */
const KOLEKCIE = {
  "stranky": "<path d='M14 2.8H7a2 2 0 0 0-2 2v14.4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.8Z'/><path d='M14 2.8V7.8h5'/><path d='M8.4 12.4h7.2'/><path d='M8.4 15.8h7.2'/>",
  "prispevky": "<path d='M3.4 6.2h13.2v13.6a1.6 1.6 0 0 1-1.6 1.6H5a1.6 1.6 0 0 1-1.6-1.6Z'/><path d='M16.6 9h2.4a1.6 1.6 0 0 1 1.6 1.6v7.6a2 2 0 0 1-2 2'/><path d='M6.4 9.4h7.2'/><path d='M6.4 12.6h7.2'/><path d='M6.4 15.8h4.4'/>",
  "katalog": "<path d='M20.4 8.4v7.2a1.8 1.8 0 0 1-.92 1.57l-6.6 3.7a1.8 1.8 0 0 1-1.76 0l-6.6-3.7A1.8 1.8 0 0 1 3.6 15.6V8.4a1.8 1.8 0 0 1 .92-1.57l6.6-3.7a1.8 1.8 0 0 1 1.76 0l6.6 3.7A1.8 1.8 0 0 1 20.4 8.4Z'/><path d='m3.85 7.5 8.15 4.6 8.15-4.6'/><path d='M12 12.1v8.4'/>",
  "udalosti": "<rect x='3.2' y='5' width='17.6' height='15.8' rx='2'/><path d='M3.2 9.6h17.6'/><path d='M8.2 3.2v3.6'/><path d='M15.8 3.2v3.6'/><path d='M7.4 13.4h2.2'/><path d='M12.9 13.4h2.2'/><path d='M7.4 17h2.2'/>",
  "kategorie": "<path d='M11.8 3.6H4.6a1.4 1.4 0 0 0-1.4 1.4v7.2l8 8a1.4 1.4 0 0 0 2 0l5.2-5.2a1.4 1.4 0 0 0 0-2Z'/><circle cx='7.4' cy='7.8' r='1.1'/><path d='M15 3.6h4a1.4 1.4 0 0 1 1.4 1.4v4'/>",
  "media": "<rect x='3' y='4.8' width='18' height='14.4' rx='2'/><circle cx='8.4' cy='9.6' r='1.5'/><path d='m3.4 17.2 4.8-4.8 3.6 3.6 3.2-3.2 5.6 5.6'/>",
  "subory": "<path d='M20.2 11.6 12.3 19.5a5 5 0 0 1-7.1-7.1l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.4 8.4a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8'/>",
  "navigacia": "<circle cx='4.8' cy='6.5' r='1.1'/><circle cx='4.8' cy='12' r='1.1'/><circle cx='4.8' cy='17.5' r='1.1'/><path d='M9 6.5h11'/><path d='M9 12h11'/><path d='M9 17.5h11'/>",
  "nastavenia-webu": "<path d='M4 7.2h9.6'/><path d='M17.6 7.2H20'/><path d='M4 12h2.4'/><path d='M10.4 12H20'/><path d='M4 16.8h6.4'/><path d='M14.4 16.8H20'/><circle cx='15.6' cy='7.2' r='2'/><circle cx='8.4' cy='12' r='2'/><circle cx='12.4' cy='16.8' r='2'/>",
  "presmerovania": "<path d='M4 17.2h8.8a4.4 4.4 0 0 0 4.4-4.4V7.2'/><path d='m13.6 10.8 3.6-3.6 3.6 3.6'/><path d='m7.6 13.6-3.6 3.6 3.6 3.6'/>",
  "formulare": "<path d='M8.4 4.4H6a2 2 0 0 0-2 2v13.2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6.4a2 2 0 0 0-2-2h-2.4'/><rect x='8.4' y='2.4' width='7.2' height='4' rx='1.2'/><path d='m8.6 13.8 2.5 2.5 4.4-4.4'/>",
  "odpovede": "<path d='M3.2 13.4h4.4l1.4 2.6h6l1.4-2.6h4.4'/><path d='M5.4 5.4h13.2l2.2 8v4.2a2 2 0 0 1-2 2H5.2a2 2 0 0 1-2-2v-4.2Z'/>",
  "zaznamy": "<path d='M3.4 12a8.6 8.6 0 1 0 2.6-6.1'/><path d='M3.4 4.6v4.4h4.4'/><path d='M12 7.8V12l3 1.8'/>",
  "projekty": "<rect x='3.2' y='3.2' width='7.4' height='7.4' rx='1.4'/><rect x='13.4' y='3.2' width='7.4' height='7.4' rx='1.4'/><rect x='3.2' y='13.4' width='7.4' height='7.4' rx='1.4'/><rect x='13.4' y='13.4' width='7.4' height='7.4' rx='1.4'/>",
  "users": "<circle cx='12' cy='8.2' r='3.6'/><path d='M4.8 20.4a7.2 7.2 0 0 1 14.4 0'/>",
  "api-klienti": "<circle cx='7.6' cy='16.4' r='3.4'/><path d='m10 14 8.2-8.2'/><path d='m15.6 8.4 2.2 2.2'/><path d='m18 6 2.2 2.2'/>"
};

const POPISY = {
  "stranky": "Stránky",
  "prispevky": "Príspevky",
  "katalog": "Katalóg",
  "udalosti": "Udalosti",
  "kategorie": "Kategórie",
  "media": "Fotografie",
  "subory": "Súbory",
  "navigacia": "Menu",
  "nastavenia-webu": "Nastavenia webu",
  "presmerovania": "Presmerovania",
  "formulare": "Formuláre",
  "odpovede": "Odpovede",
  "zaznamy": "Záznam činnosti",
  "projekty": "Projekty",
  "users": "Používatelia",
  "api-klienti": "API kľúče"
};

const navIds = Object.keys(KOLEKCIE).map((s) => `#nav-${s}`);
const grpIds = Object.keys(SKUPINY).map((g) => `[id="nav-group-${g}"] .nav-group__label`);
const cardIds = Object.keys(KOLEKCIE).map((s) => `#card-${s}`);

const von = [];
von.push("/*\n * Ikony administrácie ZJAV_ CMS — bočné menu aj karty na nástenke.\n *\n * Ikona nie je obrázok, je maska: SVG ide do `mask-image` a farbu dáva\n * `background-color`. Preto sa dá prefarbiť jedinou premennou a netreba dve\n * sady súborov pre svetlú a tmavú tému — čo je presne to, čo tu chceme:\n * v tme azúrová značková, na svetle čierna.\n *\n * Nič sa nesťahuje zvonku, všetky ikony sú v tomto súbore ako data URI.\n * Jedno SVG, viewBox 0 0 24 24, fill none, stroke-width 1.25; kódované sú\n * len znaky, ktoré v url() prekážajú.\n *\n * Payload dáva položkám menu stabilné id `nav-<slug>`, skupinám\n * `nav-group-<nadpis>` a kartám na nástenke `card-<slug>`. Na id sa dá\n * spoľahnúť aj pri aktívnej položke, ktorú Payload nevykresľuje ako <a>,\n * ale ako <div>.\n *\n * Súbor zámerne nie je v @layer: Payload má celú administráciu v\n * @layer payload-default a nevrstvené pravidlá ju prebijú bez ohľadu na\n * špecificitu. Preto tu nikde netreba !important.\n *\n * Generované skriptom — úprava ikony znamená úpravu SVG a pregenerovanie.\n */");
von.push(`
:root {
  /* Na svetlom pozadí čierna: azúrová na bielej je bledá a ikona by
     splynula skôr, než by čokoľvek povedala. */
  --farba-ikony: #06080d;
  --sila-ikony: 0.78;
}

html[data-theme="dark"] {
  /* V tme značková azúrová — rovnaká, akú má web na tlačidlách. */
  --farba-ikony: #00cfff;
  --sila-ikony: 0.92;
}
`);

von.push(`/* ---------------------------------------------------------------- *
 *  Bočné menu                                                      *
 * ---------------------------------------------------------------- */

/* Ikona je absolútne umiestnená, takže ju nepodčiarkne text-decoration pri
   prejdení myšou a nezasahuje do toku textu — zvýraznenie aktívnej položky
   tým ostáva nedotknuté. */`);
von.push([...grpIds, ...navIds].join(",\n") + " {");
von.push("  position: relative;\n  padding-inline-start: 26px;\n}\n");
von.push([...grpIds, ...navIds].map((s) => `${s}::before`).join(",\n") + " {");
von.push(`  content: "";
  position: absolute;
  inset-inline-start: 0;
  top: 50%;
  width: 16px;
  height: 16px;
  transform: translateY(-50%);
  background-color: var(--farba-ikony);
  opacity: var(--sila-ikony);
  pointer-events: none;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: 16px 16px;
  mask-size: 16px 16px;
}

/* Nadpis skupiny je vlajkový riadok, nie odkaz. */
.nav-group__toggle .nav-group__label {
  line-height: 1.4;
}
`);

von.push(`/* ---------------------------------------------------------------- *
 *  Nástenka                                                        *
 * ---------------------------------------------------------------- */

/*
 * Karta je flexbox: nadpis vľavo, tlačidlo + vpravo. Ikona ide ako ::before
 * priamo na kartu, takže je z nej riadny flex prvok pred nadpisom — nie
 * prekrytie nadpisu ani absolútny prvok, ktorý by liezol pod tlačidlo +.
 *
 * Nadpisy skupín na nástenke ikonu zámerne nedostávajú: je to veľký <h2>,
 * ktorý oddeľuje bloky, a pod ním už stojí celý riadok kariet s vlastnými
 * ikonami. Ďalšia ikona pri veľkom nadpise by pôsobila ako omyl.
 */`);
von.push(cardIds.map((s) => `${s}::before`).join(",\n") + " {");
von.push(`  content: "";
  align-self: flex-start;
  flex: 0 0 auto;
  width: 20px;
  height: 20px;
  /* Karta má gap 16px, čo je pri ikone priveľa; -4px dá výslednú medzeru
     12px a drží ikonu s nadpisom pokope. */
  margin-inline-end: -4px;
  background-color: var(--farba-ikony);
  opacity: calc(var(--sila-ikony) - 0.18);
  pointer-events: none;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: 20px 20px;
  mask-size: 20px 20px;
}
`);
von.push("@media (max-width: 768px) {");
von.push("  " + cardIds.map((s) => `${s}::before`).join(",\n  ") + " {");
von.push(`    width: 18px;
    height: 18px;
    -webkit-mask-size: 18px 18px;
    mask-size: 18px 18px;
  }
}
`);

von.push(`/* ---------------------------------------------------------------- *
 *  Samotné ikony                                                   *
 * ---------------------------------------------------------------- */
`);

for (const [nazov, telo] of Object.entries(SKUPINY)) {
  von.push(`/* Skupina: ${nazov} */`);
  von.push(`[id="nav-group-${nazov}"] .nav-group__label::before {`);
  von.push(`  -webkit-mask-image: ${uri(telo)};`);
  von.push(`  mask-image: ${uri(telo)};`);
  von.push("}\n");
}

for (const [slug, telo] of Object.entries(KOLEKCIE)) {
  von.push(`/* ${POPISY[slug] ?? slug} */`);
  von.push(`#nav-${slug}::before,\n#card-${slug}::before {`);
  von.push(`  -webkit-mask-image: ${uri(telo)};`);
  von.push(`  mask-image: ${uri(telo)};`);
  von.push("}\n");
}

const cesta = path.join(koren, "src", "payload", "admin", "ikony.css");
writeFileSync(cesta, von.join("\n").trimEnd() + "\n", "utf8");
console.log(`Zapísané ${Object.keys(SKUPINY).length + Object.keys(KOLEKCIE).length} ikon do ${cesta}`);
