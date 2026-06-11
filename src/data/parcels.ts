export type Estado = "edificado" | "en obra" | "baldío";
export type Ocupacion = "ocupado" | "vacante";
export type DomStatus = "limpio" | "hipoteca" | "embargo" | "informal";

export interface HistEvent {
  date: string;
  event: string;
}

export interface Comp {
  ref: string;
  supM2: number;
  usdM2: number;
}

export interface Ficha {
  nom: string;
  partida: string;
  dir: string;
  estado: Estado;
  ocupacion: Ocupacion;
  supM2: number;
  frente: number;
  fondo: number;
  valUsd: number;
  valFiscal: number;
  titular: string;
  dom: { status: DomStatus; detail: string };
  fuentes: number;
  historial: HistEvent[];
  comps: Comp[];
  estimated?: boolean; // true = ficha en vivo (geometría/calle reales, valor estimado)
}

/** Approx. area in m² of a GeoJSON ring [[lon,lat],...] via equirectangular projection. */
export function ringAreaM2(ring: number[][]): number {
  if (!ring || ring.length < 3) return 0;
  const latRef = (ring[0][1] * Math.PI) / 180;
  const mLat = 111320;
  const mLon = 111320 * Math.cos(latRef);
  let sum = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const x1 = ring[i][0] * mLon, y1 = ring[i][1] * mLat;
    const x2 = ring[i + 1][0] * mLon, y2 = ring[i + 1][1] * mLat;
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2;
}

/** Build a live ficha from real Catastro data + estimated valuation. */
export function buildLiveFicha(opts: { cca: string; dir: string; areaM2: number }): Ficha {
  const { cca, dir, areaM2 } = opts;
  const h = [...cca].reduce((a, c) => a + c.charCodeAt(0), 0);
  const estado: Estado = (["edificado", "en obra", "baldío"] as Estado[])[h % 3];
  const ocupacion: Ocupacion = h % 2 ? "ocupado" : "vacante";
  const sup = Math.max(1, Math.round(areaM2));
  const frente = Math.max(5, Math.round(Math.sqrt(sup / 2.6)));
  const fondo = Math.max(5, Math.round(sup / frente));
  const eFactor = estado === "edificado" ? 1.5 : estado === "en obra" ? 1.18 : 1;
  const valUsd = Math.round((sup * 78 * eFactor) / 100) * 100;
  return {
    nom: cca,
    partida: "s/d",
    dir,
    estado,
    ocupacion,
    supM2: sup,
    frente,
    fondo,
    valUsd,
    valFiscal: 0,
    titular: "Registro · acceso por convenio",
    dom: { status: "limpio", detail: "consultá el informe de dominio para confirmar" },
    fuentes: 3,
    historial: [
      { date: "en vivo", event: "Parcela localizada en el Catastro de Misiones (WFS)" },
      { date: "en vivo", event: "Dirección por geocodificación (OpenStreetMap)" },
    ],
    comps: [],
    estimated: true,
  };
}

