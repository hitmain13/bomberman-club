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
  const touchStartX = useRef<number | null>(null);
  const safeIndex = Math.min(index, Math.max(images.length - 1, 0));
  const current = images[safeIndex];

  const goNext = useCallback(() => {
    setIndex((value) => Math.min(value + 1, images.length - 1));
  }, [images.length]);

  const goPrev = useCallback(() => {
    setIndex((value) => Math.max(value - 1, 0));
  }, []);

  if (!current) {
    return <div className={cn("aspect-[4/3] rounded-lg bg-bg-elevated", className)} />;
  }

  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-bg-elevated",
        className,
      )}
      onTouchStart={(event) => {
        touchStartX.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const start = touchStartX.current;
        const end = event.changedTouches[0]?.clientX;
        touchStartX.current = null;
        if (start === null || end === undefined) {
          return;
        }
        const delta = end - start;
        if (Math.abs(delta) < 40) {
          return;
        }
        if (delta < 0) {
          goNext();
        } else {
          goPrev();
        }
      }}
    >
      <Image
        src={current.url}
        alt={current.alt}
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      {overlay}
      {images.length > 1 ? (
        <>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
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
          {safeIndex > 0 ? (
            <button
              type="button"
              aria-label="Foto anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-2 py-3 text-white"
              onClick={goPrev}
            >
              ‹
            </button>
          ) : null}
          {safeIndex < images.length - 1 ? (
            <button
              type="button"
              aria-label="Próxima foto"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-2 py-3 text-white"
              onClick={goNext}
            >
              ›
            </button>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
