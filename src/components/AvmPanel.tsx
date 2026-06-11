import { useMemo, useState } from "react";
import { AVM_ESTADO, AVM_SERVICIOS, AVM_ZONAS } from "../data/content";

export default function AvmPanel() {
  const [sup, setSup] = useState(400);
  const [zona, setZona] = useState(AVM_ZONAS[1].id);
  const [estado, setEstado] = useState(AVM_ESTADO[0].id);
  const [servicios, setServicios] = useState<string[]>(["agua", "luz"]);

  const toggle = (id: string) =>
    setServicios((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const result = useMemo(() => {
    const base = AVM_ZONAS.find((z) => z.id === zona)!.usdM2;
    const eFactor = AVM_ESTADO.find((e) => e.id === estado)!.factor;
    const sFactor = 1 + servicios.reduce((acc, id) => acc + (AVM_SERVICIOS.find((s) => s.id === id)?.factor ?? 0), 0);
    const usdM2 = base * eFactor * sFactor;
    const value = Math.round((usdM2 * sup) / 100) * 100;
    return {
      value,
      usdM2: Math.round(usdM2),
      low: Math.round((value * 0.88) / 100) * 100,
      high: Math.round((value * 1.12) / 100) * 100,
    };
  }, [sup, zona, estado, servicios]);

  const fmt = (n: number) => "USD " + n.toLocaleString("es-AR");
  const conf = Math.min(95, 58 + servicios.length * 8 + (estado === "edificado" ? 6 : 0));

  return (
    <div className="avm">
      <div className="avm-head">
        <h2>Tasación automática</h2>
        <p>
          Estimación de valor por lote a partir de zona, estado, servicios y superficie, calibrada con
          comparables de mercado y valuación fiscal de DGR.
        </p>
      </div>

      <div className="avm-grid">
        <div className="avm-form">
          <div className="field">
            <label htmlFor="sup">Superficie (m²)</label>
            <input id="sup" type="number" min={50} max={5000} step={10} value={sup} onChange={(e) => setSup(Number(e.target.value) || 0)} />
          </div>
          <div className="field">
            <label htmlFor="zona">Zona</label>
            <select id="zona" value={zona} onChange={(e) => setZona(e.target.value)}>
              {AVM_ZONAS.map((z) => (
                <option key={z.id} value={z.id}>{z.label}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="estado">Estado del lote</label>
            <select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
              {AVM_ESTADO.map((e) => (
                <option key={e.id} value={e.id}>{e.label}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Servicios</label>
            <div className="checks">
              {AVM_SERVICIOS.map((s) => (
                <label key={s.id} className={`check ${servicios.includes(s.id) ? "on" : ""}`}>
                  <input type="checkbox" checked={servicios.includes(s.id)} onChange={() => toggle(s.id)} />
                  {s.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="avm-result" aria-live="polite">
          <div className="rl">VALOR ESTIMADO</div>
          <div className="rv">{fmt(result.value)}</div>
          <div className="rr">rango {fmt(result.low)} a {fmt(result.high)}</div>
          <div className="rm">{fmt(result.usdM2)}/m² · confianza {conf}%</div>
          <div className="avm-bar"><i style={{ width: `${conf}%` }} /></div>
          <p className="rm" style={{ marginTop: 16 }}>
            Estimación de referencia del modelo AVM. No reemplaza la tasación de un corredor matriculado.
          </p>
        </div>
      </div>
    </div>
  );
}
