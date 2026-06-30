import { cn } from "@/shared/utils/cn";

import { CarCard } from "../CarCard";

import { styles } from "./CarList.styles";
import type { CarListProps } from "./CarList.types";

export function CarList({ cars, hrefFor, className }: CarListProps): JSX.Element {
  return (
    <ul className={cn(styles.root, className)}>
      {cars.map((car) => (
        <li key={car.id}>
          <CarCard car={car} href={hrefFor?.(car)} />
        </li>
      ))}
    </ul>
  );
}
