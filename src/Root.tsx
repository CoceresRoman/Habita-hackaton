import { useState } from "react";
import Landing from "./components/Landing";
import App from "./App";
import type { ViewId } from "./data/content";

export default function Root() {
  const [entered, setEntered] = useState(false);
  const [initialView, setInitialView] = useState<ViewId>("mapa");

  const enter = (view: ViewId = "mapa") => {
    setInitialView(view);
    setEntered(true);
  };

  if (entered) return <App onExit={() => setEntered(false)} initialView={initialView} />;
  return <Landing onEnter={enter} />;
}
