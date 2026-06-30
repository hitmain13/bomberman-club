import type { NotificationResponse } from "@bomberman/types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NotificationsList } from "./NotificationsList";

const notification: NotificationResponse = {
  id: "n1",
  type: "LIKE",
  actorId: "u1",
  actorUsername: "vinte.dois",
  actorAvatarUrl: null,
  targetType: "SIGHTING",
  targetId: "s1",
  readAt: null,
  createdAt: new Date().toISOString(),
};

describe("NotificationsList", () => {
  it("renders a friendly description", () => {
    render(<NotificationsList notifications={[notification]} />);
    expect(screen.getByText(/@vinte\.dois curtiu seu conteúdo/)).toBeInTheDocument();
  });
});