export const FICHAS: Ficha[] = [
  {
    nom: "38-07-04-1180-0345", partida: "P-118.034", dir: "Av. Urquiza 2480",
    estado: "edificado", ocupacion: "ocupado", supM2: 412, frente: 12, fondo: 34.3,
    valUsd: 38500, valFiscal: 9120000, titular: "●●●● ●●●●●● · convenio Reg.",
    dom: { status: "limpio", detail: "sin gravámenes" }, fuentes: 7,
    historial: [
      { date: "2026-05", event: "Estado actualizado por imagen satelital" },
      { date: "2026-03", event: "Valuación fiscal cruzada con DGR" },
      { date: "2025-11", event: "Medidas extraídas por OCR de mensura" },
    ],
    comps: [
      { ref: "1180-0512", supM2: 400, usdM2: 96 },
      { ref: "1180-0288", supM2: 430, usdM2: 91 },
      { ref: "1175-0140", supM2: 388, usdM2: 99 },
    ],
  },
  {
    nom: "38-07-04-1180-0118", partida: "P-118.011", dir: "Calle 12 N.º 845",
    estado: "baldío", ocupacion: "vacante", supM2: 600, frente: 15, fondo: 40,
    valUsd: 22000, valFiscal: 4800000, titular: "●●●● ●●●● · convenio Reg.",
    dom: { status: "limpio", detail: "sin gravámenes" }, fuentes: 6,
    historial: [
      { date: "2026-04", event: "Clasificado baldío por visión satelital" },
      { date: "2026-02", event: "Sin consumo EMSA, lote vacante" },
    ],
    comps: [
      { ref: "1180-0220", supM2: 620, usdM2: 35 },
      { ref: "1180-0331", supM2: 580, usdM2: 38 },
      { ref: "1175-0902", supM2: 560, usdM2: 37 },
    ],
  },
  {
    nom: "38-07-04-1175-0902", partida: "P-117.090", dir: "Bolívar 1190",
    estado: "en obra", ocupacion: "ocupado", supM2: 288, frente: 9, fondo: 32,
    valUsd: 29800, valFiscal: 6300000, titular: "●●●●●● ●●●● · convenio Reg.",
    dom: { status: "hipoteca", detail: "hipoteca vigente, Banco Macro" }, fuentes: 7,
    historial: [
      { date: "2026-05", event: "Obra detectada por cambio satelital" },
      { date: "2026-01", event: "Hipoteca informada por Registro" },
    ],
    comps: [
      { ref: "1175-0455", supM2: 300, usdM2: 101 },
      { ref: "1175-0610", supM2: 270, usdM2: 108 },
      { ref: "1180-0345", supM2: 412, usdM2: 93 },
    ],
  },
  {
    nom: "38-07-04-1180-0507", partida: "P-118.050", dir: "San Lorenzo 640",
    estado: "edificado", ocupacion: "ocupado", supM2: 540, frente: 13.5, fondo: 40,
    valUsd: 41200, valFiscal: 9800000, titular: "●●●● ●●●●● · convenio Reg.",
    dom: { status: "embargo", detail: "embargo trabado, verificar antes de operar" }, fuentes: 7,
    historial: [
      { date: "2026-05", event: "Embargo detectado en informe de dominio" },
      { date: "2026-04", event: "Ocupación confirmada por consumo EMSA" },
    ],
    comps: [
      { ref: "1180-0345", supM2: 412, usdM2: 93 },
      { ref: "1180-0623", supM2: 460, usdM2: 113 },
      { ref: "1175-0902", supM2: 288, usdM2: 103 },
    ],
  },
  {
    nom: "38-07-04-1175-0461", partida: "s/registrar", dir: "Loteo Itaembé s/n",
    estado: "baldío", ocupacion: "ocupado", supM2: 375, frente: 12.5, fondo: 30,
    valUsd: 18900, valFiscal: 0, titular: "sin titular registrado",
    dom: { status: "informal", detail: "ocupación informal, candidato a regularización" }, fuentes: 5,
    historial: [
      { date: "2026-05", event: "Ocupación informal mapeada por crowdsourcing" },
      { date: "2026-03", event: "Sin partida en DGR" },
    ],
    comps: [
      { ref: "1175-0510", supM2: 360, usdM2: 52 },
      { ref: "1175-0388", supM2: 390, usdM2: 49 },
      { ref: "1180-0118", supM2: 600, usdM2: 37 },
    ],
  },
  {
    nom: "38-07-04-1180-0623", partida: "P-118.062", dir: "Tucumán 305",
    estado: "edificado", ocupacion: "ocupado", supM2: 460, frente: 11.5, fondo: 40,
    valUsd: 52000, valFiscal: 11400000, titular: "●●●●● ●●●● · convenio Reg.",
    dom: { status: "limpio", detail: "sin gravámenes" }, fuentes: 7,
    historial: [
      { date: "2026-05", event: "Aviso de mercado matcheado a la parcela" },
      { date: "2026-02", event: "Valuación estimada por AVM" },
    ],
    comps: [
      { ref: "1180-0507", supM2: 540, usdM2: 76 },
      { ref: "1180-0345", supM2: 412, usdM2: 93 },
      { ref: "1175-0610", supM2: 270, usdM2: 108 },
    ],
  },
];

export interface ParcelRect {
  x: number;
  y: number;
  w: number;
  h: number;
  ficha: Ficha;
  scan: boolean;
}

