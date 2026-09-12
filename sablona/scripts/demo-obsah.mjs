#!/usr/bin/env node
/**
 * Naplní projekt v ZJAV CMS ukážkovým obsahom.
 *
 * Prázdny web po nasadení vyzerá pokazene — neukáže sa menu, hero ani karty
 * a človek nemá čo upravovať. Tento skript doplní do projektu presne toľko
 * obsahu, aby bolo vidieť, ako šablóna vyzerá naostro, a aby mala prevádzka
 * čo prepísať namiesto toho, aby začínala od nuly.
 *
 * Spustenie:
 *   node scripts/demo-obsah.mjs --projekt=kod --email=… --heslo=… [--hub=https://cms.zjav.sk]
 *
 * Je to jednorazová pomôcka, nie súčasť behu webu. Existujúci obsah nemaže —
 * len dopĺňa, takže na naplnenom projekte narobí duplicity.
 */

const arg = (meno, predvolene) => {
  const najdene = process.argv.find((a) => a.startsWith(`--${meno}=`));
  return najdene ? najdene.slice(meno.length + 3) : predvolene;
};

const HUB = (arg("hub", process.env.HUB_URL || "https://cms.zjav.sk")).replace(/\/+$/, "");
const KOD = arg("projekt", process.env.HUB_PROJEKT);
const EMAIL = arg("email", process.env.HUB_EMAIL);
const HESLO = arg("heslo", process.env.HUB_HESLO);

if (!KOD || !EMAIL || !HESLO) {
  console.error("Chýba --projekt, --email alebo --heslo. Pozri hlavičku súboru.");
  process.exit(1);
}

let token = "";

const api = async (cesta, moznosti = {}) => {
  const odpoved = await fetch(`${HUB}${cesta}`, {
    ...moznosti,
    headers: {
      "content-type": "application/json",
      ...(token ? { Authorization: `JWT ${token}` } : {}),
      ...(moznosti.headers ?? {}),
    },
  });
  const telo = await odpoved.json().catch(() => ({}));
  if (!odpoved.ok) {
    throw new Error(`${moznosti.method ?? "GET"} ${cesta} → ${odpoved.status}: ${JSON.stringify(telo).slice(0, 300)}`);
  }
  return telo;
};

const vytvor = async (kolekcia, data) => (await api(`/api/${kolekcia}`, {
  method: "POST",
  body: JSON.stringify(data),
})).doc;

/** Lexical odstavec — najmenší platný tvar bohatého textu. */
const text = (...odstavce) => ({
  root: {
    type: "root",
    format: "",
    indent: 0,
    version: 1,
    direction: "ltr",
    children: odstavce.map((t) => ({
      type: "paragraph",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: [{ type: "text", text: t, format: 0, style: "", mode: "normal", detail: 0, version: 1 }],
    })),
  },
});

