"use client";

import { useEffect, useRef, useState } from "react";

import { Icon } from "@/components/atoms/Icon";
import { Spinner } from "@/components/atoms/Spinner";
import { cn } from "@/shared/utils/cn";

import { indexFromPointer } from "./SortablePhotoGrid.logic";

export interface PhotoDraftItem {
  localId: string;
  preview: string;
  file: File;
  uploadId: string | null;
  status: "uploading" | "done" | "error";
  errorMessage?: string;
}

export interface SortablePhotoGridProps {
  photos: PhotoDraftItem[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  onRemove: (localId: string) => void;
  onRetry?: (localId: string) => void;
  className?: string;
}

const LONG_PRESS_MS = 350;
const DRAG_THRESHOLD_PX = 8;

export function SortablePhotoGrid({
  photos,
  onReorder,
  onRemove,
  onRetry,
  className,
}: SortablePhotoGridProps): JSX.Element {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const dragFromIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);
  const longPressTimer = useRef<number | null>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const photosCountRef = useRef(photos.length);
  const onReorderRef = useRef(onReorder);
  const isDraggingRef = useRef(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  photosCountRef.current = photos.length;
  onReorderRef.current = onReorder;

  const clearDragStateRef = useRef<() => void>(() => undefined);
  const beginDragRef = useRef<(index: number) => void>(() => undefined);

  const clearDragState = (): void => {
    dragFromIndex.current = null;
    dragOverIndex.current = null;
    pointerStart.current = null;
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setDraggingIndex(null);
    setHoverIndex(null);
    isDraggingRef.current = false;
  };

  const beginDrag = (index: number): void => {
    dragFromIndex.current = index;
    dragOverIndex.current = index;
    isDraggingRef.current = true;
    setDraggingIndex(index);
    setHoverIndex(index);
  };

  beginDragRef.current = beginDrag;
  clearDragStateRef.current = clearDragState;

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent): void => {
      if (dragFromIndex.current === null || !gridRef.current || !pointerStart.current) {
        return;
      }

      const deltaX = Math.abs(event.clientX - pointerStart.current.x);
      const deltaY = Math.abs(event.clientY - pointerStart.current.y);
      if (!isDraggingRef.current && deltaX + deltaY < DRAG_THRESHOLD_PX) {
        return;
      }

      if (!isDraggingRef.current && dragFromIndex.current !== null) {
        beginDragRef.current(dragFromIndex.current);
      }

      const nextIndex = indexFromPointer(
        gridRef.current,
        event.clientX,
        event.clientY,
        photosCountRef.current,
      );
      if (nextIndex !== null) {
        dragOverIndex.current = nextIndex;
        setHoverIndex(nextIndex);
      }
    };

    const finishDrag = (): void => {
      const from = dragFromIndex.current;
      const to = dragOverIndex.current;
      if (from !== null && to !== null && from !== to) {
        onReorderRef.current(from, to);
      }
      clearDragStateRef.current();
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", finishDrag);
    window.addEventListener("pointercancel", finishDrag);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", finishDrag);
      window.removeEventListener("pointercancel", finishDrag);
    };
  }, []);

  const handlePointerDown = (index: number, event: React.PointerEvent<HTMLDivElement>): void => {
    const photo = photos[index];
    if (!photo || photo.status !== "done") {
      return;
    }
    if ((event.target as HTMLElement).closest("button")) {
      return;
    }

    pointerStart.current = { x: event.clientX, y: event.clientY };
    dragFromIndex.current = index;

    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current);
    }

    if (event.pointerType === "touch") {
      longPressTimer.current = window.setTimeout(() => {
        beginDrag(index);
      }, LONG_PRESS_MS);
      return;
    }

    beginDrag(index);
  };

  return (
    <div ref={gridRef} className={cn("grid grid-cols-3 gap-2", className)}>
      {photos.map((photo, index) => (
        <div
          key={photo.localId}
          data-sort-index={index}
          onPointerDown={(event) => handlePointerDown(index, event)}
          className={cn(
            "relative aspect-square overflow-hidden rounded-md border border-border-subtle bg-bg-elevated transition-transform duration-150",
            photo.status === "done" && "touch-none select-none",
            photo.status === "done" &&
              draggingIndex === null &&
              "cursor-grab active:cursor-grabbing",
            draggingIndex === index && "z-10 scale-[1.03] opacity-90 shadow-lg",
            hoverIndex === index && draggingIndex !== null && draggingIndex !== index
              ? "ring-2 ring-accent-primary"
              : null,
            index === 0 && "ring-2 ring-accent-primary ring-offset-2 ring-offset-bg-base",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- blob: preview URLs are not supported by next/image */}
          <img
            src={photo.preview}
            alt="Foto do flagrado"
            draggable={false}
            className="pointer-events-none h-full w-full object-cover"
          />
          {photo.status === "uploading" ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 text-white">
              <Spinner size="sm" />
              <span className="text-[10px] font-medium">Enviando…</span>
            </div>
          ) : null}
          {photo.status === "error" ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-1 text-center text-[10px] text-white">
              <span className="line-clamp-2">{photo.errorMessage ?? "Falha no envio"}</span>
              {onRetry ? (
                <button
                  type="button"
                  onClick={() => onRetry(photo.localId)}
                  className="mt-1 rounded bg-white/20 px-1.5 py-0.5 text-[10px]"
                >
                  Tentar
                </button>
              ) : null}
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
