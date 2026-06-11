import type { Layer } from "../data/parcels";

interface Props {
  parcelCount: number;
  municipio: string;
  layer: Layer;
}

const LAYER_LABEL: Record<Layer, string> = {
  estado: "estado físico",
  valuacion: "valuación",
  ocupacion: "ocupación",
};

export default function StatusBar({ parcelCount, municipio, layer }: Props) {
  return (
    <footer className="statusbar">
      <span>
        <b>{parcelCount}</b> parcelas en vista
      </span>
      <span className="sep" />
      <span>
        municipio <b>{municipio}</b>
      </span>
      <span className="sep" />
      <span>
        capa activa <b>{LAYER_LABEL[layer]}</b>
      </span>
      <span className="sep" />
      <span>fuente Catastro Misiones · 46.249 parcelas</span>
    </footer>
  );
}
