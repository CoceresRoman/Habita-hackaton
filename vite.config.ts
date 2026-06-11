import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Proxy al GeoServer del Catastro de Misiones (su https tiene cert inválido, va por http).
// Evita CORS en el WFS y el mixed-content del WMS cuando la app se sirve por https.
// Se aplica tanto en dev (`vite`) como en prod (`vite preview`), porque en Railway
// el WFS/WMS deben seguir pasando por un proxy server-side: el navegador no puede
// pegarle directo a un http con cert inválido desde una página https.
const catastroProxy = {
  "/catastro": {
    target: "http://www.servicios.catastro.misiones.gov.ar",
    changeOrigin: true,
    secure: false,
    rewrite: (path: string) => path.replace(/^\/catastro/, "/geoserver"),
  },
};

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: catastroProxy,
  },
  preview: {
    // Railway asigna el host dinámicamente; sin esto vite preview responde
    // "Blocked request. This host is not allowed".
    allowedHosts: true,
    proxy: catastroProxy,
  },
});
