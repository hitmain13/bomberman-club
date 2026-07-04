"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

import { styles } from "./SightingMiniMap.styles";

interface SightingMiniMapProps {
  latitude: number;
  longitude: number;
  className?: string;
}

const markerIcon = L.divIcon({
  className: styles.marker,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  html: "",
});

export function SightingMiniMap({
  latitude,
  longitude,
  className,
}: SightingMiniMapProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }
    const map = L.map(containerRef.current, {
      center: [latitude, longitude],
      zoom: 15,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      zoomControl: false,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
    L.marker([latitude, longitude], { icon: markerIcon }).addTo(map);
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 50);
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [latitude, longitude]);

  return <div ref={containerRef} className={className ?? styles.root} aria-hidden="true" />;
}
