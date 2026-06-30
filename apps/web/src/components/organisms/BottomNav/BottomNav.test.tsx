import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

import { BottomNav } from "./BottomNav";

describe("BottomNav", () => {
  it("renders provided items as links", () => {
    render(
      <BottomNav
        items={[
          { href: "/", label: "Início", icon: "home" },
          { href: "/explore", label: "Explorar", icon: "explore" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: /início/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explorar/i })).toBeInTheDocument();
  });
});
