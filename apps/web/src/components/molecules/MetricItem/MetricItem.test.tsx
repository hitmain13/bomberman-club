import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MetricItem } from "./MetricItem";

describe("MetricItem", () => {
  it("renders label and value", () => {
    render(<MetricItem label="Potência" value="320" unit="cv" />);
    expect(screen.getByText("Potência")).toBeInTheDocument();
    expect(screen.getByText("320")).toBeInTheDocument();
    expect(screen.getByText("cv")).toBeInTheDocument();
  });
});
