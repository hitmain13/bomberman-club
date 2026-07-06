export function reorderPhotos<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  if (!moved) {
    return items;
  }
  next.splice(toIndex, 0, moved);
  return next;
}

export function indexFromPointer(
  container: HTMLElement,
  clientX: number,
  clientY: number,
  itemCount: number,
): number | null {
  if (itemCount === 0) {
    return null;
  }
  const target = document.elementFromPoint(clientX, clientY)?.closest("[data-sort-index]");
  if (target instanceof HTMLElement && target.dataset.sortIndex) {
    const parsed = Number.parseInt(target.dataset.sortIndex, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }

  const rect = container.getBoundingClientRect();
  const columns = 3;
  const gap = 8;
  const cellWidth = (rect.width - gap * (columns - 1)) / columns;
  const cellHeight = cellWidth;
  const relativeX = clientX - rect.left;
  const relativeY = clientY - rect.top;
  if (relativeX < 0 || relativeY < 0 || relativeX > rect.width || relativeY > rect.height) {
    return null;
  }
  const column = Math.min(columns - 1, Math.max(0, Math.floor(relativeX / (cellWidth + gap))));
  const row = Math.max(0, Math.floor(relativeY / (cellHeight + gap)));
  const index = row * columns + column;
  return index >= itemCount ? itemCount - 1 : index;
}
