import { useState } from "react";
import { motion } from "motion/react";
import { ChatCircleDots, FilePdf } from "@phosphor-icons/react";
import type { DomStatus, Ficha } from "../data/parcels";

type Tab = "resumen" | "dominio" | "valuacion" | "historial";

const TABS: { id: Tab; label: string }[] = [
  { id: "resumen", label: "Resumen" },
  { id: "dominio", label: "Dominio" },
  { id: "valuacion", label: "Valuación" },
  { id: "historial", label: "Historial" },
];

const DOM_CHIP: Record<DomStatus, { cls: string; label: string }> = {
  limpio: { cls: "ok", label: "dominio limpio" },
  hipoteca: { cls: "warn", label: "hipoteca" },
  embargo: { cls: "risk", label: "embargo" },
  informal: { cls: "risk", label: "informal" },
};

const fmtUsd = (n: number) => "USD " + n.toLocaleString("es-AR");
const fmtArs = (n: number) => (n ? "$ " + n.toLocaleString("es-AR") : "sin partida");

export default function FichaPanel({ ficha }: { ficha: Ficha }) {
  const [tab, setTab] = useState<Tab>("resumen");
  const dom = DOM_CHIP[ficha.dom.status];
  const estadoChip = ficha.estado === "edificado" ? "ok" : ficha.estado === "en obra" ? "warn" : "neutral";

  return (
    <aside className="ficha-pane">
      <div className="fp-head">
        <div className="fp-eyebrow">NOMENCLATURA CATASTRAL</div>
        <div className="fp-nom">{ficha.nom}</div>
        <div className="fp-dir">{ficha.dir}</div>
        <div className="fp-states">
          {ficha.estimated && <span className="chip live">en vivo</span>}
          <span className={`chip ${estadoChip}`}>{ficha.estado}</span>
          <span className="chip neutral">{ficha.ocupacion}</span>
          <span className={`chip ${dom.cls}`}>{dom.label}</span>
        </div>
      </div>

      <div className="fp-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={tab === t.id ? "active" : ""}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <motion.div className="fp-body" key={`${ficha.nom}-${tab}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }}>
        {tab === "resumen" && (
          <>
            <div className="kv-grid">
              <div className="kv"><span>VALOR ESTIMADO</span><b className="big">{fmtUsd(ficha.valUsd)}</b></div>
              <div className="kv"><span>SUPERFICIE</span><b>{ficha.supM2} m²</b></div>
              <div className="kv"><span>FRENTE x FONDO</span><b>{ficha.frente} x {ficha.fondo} m</b></div>
              <div className="kv"><span>PARTIDA DGR</span><b>{ficha.partida}</b></div>
              <div className="kv"><span>TITULAR (Registro)</span><b className="mask">{ficha.titular}</b></div>
              <div className="kv"><span>FUENTES CRUZADAS</span><b>{ficha.fuentes} de 7</b></div>
            </div>
            <div className="fp-note">
              Ficha construida por <b>record linkage</b> sobre la nomenclatura. Datos oficiales del Catastro cruzados con Registro, DGR, satélite y mercado.
            </div>
            {ficha.dom.status === "informal" && (
              <div className="fp-impact">
                <span>IMPACTO SOCIAL</span>
                Lote habitado sin título. HABITA lo detecta y guía la regularización: parte de las ~80.000 familias misioneras que pueden acceder a su escritura.
              </div>
            )}
            <div className="fp-actions">
              <button className="btn btn-primary btn-sm"><ChatCircleDots size={15} weight="bold" /> Consultar al agente</button>
              <button className="btn btn-ghost btn-sm"><FilePdf size={15} /> Informe</button>
            </div>
          </>
        )}

        {tab === "dominio" && (
          <>
            <div className="kv-grid">
              <div className="kv"><span>SITUACIÓN</span><b>{dom.label}</b></div>
              <div className="kv"><span>TITULAR</span><b className="mask">{ficha.titular}</b></div>
            </div>
            <div className="fp-note"><b>{ficha.dom.detail}.</b> La titularidad es dato personal (Ley 25.326): se accede con permisos y convenio del Registro, no se expone abiertamente.</div>
            <div className="sub-h">DUE DILIGENCE</div>
            <p style={{ color: "var(--muted)", fontSize: "0.86rem" }}>
              El agente verifica embargos, hipotecas, inhibiciones y sucesiones contra el informe de dominio antes de operar.
            </p>
          </>
        )}

        {tab === "valuacion" && (
          <>
            <div className="kv-grid">
              <div className="kv"><span>VALOR ESTIMADO (AVM)</span><b className="big">{fmtUsd(ficha.valUsd)}</b></div>
              <div className="kv"><span>VALUACIÓN FISCAL</span><b>{fmtArs(ficha.valFiscal)}</b></div>
            </div>
            <div className="sub-h">COMPARABLES DE MERCADO</div>
            {ficha.comps.length ? (
              <table className="comp-table">
                <thead>
                  <tr><th>Parcela</th><th>Sup.</th><th>USD/m²</th></tr>
                </thead>
                <tbody>
                  {ficha.comps.map((c) => (
                    <tr key={c.ref}><td>{c.ref}</td><td>{c.supM2} m²</td><td>{c.usdM2}</td></tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: "var(--muted)", fontSize: "0.86rem" }}>
                Valor estimado por el modelo AVM a partir de la superficie y la zona. Sin comparables cargados para esta parcela todavía.
              </p>
            )}
          </>
        )}

        {tab === "historial" && (
          <ul className="timeline">
            {ficha.historial.map((h, i) => (
              <li key={i}>
                <div className="td">{h.date}</div>
                <div className="te">{h.event}</div>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </aside>
  );
}
