import type { Endpoint, PayloadRequest, Where } from "payload";

import { chyba, cislo, hlavickyCors, najdiProjekt, odpoved, smieCitat, type Projekt } from "../lib/api";
import { skratka } from "../lib/text";

/**
 * Delivery API — jediná vec, kvôli ktorej tento systém dáva zmysel.
 *
 * Napojený web nevie nič o vnútornostiach hubu. Pýta sa na adresy tvaru
 * /api/web/<kód projektu>/<čo chce> a dostane hotový JSON: len zverejnený
 * obsah, len svojho projektu, s poľami, ktoré naozaj potrebuje. Žiadny
 * prístup do administrácie, žiadne cudzie projekty, žiadne koncepty.
 *
 * Endpointy sú registrované v configu Payloadu (nie ako Next route), takže
 * bežia v jeho requeste: autentifikácia kľúčom, logger a databáza sú
 * pripravené a nekoliduje to s REST vrstvou na /api/[...slug].
 */

type Kontext = { projekt: Projekt };

/** Spoločný úvod každého endpointu: nájdi projekt, over prístup. */
const priprav = async (
  req: PayloadRequest,
): Promise<{ ok: true; ctx: Kontext } | { ok: false; odpoved: Response }> => {
  const kod = (req.routeParams as { kod?: string } | undefined)?.kod;
  const projekt = await najdiProjekt(req, kod);
  if (!projekt) {
    return { ok: false, odpoved: chyba("Projekt neexistuje.", 404, req) };
  }

  const povolenie = await smieCitat(req, projekt);
  if (!povolenie.ok) {
    return { ok: false, odpoved: chyba(povolenie.dovod, povolenie.stav, req, projekt) };
  }

  return { ok: true, ctx: { projekt } };
};

const zverejnene = (projekt: Projekt, doplnok?: Where): Where => ({
  and: [
    { projekt: { equals: projekt.id } },
    { _status: { equals: "published" } },
    ...(doplnok ? [doplnok] : []),
  ],
});

const vProjekte = (projekt: Projekt, doplnok?: Where): Where => ({
  and: [{ projekt: { equals: projekt.id } }, ...(doplnok ? [doplnok] : [])],
});

/** Z relácie spravíme to, čo web naozaj potrebuje — nie celý riadok z databázy. */
const obrazok = (hodnota: unknown) => {
  if (!hodnota || typeof hodnota !== "object") return null;
  const m = hodnota as Record<string, any>;
  if (!m.url) return null;
  return {
    url: m.url,
    alt: m.alt ?? "",
    popisok: m.popisok ?? null,
    sirka: m.width ?? null,
    vyska: m.height ?? null,
    rezy: m.sizes
      ? Object.fromEntries(
          Object.entries(m.sizes as Record<string, any>)
            .filter(([, v]) => v && (v as any).url)
            .map(([k, v]) => [k, { url: (v as any).url, sirka: (v as any).width, vyska: (v as any).height }]),
        )
      : {},
  };
};

const seo = (doc: Record<string, any>) => ({
  titulok: doc.seo?.titulok || doc.nazov || null,
  popis: doc.seo?.popis || (doc.perex ? skratka(String(doc.perex)) : null),
  obrazok: obrazok(doc.seo?.obrazok) ?? obrazok(doc.obrazok),
  neindexovat: Boolean(doc.seo?.neindexovat),
});

/* ── Rozcestník: jedným dotazom všetko, čo web potrebuje pri štarte ────── */

