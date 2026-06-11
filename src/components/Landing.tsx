import { useMemo, useState } from "react";
import {
  StackSimple,
  ChatCircleDots,
  Calculator,
  Cards,
  ArrowRight,
  type Icon,
} from "@phosphor-icons/react";
import Logo from "./Logo";
import Reveal from "./Reveal";
import WhatsappPhone from "./WhatsappPhone";
import RealMap from "./RealMap";
import { buildParcels, type Ficha } from "../data/parcels";
import type { ViewId } from "../data/content";

interface Props {
  onEnter: (view?: ViewId) => void;
}

const STATS = [
  { num: "46.249", lab: "parcelas del Catastro" },
  { num: "78", lab: "municipios" },
  { num: "7", lab: "fuentes cruzadas por ficha" },
  { num: "~80.000", lab: "familias sin título" },
];

const FEATURES: { icon: Icon; title: string; body: string; view: ViewId }[] = [
  { icon: StackSimple, title: "Mapa GIS por capas", body: "Recorré el catastro y pintá las parcelas por estado, valuación u ocupación. La capa viva sobre el plano oficial.", view: "mapa" },
  { icon: ChatCircleDots, title: "Agente IA por WhatsApp", body: "Responde sobre lotes, precios y dominio, y pre-califica para crédito UVA. Atención 24/7 sobre datos reales.", view: "agente" },
  { icon: Calculator, title: "Tasación automática", body: "Estimá el valor de un lote por zona, estado y servicios, calibrado con comparables de mercado.", view: "tasar" },
  { icon: Cards, title: "Fichas con dominio", body: "Cada parcela con medidas, valuación, situación dominial e historial verificable.", view: "fichas" },
];

const STEPS = [
  { n: "01", title: "Nomenclatura", body: "El Catastro publica geometría y nomenclatura. Esa es la columna vertebral de cada ficha." },
  { n: "02", title: "Cruce de fuentes", body: "La IA fusiona Registro, DGR, satélite, servicios y mercado contra cada parcela." },
  { n: "03", title: "Ficha viva", body: "Precio, medidas, dominio y ocupación, actualizados y trazables. Lista para operar." },
];

export default function Landing({ onEnter }: Props) {
  const parcels = useMemo(() => buildParcels(), []);
  const [live, setLive] = useState<Ficha | null>(null);
  const active = live ?? parcels[0].ficha;

  return (
    <div className="lp">
      <header className="lp-nav">
        <div className="wrap lp-nav-inner">
          <span className="brand">
            <Logo />
            HABITA
          </span>
          <nav className="lp-links">
            <a href="#producto">Producto</a>
            <a href="#como">Cómo funciona</a>
            <button className="btn btn-primary btn-sm" onClick={() => onEnter("mapa")}>
              Entrar al prototipo
            </button>
          </nav>
        </div>
      </header>

      {/* hero */}
      <section className="lp-hero">
        <div className="wrap lp-hero-grid">
          <div>
            <span className="kicker">Catastro de Misiones, con capa viva</span>
            <h1>
              Cada lote de Misiones,
              <br />
              con datos que <em>sirven</em>.
            </h1>
            <p className="lp-sub">
              Mapa catastral, dominio, valuación y un agente que responde. Sobre datos oficiales del
              Catastro, cruzados por IA.
            </p>
            <div className="lp-cta-row">
              <button className="btn btn-primary" onClick={() => onEnter("mapa")}>
                Probar el prototipo <ArrowRight size={16} weight="bold" />
              </button>
              <button className="btn btn-ghost" onClick={() => onEnter("agente")}>
                Ver el agente IA
              </button>
            </div>
            <div className="lp-meta">
              {STATS.slice(0, 3).map((s) => (
                <span key={s.lab}>
                  <b>{s.num}</b> {s.lab}
                </span>
              ))}
            </div>
          </div>

          <Reveal className="lp-phone-stage">
            <div className="lp-phone-halo" aria-hidden="true" />
            <WhatsappPhone />
            <p className="lp-phone-cap">El agente responde por WhatsApp, con datos reales de cada parcela.</p>
          </Reveal>
        </div>
      </section>

      {/* stats */}
      <section className="lp-stats wrap">
        {STATS.map((s) => (
          <div className="lp-stat" key={s.lab}>
            <div className="num">{s.num}</div>
            <div className="lab">{s.lab}</div>
          </div>
        ))}
      </section>

      {/* live map showcase: real Catastro parcels */}
      <section className="lp-band">
        <div className="wrap lp-map-grid">
          <Reveal>
            <h2 className="lp-h2">Las parcelas reales de Misiones, en un mapa de verdad.</h2>
            <p className="lp-lede">
              Geometría oficial del Catastro provincial sobre el mapa real. Tocá una parcela para ver
              su ficha viva con valuación, dominio y estado.
            </p>
            <div className="lp-prev-ficha" style={{ borderTop: "none", paddingLeft: 0 }}>
              <span className="mono">{active.nom}</span>
              <span>{active.dir}</span>
              <b>USD {active.valUsd.toLocaleString("es-AR")}</b>
            </div>
            <p className="lp-map-src">Fuente: Dirección General de Catastro, Misiones (WMS).</p>
          </Reveal>
          <Reveal className="lp-preview" delay={0.05}>
            <div className="lp-prev-head">
              <span>HABITA · parcelas del Catastro</span>
              <span className="lp-prev-dot" aria-hidden="true">
                <i /><i /><i />
              </span>
            </div>
            <div className="lp-prev-map tall">
              <RealMap onLive={setLive} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* features */}
      <section className="lp-band" id="producto">
        <div className="wrap">
          <Reveal>
            <h2 className="lp-h2">Una plataforma, cuatro herramientas que ya funcionan.</h2>
            <p className="lp-lede">Cada una abre directo en el prototipo. Entrá y probalas.</p>
          </Reveal>
          <div className="lp-features">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <button className="feat" onClick={() => onEnter(f.view)}>
                  <span className="feat-ico"><f.icon size={22} weight="duotone" /></span>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                  <span className="feat-go">Abrir <ArrowRight size={13} weight="bold" /></span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="lp-band alt" id="como">
        <div className="wrap">
          <Reveal>
            <h2 className="lp-h2">De la nomenclatura a la ficha viva.</h2>
          </Reveal>
          <div className="lp-steps">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.06}>
                <div className="step">
                  <span className="step-n">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* closing cta */}
      <section className="lp-cta">
        <Reveal>
          <h2>Entrá al prototipo y recorré el mapa.</h2>
          <p>Datos oficiales del Catastro de Misiones, con la capa viva que les faltaba.</p>
          <button className="btn btn-primary" onClick={() => onEnter("mapa")}>
            Probar el prototipo <ArrowRight size={16} weight="bold" />
          </button>
        </Reveal>
      </section>

      <footer className="lp-foot">
        <div className="wrap lp-foot-inner">
          <span className="brand">
            <Logo />
            HABITA
          </span>
          <small>
            Inteligencia territorial para Misiones. Prototipo de hackatón, 2026. Datos de muestra
            sobre fuentes públicas, a tomar como referencia.
          </small>
        </div>
      </footer>
    </div>
  );
}
