import type { ServerProps } from "payload";

import { kontextPanelu } from "./kontext";
import { VyberProjektu } from "./VyberProjektu";

/**
 * Serverová polovica prepínača: dotiahne projekty, na ktoré má prihlásený
 * človek právo. Zoznam sa nikdy neposiela celý — kto má jeden web, uvidí
 * v ponuke jeden web.
 */
export const PrepinacProjektu = async (props: ServerProps) => {
  const { payload, user } = await kontextPanelu(props);
  if (!user) return null;

  try {
    const { docs } = await payload.find({
      collection: "projekty",
      limit: 100,
      depth: 0,
      sort: "nazov",
      user,
      overrideAccess: false,
    });

    return (
      <VyberProjektu
        projekty={docs.map((projekt) => ({
          id: String(projekt.id),
          nazov: String((projekt as { nazov?: unknown }).nazov ?? "Projekt"),
          farba: (projekt as { farba?: string | null }).farba ?? null,
          stav: (projekt as { stav?: string | null }).stav ?? null,
        }))}
      />
    );
  } catch {
    return null;
  }
};

export default PrepinacProjektu;
