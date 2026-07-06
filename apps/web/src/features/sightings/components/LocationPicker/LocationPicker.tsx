"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Input } from "@/components/atoms/Input";
import { BottomSheet } from "@/components/organisms/BottomSheet";
import { useGeoSearch } from "@/features/sightings";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const search = useGeoSearch(debouncedQuery);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 400);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

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

  const handleSelectResult = (result: { latitude: number; longitude: number }): void => {
    const latlng: [number, number] = [result.latitude, result.longitude];
    pickerMarkerRef.current?.setLatLng(latlng);
    mapRef.current?.setView(latlng, DEFAULT_ZOOM);
    setSelected({ lat: result.latitude, lng: result.longitude });
  };

  return (
    <BottomSheet
      open={open}
      title="Escolher local"
      onClose={onCancel}
      constrained
      footer={
        <>
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
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Input
            placeholder="Buscar rua, bairro ou cidade"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="pl-10"
          />
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
        </div>
        {search.isLoading ? (
          <p className="text-xs text-fg-muted">Buscando…</p>
        ) : search.data && search.data.results.length > 0 ? (
          <ul className="flex flex-col gap-1">
            {search.data.results.map((result) => (
              <li key={result.id}>
                <button
                  type="button"
                  onClick={() => handleSelectResult(result)}
                  className="w-full rounded-md px-3 py-2 text-left text-sm text-fg-primary hover:bg-bg-muted"
                >
                  {result.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <div ref={containerRef} className={styles.mapWrap} />
        <div className={styles.hint}>
          <span>Toque ou arraste o pin</span>
          <span className={styles.hintCoord}>
            {formatCoord(selected?.lat ?? null)}, {formatCoord(selected?.lng ?? null)}
          </span>
        </div>
      </div>
    </BottomSheet>
  );
}
