import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { NewSightingForm } from "./NewSightingForm";

function withClient(node: ReactNode): JSX.Element {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{node}</QueryClientProvider>;
}

describe("NewSightingForm", () => {
  it("shows capture actions and form fields on the same screen", () => {
    render(withClient(<NewSightingForm onSubmit={vi.fn()} />));
    expect(screen.getByRole("button", { name: "Abrir câmera" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Escolher da galeria" })).toBeInTheDocument();
    expect(screen.getByLabelText("Título")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Publicar flagrado" })).toBeDisabled();
  });
});
