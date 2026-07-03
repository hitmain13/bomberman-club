import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { BottomSheet } from "./BottomSheet";

describe("BottomSheet", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <BottomSheet open={false} title="Filtros" onClose={vi.fn()}>
        <p>Conteúdo</p>
      </BottomSheet>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders title, children and calls onClose", async () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open title="Filtros" onClose={onClose}>
        <p>Conteúdo do filtro</p>
      </BottomSheet>,
    );
    expect(screen.getByText("Filtros")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo do filtro")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