const hlavne = async () => {
  console.log(`Hub: ${HUB}`);
  ({ token } = await api("/api/users/login", {
    method: "POST",
    body: JSON.stringify({ email: EMAIL, password: HESLO }),
  }));
  console.log("Prihlásené.");

  const { docs: projekty } = await api(`/api/projekty?where[kod][equals]=${encodeURIComponent(KOD)}&limit=1`);
  const projekt = projekty?.[0];
  if (!projekt) throw new Error(`Projekt s kódom "${KOD}" neexistuje.`);
  console.log(`Projekt: ${projekt.nazov} (#${projekt.id})`);

  const p = projekt.id;

  const kategoria = await vytvor("kategorie", {
    projekt: p, nazov: "Novinky", slug: "novinky", pre: ["prispevky"], poradie: 1,
  });
  const kategoriaPonuky = await vytvor("kategorie", {
    projekt: p, nazov: "Odporúčame", slug: "odporucame", pre: ["katalog"], poradie: 1,
  });

  const formular = await vytvor("formulare", {
    projekt: p,
    nazov: "Kontaktný formulár",
    slug: "kontakt",
    textTlacidla: "Odoslať správu",
    spravaPoOdoslani: "Ďakujeme, ozveme sa do jedného pracovného dňa.",
    polia: [
      { popis: "Meno a priezvisko", kluc: "meno", typ: "text", povinne: true },
      { popis: "E-mail", kluc: "email", typ: "email", povinne: true },
      { popis: "Telefón", kluc: "telefon", typ: "tel", povinne: false },
      { popis: "Správa", kluc: "sprava", typ: "textarea", povinne: true, napoveda: "Napíš, s čím vieme pomôcť." },
      { popis: "Súhlasím so spracovaním osobných údajov", kluc: "suhlas", typ: "suhlas", povinne: true },
    ],
  });

  for (const [i, clanok] of [
    ["Otvárame novú sezónu", "otvarame-novu-sezonu", "Od budúceho týždňa máme otvorené každý deň."],
    ["Čo pripravujeme na jeseň", "co-pripravujeme-na-jesen", "Tri novinky, na ktoré sa oplatí počkať."],
    ["Ako sa k nám dostanete", "ako-sa-k-nam-dostanete", "Parkovanie, spoje aj mapa na jednom mieste."],
  ].entries()) {
    const [nazov, slug, perex] = clanok;
    await vytvor("prispevky", {
      projekt: p, nazov, slug, perex, _status: "published",
      datum: new Date(Date.now() - i * 86400000 * 7).toISOString(),
      kategorie: [kategoria.id],
      obsah: text(perex, "Tento text je ukážkový — prepíš ho v administrácii v sekcii Príspevky. Formátovanie, odkazy aj obrázky pridáš priamo v editore."),
    });
  }

  for (const [i, polozka] of [
    ["Základ", "zaklad", "od 390 €", "Pre malé prevádzky, ktoré potrebujú web rýchlo."],
    ["Štandard", "standard", "od 890 €", "Viac stránok, blog a napojenie na rezervácie."],
    ["Na mieru", "na-mieru", "na dopyt", "Keď má web robiť niečo, čo bežné riešenia nevedia."],
  ].entries()) {
    const [nazov, slug, cena, perex] = polozka;
    await vytvor("katalog", {
      projekt: p, nazov, slug, cena, perex, poradie: i, dostupne: true,
      odporucane: i === 1, _status: "published",
      kategoria: kategoriaPonuky.id,
      popis: text(perex, "Podrobný popis položky uprav v administrácii v sekcii Katalóg."),
      vlastnosti: [
        { nazov: "Dodanie", hodnota: i === 2 ? "podľa dohody" : `${2 + i} týždne` },
        { nazov: "Podpora", hodnota: "12 mesiacov" },
      ],
    });
  }

  const zajtra = new Date(Date.now() + 86400000 * 14);
  await vytvor("udalosti", {
    projekt: p, nazov: "Deň otvorených dverí", slug: "den-otvorenych-dveri",
    perex: "Príďte sa pozrieť, ako to u nás vyzerá.",
    datum: zajtra.toISOString(), cas: "17:00", miesto: "Hlavná 1, Trstená",
    vstupne: "Vstup voľný", _status: "published",
    popis: text("Program sa upresní. Rezervácia nie je potrebná."),
  });

  const domov = await vytvor("stranky", {
    projekt: p, nazov: "Domov", cesta: "/", _status: "published",
    perex: "Ukážkový obsah — prepíš ho v administrácii.",
    bloky: [
      {
        blockType: "hero", varianta: "plny",
        nadpis: `Vitajte na webe ${projekt.nazov}`,
        podnadpis: "Toto je predvolená šablóna. Všetok text, fotky aj menu meníš v administrácii — kód sa nikde dotýkať nemusíš.",
        tlacidla: [
          { text: "Naša ponuka", odkaz: "/ponuka", styl: "hlavne" },
          { text: "Kontakt", odkaz: "/kontakt", styl: "vedlajsie" },
        ],
      },
      {
        blockType: "dlazdice", nadpis: "Prečo my",
        polozky: [
          { nadpis: "Rýchlo", text: "Web beží na statických stránkach, načíta sa okamžite." },
          { nadpis: "Bez starostí", text: "Obsah si meníš sám, aktualizácie riešime my." },
          { nadpis: "Na mieru", text: "Vzhľad prispôsobíme tomu, čo robíš." },
        ],
      },
      { blockType: "vypis", nadpis: "Novinky", zdroj: "prispevky", pocet: 3, rozlozenie: "karty", odkazNaVsetko: "/blog" },
      { blockType: "vypis", nadpis: "Z ponuky", zdroj: "katalog", pocet: 3, rozlozenie: "karty", odkazNaVsetko: "/ponuka" },
      {
        blockType: "faq", nadpis: "Časté otázky",
        otazky: [
          { otazka: "Ako si zmením text na stránke?", odpoved: "Prihlás sa do administrácie, otvor Stránky a uprav blok. Zmena je na webe do minúty." },
          { otazka: "Môžem pridať vlastnú stránku?", odpoved: "Áno. V sekcii Stránky založ novú, zvoľ cestu a poskladaj obsah z blokov." },
        ],
      },
      { blockType: "cta", varianta: "pas", nadpis: "Chcete vedieť viac?", text: "Napíšte nám, ozveme sa do jedného pracovného dňa.", tlacidla: [{ text: "Napísať správu", odkaz: "/kontakt", styl: "hlavne" }] },
    ],
  });

  await vytvor("stranky", {
    projekt: p, nazov: "O nás", cesta: "/o-nas", _status: "published",
    perex: "Kto sme a čo robíme.",
    bloky: [
      { blockType: "text", nadpis: "Náš príbeh", sirka: "uzka", obsah: text("Tento text prepíš v administrácii. Blok Text zvláda nadpisy, zoznamy, odkazy aj obrázky.", "Stránku pokojne rozšír o ďalšie bloky — galériu, video alebo výzvu k akcii.") },
    ],
  });

  await vytvor("stranky", {
    projekt: p, nazov: "Kontakt", cesta: "/kontakt", _status: "published",
    perex: "Ozvite sa nám.",
    bloky: [
      { blockType: "formular", nadpis: "Napíšte nám", text: "Odpovedáme do jedného pracovného dňa.", formular: formular.id },
    ],
  });

  await vytvor("navigacia", {
    projekt: p, nazov: "Hlavné menu", umiestnenie: "hlavicka",
    polozky: [
      { text: "Domov", typ: "stranka", stranka: domov.id },
      { text: "Ponuka", typ: "adresa", adresa: "/ponuka" },
      { text: "Novinky", typ: "adresa", adresa: "/blog" },
      { text: "Udalosti", typ: "adresa", adresa: "/udalosti" },
      { text: "Kontakt", typ: "adresa", adresa: "/kontakt" },
    ],
  });

  await vytvor("navigacia", {
    projekt: p, nazov: "Rýchle odkazy", umiestnenie: "paticka",
    polozky: [
      { text: "O nás", typ: "adresa", adresa: "/o-nas" },
      { text: "Ponuka", typ: "adresa", adresa: "/ponuka" },
      { text: "Kontakt", typ: "adresa", adresa: "/kontakt" },
    ],
  });

  const { docs: nastavenia } = await api(`/api/nastavenia-webu?where[projekt][equals]=${p}&limit=1`);
  if (nastavenia?.[0]) {
    await api(`/api/nastavenia-webu/${nastavenia[0].id}`, {
      method: "PATCH",
      body: JSON.stringify({
        podtitul: "Ukážkový podtitul — zmeň ho v Nastaveniach webu",
        popisWebu: `${projekt.nazov} — web postavený na šablóne ZJAV.`,
        farbaHlavna: "#2f6f4e",
        farbaDoplnkova: "#d98324",
        email: "info@example.sk",
        telefon: "+421 900 000 000",
        adresa: "Hlavná 1\n028 01 Trstená",
        hodiny: [
          { dni: "Pondelok – Piatok", cas: "9:00 – 17:00" },
          { dni: "Sobota", cas: "9:00 – 12:00" },
          { dni: "Nedeľa", cas: "Zatvorené" },
        ],
        siete: [{ siet: "instagram", adresa: "https://instagram.com/" }],
        cookieLista: true,
        ochranaUdajov: text("Tento text nahraď skutočnými zásadami ochrany osobných údajov."),
      }),
    });
  }

  console.log("Hotovo. Otvor web a uvidíš naplnenú šablónu.");
};

hlavne().catch((chyba) => {
  console.error(`Zlyhalo: ${chyba.message}`);
  process.exit(1);
});
