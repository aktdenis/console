import { type FC, useMemo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@akashnetwork/ui/components";
import { format, parseISO } from "date-fns";

import type { SpendDenom } from "@/components/charts/SpendChart/spendDenoms";
import { bucketSnapshots } from "@/lib/bucketSnapshots";
import type { SnapshotValue } from "@/types";

export type BubbleChartSeries = {
  denom: SpendDenom;
  completedSnapshots: SnapshotValue[];
};

export const GRANULARITY_OPTIONS = [
  { key: "week", days: 7, label: "Week", bucketCount: 12 },
  { key: "month", days: 30, label: "Month", bucketCount: 6 }
] as const;

export const DEFAULT_GRANULARITY_KEY: (typeof GRANULARITY_OPTIONS)[number]["key"] = "week";

export type ResourcesLeasedBubbleChartProps = {
  series: BubbleChartSeries[];
  granularityKey: string;
};

const LABEL_WIDTH_PX = 76;
const CELL_WIDTH_PX = 44;
const ROW_HEIGHT_PX = 48;

/** Bubble diameter scales with each row's own peak, since vCPU cores, GPU count, and TB aren't comparable magnitudes. */
const MIN_DIAMETER_PX = 14;
const MAX_DIAMETER_PX = 36;

export const ResourcesLeasedBubbleChart: FC<ResourcesLeasedBubbleChartProps> = ({ series, granularityKey }) => {
  const granularity = GRANULARITY_OPTIONS.find(option => option.key === granularityKey) ?? GRANULARITY_OPTIONS[0];

  const rows = useMemo(
    () =>
      series.map(({ denom, completedSnapshots }) => ({
        key: denom.key,
        label: denom.tabLabel,
        buckets: bucketSnapshots(completedSnapshots, granularity.bucketCount, granularity.days).map(bucket => {
          const displayValue = denom.toDisplayValue(bucket.value);
          return {
            bucketStart: bucket.bucketStart,
            value: displayValue,
            tooltip: (
              <>
                {denom.formatTooltipAmount(displayValue)} · {granularity.label.toLowerCase()} of {format(parseISO(bucket.bucketStart), "MMM d, yyyy")}
              </>
            )
          };
        })
      })),
    [series, granularity]
  );

  const bucketCount = rows[0]?.buckets.length ?? 0;
  const gridTemplateColumns = `${LABEL_WIDTH_PX}px repeat(${bucketCount}, minmax(${CELL_WIDTH_PX}px, 1fr))`;

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: LABEL_WIDTH_PX + bucketCount * CELL_WIDTH_PX }}>
        <div className="grid items-center gap-x-1 pb-2" style={{ gridTemplateColumns }}>
          <span />
          {rows[0]?.buckets.map(bucket => (
            <span key={bucket.bucketStart} className="text-center text-[10px] uppercase tracking-wide text-muted-foreground">
              {format(parseISO(bucket.bucketStart), "d MMM")}
            </span>
          ))}
        </div>

        {rows.map(row => {
          const maxValue = Math.max(...row.buckets.map(bucket => bucket.value), 0);

          return (
            <div key={row.key} className="grid items-center gap-x-1 border-t py-1" style={{ gridTemplateColumns }}>
              <span className="text-xs font-medium text-muted-foreground">{row.label}</span>

              {row.buckets.map(bucket => {
                const percent = maxValue > 0 ? bucket.value / maxValue : 0;
                const diameterPx = bucket.value > 0 ? MIN_DIAMETER_PX + percent * (MAX_DIAMETER_PX - MIN_DIAMETER_PX) : 0;

                return (
                  <div key={bucket.bucketStart} className="flex items-center justify-center" style={{ height: ROW_HEIGHT_PX }}>
                    {diameterPx > 0 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="relative rounded-full transition-transform duration-300 ease-out hover:z-10 hover:scale-125"
                            style={{
                              width: diameterPx,
                              height: diameterPx,
                              background:
                                "radial-gradient(circle at 35% 30%, hsl(var(--muted-foreground) / 0.95), hsl(var(--muted-foreground) / 0.85) 65%, hsl(var(--muted-foreground) / 0.75) 100%)"
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>{bucket.tooltip}</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
