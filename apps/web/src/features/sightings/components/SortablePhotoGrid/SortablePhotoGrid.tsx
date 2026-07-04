"use client";

import { useRef } from "react";

import { Icon } from "@/components/atoms/Icon";
import { Spinner } from "@/components/atoms/Spinner";
import { cn } from "@/shared/utils/cn";

export interface PhotoDraftItem {
  localId: string;
  preview: string;
  uploadId: string | null;
  status: "uploading" | "done" | "error";
  errorMessage?: string;
}

export interface SortablePhotoGridProps {
  photos: PhotoDraftItem[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  onRemove: (localId: string) => void;
  className?: string;
}

export function SortablePhotoGrid({
  photos,
  onReorder,
  onRemove,
  className,
}: SortablePhotoGridProps): JSX.Element {
  const dragIndex = useRef<number | null>(null);

  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {photos.map((photo, index) => (
        <div
          key={photo.localId}
          draggable={photo.status === "done"}
          onDragStart={() => {
            dragIndex.current = index;
          }}
          onDragOver={(event) => {
            event.preventDefault();
          }}
          onDrop={() => {
            if (dragIndex.current === null || dragIndex.current === index) {
              return;
            }
            onReorder(dragIndex.current, index);
            dragIndex.current = null;
          }}
          className={cn(
            "relative aspect-square overflow-hidden rounded-md border border-border-subtle bg-bg-elevated",
            photo.status === "done" && "cursor-grab active:cursor-grabbing",
            index === 0 && "ring-2 ring-accent-primary ring-offset-2 ring-offset-bg-base",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- blob: preview URLs are not supported by next/image */}
          <img src={photo.preview} alt="Foto do flagrado" className="h-full w-full object-cover" />
          {photo.status === "uploading" ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 text-white">
              <Spinner size="sm" />
              <span className="text-[10px] font-medium">Enviando…</span>
            </div>
          ) : null}
          {photo.status === "error" ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 p-1 text-center text-[10px] text-white">
              {photo.errorMessage ?? "Falha no envio"}
            </div>
          ) : null}
          {index === 0 ? (
            <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
              Capa
            </span>
          ) : null}
          <button
            type="button"
            aria-label="Remover foto"
            className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
            onClick={() => onRemove(photo.localId)}
          >
            <Icon name="x" size="sm" />
          </button>
        </div>
      ))}
    </div>
  );
}
