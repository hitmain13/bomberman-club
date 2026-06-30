import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ProfileTabs } from "./ProfileTabs";

describe("ProfileTabs", () => {
  it("switches the active tab", async () => {
    render(
      <ProfileTabs
        tabs={[
          { id: "cars", label: "Carros", content: <p>Carros aqui</p> },
          { id: "sightings", label: "Flagrados", content: <p>Flagrados aqui</p> },
        ]}
      />,
    );
    expect(screen.getByText("Carros aqui")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("tab", { name: "Flagrados" }));
    expect(screen.getByText("Flagrados aqui")).toBeInTheDocument();
  });
});
