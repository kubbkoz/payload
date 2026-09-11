import Link from "next/link";

/**
 * Verejná tvár hubu je zámerne jedna obrazovka.
 *
 * Toto nie je web, je to backend. Kto sem príde, buď ide do administrácie,
 * alebo hľadá, ako sa naň napojiť — tak má pred sebou oboje a nič iné.
 */
export default function Domov() {
  return (
    <main className="hub-web">
      <header className="hub-web__hlavicka">
        <p className="hub-web__stitok">Obsahový hub</p>
        <h1>Jedna administrácia pre všetky tvoje weby</h1>
        <p className="hub-web__uvod">
          Obsah, používatelia a práva na jednom mieste. Každý napojený web si svoje dáta
          ťahá cez API a nepotrebuje vlastný backend.
        </p>
        <Link className="hub-web__tlacidlo" href="/admin">
          Vstúpiť do administrácie
        </Link>
      </header>

      <section className="hub-web__sekcia">
        <h2>Ako sa web napojí</h2>
        <ol className="hub-web__kroky">
          <li>
            <strong>Založ projekt</strong> v sekcii Systém → Projekty. Dostane kód, napríklad{" "}
            <code>vinaren</code>, a zoznam povolených domén.
          </li>
          <li>
            <strong>Pridaj ľudí</strong> a každému nastav, ku ktorým projektom sa dostane a
            čo tam smie.
          </li>
          <li>
            <strong>Web si ťahá obsah</strong> z adries nižšie. Nič viac netreba — žiadna
            databáza na strane webu, žiadne prihlasovanie.
          </li>
        </ol>
      </section>

      <section className="hub-web__sekcia">
        <h2>Rozhranie pre napojený web</h2>
        <table className="hub-web__tabulka">
          <thead>
            <tr>
              <th>Adresa</th>
              <th>Čo vráti</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>GET /api/web/:kod</code>
              </td>
              <td>Nastavenia webu, menu a presmerovania — všetko na štart jedným dotazom.</td>
            </tr>
            <tr>
              <td>
                <code>GET /api/web/:kod/stranky</code>
              </td>
              <td>Zoznam zverejnených stránok s cestami.</td>
            </tr>
            <tr>
              <td>
                <code>GET /api/web/:kod/stranka?cesta=/o-nas</code>
              </td>
              <td>Jedna stránka vrátane blokov a SEO.</td>
            </tr>
            <tr>
              <td>
                <code>GET /api/web/:kod/prispevky</code>
              </td>
              <td>
                Články. Filtre: <code>slug</code>, <code>kategoria</code>, <code>limit</code>,{" "}
                <code>strana</code>, <code>odporucane=1</code>.
              </td>
            </tr>
            <tr>
              <td>
                <code>GET /api/web/:kod/katalog</code>
              </td>
              <td>Ponuka, cenník alebo produkty s cenami a parametrami.</td>
            </tr>
            <tr>
              <td>
                <code>GET /api/web/:kod/udalosti</code>
              </td>
              <td>
                Akcie s termínom. Minulé sa nevydávajú, <code>vsetky=1</code> ich zahrnie.
              </td>
            </tr>
            <tr>
              <td>
                <code>GET /api/web/:kod/kategorie</code>
              </td>
              <td>Číselník kategórií pre výpisy.</td>
            </tr>
            <tr>
              <td>
                <code>GET /api/web/:kod/formular/:slug</code>
              </td>
              <td>Popis polí formulára, aby si ho web vykreslil vlastným dizajnom.</td>
            </tr>
            <tr>
              <td>
                <code>POST /api/web/:kod/formular/:slug</code>
              </td>
              <td>Odoslanie vyplneného formulára. Hub ho overí, uloží a rozpošle e-maily.</td>
            </tr>
          </tbody>
        </table>
        <p className="hub-web__poznamka">
          Verejný projekt vydá obsah priamo doménam, ktoré má zapísané. Neverejný vyžaduje
          hlavičku <code>x-api-key</code> s kľúčom vystaveným presne na ten projekt. Po každej
          zmene obsahu hub zavolá adresu na prepláchnutie, ak ju projekt má — web sa tak
          dozvie, že má zahodiť vyrenderovanú kópiu.
        </p>
      </section>
    </main>
  );
}
