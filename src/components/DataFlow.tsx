import { motion } from "motion/react";
import {
  Buildings,
  CurrencyCircleDollar,
  Globe,
  Plugs,
  Storefront,
  Brain,
  FileText,
} from "@phosphor-icons/react";

const SOURCES = [
  { icon: Buildings, label: "Registro", sub: "Propiedad" },
  { icon: CurrencyCircleDollar, label: "DGR", sub: "Rentas" },
  { icon: Globe, label: "Satélite", sub: "Imágenes" },
  { icon: Plugs, label: "Servicios", sub: "Públicos" },
  { icon: Storefront, label: "Mercado", sub: "Precios" },
];

export default function DataFlow() {
  return (
    <div className="dataflow">
      {/* Sources */}
      <div className="df-sources">
        {SOURCES.map((src, i) => (
          <motion.div
            key={src.label}
            className="df-source"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
          >
            <span className="df-source-icon">
              <src.icon size={24} weight="duotone" />
            </span>
            <div className="df-source-text">
              <span>{src.label}</span>
              <small>{src.sub}</small>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Animated Lines */}
      <div className="df-lines">
        <svg viewBox="0 0 120 200" preserveAspectRatio="none" className="df-svg">
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <motion.path
                d={`M 0 ${20 + i * 40} Q 60 ${20 + i * 40}, 60 100 T 120 100`}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: "easeInOut" }}
              />
              <motion.circle
                r="4"
                fill="var(--accent-hi)"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.3 + i * 0.1 }}
              >
                <animateMotion
                  dur={`${2 + i * 0.2}s`}
                  repeatCount="indefinite"
                  path={`M 0 ${20 + i * 40} Q 60 ${20 + i * 40}, 60 100 T 120 100`}
                />
              </motion.circle>
            </g>
          ))}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--line)" />
              <stop offset="100%" stopColor="var(--accent)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* AI Processing */}
      <motion.div
        className="df-ai"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
      >
        <div className="df-ai-glow" />
        <motion.div
          className="df-ai-ring"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="df-ai-ring df-ai-ring-2"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <div className="df-ai-core">
          <Brain size={40} weight="duotone" />
          <span>IA</span>
        </div>
        <motion.div
          className="df-ai-pulse"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Animated Line to Output */}
      <div className="df-line-out">
        <svg viewBox="0 0 80 20" preserveAspectRatio="none" className="df-svg-out">
          <motion.line
            x1="0" y1="10" x2="80" y2="10"
            stroke="url(#lineGradient2)"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2, duration: 0.6 }}
          />
          <motion.polygon
            points="70,4 80,10 70,16"
            fill="var(--accent-hi)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.6 }}
          />
          <motion.circle
            r="5"
            fill="var(--accent-hi)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.5 }}
          >
            <animateMotion dur="1.5s" repeatCount="indefinite" path="M 0 10 L 70 10" />
          </motion.circle>
          <defs>
            <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--accent-hi)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Output */}
      <motion.div
        className="df-output"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.4, duration: 0.5, ease: "easeOut" }}
      >
        <div className="df-output-icon">
          <FileText size={36} weight="duotone" />
        </div>
        <div className="df-output-text">
          <span>Ficha Verificada</span>
          <small>Cámara Inmobiliaria</small>
        </div>
      </motion.div>
    </div>
  );
}
