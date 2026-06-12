import { useMemo, useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Database,
  Lightning,
  CurrencyCircleDollar,
  ChatsCircle,
  Buildings,
  Users,
  Calendar,
  Handshake,
} from "@phosphor-icons/react";
import DataFlow from "./DataFlow";
import { GradientBackground } from "./ui/gradient-background";
import Logo from "./Logo";
import Reveal from "./Reveal";
import PhoneCarousel from "./PhoneCarousel";
import RealMap from "./RealMap";
import { buildParcels, type Ficha } from "../data/parcels";
import type { ViewId } from "../data/content";

// ViewId still used for onEnter callback

interface Props {
  onEnter: (view?: ViewId) => void;
}

const STATS = [
  { num: "46.249", lab: "parcelas del Catastro" },
  { num: "78", lab: "municipios" },
  { num: "7", lab: "fuentes cruzadas por ficha" },
  { num: "~80.000", lab: "familias sin título" },
];

const PILLARS = [
  { icon: Database, title: "Datos oficiales", body: "Información directa del Catastro provincial, DGR y Registro de la Propiedad." },
  { icon: ShieldCheck, title: "Verificable", body: "Cada dato tiene trazabilidad. La IA no inventa, encuentra y cruza fuentes." },
  { icon: Lightning, title: "Tiempo real", body: "Actualización continua desde fuentes públicas oficiales." },
];

const REVENUE_STREAMS = [
  { icon: CurrencyCircleDollar, title: "Acceso a información filtrada", body: "Suscripción para inmobiliarias y profesionales que necesitan datos catastrales verificados y actualizados." },
  { icon: ChatsCircle, title: "Agente WhatsApp", body: "Atención automatizada 24/7 para consultas de lotes, valuaciones y pre-calificación de créditos." },
  { icon: Buildings, title: "Gestor de consorcios", body: "Sistema de gestión para inmobiliarias y administradores de consorcios con datos integrados." },
  { icon: Users, title: "Portal para inquilinos", body: "Plataforma donde inquilinos acceden a información verificada de propiedades y documentación." },
];

const VIABILIDAD = [
  { icon: Calendar, title: "5 meses de desarrollo", body: "Desarrollo del MVP completo con las funcionalidades core de la plataforma." },
  { icon: Handshake, title: "Acuerdos institucionales", body: "Requiere convenios con la Cámara Inmobiliaria, Catastro y entidades oficiales de Misiones." },
];