const bootstrap: Endpoint = {
  path: "/web/:kod",
  method: "get",
  handler: async (req) => {
    const v = await priprav(req);
    if (!v.ok) return v.odpoved;
    const { projekt } = v.ctx;

    const [nastavenia, menu, presmerovania] = await Promise.all([
      req.payload.find({
        collection: "nastavenia-webu",
        where: vProjekte(projekt),
        limit: 1,
        depth: 2,
        overrideAccess: true,
      }),
      req.payload.find({
        collection: "navigacia",
        where: vProjekte(projekt),
        limit: 20,
        depth: 2,
        overrideAccess: true,
      }),
      req.payload.find({
        collection: "presmerovania",
        where: vProjekte(projekt),
        limit: 500,
        depth: 0,
        overrideAccess: true,
      }),
    ]);

    const n = (nastavenia.docs[0] ?? {}) as Record<string, any>;

    return odpoved(
      {
        projekt: { kod: projekt.kod, nazov: projekt.nazov, stav: projekt.stav },
        nastavenia: {
          nazovWebu: n.nazovWebu ?? projekt.nazov,
          podtitul: n.podtitul ?? null,
          popisWebu: n.popisWebu ?? null,
          logo: obrazok(n.logo),
          favicon: obrazok(n.favicon),
          obrazokZdielania: obrazok(n.obrazokZdielania),
          farby: { hlavna: n.farbaHlavna ?? null, doplnkova: n.farbaDoplnkova ?? null },
          kontakt: {
            email: n.email ?? null,
            telefon: n.telefon ?? null,
            adresa: n.adresa ?? null,
            mapa: n.mapa ?? null,
            hodiny: n.hodiny ?? [],
          },
          firemneUdaje: n.firemneUdaje ?? null,
          siete: n.siete ?? [],
          meranie: { analytics: n.analytics ?? null, pixel: n.pixel ?? null },
          pravne: {
            cookieLista: n.cookieLista ?? true,
            cookieText: n.cookieText ?? null,
            ochranaUdajov: n.ochranaUdajov ?? null,
            obchodnePodmienky: n.obchodnePodmienky ?? null,
          },
        },
        menu: menu.docs.map((m) => {
          const d = m as Record<string, any>;
          return { nazov: d.nazov, umiestnenie: d.umiestnenie, polozky: d.polozky ?? [] };
        }),
        presmerovania: presmerovania.docs.map((p) => {
          const d = p as Record<string, any>;
          return { zo: d.zo, na: d.na, kod: d.trvale ? 301 : 307 };
        }),
      },
      projekt,
      req,
    );
  },
};

/* ── Stránky ──────────────────────────────────────────────────────────── */

const zoznamStranok: Endpoint = {
  path: "/web/:kod/stranky",
  method: "get",
  handler: async (req) => {
    const v = await priprav(req);
    if (!v.ok) return v.odpoved;
    const { projekt } = v.ctx;

    const { docs, totalDocs } = await req.payload.find({
      collection: "stranky",
      where: zverejnene(projekt),
      limit: cislo(req.query?.limit, 200, 500),
      depth: 0,
      sort: "cesta",
      overrideAccess: true,
    });

    return odpoved(
      {
        celkom: totalDocs,
        docs: docs.map((s) => {
          const d = s as Record<string, any>;
          return { cesta: d.cesta, nazov: d.nazov, perex: d.perex ?? null, upravene: d.updatedAt };
        }),
      },
      projekt,
      req,
    );
  },
};

const detailStranky: Endpoint = {
  path: "/web/:kod/stranka",
  method: "get",
  handler: async (req) => {
    const v = await priprav(req);
    if (!v.ok) return v.odpoved;
    const { projekt } = v.ctx;

    const cesta = typeof req.query?.cesta === "string" ? req.query.cesta : "/";
    const { docs } = await req.payload.find({
      collection: "stranky",
      where: zverejnene(projekt, { cesta: { equals: cesta.startsWith("/") ? cesta : `/${cesta}` } }),
      limit: 1,
      depth: 3,
      overrideAccess: true,
    });

    const stranka = docs[0] as Record<string, any> | undefined;
    if (!stranka) return chyba("Stránka neexistuje.", 404, req, projekt);

    return odpoved(
      {
        cesta: stranka.cesta,
        nazov: stranka.nazov,
        perex: stranka.perex ?? null,
        bloky: stranka.bloky ?? [],
        seo: seo(stranka),
        upravene: stranka.updatedAt,
      },
      projekt,
      req,
    );
  },
};

/* ── Príspevky, katalóg, udalosti ─────────────────────────────────────── */

