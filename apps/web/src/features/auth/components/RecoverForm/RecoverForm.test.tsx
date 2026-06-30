import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { RecoverForm } from "./RecoverForm";

function withClient(node: ReactNode): JSX.Element {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{node}</QueryClientProvider>;
}

describe("RecoverForm", () => {
  it("validates email", async () => {
    render(withClient(<RecoverForm />));
    await userEvent.type(screen.getByLabelText("E-mail"), "not-a-mail");
    await userEvent.click(screen.getByRole("button", { name: "Enviar link" }));
    expect(await screen.findByText(/Invalid email/i)).toBeInTheDocument();
  });
});
