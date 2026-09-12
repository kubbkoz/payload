import Link from "next/link";

export default function Nenajdene() {
  return (
    <div className="chyba">
      <p className="chyba__kod">404</p>
      <h1>Táto stránka tu nie je</h1>
      <p className="prazdne">Možno sa presťahovala, možno v adrese ušiel preklep.</p>
      <p>
        <Link className="tlacidlo tlacidlo--hlavne" href="/">
          Späť na úvod
        </Link>
      </p>
    </div>
  );
}
