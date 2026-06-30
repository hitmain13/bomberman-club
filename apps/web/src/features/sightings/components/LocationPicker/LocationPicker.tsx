"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";

import { styles } from "./LocationPicker.styles";
import type { LocationPickerProps } from "./LocationPicker.types";

const FALLBACK_CENTER: [number, number] = [-23.55, -46.63];
const DEFAULT_ZOOM = 14;

const pickerIcon = L.divIcon({
  className: styles.pickerMarker,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  html: "",
});

const meIcon = L.divIcon({
  className: styles.meMarker,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
  html: "",
});

function formatCoord(value: number | null): string {
  if (value === null || Number.isNaN(value)) {
    return "—";
  }
  return value.toFixed(5);
}

export function LocationPicker({
  open,
  initialLatitude,
  initialLongitude,
  onCancel,
  onConfirm,
}: LocationPickerProps): JSX.Element | null {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const pickerMarkerRef = useRef<L.Marker | null>(null);
  const meMarkerRef = useRef<L.Marker | null>(null);
  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(() => {
    if (initialLatitude !== null && initialLongitude !== null) {
      return { lat: initialLatitude, lng: initialLongitude };
    }
    return null;
  });

  useEffect(() => {
    if (!open || !containerRef.current || mapRef.current) {
      return;
    }
    const startCenter: [number, number] =
      selected !== null ? [selected.lat, selected.lng] : FALLBACK_CENTER;
    const map = L.map(containerRef.current, {
      center: startCenter,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const marker = L.marker(startCenter, { icon: pickerIcon, draggable: true }).addTo(map);
    pickerMarkerRef.current = marker;
    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      setSelected({ lat: pos.lat, lng: pos.lng });
    });
    map.on("click", (event: L.LeafletMouseEvent) => {
      marker.setLatLng(event.latlng);
      setSelected({ lat: event.latlng.lat, lng: event.latlng.lng });
    });

    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 50);

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!mapRef.current) {
            return;
          }
          const latlng: [number, number] = [position.coords.latitude, position.coords.longitude];
          if (meMarkerRef.current) {
            meMarkerRef.current.setLatLng(latlng);
          } else {
            meMarkerRef.current = L.marker(latlng, { icon: meIcon, interactive: false }).addTo(map);
          }
          if (selected === null) {
            marker.setLatLng(latlng);
            map.setView(latlng, DEFAULT_ZOOM);
            setSelected({ lat: latlng[0], lng: latlng[1] });
          }
        },
        undefined,
        { enableHighAccuracy: true, timeout: 5_000 },
      );
    }

    return () => {
      map.remove();
      mapRef.current = null;
      pickerMarkerRef.current = null;
      meMarkerRef.current = null;
    };
  }, [open, selected]);

  if (!open) {
    return null;
  }

  const handleUseMyLocation = (): void => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latlng: [number, number] = [position.coords.latitude, position.coords.longitude];
        pickerMarkerRef.current?.setLatLng(latlng);
        mapRef.current?.setView(latlng, DEFAULT_ZOOM);
        setSelected({ lat: latlng[0], lng: latlng[1] });
      },
      undefined,
      { enableHighAccuracy: true, timeout: 5_000 },
    );
  };

  return (
    <>
      <div
        className={styles.overlay}
        onClick={onCancel}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            onCancel();
          }
        }}
        role="presentation"
      />
      <dialog open className={styles.sheet} aria-modal="true" aria-label="Escolher local">
        <header className={styles.header}>
          <h2 className={styles.title}>Escolher local</h2>
          <button type="button" className={styles.close} onClick={onCancel}>
            Cancelar
          </button>
        </header>
        <div ref={containerRef} className={styles.mapWrap} />
        <div className={styles.hint}>
          <span>Toque ou arraste o pin</span>
          <span className={styles.hintCoord}>
            {formatCoord(selected?.lat ?? null)}, {formatCoord(selected?.lng ?? null)}
          </span>
        </div>
        <div className={styles.actions}>
          <Button
            variant="secondary"
            fullWidth
            leadingIcon={<Icon name="map" />}
            onClick={handleUseMyLocation}
          >
            Minha localização
          </Button>
          <Button
            fullWidth
            disabled={selected === null}
            onClick={() => {
              if (selected !== null) {
                onConfirm(selected.lat, selected.lng);
              }
            }}
          >
            Confirmar
          </Button>
        </div>
      </dialog>
    </>
  );
}
