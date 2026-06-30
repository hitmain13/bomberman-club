import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { AddCarPartForm } from "./AddCarPartForm";

function withClient(node: ReactNode): JSX.Element {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{node}</QueryClientProvider>;
}

describe("AddCarPartForm", () => {
  it("disables submit until a part is selected", () => {
    render(withClient(<AddCarPartForm onSubmit={vi.fn()} />));
    expect(screen.getByRole("button", { name: "Adicionar peça" })).toBeDisabled();
  });
});
