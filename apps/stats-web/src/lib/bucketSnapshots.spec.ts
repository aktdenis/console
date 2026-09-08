import { describe, expect, it } from "vitest";

import { bucketSnapshots } from "@/lib/bucketSnapshots";

describe(bucketSnapshots.name, () => {
  it("averages each fixed-size window into one bucket", () => {
    const snapshots = Array.from({ length: 14 }, (_, i) => ({ date: `day-${i}`, value: i < 7 ? 10 : 20 }));

    const buckets = bucketSnapshots(snapshots, 2, 7);

    expect(buckets).toEqual([
      { bucketStart: "day-0", value: 10 },
      { bucketStart: "day-7", value: 20 }
    ]);
  });

  it("keeps only the most recent bucketCount windows", () => {
    const snapshots = Array.from({ length: 21 }, (_, i) => ({ date: `day-${i}`, value: i }));

    const buckets = bucketSnapshots(snapshots, 1, 7);

    expect(buckets).toHaveLength(1);
    expect(buckets[0].bucketStart).toBe("day-14");
  });

  it("averages a partial trailing window using only the days available", () => {
    const snapshots = [
      { date: "d1", value: 10 },
      { date: "d2", value: 20 },
      { date: "d3", value: 30 }
    ];

    const buckets = bucketSnapshots(snapshots, 4, 7);

    expect(buckets).toEqual([{ bucketStart: "d1", value: 20 }]);
  });

  it("supports a larger window size for a coarser granularity", () => {
    const snapshots = Array.from({ length: 60 }, (_, i) => ({ date: `day-${i}`, value: i < 30 ? 1 : 2 }));

    const buckets = bucketSnapshots(snapshots, 2, 30);

    expect(buckets).toEqual([
      { bucketStart: "day-0", value: 1 },
      { bucketStart: "day-30", value: 2 }
    ]);
  });
});
