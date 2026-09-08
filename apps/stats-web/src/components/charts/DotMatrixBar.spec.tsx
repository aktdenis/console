// @vitest-environment jsdom
import { describe, expect, it } from "vitest";

import { DotMatrixBar } from "@/components/charts/DotMatrixBar";
import { render } from "@testing-library/react";

const TOTAL_DOTS = 308;

describe(DotMatrixBar.name, () => {
  it("fills roughly percent of the total dots", () => {
    const { container } = render(<DotMatrixBar percent={0.5} />);

    const filled = container.querySelectorAll(".bg-foreground");
    expect(filled).toHaveLength(154);
  });

  it("fills every dot at 100 percent", () => {
    const { container } = render(<DotMatrixBar percent={1} />);

    expect(container.querySelectorAll(".bg-foreground")).toHaveLength(TOTAL_DOTS);
    expect(container.querySelectorAll(".bg-muted")).toHaveLength(0);
  });

  it("fills no dots at 0 percent", () => {
    const { container } = render(<DotMatrixBar percent={0} />);

    expect(container.querySelectorAll(".bg-foreground")).toHaveLength(0);
    expect(container.querySelectorAll(".bg-muted")).toHaveLength(TOTAL_DOTS);
  });

  it("clamps out-of-range percentages instead of over- or under-filling", () => {
    const { container: over } = render(<DotMatrixBar percent={1.5} />);
    const { container: under } = render(<DotMatrixBar percent={-0.2} />);

    expect(over.querySelectorAll(".bg-foreground")).toHaveLength(TOTAL_DOTS);
    expect(under.querySelectorAll(".bg-foreground")).toHaveLength(0);
  });

  it("stalls each filled dot's animation start in fill order, bottom row first", () => {
    const { container } = render(<DotMatrixBar percent={1 / TOTAL_DOTS} />);

    const [firstDot] = container.querySelectorAll(".bg-foreground");
    expect(firstDot).toHaveStyle({ animationDelay: "0ms" });
  });
});
