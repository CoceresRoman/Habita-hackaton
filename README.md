# HABITA

La capa viva del suelo misionero. Propuesta de IA inmobiliaria para la Cámara Inmobiliaria de Misiones, presentada en Hackatón de IA (Junio 2026).

Sitio de pitch: una capa de datos confiable y trazable sobre el Catastro provincial. Precio, medidas, dominio, ocupación y crédito sobre cada parcela, con datos oficiales cruzados por IA.

## Stack

- Vite 5 + React 18 + TypeScript
- Motion (`motion/react`) para reveals respetando `prefers-reduced-motion`
- Phosphor Icons
- CSS nativo con tokens OKLCH (sin framework de utilidades)

## Desarrollo

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # typecheck + bundle de producción en dist/
pnpm preview    # sirve el build
```

## Estructura

```
src/
  components/   secciones del pitch + ParcelMap interactivo + Reveal
  data/         contenido tipado (content.ts) y parcelas del mapa (parcels.ts)
  styles/       global.css (tokens OKLCH, layout cartográfico)
```

El nombre HABITA y el contenido son editables desde `src/data/`. El mapa catastral del hero es interactivo: cada parcela abre su ficha cruzando las fuentes.
