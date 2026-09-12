import config from "@payload-config";
import { headers as hlavickyPoziadavky } from "next/headers";
import { getPayload, type Payload, type TypedUser } from "payload";

/**
 * Prihlásený človek a inštancia Payloadu pre serverové komponenty panelu.
 *
 * Payload síce props s `payload` a `user` posiela, ale nie do každého slotu a
 * nie v každej verzii rovnako. Komponent, ktorý sa na ne spolieha, potom ticho
 * vráti null a v paneli jednoducho nič nie je — bez chyby, bez stopy v logu.
 * Preto sa tu props použijú, keď sú, a keď nie sú, zistí sa to znova z hlavičiek.
 */
export const kontextPanelu = async (props: {
  payload?: Payload;
  user?: TypedUser | null;
}): Promise<{ payload: Payload; user: TypedUser | null }> => {
  const payload = props.payload ?? (await getPayload({ config }));
  if (props.user) return { payload, user: props.user };

  try {
    const { user } = await payload.auth({ headers: await hlavickyPoziadavky() });
    return { payload, user: user ?? null };
  } catch {
    return { payload, user: null };
  }
};
