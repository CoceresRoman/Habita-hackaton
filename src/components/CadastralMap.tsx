import { type KeyboardEvent } from "react";
import { parcelFill, LEGENDS, type Layer, type ParcelRect } from "../data/parcels";

interface Props {
  parcels: ParcelRect[];
  activeIdx: number;
  onSelect: (idx: number) => void;
  layer: Layer;
}

export default function CadastralMap({ parcels, activeIdx, onSelect, layer }: Props) {
  const onKey = (e: KeyboardEvent<SVGRectElement>, idx: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(idx);
    }
  };

  return (
    <div className="map-canvas">
      <svg viewBox="0 0 400 344" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Mapa catastral. Tocá una parcela para abrir su ficha.">
        <path className="maproad" d="M0 118 H400" />
        <path className="maproad" d="M0 232 H400" />
        <path className="maproad" d="M150 0 V344" />
        <path className="maproad" d="M268 0 V344" />
        {parcels.map((p, idx) => {
          const isActive = idx === activeIdx;
          const cls = ["parcel", isActive ? "is-active" : "", p.scan && !isActive ? "scan" : ""]
            .filter(Boolean)
            .join(" ");
          return (
            <rect
              key={idx}
              className={cls}
              style={{ "--pf": parcelFill(p.ficha, layer) } as React.CSSProperties}
              x={p.x.toFixed(1)}
              y={p.y.toFixed(1)}
              width={p.w.toFixed(1)}
              height={p.h.toFixed(1)}
              rx="1.5"
              tabIndex={0}
              role="button"
              aria-label={`Parcela ${p.ficha.nom}`}
              aria-pressed={isActive}
              onClick={() => onSelect(idx)}
              onKeyDown={(e) => onKey(e, idx)}
            />
          );
        })}
        <text className="maplabel" x="6" y="112">AV. URQUIZA</text>
        <text className="maplabel" x="154" y="14">CALLE 12</text>
      </svg>

      <div className="legend">
        <div className="lt">CAPA: {layer.toUpperCase()}</div>
        <ul>
          {LEGENDS[layer].map((item) => (
            <li key={item.label}>
              <i style={{ background: item.swatch }} />
              {item.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="map-coords">27°22'S 55°53'O · zoom 16</div>
    </div>
  );
}
