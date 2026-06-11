import { useState } from "react";
import { X, HandTap } from "@phosphor-icons/react";
import CadastralMap from "./CadastralMap";
import RealMap from "./RealMap";
import FichaPanel from "./FichaPanel";
import { LAYER_TABS } from "../data/content";
import type { Layer, ParcelRect } from "../data/parcels";

interface Props {
  parcels: ParcelRect[];
  activeIdx: number;
  setActiveIdx: (i: number) => void;
  layer: Layer;
  setLayer: (l: Layer) => void;
}

type MapMode = "real" | "esquema";

export default function MapWorkspace({ parcels, activeIdx, setActiveIdx, layer, setLayer }: Props) {
  const [hint, setHint] = useState(true);
  const [mode, setMode] = useState<MapMode>(
    typeof navigator !== "undefined" && navigator.onLine === false ? "esquema" : "real"
  );

  return (
    <div className="workspace">
      <div className="map-pane">
        {hint && (
          <div className="map-hint">
            <HandTap size={18} weight="duotone" />
            <span>
              <b>Tocá cualquier parcela</b> para ver su ficha. Cambiá entre el mapa real y el esquema temático.
            </span>
            <button className="mh-close" onClick={() => setHint(false)} aria-label="Cerrar ayuda">
              <X size={15} />
            </button>
          </div>
        )}
        <div className="map-toolbar">
          <div className="mode-toggle" role="tablist" aria-label="Tipo de mapa">
            <button role="tab" aria-selected={mode === "real"} className={mode === "real" ? "active" : ""} onClick={() => setMode("real")}>
              Real
            </button>
            <button role="tab" aria-selected={mode === "esquema"} className={mode === "esquema" ? "active" : ""} onClick={() => setMode("esquema")}>
              Esquema
            </button>
          </div>

          {mode === "esquema" ? (
            <div className="layer-tabs" role="tablist" aria-label="Capa de datos">
              {LAYER_TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={layer === t.id}
                  className={layer === t.id ? "active" : ""}
                  onClick={() => setLayer(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          ) : (
            <span className="tt">Parcelas reales · Catastro de Misiones</span>
          )}

          <span className="count">{parcels.length} parcelas</span>
        </div>

        {mode === "real" ? (
          <div className="map-canvas">
            <RealMap parcelCount={parcels.length} onSelect={setActiveIdx} />
          </div>
        ) : (
          <CadastralMap parcels={parcels} activeIdx={activeIdx} onSelect={setActiveIdx} layer={layer} />
        )}
      </div>

      <FichaPanel ficha={parcels[activeIdx].ficha} />
    </div>
  );
}
