import type { Blok } from "@/hub/typy";

type Data = Extract<Blok, { blockType: "video" }>;

/**
 * Prevod bežných adries na vloženie. Kto vloží odkaz z prehliadača (a to robí
 * každý), dostane adresu stránky, nie prehrávača — tu sa to preloží.
 */
const vlozitelna = (adresa: string): string | null => {
  const youtube = adresa.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/,
  );
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}`;

  const vimeo = adresa.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

  return null;
};

export function Video({ blok }: { blok: Data }) {
  const adresa = blok.adresa?.trim();
  const vlozenie = adresa ? vlozitelna(adresa) : null;
  const subor = blok.subor?.url ?? (adresa && /\.(mp4|webm|mov)$/i.test(adresa) ? adresa : null);

  if (!vlozenie && !subor) return null;

  return (
    <section className="sekcia sekcia--siroka">
      {blok.nadpis ? <h2 className="sekcia__nadpis">{blok.nadpis}</h2> : null}
      <div className="video">
        {vlozenie ? (
          <iframe
            src={vlozenie}
            title={blok.nadpis || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <video controls preload="metadata" poster={blok.nahlad?.url}>
            <source src={subor!} />
          </video>
        )}
      </div>
    </section>
  );
}