const vypis = (
  kolekcia: "prispevky" | "katalog" | "udalosti",
  radenie: string,
): Endpoint => ({
  path: `/web/:kod/${kolekcia}`,
  method: "get",
  handler: async (req) => {
    const v = await priprav(req);
    if (!v.ok) return v.odpoved;
    const { projekt } = v.ctx;

    const podmienky: Where[] = [];

    const slug = req.query?.slug;
    if (typeof slug === "string" && slug) podmienky.push({ slug: { equals: slug } });

    const kategoria = req.query?.kategoria;
    if (typeof kategoria === "string" && kategoria) {
      const { docs } = await req.payload.find({
        collection: "kategorie",
        where: vProjekte(projekt, { slug: { equals: kategoria } }),
        limit: 1,
        depth: 0,
        overrideAccess: true,
      });
      const id = docs[0]?.id;
      if (!id) return odpoved({ celkom: 0, docs: [] }, projekt, req);
      podmienky.push(
        kolekcia === "prispevky" ? { kategorie: { in: [id] } } : { kategoria: { equals: id } },
      );
    }

    // Udalosti, ktoré už boli, nemá zmysel vydávať — návštevník nemá čo robiť
    // s pozvánkou spred mesiaca. Akcie bez dátumu (stála ponuka) ostávajú.
    if (kolekcia === "udalosti" && req.query?.vsetky !== "1") {
      const dnes = new Date();
      dnes.setHours(0, 0, 0, 0);
      podmienky.push({
        or: [{ datum: { greater_than_equal: dnes.toISOString() } }, { datum: { exists: false } }],
      });
    }

    if (req.query?.odporucane === "1") {
      podmienky.push(
        kolekcia === "udalosti" ? { odporucana: { equals: true } } : { odporucany: { equals: true } },
      );
    }

    const { docs, totalDocs, page, totalPages } = await req.payload.find({
      collection: kolekcia,
      where: zverejnene(projekt, podmienky.length ? { and: podmienky } : undefined),
      limit: cislo(req.query?.limit, 12, 100),
      page: cislo(req.query?.strana, 1, 10000),
      depth: 2,
      sort: typeof req.query?.radit === "string" ? req.query.radit : radenie,
      overrideAccess: true,
    });

    return odpoved(
      {
        celkom: totalDocs,
        strana: page,
        stran: totalPages,
        docs: docs.map((z) => {
          const d = z as Record<string, any>;
          const spolocne = {
            id: d.id,
            slug: d.slug,
            nazov: d.nazov,
            perex: d.perex ?? null,
            obrazok: obrazok(d.obrazok),
            seo: seo(d),
            upravene: d.updatedAt,
          };

          if (kolekcia === "prispevky") {
            return {
              ...spolocne,
              datum: d.datum ?? null,
              autor: d.autorText ?? null,
              odporucany: Boolean(d.odporucany),
              kategorie: (d.kategorie ?? []).map((k: any) =>
                typeof k === "object" ? { slug: k.slug, nazov: k.nazov } : k,
              ),
              obsah: d.obsah ?? null,
              bloky: d.bloky ?? [],
            };
          }

          if (kolekcia === "katalog") {
            return {
              ...spolocne,
              cena: d.cena ?? null,
              cenaCislo: d.cenaCislo ?? null,
              jednotka: d.jednotka ?? null,
              dostupne: d.dostupne !== false,
              odporucane: Boolean(d.odporucane),
              poradie: d.poradie ?? 0,
              kategoria:
                d.kategoria && typeof d.kategoria === "object"
                  ? { slug: d.kategoria.slug, nazov: d.kategoria.nazov }
                  : null,
              galeria: (d.galeria ?? []).map(obrazok).filter(Boolean),
              vlastnosti: d.vlastnosti ?? [],
              popis: d.popis ?? null,
            };
          }

          return {
            ...spolocne,
            datum: d.datum ?? null,
            cas: d.cas ?? null,
            terminText: d.terminText ?? null,
            miesto: d.miesto ?? null,
            vstupne: d.vstupne ?? null,
            odkazNaVstupenky: d.odkazNaVstupenky ?? null,
            odporucana: Boolean(d.odporucana),
            kategoria:
              d.kategoria && typeof d.kategoria === "object"
                ? { slug: d.kategoria.slug, nazov: d.kategoria.nazov }
                : null,
            popis: d.popis ?? null,
          };
        }),
      },
      projekt,
      req,
    );
  },
});

const zoznamKategorii: Endpoint = {
  path: "/web/:kod/kategorie",
  method: "get",
  handler: async (req) => {
    const v = await priprav(req);
    if (!v.ok) return v.odpoved;
    const { projekt } = v.ctx;

    const pre = req.query?.pre;
    const { docs } = await req.payload.find({
      collection: "kategorie",
      where: vProjekte(
        projekt,
        typeof pre === "string" && pre ? { pre: { contains: pre } } : undefined,
      ),
      limit: 200,
      depth: 0,
      sort: "poradie",
      overrideAccess: true,
    });

    return odpoved(
      {
        docs: docs.map((k) => {
          const d = k as Record<string, any>;
          return { slug: d.slug, nazov: d.nazov, popis: d.popis ?? null, pre: d.pre ?? [] };
        }),
      },
      projekt,
      req,
    );
  },
};

