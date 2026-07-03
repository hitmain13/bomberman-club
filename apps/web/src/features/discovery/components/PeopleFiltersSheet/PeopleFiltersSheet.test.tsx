import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PeopleFiltersSheet } from "./PeopleFiltersSheet";
import { memberSinceToIso } from "./PeopleFiltersSheet.utils";

describe("PeopleFiltersSheet", () => {
  it("applies the edited draft when confirming", async () => {
    const onApply = vi.fn();
    render(
      <PeopleFiltersSheet
        open
        value={{ city: "", sort: "RECENT", memberSince: "ALL" }}
        onClose={vi.fn()}
        onApply={onApply}
        onClear={vi.fn()}
      />,
    );
    await userEvent.type(screen.getByLabelText("Localização"), "São Paulo");
    await userEvent.click(screen.getByRole("button", { name: "Aplicar filtros" }));
    expect(onApply).toHaveBeenCalledWith({ city: "São Paulo", sort: "RECENT", memberSince: "ALL" });
  });
});

describe("memberSinceToIso", () => {
  it("returns undefined for ALL", () => {
    expect(memberSinceToIso("ALL")).toBeUndefined();
  });

  it("returns an ISO string 30 days back for LAST_30_DAYS", () => {
    const now = new Date("2026-06-30T12:00:00.000Z");
    const result = memberSinceToIso("LAST_30_DAYS", now);
    expect(result).toBe("2026-05-31T12:00:00.000Z");
  });

  it("returns January 1st of the current year for THIS_YEAR", () => {
    const now = new Date("2026-06-30T12:00:00.000Z");
    const result = memberSinceToIso("THIS_YEAR", now);
    expect(result).toContain("2026-01-01");
  });
});
