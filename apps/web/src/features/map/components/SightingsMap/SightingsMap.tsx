"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

import { styles } from "./SightingsMap.styles";
import type { SightingsMapProps } from "./SightingsMap.types";

const DEFAULT_CENTER: [number, number] = [-23.55, -46.63];
const DEFAULT_ZOOM = 11;

const icon = L.divIcon({
  className:
    "flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-bg-base bg-accent-danger shadow-md",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  html: "",
});

export function SightingsMap({ sightings, center, zoom }: SightingsMapProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }
    const map = L.map(containerRef.current, {
      center: center ?? DEFAULT_CENTER,
      zoom: zoom ?? DEFAULT_ZOOM,
      attributionControl: false,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [center, zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }
    for (const marker of markersRef.current) {
      marker.remove();
    }
    markersRef.current = [];
    for (const sighting of sightings) {
      const marker = L.marker([sighting.latitude, sighting.longitude], { icon }).addTo(map);
      const popupHtml = `
        <strong>${escapeHtml(sighting.title)}</strong><br/>
        <span>@${escapeHtml(sighting.author.username)}</span><br/>
        <a class="${styles.popupLink}" href="/sightings/${encodeURIComponent(sighting.id)}">Ver detalhes</a>
      `;
      marker.bindPopup(popupHtml);
      markersRef.current.push(marker);
    }
  }, [sightings]);

  return (
    <div
      ref={containerRef}
      className={styles.root}
      role="application"
      aria-label="Mapa de flagrados"
    />
  );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