/* ── Formuláre ────────────────────────────────────────────────────────── */

const detailFormulara: Endpoint = {
  path: "/web/:kod/formular/:slug",
  method: "get",
  handler: async (req) => {
    const v = await priprav(req);
    if (!v.ok) return v.odpoved;
    const { projekt } = v.ctx;
    const slug = (req.routeParams as { slug?: string } | undefined)?.slug;

    const { docs } = await req.payload.find({
      collection: "formulare",
      where: vProjekte(projekt, { slug: { equals: String(slug ?? "") } }),
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });

    const formular = docs[0] as Record<string, any> | undefined;
    if (!formular) return chyba("Formulár neexistuje.", 404, req, projekt);

    return odpoved(
      {
        slug: formular.slug,
        nazov: formular.nazov,
        polia: (formular.polia ?? []).map((p: any) => ({
          kluc: p.kluc,
          popis: p.popis,
          typ: p.typ,
          povinne: Boolean(p.povinne),
          napoveda: p.napoveda ?? null,
          moznosti: (p.moznosti ?? []).map((m: any) => m.hodnota),
        })),
        textTlacidla: formular.textTlacidla ?? "Odoslať",
        spravaPoOdoslani: formular.spravaPoOdoslani ?? null,
        presmerovanie: formular.presmerovanie ?? null,
      },
      projekt,
      req,
    );
  },
};

