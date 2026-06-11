import { useMemo, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import type { ParcelRect } from "../data/parcels";

interface Props {
  parcels: ParcelRect[];
  onSelect: (idx: number) => void;
}

export default function SearchView({ parcels, onSelect }: Props) {
  const [q, setQ] = useState("");

  // unique fichas with their first parcel index
  const rows = useMemo(() => {
    const seen = new Map<string, number>();
    parcels.forEach((p, idx) => {
      if (!seen.has(p.ficha.nom)) seen.set(p.ficha.nom, idx);
    });
    return [...seen.values()];
  }, [parcels]);

  const filtered = rows.filter((idx) => {
    const f = parcels[idx].ficha;
    const hay = `${f.nom} ${f.dir} ${f.estado} ${f.ocupacion}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  const fmt = (n: number) => "USD " + n.toLocaleString("es-AR");

  return (
    <div className="list-view">
      <h2>Buscar parcelas</h2>
      <div className="sub">{filtered.length} resultados sobre datos verificados del Catastro</div>

      <div className="tb-search" style={{ maxWidth: "none", marginTop: 18 }}>
        <MagnifyingGlass size={16} />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filtrá por nomenclatura, dirección o estado"
          aria-label="Filtrar"
        />
      </div>

      {filtered.map((idx) => {
        const f = parcels[idx].ficha;
        return (
          <div key={f.nom} className="result" role="button" tabIndex={0} onClick={() => onSelect(idx)}
            onKeyDown={(e) => (e.key === "Enter" ? onSelect(idx) : null)}>
            <span className="rn">{f.nom}</span>
            <span className="rd">{f.dir}<small>{f.estado} · {f.ocupacion} · {f.supM2} m²</small></span>
            <span className="rv">{fmt(f.valUsd)}</span>
            <span className="rd" style={{ color: "var(--faint)", fontFamily: "var(--mono)", fontSize: "0.78rem" }}>{f.fuentes}/7 fuentes</span>
          </div>
        );
      })}
    </div>
  );
}
