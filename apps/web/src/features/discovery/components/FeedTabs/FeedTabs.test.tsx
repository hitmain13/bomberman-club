import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FeedTabs } from "./FeedTabs";

describe("FeedTabs", () => {
  it("invokes onChange when selecting another scope", async () => {
    const onChange = vi.fn();
    render(<FeedTabs value="FORYOU" onChange={onChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "Seguindo" }));
    expect(onChange).toHaveBeenCalledWith("FOLLOWING");
  });
});
