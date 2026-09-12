# Šablóna webu pre ZJAV CMS

Predvolený Next.js web, ktorý si celý obsah ťahá z [ZJAV CMS](../README.md).
Nemá databázu, nemá prihlasovanie a nemá vlastnú administráciu — má tri
premenné prostredia a všetko ostatné je v hube.

Z toho plynie celý zmysel: nový web nezačína písaním backendu. Založíš projekt
v CMS, nasadíš túto šablónu s jeho kódom a hneď stojí funkčný web. Potom
upravuješ len to, čo má byť na tomto webe iné — a to je frontend.

---

## Nový web za tri kroky

**1. Založ projekt v CMS** — Systém → Projekty. Vyplň názov a kód (napr.
`vinaren`), doménu webu a nechaj zapnuté „obsah dostupný bez kľúča".

**2. Nasaď šablónu.** Skopíruj tento priečinok do nového repozitára a naimportuj
ho na Vercel. Nastav premenné:

```
HUB_PROJEKT=vinaren
HUB_URL=https://cms.zjav.sk
HUB_SECRET=<to isté, čo je v projekte v poli „Tajomstvo pre prepláchnutie">
```

**3. Vráť sa do CMS** a do projektu dopíš adresu na prepláchnutie:
`https://tvoj-web.sk/api/revalidate`. Od tej chvíle sa web po každej zmene
obsahu sám aktualizuje.

Prázdny projekt naplníš ukážkovým obsahom, aby bolo čo prepisovať:

```bash
node scripts/demo-obsah.mjs --projekt=vinaren --email=ty@zjav.sk --heslo=…
```

---

## Premenné prostredia

| Premenná | Povinná | Na čo |
| --- | --- | --- |
| `HUB_PROJEKT` | áno | Kód projektu z administrácie. Jediná premenná, ktorá sa medzi webmi naozaj líši. |
| `HUB_URL` | nie | Adresa hubu. Predvolene `https://cms.zjav.sk`. |
| `HUB_API_KEY` | nie | Len keď má projekt vypnuté verejné čítanie. Ostáva na serveri. |
| `HUB_SECRET` | nie | Podpis preplachu z hubu. Bez neho `/api/revalidate` odmieta všetko. |
| `NEXT_PUBLIC_WEB_URL` | nie | Vlastná doména. Na Verceli sa dopočíta sama. |

---

## Čo šablóna vie

**Stránky z blokov.** Všetkých dvanásť blokov page buildera má svoj komponent
v `src/komponenty/bloky/`: hero, text, obrázok, galéria, výpis obsahu, dlaždice,
výzva k akcii, otázky a odpovede, formulár, video, vložený kód a oddeľovač.
Blok, o ktorom šablóna nevie, sa ticho preskočí — web sa nerozsype preto, že
v CMS pribudla novinka.

**Hotové sekcie.** `/blog`, `/ponuka` a `/udalosti` vrátane detailov,
stránkovania a filtrovania podľa kategórií. Právne texty na
`/ochrana-osobnych-udajov` a `/obchodne-podmienky` sa berú z nastavení webu
a kým nie sú vyplnené, stránka neexistuje.

**Formuláre.** Polia prídu z CMS, šablóna ich len poskladá. Odosielajú sa cez
vlastný endpoint `/api/formular`, takže API kľúč nikdy neopustí server a odpadá
CORS. Ochrana proti robotom je skryté pole, nie captcha.

**Identita z CMS.** Názov, logo, farby, kontakty, otváracie hodiny, siete aj
menu sú z administrácie. Farby idú do CSS premenných na `<html>`, takže
prefarbenie webu je zmena v paneli.

**Meranie až po súhlase.** Google Analytics ani Meta Pixel sa nenačítajú, kým
návštevník nepovie áno. Lišta, ktorá oznámi „používame cookies" a meria od
prvej sekundy, nie je súhlas.

**SEO.** Titulky a popisy zo SEO polí v CMS, `sitemap.xml` zo skutočného
obsahu, `robots.txt` podľa stavu projektu — web vo výstavbe sa neindexuje.

**Presmerovania.** Keď stránka na ceste neexistuje, šablóna sa pozrie do
presmerovaní z CMS a až potom vráti 404. Prestavba webu tak nezhodí adresy,
ktoré má Google v indexe.

---

## Ako sa obsah aktualizuje

Odpovede z hubu sa cachujú s cache tagmi (`hub`, `hub:prispevky`, …). Po
uložení obsahu zavolá hub `/api/revalidate` s hlavičkou `x-hub-secret` a telom
`{ kolekcia }` — zhodí sa presne tá jedna značka, zvyšok webu ostane
vyrenderovaný. Keď oznámenie nedorazí, obsah sa aj tak obnoví do piatich minút.

---

## Čo upravovať

| Chcem zmeniť | Kde |
| --- | --- |
| Vzhľad (farby, typografia, rozostupy) | `src/styly/web.css` |
| Ako vyzerá konkrétny blok | `src/komponenty/bloky/<Blok>.tsx` |
| Hlavičku, pätičku, karty vo výpisoch | `src/komponenty/` |
| Adresy sekcií (`/blog`, `/ponuka`, …) | premenovať priečinok v `src/app/` |
| Čo sa ťahá z hubu | `src/hub/klient.ts` |

`src/hub/typy.ts` je zrkadlo delivery API. Keď sa API zmení, zmení sa tento
súbor a TypeScript ukáže presne tie miesta, ktoré na to doplácajú.

---

## Lokálny vývoj

```bash
cp .env.example .env.local     # vyplň aspoň HUB_PROJEKT
npm install
npm run dev                    # http://localhost:3000
```

Keď chýba `HUB_PROJEKT` alebo je hub nedostupný, web namiesto pádu ukáže
obrazovku s tým, čo presne treba vyplniť.
