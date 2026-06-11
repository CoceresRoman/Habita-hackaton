import {
  StackSimple,
  MagnifyingGlass,
  Cards,
  ChatCircleDots,
  Calculator,
  type Icon,
} from "@phosphor-icons/react";
import Logo from "./Logo";
import { NAV, type ViewId } from "../data/content";

const ICONS: Record<string, Icon> = {
  StackSimple,
  MagnifyingGlass,
  Cards,
  ChatCircleDots,
  Calculator,
};

interface Props {
  view: ViewId;
  setView: (v: ViewId) => void;
  parcelCount: number;
  onExit?: () => void;
}

export default function Sidebar({ view, setView, parcelCount, onExit }: Props) {
  return (
    <aside className="sidebar">
      <button className="side-brand" onClick={onExit} title="Volver al inicio">
        <Logo />
        <span>
          HABITA
          <small>inteligencia territorial</small>
        </span>
      </button>

      <div className="side-sec">ESPACIO DE TRABAJO</div>
      {NAV.map((item) => {
        const I = ICONS[item.icon];
        return (
          <button
            key={item.id}
            className={`side-item ${view === item.id ? "active" : ""}`}
            onClick={() => setView(item.id)}
            aria-current={view === item.id ? "page" : undefined}
          >
            <I size={18} weight={view === item.id ? "fill" : "regular"} />
            {item.label}
            {item.id === "mapa" && <span className="badge-n">{parcelCount}</span>}
          </button>
        );
      })}

      <div className="side-foot">
        <span className="side-dot">●</span> Catastro Misiones conectado
        <br />
        última sincronización hace 4 min
      </div>
    </aside>
  );
}
