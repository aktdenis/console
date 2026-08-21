import { describe, expect, it } from "vitest";

import { fitCentered, formatSnapshotTimestamp } from "@/components/charts/chartSnapshot/chartSnapshotLayout";

describe(fitCentered.name, () => {
  it("scales a wider-than-area image down to the area's width, preserving aspect ratio", () => {
    const result = fitCentered(2000, 500, { x: 0, y: 0, width: 1000, height: 1000 });

    expect(result).toEqual({ x: 0, y: 375, width: 1000, height: 250 });
  });

  it("scales a taller-than-area image down to the area's height, preserving aspect ratio", () => {
    const result = fitCentered(500, 2000, { x: 0, y: 0, width: 1000, height: 1000 });

    expect(result).toEqual({ x: 375, y: 0, width: 250, height: 1000 });
  });

  it("centers a smaller image within an offset area rather than anchoring to its origin", () => {
    const result = fitCentered(100, 100, { x: 200, y: 300, width: 400, height: 400 });

    expect(result).toEqual({ x: 200, y: 300, width: 400, height: 400 });
  });

  it("offsets the fitted rect by the area's own position, not just its size", () => {
    const result = fitCentered(2000, 500, { x: 64, y: 240, width: 1000, height: 1000 });

    expect(result).toEqual({ x: 64, y: 615, width: 1000, height: 250 });
  });
});

describe(formatSnapshotTimestamp.name, () => {
  it("renders a human-readable UTC date and time", () => {
    const result = formatSnapshotTimestamp(new Date("2026-08-21T16:07:00Z"));

    expect(result).toBe("Aug 21, 2026, 4:07 PM UTC");
  });
});