const prijatieFormulara: Endpoint = {
  path: "/web/:kod/formular/:slug",
  method: "post",
  handler: async (req) => {
    const v = await priprav(req);
    if (!v.ok) return v.odpoved;
    const { projekt } = v.ctx;
    const slug = (req.routeParams as { slug?: string } | undefined)?.slug;

    let telo: Record<string, unknown> = {};
    try {
      telo = ((await req.json?.()) as Record<string, unknown>) ?? {};
    } catch {
      return chyba("Telo požiadavky nie je platný JSON.", 400, req, projekt);
    }

    // Pasca na roboty: pole, ktoré človek nevidí a nevyplní. Lacnejšie a
    // spoľahlivejšie než captcha pri objeme, aký má bežná prezentácia.
    if (typeof telo._pasca === "string" && telo._pasca.trim()) {
      return odpoved({ ok: true }, projekt, req, 200, "no-store");
    }

    const { docs } = await req.payload.find({
      collection: "formulare",
      where: vProjekte(projekt, { slug: { equals: String(slug ?? "") } }),
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    const formular = docs[0] as Record<string, any> | undefined;
    if (!formular) return chyba("Formulár neexistuje.", 404, req, projekt);

    const hodnoty: Record<string, unknown> = {};
    const chyby: string[] = [];

    for (const pole of (formular.polia ?? []) as any[]) {
      const surova = telo[pole.kluc];
      const prazdna =
        surova === undefined || surova === null || String(surova).trim() === "" || surova === false;

      if (pole.povinne && prazdna) {
        chyby.push(`Pole „${pole.popis}“ je povinné.`);
        continue;
      }
      if (prazdna) continue;

      if (pole.typ === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(surova))) {
        chyby.push(`Pole „${pole.popis}“ nie je platný e-mail.`);
        continue;
      }
      if (pole.typ === "cislo" && !Number.isFinite(Number(surova))) {
        chyby.push(`Pole „${pole.popis}“ musí byť číslo.`);
        continue;
      }
      if (pole.typ === "vyber") {
        const povolene = (pole.moznosti ?? []).map((m: any) => String(m.hodnota));
        if (povolene.length && !povolene.includes(String(surova))) {
          chyby.push(`Pole „${pole.popis}“ má neplatnú hodnotu.`);
          continue;
        }
      }

      hodnoty[pole.kluc] =
        typeof surova === "string" ? surova.slice(0, 5000) : (surova as unknown);
    }

    if (chyby.length) {
      return odpoved({ ok: false, chyby }, projekt, req, 422, "no-store");
    }

    const prvaHodnota = Object.values(hodnoty).find(
      (h) => typeof h === "string" && h.trim().length > 0,
    );

    const zaznam = await req.payload.create({
      collection: "odpovede",
      data: {
        projekt: projekt.id as number,
        formular: formular.id as number,
        udaje: hodnoty,
        suhrn: prvaHodnota ? skratka(String(prvaHodnota), 120) : `Odpoveď ${formular.nazov}`,
        zdroj: req.headers.get("referer") ?? null,
        stav: "nove",
      },
      req,
      overrideAccess: true,
      context: { preskocKontrolu: true, preskocPreplach: true, preskocZaznam: true },
    });

    await rozposliMaily(req, formular, hodnoty, projekt);

    return odpoved(
      {
        ok: true,
        id: zaznam.id,
        sprava: formular.spravaPoOdoslani ?? null,
        presmerovanie: formular.presmerovanie ?? null,
      },
      projekt,
      req,
      201,
      "no-store",
    );
  },
};

/**
 * E-maily sa posielajú až po uložení a ich zlyhanie sa navonok nehlási.
 * Odoslaná odpoveď je uložená odpoveď; keď sa pokazí Resend, obsluha ju nájde
 * v administrácii — opačné poradie by znamenalo, že sa dopyt stratí úplne.
 */
const rozposliMaily = async (
  req: PayloadRequest,
  formular: Record<string, any>,
  hodnoty: Record<string, unknown>,
  projekt: Projekt,
): Promise<void> => {
  const riadky = Object.entries(hodnoty)
    .map(([kluc, hodnota]) => {
      const pole = (formular.polia ?? []).find((p: any) => p.kluc === kluc);
      return `<tr><td style="padding:4px 12px 4px 0;color:#666">${pole?.popis ?? kluc}</td><td style="padding:4px 0"><strong>${String(hodnota)}</strong></td></tr>`;
    })
    .join("");

  const prijemcovia = (formular.prijemcovia ?? [])
    .map((p: any) => p?.email)
    .filter((e: unknown): e is string => typeof e === "string" && e.includes("@"));

  if (prijemcovia.length) {
    try {
      await req.payload.sendEmail({
        to: prijemcovia.join(", "),
        subject: formular.predmet || `Nová odpoveď z formulára ${formular.nazov}`,
        html: `<p>Projekt <strong>${projekt.nazov}</strong>, formulár <strong>${formular.nazov}</strong>.</p><table>${riadky}</table>`,
      });
    } catch (chybaMailu) {
      req.payload.logger.warn({ chybaMailu }, "Upozornenie na odpoveď sa nepodarilo odoslať.");
    }
  }

  if (formular.potvrdenieOdosielatelovi) {
    const polePreEmail = (formular.polia ?? []).find((p: any) => p.typ === "email");
    const adresa = polePreEmail ? hodnoty[polePreEmail.kluc] : undefined;
    if (typeof adresa === "string" && adresa.includes("@")) {
      try {
        await req.payload.sendEmail({
          to: adresa,
          subject: `${projekt.nazov} — potvrdenie`,
          html: `<p>${(formular.textPotvrdenia ?? "Ďakujeme, ozveme sa čo najskôr.").replace(/\n/g, "<br>")}</p><table>${riadky}</table>`,
        });
      } catch (chybaMailu) {
        req.payload.logger.warn({ chybaMailu }, "Potvrdenie odosielateľovi sa nepodarilo odoslať.");
      }
    }
  }
};

/** Predlet pre POST z prehliadača. Bez neho formulár z cudzej domény neodíde. */
const predlet: Endpoint = {
  path: "/web/:kod/formular/:slug",
  method: "options",
  handler: async (req) => {
    const kod = (req.routeParams as { kod?: string } | undefined)?.kod;
    const projekt = await najdiProjekt(req, kod);
    if (!projekt) return new Response(null, { status: 404 });
    return new Response(null, {
      status: 204,
      headers: hlavickyCors(projekt, req.headers.get("origin")),
    });
  },
};

export const ENDPOINTY: Endpoint[] = [
  bootstrap,
  zoznamStranok,
  detailStranky,
  zoznamKategorii,
  vypis("prispevky", "-datum"),
  vypis("katalog", "poradie"),
  vypis("udalosti", "datum"),
  detailFormulara,
  prijatieFormulara,
  predlet,
];
