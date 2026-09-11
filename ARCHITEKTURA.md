# Architektúra

Prečo je systém postavený takto a čo sa tým zámerne obetovalo.

---

## Východisko

Každý web má svoj backend. Pri troch weboch to znamená tri administrácie, tri
databázy, tri aktualizácie Payloadu a tri miesta, kde sa zakladá používateľ.
Pri desiatich je to práca na plný úväzok, ktorá neprináša nič nové — len
udržiava to, čo už raz vzniklo.

Tento systém to obracia: **jeden backend, N webov**. Web prestáva byť
aplikáciou s databázou a stáva sa z neho vykresľovacia vrstva nad HTTP
rozhraním.

---

## Základné rozhodnutie: jedna databáza, pole `projekt`

Na oddelenie klientov v jednom systéme sú tri cesty:

| Model | Cena | Prečo nie / áno |
| --- | --- | --- |
| Databáza na klienta | Silné oddelenie | N migrácií, N spojení, serverless pool sa vyčerpá; master nevie jedným dotazom zistiť, čo sa dnes dialo |
| Schéma na klienta | Slabšia izolácia než DB, rovnaká réžia | Payload s tým nepočíta, každá zmena schémy sa robí N-krát |
| **Riadok s `projekt`** | Izolácia stojí na kóde | **Zvolené** — jedna migrácia, jedno spojenie, prehľad naprieč projektmi zadarmo |

Zvolený model má jedno slabé miesto a treba ho pomenovať: **oddelenie je len
také silné ako kód, ktorý ho vynucuje.** Preto neexistuje ani jedna kolekcia
obsahu bez poľa `projekt` a ani jedna cesta k dátam, ktorá by obišla filter.

### Ako sa to vynucuje

1. **Prístup vracia filter, nie áno/nie.** `citatObsah` a `menitObsah`
   v `src/payload/access.ts` vracajú `Where` — Payload ho pripojí ku každému
   dotazu vrátane REST, GraphQL, zoznamov v paneli aj vyhľadávania. Nie je to
   kontrola v rozhraní, je to podmienka v SQL.
2. **Hook pred zápisom.** `overProjekt` beží na serveri pri každom vytvorení aj
   úprave. `filterOptions` a `access` na poli sa dajú obísť priamym volaním API,
   tento hook nie.
3. **Presun pod iný projekt je zakázaný.** Aj keď sa v tele požiadavky objaví
   iný projekt, úprava ostáva tam, kde bola. Presunúť záznam smie iba master.
4. **Zložený unikátny index v databáze.** `(projekt, slug)`, `(projekt, cesta)`.
   Dva weby majú vlastné `/kontakt`, ale jeden web nemá dve. Kontrola
   v aplikácii by sa dala obísť dvoma súbežnými uloženiami; index nie.
5. **Relácie sa zužujú.** Výber fotky, kategórie či formulára ponúka výhradne
   záznamy toho istého projektu — cez pickery sa do cudzej knižnice nedá dostať.

### Prepínač projektu ≠ bezpečnosť

Prepínač v hlavičke zapisuje cookie a zužuje zoznamy cez `baseListFilter`.
Je to **pohodlie, nie ochrana**. Kto si cookie prepíše na cudzí projekt,
dostane prázdny zoznam — práva sa rozhodujú inde a cookie na ne nemá vplyv.

---

## Role

Rola je vlastnosť dvojice človek + projekt, nie človeka. Jedno pole „rola“ na
používateľovi by znamenalo, že kto je editorom jedného webu, je editorom
všetkých — presne to, čo tento systém rieši.

```
master                      nad projektmi, jediná globálna rola
  └── pristupy: [{ projekt, rola }]
        správca     obsah + nastavenia + ľudia (len pre svoje projekty)
        editor      obsah vrátane zverejňovania
        autor       vlastné záznamy, bez zverejnenia
        pozorovateľ čítanie
```

Tri miesta, kde to musí držať:

- **Autor vidí len svoje.** `menitObsah` skladá `OR` z dvoch vetiev: projekty,
  kde je človek aspoň editorom, a projekty, kde je autorom — tam s podmienkou
  `vytvoril = ja`.
- **Autor nezverejňuje.** Payload zverejňuje cez `_status`, takže to stráži
  hook `obmedzZverejnenie`. Tlačidlo v rozhraní by sa obišlo volaním API.
- **Správca nesiahne na cudzie prístupy.** Hook v kolekcii `users` berie
  riadky prístupov k cudzím projektom z uloženého dokumentu, nie z požiadavky.
  Rolu master cez toto pole nedostane nikto.

Navyše: posledný aktívny master sa nedá vypnúť ani degradovať a nikto si nesmie
upraviť vlastné oprávnenia.

---

## Rozhranie pre napojené weby

Payload má vlastné REST aj GraphQL. Napriek tomu existuje samostatné
**delivery API** v `src/payload/endpointy.ts`, a to z troch dôvodov:

1. **Tvar dát.** Web potrebuje `{ url, alt, rezy }`, nie celý riadok tabuľky
   `media` s časovými pečiatkami a ID.
2. **Jeden dotaz namiesto piatich.** `GET /api/web/:kod` vráti nastavenia, menu
   aj presmerovania naraz — presne to, čo web potrebuje pri štarte.
