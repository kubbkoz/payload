import { NextResponse, type NextRequest } from "next/server";

/**
 * Predvolene tmavá administrácia.
 *
 * ZJAV_ je tmavá značka — web má v koreni napísané „dark by default“ a panel
 * nemá dôvod vyzerať inak. Payload však štartuje na svetlej a tému číta
 * z cookie `payload-theme` už pri serverovom vykreslení.
 *
 * Riešiť to komponentom v prehliadači nestačí: vlastné providery Payloadu sa
 * na prihlasovacej obrazovke nemountujú, takže by človek dostal do očí bielu
 * stránku, ktorá po prihlásení zhasne. Preto sa cookie dopĺňa tu, ešte pred
 * vykreslením — prvé pixely sú tmavé a žiadny záblesk sa nekoná.
 *
 * Dopĺňa sa iba keď chýba. Kto si prepne na svetlú, má ju aj po návrate.
 */
const COOKIE_TEMY = "payload-theme";

export function middleware(req: NextRequest) {
  if (req.cookies.has(COOKIE_TEMY)) return NextResponse.next();

  // Nastavenie na požiadavke (nie len na odpovedi) je to podstatné: bez neho
  // by sa prvé vykreslenie stihlo ešte v svetlej a tmavá by naskočila až
  // pri ďalšej navigácii.
  req.cookies.set(COOKIE_TEMY, "dark");

  const odpoved = NextResponse.next({ request: { headers: req.headers } });
  odpoved.cookies.set(COOKIE_TEMY, "dark", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return odpoved;
}

export const config = {
  // Iba panel. Delivery API ani verejná stránka s témou nič nemajú.
  matcher: ["/admin/:path*"],
};
