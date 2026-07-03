import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { CarForm } from "./CarForm";

function withClient(node: ReactNode): JSX.Element {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{node}</QueryClientProvider>;
}

describe("CarForm", () => {
  it("renders sections with default values for a new car", () => {
    render(withClient(<CarForm garageId="g_1" onSubmit={vi.fn()} />));
    expect(screen.getByText("Identidade")).toBeInTheDocument();
    expect(screen.getAllByText("Motor").length).toBeGreaterThan(0);
    expect(screen.getByText("Performance")).toBeInTheDocument();
    expect(screen.getByLabelText("Apelido")).toHaveValue("");
  });
});
