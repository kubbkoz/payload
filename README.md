# ZJAV_ CMS

Jedna administrácia pre ľubovoľný počet webov. Postavené na Payload 3, Next 16
a Postgrese.

Namiesto samostatného backendu pre každý web beží jeden systém, v ktorom je
každý web **projektom**. Obsah, ľudia aj práva sú na jednom mieste; napojený web
si svoje dáta ťahá cez HTTP a sám žiadnu databázu ani prihlasovanie nepotrebuje.

- **Architektúra a rozhodnutia:** [ARCHITEKTURA.md](./ARCHITEKTURA.md)
- **Administrácia:** `/admin`
- **Rozhranie pre weby:** `/api/web/<kód projektu>/…`

---

## Čo systém vie

| Oblasť | Obsah |
| --- | --- |
| **Obsah** | Stránky skladané z 12 blokov, príspevky, katalóg (ponuka/cenník/produkty), udalosti, kategórie, fotografie, súbory |
| **Štruktúra webu** | Menu pre hlavičku/pätičku, nastavenia webu (identita, kontakt, hodiny, siete, meranie, právne texty), presmerovania |
| **Interakcia** | Skladateľné formuláre, prijaté odpovede vrátane stavu vybavenia a e-mailových upozornení |
| **Prevádzka** | Záznam činnosti — kto, čo, kedy a v ktorom projekte |
| **Systém** | Projekty, používatelia s právami po projektoch, API kľúče |
| **Obsahová práca** | Koncepty, automatické ukladanie, história verzií, naplánované zverejnenie |

## Role

Rola nie je vlastnosť človeka, ale dvojice **človek + projekt**. Ten istý
používateľ môže byť správcom jedného webu a pozorovateľom druhého.

| Rola | Čo smie |
| --- | --- |
| **master** | Všetko vo všetkých projektoch vrátane zakladania projektov a API kľúčov |
| **správca** | Celý obsah projektu + nastavenia webu, menu, presmerovania, pozývanie ľudí k svojim projektom |
| **editor** | Vytvára, upravuje, zverejňuje a maže obsah. Nastavenia webu nevidí |
| **autor** | Píše a upravuje výhradne vlastné záznamy a nesmie ich zverejniť |
| **pozorovateľ** | Obsah len číta |

Oddelenie projektov nie je kontrola v rozhraní — je to podmienka pripojená ku
každému dotazu vrátane REST a GraphQL, plus zložené unikátne indexy v databáze.
Dva weby teda pokojne majú vlastné `/kontakt` a jeden o druhom nevie.

---

## Spustenie lokálne

```bash
cp .env.example .env          # vyplň DATABASE_URI a PAYLOAD_SECRET
createdb hub                  # prázdna Postgres databáza
npm install
npm run payload:migrate       # vytvorí schému
npm run dev                   # http://localhost:3000/admin
```

Prvý účet vytvoríš na úvodnej obrazovke administrácie — systém z neho
automaticky spraví mastera. Alternatívne vyplň `HUB_ADMIN_EMAIL`
a `HUB_ADMIN_PASSWORD` a založí sa pri štarte sám.

### Zmena schémy

```bash
npm run payload:migrate:create nazov_zmeny   # vygeneruje a opraví migráciu
npm run payload:migrate                      # aplikuje ju lokálne
npm run payload:types                        # prepíše payload-types.ts
```

Dev push je vypnutý zámerne — pozri komentár v `src/payload.config.ts`.
Produkčná databáza sa migruje sama pri prvom štarte po nasadení.

Po pridaní alebo zmene vlastného komponentu administrácie spusti
`npm run payload:importmap`.

---

## Nasadenie na Vercel

1. Naimportuj repozitár ako Next.js projekt.
2. Pripoj **Postgres** (Neon alebo Vercel Postgres) — vloží `DATABASE_URL`.
3. Pripoj **Blob** úložisko — vloží `BLOB_READ_WRITE_TOKEN`. Bez neho sa
   nahraté súbory po každom studenom štarte stratia.
4. Nastav premenné:

| Premenná | Povinná | Na čo |
| --- | --- | --- |
| `PAYLOAD_SECRET` | áno | Podpisovanie prihlasovacích tokenov (`openssl rand -hex 32`) |
| `NEXT_PUBLIC_SERVER_URL` | áno | Verejná adresa hubu — pre produkciu `https://cms.zjav.sk` |
| `DATABASE_URL` | áno | Postgres (vloží integrácia) |
| `BLOB_READ_WRITE_TOKEN` | prakticky áno | Úložisko súborov |
| `RESEND_API_KEY`, `EMAIL_FROM` | nie | Obnova hesla a upozornenia z formulárov |
| `CRON_SECRET` | nie | Chráni frontu naplánovaného zverejnenia |
| `HUB_ADMIN_EMAIL`, `HUB_ADMIN_PASSWORD` | nie | Prvý master pri prázdnej databáze |

Cron v `vercel.json` spúšťa `/api/payload-jobs/run` každých desať minút —
je to fronta naplánovaného zverejnenia. Program Hobby vie cron spúšťať len raz
denne; tam zmeň rozvrh na `0 * * * *` alebo si frontu spúšťaj externe.

---

## Ako sa napojí web

### 1. Založ projekt

