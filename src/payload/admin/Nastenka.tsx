import { cookies } from "next/headers";
import type { ServerProps } from "payload";

import { COOKIE_PROJEKTU } from "../access";
import { PREHLAD_NA_NASTENKE } from "../kolekcie";
import { kontextPanelu } from "./kontext";

/**
 * Nástenka nad štandardným rozcestníkom Payloadu.
 *
 * Keď je zvolený projekt, ukáže jeho čísla a poslednú činnosť. Keď nie je,
 * ukáže dlaždice projektov — to je prvá obrazovka mastera, ktorý spravuje
 * desať webov a potrebuje vedieť, kde sa dnes niečo dialo a kde čaká
 * nevybavená odpoveď z formulára.
 *
 * Počty sa rátajú dotazom `count` s právami prihláseného človeka, takže
 * pozorovateľ jedného projektu tu neuvidí ani číslo z cudzieho.
 */
export const Nastenka = async (props: ServerProps) => {
  const { payload, user } = await kontextPanelu(props);
  if (!user) return null;

  const zasobnik = await cookies();
  const zvoleny = zasobnik.get(COOKIE_PROJEKTU)?.value;
  const aktivny = zvoleny && zvoleny !== "vsetky" ? zvoleny : null;

  const spolocne = { user, overrideAccess: false } as const;

  try {
    const { docs: projekty } = await payload.find({
      collection: "projekty",
      limit: 24,
      depth: 0,
      sort: "nazov",
      ...spolocne,
    });

    if (projekty.length === 0) {
      return (
        <section className="hub-nastenka hub-nastenka--prazdna">
          <h2>Zatiaľ tu nie je žiadny projekt</h2>
          <p>
            Projekt je web napojený na túto administráciu. Založ prvý v sekcii{" "}
            <strong>Systém → Projekty</strong>; hneď po uložení dostane vlastné nastavenia
            a môžeš doň pridávať obsah aj ľudí.
          </p>
        </section>
      );
    }

    const cielove = aktivny
      ? projekty.filter((p) => String(p.id) === String(aktivny))
      : projekty.slice(0, 12);

    const dlazdice = await Promise.all(
      cielove.map(async (projekt) => {
        const kolekcie = aktivny
          ? PREHLAD_NA_NASTENKE
          : PREHLAD_NA_NASTENKE.filter((k) =>
              ["stranky", "prispevky", "odpovede"].includes(k.slug),
            );

        const cisla = await Promise.all(
          kolekcie.map(async (kolekcia) => {
            try {
              const { totalDocs } = await payload.count({
                collection: kolekcia.slug,
                where: { projekt: { equals: projekt.id } },
                ...spolocne,
              });
              return { ...kolekcia, pocet: totalDocs };
            } catch {
              return { ...kolekcia, pocet: null as number | null };
            }
          }),
        );

        let nevybavene = 0;
        try {
          const { totalDocs } = await payload.count({
            collection: "odpovede",
            where: {
              and: [{ projekt: { equals: projekt.id } }, { stav: { equals: "nove" } }],
            },
            ...spolocne,
          });
          nevybavene = totalDocs;
        } catch {
          nevybavene = 0;
        }

        return { projekt, cisla, nevybavene };
      }),
    );

    const { docs: cinnost } = await payload.find({
      collection: "zaznamy",
      limit: 8,
      depth: 0,
      sort: "-createdAt",
      ...(aktivny ? { where: { projekt: { equals: aktivny } } } : {}),
      ...spolocne,
    });

    return (
      <section className="hub-nastenka">
        <header className="hub-nastenka__hlavicka">
          <h2>{aktivny ? "Prehľad projektu" : "Tvoje projekty"}</h2>
          <p>
            {aktivny
              ? "Zoznamy nižšie sú zúžené na zvolený projekt. Prepneš ho vľavo hore."
              : "Prepínačom vľavo si vyber projekt — zúži sa tým celá administrácia."}
          </p>
        </header>

        <div className="hub-karty">
          {dlazdice.map(({ projekt, cisla, nevybavene }) => (
            <article
              key={String(projekt.id)}
              className="hub-karta"
              style={
                {
                  "--farba-projektu": (projekt as { farba?: string }).farba || "#00cfff",
                } as React.CSSProperties
              }
            >
              <h3 className="hub-karta__nazov">
                {String((projekt as { nazov?: unknown }).nazov ?? "Projekt")}
                {(projekt as { stav?: string }).stav !== "aktivny" ? (
                  <span className="hub-znacka">
                    {(projekt as { stav?: string }).stav === "vystavba"
                      ? "vo výstavbe"
                      : (projekt as { stav?: string }).stav === "pozastaveny"
                        ? "pozastavený"
                        : "archív"}
                  </span>
                ) : null}
              </h3>
              {(projekt as { domenaHlavna?: string }).domenaHlavna ? (
                <a
                  className="hub-karta__domena"
                  href={String((projekt as { domenaHlavna?: string }).domenaHlavna)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {String((projekt as { domenaHlavna?: string }).domenaHlavna).replace(
                    /^https?:\/\//,
                    "",
                  )}
                </a>
              ) : (
                <span className="hub-karta__domena hub-karta__domena--prazdna">
                  doména nevyplnená
                </span>
              )}

              <dl className="hub-karta__cisla">
                {cisla.map((c) => (
                  <div key={c.slug}>
                    <dt>{c.popis}</dt>
                    <dd>{c.pocet === null ? "—" : c.pocet}</dd>
                  </div>
                ))}
              </dl>

              {nevybavene > 0 ? (
                <p className="hub-karta__upozornenie">
                  {nevybavene}× nevybavená odpoveď z formulára
                </p>
              ) : null}
            </article>
          ))}
        </div>

        {cinnost.length > 0 ? (
          <div className="hub-cinnost">
            <h3>Posledná činnosť</h3>
            <ul>
              {cinnost.map((zaznam) => {
                const z = zaznam as unknown as Record<string, unknown>;
                return (
                  <li key={String(z.id)}>
                    <span className={`hub-akcia hub-akcia--${String(z.akcia ?? "uprava")}`}>
                      {String(z.akcia ?? "úprava")}
                    </span>
                    <strong>{String(z.nazov ?? "")}</strong>
                    <span className="hub-cinnost__meta">
                      {String(z.kolekcia ?? "")} · {String(z.ktoPopis ?? "")} ·{" "}
                      {z.createdAt
                        ? new Date(String(z.createdAt)).toLocaleString("sk-SK", {
                            day: "numeric",
                            month: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </section>
    );
  } catch {
    return null;
  }
};

export default Nastenka;
