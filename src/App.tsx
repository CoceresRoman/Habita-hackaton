import { useMemo, useState } from "react";
import { MotionConfig, AnimatePresence, motion } from "motion/react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import StatusBar from "./components/StatusBar";
import MapWorkspace from "./components/MapWorkspace";
import AgentChat from "./components/AgentChat";
import AvmPanel from "./components/AvmPanel";
import SearchView from "./components/SearchView";
import FichasView from "./components/FichasView";
import { buildParcels, type Layer } from "./data/parcels";
import { MUNICIPIOS, type ViewId } from "./data/content";

interface AppProps {
  onExit?: () => void;
  initialView?: ViewId;
}

export default function App({ onExit, initialView = "mapa" }: AppProps) {
  const parcels = useMemo(() => buildParcels(), []);
  const [view, setView] = useState<ViewId>(initialView);
  const [activeIdx, setActiveIdx] = useState(0);
  const [layer, setLayer] = useState<Layer>("estado");
  const [municipio, setMunicipio] = useState(MUNICIPIOS[0]);

  const goToParcel = (idx: number) => {
    setActiveIdx(idx);
    setView("mapa");
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="app">
        <Sidebar view={view} setView={setView} parcelCount={parcels.length} onExit={onExit} />
        <Topbar municipio={municipio} setMunicipio={setMunicipio} />
        <div className="main">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              className="view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            >
              {view === "mapa" && (
                <MapWorkspace
                  parcels={parcels}
                  activeIdx={activeIdx}
                  setActiveIdx={setActiveIdx}
                  layer={layer}
                  setLayer={setLayer}
                  onConsultAgent={() => setView("agente")}
                />
              )}
              {view === "buscar" && <SearchView parcels={parcels} onSelect={goToParcel} />}
              {view === "fichas" && <FichasView parcels={parcels} onSelect={goToParcel} />}
              {view === "agente" && <AgentChat />}
              {view === "tasar" && <AvmPanel />}
            </motion.div>
          </AnimatePresence>
        </div>
        <StatusBar parcelCount={parcels.length} municipio={municipio} layer={layer} />
      </div>
    </MotionConfig>
  );
}
