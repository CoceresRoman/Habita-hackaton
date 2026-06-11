import type { Layer } from "./parcels";

/* Catastro de Misiones - GeoServer WMS (http: el https tiene cert inválido).
   Tiles <img>, sin CORS. parcela_urbana cubre toda la provincia. */
export const CATASTRO = {
  wms: "http://www.servicios.catastro.misiones.gov.ar/geoserver/mapa/wms",
  layer: "mapa:parcela_urbana",
  center: [-27.3667, -55.8961] as [number, number], // Posadas
  zoom: 16,
  attribution: "Parcelas: Dirección General de Catastro, Misiones",
};

export type ViewId = "mapa" | "buscar" | "fichas" | "agente" | "tasar";

export interface NavItem {
  id: ViewId;
  label: string;
  icon: string; // phosphor icon name
}

export const NAV: NavItem[] = [
  { id: "mapa", label: "Mapa", icon: "StackSimple" },
  { id: "buscar", label: "Buscar", icon: "MagnifyingGlass" },
  { id: "fichas", label: "Fichas", icon: "Cards" },
  { id: "agente", label: "Agente IA", icon: "ChatCircleDots" },
  { id: "tasar", label: "Tasar", icon: "Calculator" },
];

export const LAYER_TABS: { id: Layer; label: string }[] = [
  { id: "estado", label: "Estado" },
  { id: "valuacion", label: "Valuación" },
  { id: "ocupacion", label: "Ocupación" },
];

export const MUNICIPIOS = ["Posadas", "Garupá", "Oberá", "Eldorado", "Apóstoles"];

/* ---------- agent chat (scripted, interactive) ---------- */

export interface QuickReply {
  key: string;
  label: string;
}

export const QUICK_REPLIES: QuickReply[] = [
  { key: "lotes", label: "Lotes disponibles en Itaembé" },
  { key: "precio", label: "¿Cuánto vale la parcela 1180-0345?" },
  { key: "dominio", label: "¿Tiene gravámenes?" },
  { key: "credito", label: "¿Califico para crédito UVA?" },
  { key: "visita", label: "Quiero agendar una visita" },
];

export const AGENT_REPLIES: Record<string, string[]> = {
  lotes: [
    "Encontré 3 lotes en Itaembé con estado verificado:",
    "1) 1180-0118, baldío, 600 m², USD 22.000\n2) 1175-0461, ocupación informal, 375 m²\n3) 1180-0507, edificado, 540 m², USD 41.200",
    "¿Querés la ficha completa de alguno o filtro por presupuesto?",
  ],
  precio: [
    "La parcela 38-07-04-1180-0345 (Av. Urquiza 2480) tiene un valor estimado de USD 38.500.",
    "Surge de la valuación fiscal de DGR cruzada con 3 comparables de mercado. Superficie 412 m², edificado, dominio sin gravámenes.",
  ],
  dominio: [
    "Sobre 1180-0345: dominio limpio, sin hipotecas ni embargos al último informe.",
    "Ojo con 1180-0507: tiene un embargo trabado. Conviene due diligence antes de operar. ¿Te paso el informe de dominio?",
  ],
  credito: [
    "Con crédito UVA reactivado (UVA +6 a +13%) puedo hacer una pre-calificación.",
    "Necesito ingreso mensual y monto buscado. Con eso estimo cuota, relación cuota/ingreso y a qué línea derivarte (Nación, Provincia o banco).",
  ],
  visita: [
    "Listo. ¿Qué día y horario te queda cómodo para la visita?",
    "Coordino con el corredor a cargo y te confirmo por acá. También te mando la ficha y la ubicación.",
  ],
};

export const AGENT_INTRO = [
  "Hola, soy el agente de HABITA. Trabajo sobre datos oficiales del Catastro de Misiones.",
  "Puedo informarte lotes disponibles, precios, situación dominial y pre-calificarte para crédito. ¿Por dónde arrancamos?",
];

/* ---------- WhatsApp demo (landing phone) ---------- */

export interface WaMsg {
  side: "in" | "out"; // in = agente HABITA, out = persona
  text: string;
  time: string;
}

export const WHATSAPP_DEMO: WaMsg[] = [
  { side: "out", text: "Hola! Vi un lote en Itaembé, ¿me pasás info? 👀", time: "10:21" },
  { side: "in", text: "¡Hola! Es la parcela 38-07-04-1175-0461, de 375 m².", time: "10:21" },
  { side: "in", text: "Estado: baldío ocupado. Valor estimado USD 18.900.", time: "10:21" },
  { side: "out", text: "¿Está libre de deudas?", time: "10:22" },
  { side: "in", text: "Tiene ocupación informal: es candidato a regularización. Te paso el informe de dominio. 📄", time: "10:22" },
  { side: "in", text: "¿Querés que coordine una visita con un corredor de la zona?", time: "10:22" },
  { side: "out", text: "Dale, gracias! 🙌", time: "10:23" },
];

/* ---------- AVM (tasación automática) ---------- */

export const AVM_ZONAS: { id: string; label: string; usdM2: number }[] = [
  { id: "centro", label: "Centro / microcentro", usdM2: 145 },
  { id: "intermedia", label: "Zona intermedia", usdM2: 92 },
  { id: "periferia", label: "Periferia urbana", usdM2: 58 },
  { id: "loteo", label: "Loteo nuevo / chacra", usdM2: 34 },
];

export const AVM_SERVICIOS: { id: string; label: string; factor: number }[] = [
  { id: "agua", label: "Agua de red", factor: 0.05 },
  { id: "luz", label: "Energía (EMSA)", factor: 0.05 },
  { id: "cloacas", label: "Cloacas", factor: 0.07 },
  { id: "pavimento", label: "Pavimento", factor: 0.08 },
];

export const AVM_ESTADO: { id: string; label: string; factor: number }[] = [
  { id: "baldio", label: "Baldío", factor: 1.0 },
  { id: "obra", label: "En obra", factor: 1.18 },
  { id: "edificado", label: "Edificado", factor: 1.55 },
];