export default function Landing({ onEnter }: Props) {
  const parcels = useMemo(() => buildParcels(), []);
  const [live, setLive] = useState<Ficha | null>(null);
  const active = live ?? parcels[0].ficha;

  return (
    <div className="lp">
      {/* Navigation - Executive style */}
      <header className="lp-nav">
        <div className="wrap lp-nav-inner">
          <span className="brand">
            <Logo />
            HABITA
          </span>
          <nav className="lp-links">
            <a href="#solucion">Solución</a>
            <a href="#mercado">Mercado</a>
            <a href="#viabilidad">Viabilidad</a>
            <button className="btn btn-primary btn-sm" onClick={() => onEnter("mapa")}>
              Acceder a la plataforma
            </button>
          </nav>
        </div>
      </header>

      {/* SLIDE 1: Problem Statement */}
      <section className="lp-slide lp-slide-problem">
        <GradientBackground />
        <div className="hero-image" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
            alt=""
            loading="eager"
          />
        </div>
        <div className="wrap">
          <div className="hero-executive">
            <Reveal>
              <span className="kicker">Cámara Inmobiliaria de Misiones</span>
              <h1 className="hero-title">
                El mercado inmobiliario opera
                <br />
                con <em>información fragmentada</em>.
              </h1>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="hero-problem">
                <div className="hero-problem-inner">
                  <p className="hero-statement">
                    La falta de información confiable y accesible genera cotizaciones opacas,
                    desconfianza y asimetría de información que perjudica tanto a compradores
                    como a inmobiliarias.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="slide-scroll-hint">Scroll para ver la solución</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SLIDE 2: Solution + DataFlow */}
      <section className="lp-slide lp-slide-solution" id="solucion">
        <div className="wrap">
          <div className="hero-executive">
            <Reveal>
              <div className="hero-solution">
                <h2 className="hero-solution-title"><strong>HABITA</strong> resuelve esto.</h2>
                <p className="hero-solution-text">
                  Centralizamos y cruzamos datos oficiales con IA. La inteligencia artificial
                  no inventa datos: los encuentra, cruza y actualiza desde fuentes oficiales.
                </p>
              </div>
            </Reveal>

            {/* Animated Data Flow */}
            <DataFlow />

            <Reveal delay={0.18}>
              <div className="hero-pillars">
                {PILLARS.map((p) => (
                  <div key={p.title} className="hero-pillar">
                    <span className="hero-pillar-icon">
                      <p.icon size={20} weight="duotone" />
                    </span>
                    <div>
                      <h3>{p.title}</h3>
                      <p>{p.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="lp-cta-row hero-cta">
                <button className="btn btn-primary" onClick={() => onEnter("mapa")}>
                  Acceder a la plataforma <ArrowRight size={16} weight="bold" />
                </button>
                <button className="btn btn-ghost" onClick={() => onEnter("agente")}>
                  Ver demostración
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SLIDE 3: Stats + Map */}
      <section className="lp-slide lp-slide-map">
        <div className="wrap">
          {/* Stats inline at top */}
          <div className="lp-stats-inline">
            {STATS.map((s) => (
              <div className="lp-stat-inline" key={s.lab}>
                <span className="num">{s.num}</span>
                <span className="lab">{s.lab}</span>
              </div>
            ))}
          </div>

          <div className="lp-map-grid">
            <Reveal>
              <h2 className="lp-h2">Datos catastrales verificados en tiempo real.</h2>
              <p className="lp-lede">
                Geometría oficial del Catastro provincial integrada con valuaciones,
                dominio y estado de cada parcela.
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
        </div>
      </section>

      {/* SLIDE 4: Apps - WhatsApp Agent + Property Swiper */}
      <section className="lp-slide lp-slide-agent" id="agente">
        <div className="wrap lp-agent-grid">
          <Reveal className="lp-phone-stage">
            <div className="lp-phone-halo" aria-hidden="true" />
            <PhoneCarousel />
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="lp-h2">Dos apps, una plataforma.</h2>
            <p className="lp-lede">
              Agente IA por WhatsApp para consultas sobre lotes, valuaciones y pre-calificación
              de créditos. Explorador de propiedades estilo Tinder para deslizar entre lotes,
              propiedades y alquileres verificados.
            </p>
            <p className="lp-agent-note">
              Toda la información proviene del Catastro, Registro de la Propiedad y fuentes
              oficiales de Misiones. Datos verificables, actualizados en tiempo real.
            </p>
            <button className="btn btn-ghost" onClick={() => onEnter("agente")} style={{ marginTop: 20 }}>
              Probar el agente <ArrowRight size={14} weight="bold" />
            </button>
          </Reveal>
        </div>
      </section>

      {/* SLIDE 5: Mercado */}
      <section className="lp-slide lp-slide-mercado" id="mercado">
        <div className="wrap">
          <Reveal>
            <h2 className="lp-h2">Mercado</h2>
            <p className="lp-lede">
              Modelo de negocio con múltiples fuentes de ingreso para la Cámara Inmobiliaria.
            </p>
          </Reveal>
          <div className="lp-revenue-grid">
            {REVENUE_STREAMS.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.06}>
                <div className="revenue-card">
                  <span className="revenue-ico"><r.icon size={28} weight="duotone" /></span>
                  <h3>{r.title}</h3>
                  <p>{r.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SLIDE 6: Viabilidad técnica + CTA */}
      <section className="lp-slide lp-slide-viabilidad" id="viabilidad">
        <div className="wrap">
          <Reveal>
            <h2 className="lp-h2">Viabilidad técnica</h2>
            <p className="lp-lede">
              Plan de implementación realista con requerimientos claros.
            </p>
          </Reveal>
          <div className="lp-viabilidad-grid">
            {VIABILIDAD.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="viabilidad-card">
                  <span className="viabilidad-ico"><v.icon size={36} weight="duotone" /></span>
                  <div>
                    <h3>{v.title}</h3>
                    <p>{v.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="lp-final-cta">
              <h3>Entrá al prototipo y recorré el mapa.</h3>
              <p>Datos oficiales del Catastro de Misiones, con la capa viva que les faltaba.</p>
              <button className="btn btn-primary" onClick={() => onEnter("mapa")}>
                Probar el prototipo <ArrowRight size={16} weight="bold" />
              </button>
            </div>
          </Reveal>
        </div>

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
      </section>
    </div>
  );
}
