import { describe, expect, it } from "vitest";

import { mergeSeriesByDate, normalizeRowsToPercentChange } from "@/lib/compareSeries";

describe(mergeSeriesByDate.name, () => {
  it("combines series sharing the same dates into one row per date", () => {
    const rows = mergeSeriesByDate([
      {
        key: "usd",
        points: [
          { date: "2026-01-01", value: 10 },
          { date: "2026-01-02", value: 20 }
        ]
      },
      {
        key: "leases",
        points: [
          { date: "2026-01-01", value: 100 },
          { date: "2026-01-02", value: 110 }
        ]
      }
    ]);

    expect(rows).toEqual([
      { date: "2026-01-01", usd: 10, leases: 100 },
      { date: "2026-01-02", usd: 20, leases: 110 }
    ]);
  });

  it("sorts rows chronologically regardless of input order", () => {
    const rows = mergeSeriesByDate([
      {
        key: "usd",
        points: [
          { date: "2026-01-02", value: 20 },
          { date: "2026-01-01", value: 10 }
        ]
      }
    ]);

    expect(rows.map(row => row.date)).toEqual(["2026-01-01", "2026-01-02"]);
  });

  it("leaves a series' key absent for a date only other series have, rather than defaulting to zero", () => {
    const rows = mergeSeriesByDate([
      { key: "usd", points: [{ date: "2026-01-01", value: 10 }] },
      {
        key: "leases",
        points: [
          { date: "2026-01-01", value: 100 },
          { date: "2026-01-02", value: 110 }
        ]
      }
    ]);

    const secondDay = rows.find(row => row.date === "2026-01-02");
    expect(secondDay?.leases).toBe(110);
    expect(secondDay?.usd).toBeUndefined();
  });
});

describe(normalizeRowsToPercentChange.name, () => {
  it("rebases each series to percent change from its own first value", () => {
    const rows = [
      { date: "2026-01-01", usd: 100, leases: 10 },
      { date: "2026-01-02", usd: 150, leases: 5 }
    ];

    const normalized = normalizeRowsToPercentChange(rows, ["usd", "leases"]);

    expect(normalized).toEqual([
      { date: "2026-01-01", usd: 0, leases: 0 },
      { date: "2026-01-02", usd: 50, leases: -50 }
    ]);
  });

  it("skips a leading zero baseline and rebases from the first non-zero value instead", () => {
    const rows = [
      { date: "2026-01-01", usd: 0 },
      { date: "2026-01-02", usd: 50 },
      { date: "2026-01-03", usd: 100 }
    ];

    const normalized = normalizeRowsToPercentChange(rows, ["usd"]);

    expect(normalized).toEqual([
      { date: "2026-01-01", usd: null },
      { date: "2026-01-02", usd: 0 },
      { date: "2026-01-03", usd: 100 }
    ]);
  });

  it("reports null for a series with no usable baseline anywhere in range, instead of throwing", () => {
    const rows = [
      { date: "2026-01-01", usd: 0 },
      { date: "2026-01-02", usd: 0 }
    ];

    const normalized = normalizeRowsToPercentChange(rows, ["usd"]);

    expect(normalized.every(row => row.usd === null)).toBe(true);
  });

  it("reports null for a date a series has no value for, rather than a stale carry-forward", () => {
    const rows = [
      { date: "2026-01-01", usd: 100, leases: 10 },
      { date: "2026-01-02", usd: 200 }
    ];

    const normalized = normalizeRowsToPercentChange(rows, ["usd", "leases"]);

    expect(normalized[1].leases).toBeNull();
  });
});
