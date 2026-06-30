import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("renders children inside main", () => {
    render(
      <AppShell>
        <p>Conteúdo</p>
      </AppShell>,
    );
    expect(screen.getByText("Conteúdo")).toBeInTheDocument();
  });
});
