import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Icon } from "./Icon";

describe("Icon", () => {
  it("renders svg element", () => {
    const { container } = render(<Icon name="home" />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
});