/** Cadastral parcels around the two-road grid. Deterministic. */
export function buildParcels(): ParcelRect[] {
  const cols: [number, number][] = [
    [4, 146],
    [154, 110],
    [272, 124],
  ];
  const rows: [number, number][] = [
    [4, 110],
    [122, 106],
    [236, 104],
  ];
  const blockDiv: [number, number][] = [
    [2, 2], [3, 2], [2, 3], [2, 2], [2, 2], [3, 2], [1, 2], [2, 2], [2, 3],
  ];

  const cells: { x: number; y: number; w: number; h: number }[] = [];
  const subdiv = (x: number, w: number, y: number, h: number, nx: number, ny: number) => {
    const gap = 5;
    const cw = (w - gap * (nx - 1)) / nx;
    const ch = (h - gap * (ny - 1)) / ny;
    for (let i = 0; i < nx; i++) {
      for (let j = 0; j < ny; j++) {
        cells.push({ x: x + i * (cw + gap), y: y + j * (ch + gap), w: cw, h: ch });
      }
    }
  };

  let bi = 0;
  for (const [cx, cw] of cols) {
    for (const [ry, rh] of rows) {
      const [nx, ny] = blockDiv[bi++ % blockDiv.length];
      subdiv(cx, cw, ry, rh, nx, ny);
    }
  }

  return cells.map((cell, idx) => ({
    ...cell,
    ficha: FICHAS[idx % FICHAS.length],
    scan: idx === 5 || idx === 12,
  }));
}

/* ---------- layer coloring (choropleth in the locked accent ramp) ---------- */

export type Layer = "estado" | "valuacion" | "ocupacion";

const VAL_BANDS = [25000, 35000, 45000]; // USD thresholds

/** Returns a CSS color for a parcel under the active layer. Single-hue ramp. */
export function parcelFill(f: Ficha, layer: Layer): string {
  if (layer === "estado") {
    if (f.estado === "edificado") return "color-mix(in oklab, var(--surface) 55%, var(--ok))";
    if (f.estado === "en obra") return "color-mix(in oklab, var(--surface) 60%, var(--warn))";
    return "var(--surface)"; // baldío
  }
  if (layer === "ocupacion") {
    return f.ocupacion === "ocupado"
      ? "color-mix(in oklab, var(--surface) 45%, var(--accent))"
      : "var(--surface)";
  }
  // valuacion ramp
  const band = f.valUsd >= VAL_BANDS[2] ? 0.78 : f.valUsd >= VAL_BANDS[1] ? 0.5 : f.valUsd >= VAL_BANDS[0] ? 0.3 : 0.14;
  return `color-mix(in oklab, var(--surface) ${Math.round((1 - band) * 100)}%, var(--accent))`;
}

export interface LegendItem {
  label: string;
  swatch: string;
}

export const LEGENDS: Record<Layer, LegendItem[]> = {
  estado: [
    { label: "edificado", swatch: "color-mix(in oklab, var(--surface) 55%, var(--ok))" },
    { label: "en obra", swatch: "color-mix(in oklab, var(--surface) 60%, var(--warn))" },
    { label: "baldío", swatch: "var(--surface)" },
  ],
  valuacion: [
    { label: "alta", swatch: "color-mix(in oklab, var(--surface) 22%, var(--accent))" },
    { label: "media", swatch: "color-mix(in oklab, var(--surface) 50%, var(--accent))" },
    { label: "baja", swatch: "color-mix(in oklab, var(--surface) 86%, var(--accent))" },
  ],
  ocupacion: [
    { label: "ocupado", swatch: "color-mix(in oklab, var(--surface) 45%, var(--accent))" },
    { label: "vacante", swatch: "var(--surface)" },
  ],
};

/** Faint parcel field for ambient backgrounds. */
export function buildCloseField(): { x: number; y: number; w: number; h: number }[] {
  const out: { x: number; y: number; w: number; h: number }[] = [];
  let x = 0;
  while (x < 1200) {
    const w = 40 + ((x * 37) % 90);
    let y = 0;
    while (y < 400) {
      const rh = 44 + ((x + y) % 70);
      out.push({ x, y, w: w - 6, h: rh - 6 });
      y += rh;
    }
    x += w;
  }
  return out;
}
