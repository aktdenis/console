// @vitest-environment jsdom
import { describe, expect, it } from "vitest";

import { WorldMapDots } from "@/components/layout/WorldMapDots";
import { render } from "@testing-library/react";

describe(WorldMapDots.name, () => {
  it("renders the globe image", () => {
    const { container } = render(<WorldMapDots markers={[]} />);

    const image = container.querySelector("image");
    expect(image).toHaveAttribute("href", "/images/getting-started/world.svg");
  });

  it("projects the globe's center coordinate to the middle of the viewBox", () => {
    const { container } = render(<WorldMapDots markers={[[15, -55]]} />);

    const [dot] = container.querySelectorAll("circle");
    expect(Number(dot.getAttribute("cx"))).toBeCloseTo(47, 5);
    expect(Number(dot.getAttribute("cy"))).toBeCloseTo(47, 5);
  });

  it("omits markers on the far side of the globe", () => {
    const { container } = render(<WorldMapDots markers={[[-15, 125]]} />);

    expect(container.querySelectorAll("circle")).toHaveLength(0);
  });

  it("renders one dot per visible marker, skipping only the far-side ones", () => {
    const { container } = render(
      <WorldMapDots
        markers={[
          [15, -55],
          [40, -90],
          [-15, 125]
        ]}
      />
    );

    expect(container.querySelectorAll("circle")).toHaveLength(2);
  });

  it("renders no dots when there are no markers", () => {
    const { container } = render(<WorldMapDots markers={[]} />);

    expect(container.querySelectorAll("circle")).toHaveLength(0);
  });
});
