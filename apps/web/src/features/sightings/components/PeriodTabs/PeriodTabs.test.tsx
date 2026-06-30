import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PeriodTabs } from "./PeriodTabs";

describe("PeriodTabs", () => {
  it("invokes onChange when selecting a period", async () => {
    const onChange = vi.fn();
    render(<PeriodTabs value="ALL" onChange={onChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "Hoje" }));
    expect(onChange).toHaveBeenCalledWith("TODAY");
  });
});