3. **Iný model prístupu.** Verejný web nemá byť účtom v administrácii. Projekt
   označený ako verejný vydá zverejnený obsah doménam, ktoré má zapísané.

Endpointy sú registrované v konfigurácii Payloadu, nie ako Next route. Bežia
teda v jeho requeste — autentifikácia kľúčom, transakcia aj logger sú
pripravené a nekoliduje to s REST vrstvou na `/api/[...slug]`.

### CORS

Zoznam povolených pôvodov vzniká z domén zapísaných pri projekte, nie
z hviezdičky. Serverové volania (bez hlavičky `Origin`) tým obmedzené nie sú —
tie rieši kľúč.

### API kľúče

Kľúč je viazaný na jeden projekt a je zásadne len na čítanie: web si obsah
ťahá, nikdy ho nezapisuje. Overuje ho Payload vlastnou stratégiou nad
šifrovaným zápisom.

Kľúč generuje systém v hooku `beforeOperation` — musí to byť práve tam, lebo
z kľúča sa počíta vyhľadávací index a robí to poľový hook, ktorý beží ešte pred
kolekčnými. Kľúč doplnený neskôr by index nedostal a overenie by ho nikdy
nenašlo: v paneli by bol vidieť, ale web by ním neprešiel.

### Preplach webu

Hub nevie, aké adresy cudzí web má — a ani vedieť nemá. Po zmene obsahu pošle
jedno oznámenie „v projekte X sa zmenila kolekcia Y, záznam Z“ na adresu
zapísanú pri projekte. Čo s tým web urobí, je jeho vec.

Päťsekundový strop a tiché zlyhanie sú zámer: obsluha nemá čo robiť s chybou
cudzieho servera uprostred písania článku.

---

## Prečo kolekcie a nie globaly

Payload má `globals` — jeden dokument na celý systém. Presne to je problém:
v systéme s dvadsiatimi webmi by to znamenalo jedno menu a jedny nastavenia pre
všetkých. Preto sú `navigacia` aj `nastavenia-webu` kolekcie, kde jeden riadok
patrí jednému projektu. Jedinečnosť drží unikátny index na `projekt`, nie
dohoda, že sa druhý riadok nezaloží.

Nový projekt si riadok nastavení založí sám hookom — správca po prvom
prihlásení nenarazí na prázdny zoznam a otázku, čo s ním.

---

## Kaskádové mazanie

Zmazanie projektu maže jeho obsah v hooku `beforeDelete`, nie `afterDelete`.

Payload zakladá cudzie kľúče s `ON DELETE SET NULL`. Keby sa obsah domazával až
potom, databáza by pri mazaní projektu najprv skúsila zapísať NULL do stĺpca
`projekt_id`, ktorý je NOT NULL, a celé mazanie by padlo. Takto v okamihu, keď
projekt mizne, už naň nič neukazuje.

Zoznam kolekcií je na jednom mieste (`src/payload/kolekcie.ts`), aby nová
kolekcia neostala mimo kaskády.

---

## Page builder

Blokov je dvanásť a je to zámer. Skladačka z dvadsiatich mikro-blokov vyzerá
v ponuke bohato, ale obsluha v nej po týždni tápe a každý web z nej vyjde inak
rozbitý.

Bloky nenesú žiadne triedy ani farby — len dáta a pole `varianta`, ktoré si web
preloží do vlastného dizajnu. Dizajn patrí do webu, nie do CMS. Inak sa CMS
stane zlým editorom šablón a zmena vzhľadu sa robí v databáze.

---

## Čo systém zámerne nerobí

- **Nevykresľuje weby.** Nie je to Wix. Je to zdroj dát; vzhľad je vecou webu.
- **Neponúka captchu.** Ochrana formulárov je skryté pole. Captcha je ďalšia
  služba, ďalší kľúč a ďalšia vec, ktorá sa pokazí — pri objeme, aký má bežná
  prezentácia, sa nevyplatí.
- **Nerieši fakturáciu a odbery.** Keby to raz bola platená služba, patrí to do
  samostatnej vrstvy, nie medzi obsahové kolekcie.
- **Nemá per-projektový dizajn administrácie.** Farba projektu v prepínači
  a na karte stačí; prefarbený panel by bola údržba navyše bez úžitku.

---

## Známe hranice

| Hranica | Kedy zabolí | Čo s tým |
| --- | --- | --- |
| Jedna databáza pre všetkých | Klient bude chcieť zmluvne oddelené dáta | Vyčleniť mu samostatnú inštanciu — kód je rovnaký, zmení sa iba `DATABASE_URL` |
| Nástenka ráta dotazom `count` | Pri desiatkach projektov je štart pomalší | Zvoliť projekt v prepínači; karty sa zúžia na jeden |
| Cron zverejňovania raz denne | Na Vercel Hobby | Pro program alebo externý cron |
| Zoznam odpovedí bez exportu | Pri stovkách dopytov mesačne | Doplniť export do CSV nad kolekciou `odpovede` |
| Bez viacjazyčnosti obsahu | Pri prvom dvojjazyčnom webe | Payload má `localization` — zapína sa v konfigurácii a doplní jazyk do dotazov delivery API |
