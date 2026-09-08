import type { SnapshotValue } from "@/types";

export type ComparableSeries = { key: string; points: SnapshotValue[] };

export type ComparisonRow = {
  date: string;
  [metricKey: string]: string | number | null;
};

/** Wide-pivots N independent {date,value} series into one row per date, keyed by each series' own key. A date a series has no point for gets null rather than a false zero. */
export function mergeSeriesByDate(seriesList: ComparableSeries[]): ComparisonRow[] {
  const rowsByDate = new Map<string, ComparisonRow>();

  for (const { key, points } of seriesList) {
    for (const point of points) {
      const row = rowsByDate.get(point.date) ?? { date: point.date };
      row[key] = point.value;
      rowsByDate.set(point.date, row);
    }
  }

  return [...rowsByDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Rebases each series to % change from its own first non-zero value in range, so metrics with
 * unlike units (dollars, cores, a ratio) can be read on one shared axis - the "indexed
 * performance" convention terminals use to compare unlike assets on the same chart.
 */
export function normalizeRowsToPercentChange(rows: ComparisonRow[], keys: string[]): ComparisonRow[] {
  const baselineIndexes = new Map<string, number>();
  const baselineValues = new Map<string, number>();

  for (const key of keys) {
    const index = rows.findIndex(row => typeof row[key] === "number" && row[key] !== 0);
    if (index !== -1) {
      baselineIndexes.set(key, index);
      baselineValues.set(key, rows[index][key] as number);
    }
  }

  return rows.map((row, rowIndex) => {
    const normalized: ComparisonRow = { date: row.date };
    for (const key of keys) {
      const value = row[key];
      const baselineIndex = baselineIndexes.get(key);
      const baseline = baselineValues.get(key);
      normalized[key] =
        typeof value === "number" && baseline !== undefined && baselineIndex !== undefined && rowIndex >= baselineIndex
          ? ((value - baseline) / baseline) * 100
          : null;
    }
    return normalized;
  });
}
