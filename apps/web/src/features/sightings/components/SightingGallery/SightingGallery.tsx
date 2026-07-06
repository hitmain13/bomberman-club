"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import { cn } from "@/shared/utils/cn";

export interface SightingGalleryProps {
  images: ReadonlyArray<{ url: string; alt: string }>;
  className?: string;
  overlay?: React.ReactNode;
}

export function SightingGallery({ images, className, overlay }: SightingGalleryProps): JSX.Element {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startXRef = useRef<number | null>(null);
  const currentXRef = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const safeIndex = Math.min(index, Math.max(images.length - 1, 0));
  const current = images[safeIndex];

  const goNext = useCallback(() => {
    setIndex((value) => Math.min(value + 1, images.length - 1));
  }, [images.length]);

  const goPrev = useCallback(() => {
    setIndex((value) => Math.max(value - 1, 0));
  }, []);

  const endDrag = useCallback(() => {
    if (startXRef.current === null || currentXRef.current === null) {
      return;
    }
    const delta = currentXRef.current - startXRef.current;
    if (delta < -40) {
      goNext();
    } else if (delta > 40) {
      goPrev();
    }
    startXRef.current = null;
    currentXRef.current = null;
    setDragOffset(0);
  }, [goNext, goPrev]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (images.length <= 1) {
      return;
    }
    startXRef.current = event.clientX;
    currentXRef.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (startXRef.current === null) {
      return;
    }
    currentXRef.current = event.clientX;
    const width = containerRef.current?.clientWidth ?? 0;
    if (width === 0) {
      return;
    }
    setDragOffset((currentXRef.current - startXRef.current) / width);
  };

  const handlePointerUp = (): void => {
    endDrag();
  };

  const handlePointerCancel = (): void => {
    endDrag();
  };

  if (!current) {
    return <div className={cn("aspect-[4/3] rounded-lg bg-bg-elevated", className)} />;
  }

  const percent = -safeIndex * 100 + dragOffset * 100;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-bg-elevated touch-pan-y",
        className,
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <div
        className="flex h-full w-full transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(${percent}%)`,
          transitionDuration: dragOffset === 0 ? "300ms" : "0ms",
        }}
      >
        {images.map((image) => (
          <div key={image.url} className="relative h-full w-full flex-shrink-0">
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="100vw"
              className="object-cover"
              priority={image.url === current.url}
            />
          </div>
        ))}
      </div>
      {overlay}
      {images.length > 1 ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
          {images.map((image, dotIndex) => (
            <button
              key={image.url}
              type="button"
              aria-label={`Foto ${dotIndex + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                dotIndex === safeIndex ? "w-4 bg-white" : "w-1.5 bg-white/50",
              )}
              onClick={() => setIndex(dotIndex)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
