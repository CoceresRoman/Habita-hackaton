import { useEffect, useRef } from "react";
import L from "leaflet";
import { CATASTRO } from "../data/content";
import { buildLiveFicha, ringAreaM2, type Ficha } from "../data/parcels";

interface Props {
  onLive: (f: Ficha | null) => void;
}

// WFS output in EPSG:3857 (meters): 4326 output is truncated to 4 decimals
// and collapses small urban parcels. We invert mercator to lat/lng ourselves.
const WFS = (lon: number, lat: number) => {
  const d = 0.00012; // ~12 m box around the click
  const bbox = `${lon - d},${lat - d},${lon + d},${lat + d},EPSG:4326`;
  return (
    "/catastro/mapa/ows?service=WFS&version=1.0.0&request=GetFeature" +
    "&typeName=mapa:parcela_urbana&maxFeatures=1&outputFormat=application/json" +
    `&srsName=EPSG:3857&bbox=${bbox}`
  );
};

const R = 6378137;
const merc2lat = (y: number) => ((2 * Math.atan(Math.exp(y / R)) - Math.PI / 2) * 180) / Math.PI;
const merc2lon = (x: number) => ((x / R) * 180) / Math.PI;
const toLatLng = (p: number[]): [number, number] => [merc2lat(p[1]), merc2lon(p[0])];

async function geocode(lat: number, lon: number): Promise<string> {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&addressdetails=1&lat=${lat}&lon=${lon}`,
      { headers: { Accept: "application/json" } }
    );
    const j = await r.json();
    const a = j.address ?? {};
    const road = a.road ?? a.pedestrian ?? a.residential;
    const num = a.house_number;
    const loc = a.city ?? a.town ?? a.village ?? a.suburb ?? "Misiones";
    if (road) return `${road}${num ? " " + num : ""}, ${loc}`;
    return j.display_name?.split(",").slice(0, 2).join(",") ?? "Posadas, Misiones";
  } catch {
    return "Posadas, Misiones";
  }
}

export default function RealMap({ onLive }: Props) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const selRef = useRef<L.Polygon | null>(null);
  const pinRef = useRef<L.CircleMarker | null>(null);
  const reqRef = useRef(0);

  useEffect(() => {
    if (!elRef.current || mapRef.current) return;

    const map = L.map(elRef.current, { center: CATASTRO.center, zoom: CATASTRO.zoom });
    mapRef.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 20,
      attribution: "&copy; OpenStreetMap &copy; CARTO",
    }).addTo(map);

    L.tileLayer
      .wms(CATASTRO.wms, {
        layers: CATASTRO.layer,
        format: "image/png",
        transparent: true,
        version: "1.3.0",
        opacity: 0.85,
        attribution: CATASTRO.attribution,
      })
      .addTo(map);

    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const myReq = ++reqRef.current;

      // instant feedback marker at the click point
      if (pinRef.current) pinRef.current.remove();
      pinRef.current = L.circleMarker(e.latlng, {
        radius: 5,
        color: "#7be0a8",
        weight: 2,
        fillColor: "#7be0a8",
        fillOpacity: 0.95,
      }).addTo(map);

      const geoP = geocode(lat, lng);

      fetch(WFS(lng, lat))
        .then((r) => r.json())
        .then((data) => {
          if (myReq !== reqRef.current) return;
          const feat = data.features?.[0];
          const g = feat?.geometry;
          if (!g) {
            onLive(null);
            return;
          }
          const polys: number[][][][] = g.type === "MultiPolygon" ? g.coordinates : [g.coordinates];
          // outer ring of the first polygon: simple, reliably-rendered polygon
          const outerRing = polys[0][0];
          const outerLatLng = outerRing.map(toLatLng);

          if (selRef.current) selRef.current.remove();
          selRef.current = L.polygon(outerLatLng, {
            color: "#7be0a8",
            weight: 3,
            fillColor: "#7be0a8",
            fillOpacity: 0.4,
          }).addTo(map);
          if (pinRef.current) {
            pinRef.current.remove();
            pinRef.current = null;
          }

          // outer ring as [lon,lat] for area
          const outer = outerRing.map((p) => [merc2lon(p[0]), merc2lat(p[1])]);
          const area = ringAreaM2(outer);
          const cca = feat.properties?.cca ?? "s/d";

          onLive(buildLiveFicha({ cca, dir: "buscando dirección…", areaM2: area }));
          geoP.then((dir) => {
            if (myReq === reqRef.current) onLive(buildLiveFicha({ cca, dir, areaM2: area }));
          });
        })
        .catch(() => {
          if (myReq === reqRef.current) onLive(null);
        });
    });

    const t = setTimeout(() => map.invalidateSize(), 60);
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(elRef.current);

    return () => {
      clearTimeout(t);
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      selRef.current = null;
      pinRef.current = null;
    };
  }, [onLive]);

  return (
    <div className="real-map" ref={elRef} role="application" aria-label="Mapa real de parcelas del Catastro de Misiones" />
  );
}
