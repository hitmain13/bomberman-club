import type { PrivateUser } from "@bomberman/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn() }) }));
vi.mock("@/shared/contexts/auth-context", () => ({
  useAuth: () => ({ refreshUser: vi.fn() }),
}));

import { EditProfileForm } from "./EditProfileForm";

const user: PrivateUser = {
  id: "1",
  username: "speed.fabio",
  email: "fabio@example.com",
  role: "USER",
  bio: "Apaixonado por turbo.",
  city: "São Paulo - SP",
  avatarUrl: null,
  createdAt: new Date().toISOString(),
};

function withClient(node: ReactNode): JSX.Element {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{node}</QueryClientProvider>;
}

describe("EditProfileForm", () => {
  it("starts with the user data populated", () => {
    render(withClient(<EditProfileForm user={user} />));
    expect(screen.getByLabelText("Nome de usuário")).toHaveValue("speed.fabio");
    expect(screen.getByLabelText("Cidade")).toHaveValue("São Paulo - SP");
  });

  it("enables save after selecting a new photo", () => {
    render(withClient(<EditProfileForm user={user} />));
    const saveButton = screen.getByRole("button", { name: "Salvar alterações" });
    expect(saveButton).toBeDisabled();

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["avatar"], "avatar.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(saveButton).toBeEnabled();
  });
});
