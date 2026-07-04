"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/shared/utils/cn";

const SightingMiniMap = dynamic(
  () =>
    import("../SightingMiniMap/SightingMiniMap").then((module) => ({
      default: module.SightingMiniMap,
    })),
  { ssr: false, loading: () => <div className="h-40 animate-pulse rounded-lg bg-bg-elevated" /> },
);

export interface ExpandableMapProps {
  latitude: number;
  longitude: number;
  className?: string;
}

export function ExpandableMap({ latitude, longitude, className }: ExpandableMapProps): JSX.Element {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      <div className={cn("relative transition-[height] duration-300", expanded ? "h-72" : "h-40")}>
        <SightingMiniMap
          key={expanded ? "expanded" : "collapsed"}
          latitude={latitude}
          longitude={longitude}
          className="h-full"
          interactive={expanded}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg-base to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-2 flex justify-center">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setExpanded((value) => !value)}
          leadingIcon={<Icon name="map" size="sm" />}
        >
          {expanded ? "Recolher mapa" : "Ver mapa completo"}
        </Button>
      </div>
    </div>
  );
}
