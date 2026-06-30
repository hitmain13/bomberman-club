"use client";

import type { CarPartResponse } from "@bomberman/types";

import { cn } from "@/shared/utils/cn";

import { styles } from "./CarPartsList.styles";
import type { CarPartsListProps } from "./CarPartsList.types";

function groupByCategory(
  parts: ReadonlyArray<CarPartResponse>,
): ReadonlyArray<{ categoryName: string; items: ReadonlyArray<CarPartResponse> }> {
  const map = new Map<string, { categoryName: string; items: CarPartResponse[] }>();
  for (const part of parts) {
    const key = part.category.id;
    const existing = map.get(key);
    if (existing) {
      existing.items.push(part);
      continue;
    }
    map.set(key, { categoryName: part.category.name, items: [part] });
  }
  return Array.from(map.values());
}

export function CarPartsList({
  parts,
  onRemove,
  readOnly = false,
  className,
}: CarPartsListProps): JSX.Element {
  const groups = groupByCategory(parts);
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {groups.map((group) => (
        <section key={group.categoryName} className={styles.group}>
          <p className={styles.category}>{group.categoryName}</p>
          <ul className={styles.list}>
            {group.items.map((item) => (
              <li key={item.id} className={styles.item}>
                <div className={styles.identity}>
                  <span className={styles.manufacturer}>{item.part.manufacturer}</span>
                  <span className={styles.partName}>{item.part.name}</span>
                </div>
                {!readOnly && onRemove ? (
                  <button type="button" onClick={() => onRemove(item.id)} className={styles.remove}>
                    Remover
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
