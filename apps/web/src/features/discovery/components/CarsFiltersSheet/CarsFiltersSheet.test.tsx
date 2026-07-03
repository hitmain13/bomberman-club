import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { CarsFiltersSheet } from "./CarsFiltersSheet";

function withClient(node: ReactNode): JSX.Element {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{node}</QueryClientProvider>;
}

describe("CarsFiltersSheet", () => {
  it("applies the sort change when confirming", async () => {
    const onApply = vi.fn();
    render(
      withClient(
        <CarsFiltersSheet
          open
          value={{ stage: "", sort: "NEWEST" }}
          onClose={vi.fn()}
          onApply={onApply}
          onClear={vi.fn()}
        />,
      ),
    );
    await userEvent.selectOptions(screen.getByLabelText("Ordenar por"), "MOST_POWERFUL");
    await userEvent.click(screen.getByRole("button", { name: "Aplicar filtros" }));
    expect(onApply).toHaveBeenCalledWith({ stage: "", sort: "MOST_POWERFUL" });
  });
});
