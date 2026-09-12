import Link from "next/link";

import type { Tlacidlo } from "@/hub/typy";

const trieda = (styl: Tlacidlo["styl"]) =>
  styl === "vedlajsie"
    ? "tlacidlo tlacidlo--vedlajsie"
    : styl === "odkaz"
      ? "tlacidlo tlacidlo--text"
      : "tlacidlo tlacidlo--hlavne";

export function Tlacidla({ tlacidla }: { tlacidla?: Tlacidlo[] | null }) {
  if (!tlacidla?.length) return null;
  return (
    <div className="tlacidla">
      {tlacidla.map((t, i) => {
        const cudzie = /^https?:\/\//.test(t.odkaz);
        return (
          <Link
            key={i}
            href={t.odkaz}
            className={trieda(t.styl)}
            {...(cudzie ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {t.text}
          </Link>
        );
      })}
    </div>
  );
}
