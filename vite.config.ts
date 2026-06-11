import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Proxy al GeoServer del Catastro de Misiones (su https tiene cert inválido, va por http).
// Evita CORS al consultar la parcela clickeada por WFS.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      "/catastro": {
        target: "http://www.servicios.catastro.misiones.gov.ar",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/catastro/, "/geoserver"),
      },
    },
  },
});
