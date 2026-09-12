import type { JSX } from "react";

import type { BohatyText } from "./typy";
import { Obrazok } from "@/komponenty/Obrazok";

/**
 * Vykreslenie textu z editora administrácie.
 *
 * Payload ukladá text ako Lexical JSON. Existuje na to oficiálny balík, ale
 * ťahá so sebou celý editor kvôli tridsiatim riadkom prevodu — na weboch,
 * ktoré majú byť rýchle, je to zlý obchod. Tu je len to, čo editor v hube
 * naozaj dokáže vyrobiť.
 *
 * Neznámy uzol sa ticho preskočí. Web sa nemá rozbiť preto, že do obsahu
 * pribudol prvok, o ktorom šablóna ešte nevie.
 */

type Uzol = Record<string, any>;

// Bitová maska formátovania textu v Lexicale.
const TUCNE = 1;
const KURZIVA = 2;
const PRECIARKNUTE = 4;
const PODCIARKNUTE = 8;
const KOD = 16;

const text = (uzol: Uzol, kluc: string) => {
  const format: number = uzol.format ?? 0;
  let prvok: JSX.Element = <>{uzol.text}</>;

  if (format & KOD) prvok = <code>{prvok}</code>;
  if (format & TUCNE) prvok = <strong>{prvok}</strong>;
  if (format & KURZIVA) prvok = <em>{prvok}</em>;
  if (format & PODCIARKNUTE) prvok = <u>{prvok}</u>;
  if (format & PRECIARKNUTE) prvok = <s>{prvok}</s>;

  return <span key={kluc}>{prvok}</span>;
};

const deti = (uzol: Uzol, predpona: string): (JSX.Element | null)[] =>
  ((uzol.children ?? []) as Uzol[]).map((dieta, i) => uzlom(dieta, `${predpona}-${i}`));

function uzlom(uzol: Uzol | null | undefined, kluc: string): JSX.Element | null {
  if (!uzol) return null;

  switch (uzol.type) {
    case "text":
      return text(uzol, kluc);

    case "linebreak":
      return <br key={kluc} />;

    case "paragraph": {
      const obsah = deti(uzol, kluc);
      // Prázdny odstavec je v editore medzera, na webe by bol prázdny <p>.
      if (obsah.every((d) => d === null)) return null;
      return <p key={kluc}>{obsah}</p>;
    }

    case "heading": {
      const Tag = (uzol.tag ?? "h2") as keyof JSX.IntrinsicElements;
      return <Tag key={kluc}>{deti(uzol, kluc)}</Tag>;
    }

    case "quote":
      return <blockquote key={kluc}>{deti(uzol, kluc)}</blockquote>;

    case "list":
      return uzol.listType === "number" ? (
        <ol key={kluc}>{deti(uzol, kluc)}</ol>
      ) : (
        <ul key={kluc} className={uzol.listType === "check" ? "zoznam--zaskrtavaci" : undefined}>
          {deti(uzol, kluc)}
        </ul>
      );

    case "listitem":
      return <li key={kluc}>{deti(uzol, kluc)}</li>;

    case "link": {
      const polia = uzol.fields ?? {};
      const kam: string = polia.url ?? polia.doc?.value?.cesta ?? "#";
      const cudzie = polia.newTab || /^https?:\/\//.test(kam);
      return (
        <a
          key={kluc}
          href={kam}
          {...(cudzie ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {deti(uzol, kluc)}
        </a>
      );
    }

    case "horizontalrule":
      return <hr key={kluc} />;

    case "upload": {
      const m = uzol.value;
      if (!m?.url) return null;
      return (
        <figure key={kluc} className="text__obrazok">
          <Obrazok
            obrazok={{
              url: m.url,
              alt: m.alt ?? "",
              popisok: m.popisok ?? null,
              sirka: m.width ?? null,
              vyska: m.height ?? null,
              rezy: {},
            }}
            sirky="(max-width: 760px) 100vw, 720px"
          />
          {m.popisok ? <figcaption>{m.popisok}</figcaption> : null}
        </figure>
      );
    }

    default:
      // Neznámy uzol s deťmi aspoň vypíše text, ktorý v ňom je.
      return uzol.children ? <div key={kluc}>{deti(uzol, kluc)}</div> : null;
  }
}

export function BohatyTextBlok({ obsah }: { obsah: BohatyText }) {
  const korene = (obsah as { root?: { children?: Uzol[] } } | null)?.root?.children;
  if (!korene?.length) return null;
  return <div className="text">{korene.map((u, i) => uzlom(u, `u${i}`))}</div>;
}

/** Holý text z bohatého textu — na popisy do SEO a náhľady. */
export function textZObsahu(obsah: BohatyText, strop = 200): string {
  const von: string[] = [];
  const prejdi = (uzly: Uzol[] | undefined) => {
    for (const u of uzly ?? []) {
      if (u?.type === "text" && typeof u.text === "string") von.push(u.text);
      if (u?.children) prejdi(u.children as Uzol[]);
      if (von.join(" ").length > strop) return;
    }
  };
  prejdi((obsah as { root?: { children?: Uzol[] } } | null)?.root?.children);
  const cely = von.join(" ").replace(/\s+/g, " ").trim();
  return cely.length <= strop ? cely : `${cely.slice(0, strop - 1).trimEnd()}…`;
}
