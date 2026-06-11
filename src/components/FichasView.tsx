import { useMemo } from "react";
import type { ParcelRect } from "../data/parcels";

interface Props {
  parcels: ParcelRect[];
  onSelect: (idx: number) => void;
}

export default function FichasView({ parcels, onSelect }: Props) {
  const rows = useMemo(() => {
    const seen = new Map<string, number>();
    parcels.forEach((p, idx) => {
      if (!seen.has(p.ficha.nom)) seen.set(p.ficha.nom, idx);
    });
    return [...seen.values()];
  }, [parcels]);

  const fmt = (n: number) => "USD " + n.toLocaleString("es-AR");

  return (
    <div className="list-view">
      <h2>Fichas recientes</h2>
      <div className="sub">{rows.length} parcelas con ficha viva construida por la plataforma</div>

      <div className="cards-grid">
        {rows.map((idx) => {
          const f = parcels[idx].ficha;
          return (
            <div key={f.nom} className="fcard" role="button" tabIndex={0} onClick={() => onSelect(idx)}
              onKeyDown={(e) => (e.key === "Enter" ? onSelect(idx) : null)}>
              <div className="fn">{f.nom}</div>
              <div className="fd">{f.dir}</div>
              <div className="fp-states" style={{ marginTop: 12 }}>
                <span className="chip neutral">{f.estado}</span>
                <span className="chip neutral">{f.ocupacion}</span>
              </div>
              <div className="fm">
                <span className="fv">{fmt(f.valUsd)}</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: "0.74rem", color: "var(--faint)" }}>{f.fuentes}/7</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
