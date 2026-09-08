import type { SnapshotValue } from "@/types";

export type SnapshotBucket = {
  bucketStart: string;
  value: number;
};

/**
 * Averages a gauge-style daily series (e.g. "leased CPU today") into fixed-size
 * buckets, keeping only the most recent `bucketCount` of them. Averaging - not
 * summing - is what makes sense for a level/gauge metric, unlike a flow metric
 * such as daily spend.
 */
export function bucketSnapshots(snapshots: SnapshotValue[], bucketCount: number, daysPerBucket: number): SnapshotBucket[] {
  const recent = snapshots.slice(-bucketCount * daysPerBucket);
  const buckets: SnapshotBucket[] = [];

  for (let i = 0; i < recent.length; i += daysPerBucket) {
    const days = recent.slice(i, i + daysPerBucket);
    const value = days.reduce((sum, day) => sum + day.value, 0) / days.length;
    buckets.push({ bucketStart: days[0].date, value });
  }

  return buckets;
}