Systém → Projekty. Vyplň názov, kód (napr. `vinaren`) a domény, na ktorých web
beží. Z domén vzniká zoznam povolených pôvodov — čo tam nie je, to si obsah
z prehliadača nestiahne.

### 2. Stiahni si obsah

```js
const hub = "https://tvoj-hub.vercel.app";

// Všetko na štart jedným dotazom: nastavenia, menu, presmerovania
const web = await fetch(`${hub}/api/web/vinaren`).then((r) => r.json());

// Jedna stránka aj s blokmi
const stranka = await fetch(
  `${hub}/api/web/vinaren/stranka?cesta=/o-nas`,
).then((r) => r.json());

// Výpisy
const clanky = await fetch(
  `${hub}/api/web/vinaren/prispevky?limit=6&kategoria=novinky`,
).then((r) => r.json());
```

| Adresa | Vráti |
| --- | --- |
| `GET /api/web/:kod` | Nastavenia webu, menu, presmerovania |
| `GET /api/web/:kod/stranky` | Zoznam zverejnených stránok |
| `GET /api/web/:kod/stranka?cesta=/o-nas` | Stránku s blokmi a SEO |
| `GET /api/web/:kod/prispevky` | Články — `slug`, `kategoria`, `limit`, `strana`, `odporucane=1`, `radit` |
| `GET /api/web/:kod/katalog` | Položky s cenou, parametrami a galériou |
| `GET /api/web/:kod/udalosti` | Akcie; minulé sa nevydávajú, `vsetky=1` ich zahrnie |
| `GET /api/web/:kod/kategorie` | Číselník — `pre=prispevky\|katalog\|udalosti` |
| `GET /api/web/:kod/formular/:slug` | Popis polí formulára |
| `POST /api/web/:kod/formular/:slug` | Odoslanie formulára |

Vydáva sa výhradne **zverejnený** obsah zvoleného projektu. Koncepty
a rozrobené verzie von neidú.

### 3. Prihlás sa, ak má byť obsah neverejný

Projekt s vypnutým „obsah dostupný bez kľúča“ vyžaduje hlavičku:

```js
fetch(`${hub}/api/web/vinaren/katalog`, {
  headers: { "x-api-key": process.env.HUB_API_KEY },
});
```

Kľúč vystavíš v Systém → API kľúče. Je viazaný na jeden projekt, je len na
čítanie a na cudzí projekt neprejde.

### 4. Nechaj si preplachovať web

Do projektu vyplň **adresu na prepláchnutie** a **tajomstvo**. Po každej zmene
obsahu príde na tú adresu POST:

```json
{
  "udalost": "zmenene",
  "projekt": 1,
  "kolekcia": "stranky",
  "zaznam": 12,
  "cas": "2026-09-11T21:30:00.000Z"
}
```

V hlavičke `x-hub-secret` je tajomstvo. Na strane webu (Next.js):

```ts
export async function POST(req: Request) {
  if (req.headers.get("x-hub-secret") !== process.env.HUB_SECRET) {
    return new Response("Nie", { status: 401 });
  }
  revalidatePath("/", "layout");
  return Response.json({ ok: true });
}
```

### 5. Formuláre

```js
await fetch(`${hub}/api/web/vinaren/formular/kontakt`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ meno, email, sprava, _pasca: "" }),
});
```

`_pasca` je skryté pole — nechaj ho vo formulári prázdne a neviditeľné pre
človeka. Keď ho niečo vyplní, hub odpoveď ticho zahodí. Odpoveď na neplatné
údaje má stav 422 a pole `chyby` s vetami v slovenčine.

---

## Vzhľad

Panel nosí značku ZJAV_: modrošedá škála, azúrová `#00CFFF` na všetkom
stlačiteľnom, mätová `#00E5A0` na potvrdeniach, Oxanium na nadpisy, Inter na
text a JetBrains Mono na kód — tie isté hodnoty, aké má web zjav.sk.

Rebranding nie je prefarbovanie tried. Payload stavia celé rozhranie na jednej
škále `--color-base-0…1000` a v tmavej téme ju číta odzadu, takže stačí tú
škálu vymeniť v `src/payload/admin/hub.css` a prefarbí sa všetko naraz —
vrátane tabuliek, polí a stavov, v oboch témach.

Predvolená je tmavá; dopĺňa ju `src/middleware.ts` do cookie `payload-theme`
ešte pred vykreslením, takže ani prihlasovacia obrazovka nebliká bielou.
Prepínač svetlá/tmavá je v bočnom menu a voľba človeka predvolenú prebije.

## Štruktúra repozitára

```
src/
  payload.config.ts        konfigurácia — kolekcie, adaptéry, endpointy
  payload/
    access.ts              oddelenie projektov, role, filtre dotazov
    roly.ts                role a ich váhy
    kolekcie.ts            zoznam kolekcií patriacich projektu
    hooky.ts               preplach napojeného webu a záznam činnosti
    endpointy.ts           delivery API pre napojené weby
    collections/           16 kolekcií
    bloky/                 bloky page buildera
    polia/                 pole projektu, slug, SEO, relácie v projekte
    admin/                 prepínač projektu, nástenka, štýly
  app/(payload)/           administrácia a REST/GraphQL Payloadu
  app/(hub)/               verejná úvodná obrazovka hubu
  middleware.ts            predvolene tmavý panel
  lib/                     pomocné funkcie API a textu
  migrations/              migrácie databázy
```
