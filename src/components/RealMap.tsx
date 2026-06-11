import { useEffect, useRef } from "react";
import L from "leaflet";
import { CATASTRO } from "../data/content";

interface Props {
  parcelCount: number;
  onSelect: (idx: number) => void;
}

/**
 * Real Leaflet map: dark basemap + live Catastro de Misiones parcels (WMS).
 * Clicking drops a marker and opens a ficha (cycles the sample fichas).
 */
export default function RealMap({ parcelCount, onSelect }: Props) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.CircleMarker | null>(null);
  const clicksRef = useRef(0);

  useEffect(() => {
    if (!elRef.current || mapRef.current) return;

    const map = L.map(elRef.current, {
      center: CATASTRO.center,
      zoom: CATASTRO.zoom,
      zoomControl: true,
      attributionControl: true,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 20,
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    }).addTo(map);

    L.tileLayer
      .wms(CATASTRO.wms, {
        layers: CATASTRO.layer,
        format: "image/png",
        transparent: true,
        version: "1.3.0",
        opacity: 0.9,
        attribution: CATASTRO.attribution,
      })
      .addTo(map);

    map.on("click", (e: L.LeafletMouseEvent) => {
      if (markerRef.current) markerRef.current.remove();
      markerRef.current = L.circleMarker(e.latlng, {
        radius: 9,
        color: "#7be0a8",
        weight: 2,
        fillColor: "#7be0a8",
        fillOpacity: 0.35,
      }).addTo(map);
      const idx = clicksRef.current % parcelCount;
      clicksRef.current += 1;
      onSelect(idx);
    });

    const t = setTimeout(() => map.invalidateSize(), 60);
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(elRef.current);

    return () => {
      clearTimeout(t);
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [parcelCount, onSelect]);

  return <div className="real-map" ref={elRef} role="application" aria-label="Mapa real de parcelas del Catastro de Misiones" />;
}
