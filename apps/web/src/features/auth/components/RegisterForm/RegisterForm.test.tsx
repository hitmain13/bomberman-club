import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn() }) }));
vi.mock("@/shared/contexts/auth-context", () => ({ useAuth: () => ({ signUp: vi.fn() }) }));

import { RegisterForm } from "./RegisterForm";

function withClient(node: ReactNode): JSX.Element {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{node}</QueryClientProvider>;
}

describe("RegisterForm", () => {
  it("requires accept terms", async () => {
    render(withClient(<RegisterForm />));
    await userEvent.click(screen.getByRole("button", { name: "Criar conta" }));
    expect(await screen.findByText("Você precisa aceitar os termos.")).toBeInTheDocument();
  });
});
