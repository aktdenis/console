import { type FC, useMemo } from "react";
import { FormattedNumber } from "react-intl";
import type { ChartConfig } from "@akashnetwork/ui/components";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@akashnetwork/ui/components";
import { cn } from "@akashnetwork/ui/utils";
import { format, parseISO } from "date-fns";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { percIncrease } from "@/lib/mathHelpers";
import type { SnapshotValue } from "@/types";

const chartConfig = {
  activeGPU: { label: "Active GPUs", color: "hsl(var(--foreground))" }
} satisfies ChartConfig;

type ChartPoint = { date: string; activeGPU: number };

export const DEPENDENCIES = {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  BarChart,
  CartesianGrid,
  XAxis,
  Bar
};

const WINDOW_DAYS = 30;

export type GpuTrendChartProps = {
  /** Fully-settled days only, full history - windowed to the last 30 days internally; the in-progress "today" point is dropped by the caller. */
  completedSnapshots: SnapshotValue[];
  /** Total network-wide GPU capacity, from useDashboardData().networkCapacity.totalGPU. */
  totalGPU: number;
  isFetching: boolean;
  dependencies?: typeof DEPENDENCIES;
};

export const GpuTrendChart: FC<GpuTrendChartProps> = ({ completedSnapshots, totalGPU, isFetching, dependencies: d = DEPENDENCIES }) => {
  const windowedSnapshots = useMemo(() => completedSnapshots.slice(Math.max(completedSnapshots.length - WINDOW_DAYS, 0)), [completedSnapshots]);
  const chartData: ChartPoint[] = useMemo(() => windowedSnapshots.map(snapshot => ({ date: snapshot.date, activeGPU: snapshot.value })), [windowedSnapshots]);

  const latestValue = windowedSnapshots.at(-1)?.value;

  const trend = useMemo(() => {
    if (chartData.length < 2) return null;
    const first = chartData[0];
    const last = chartData[chartData.length - 1];
    return { percent: percIncrease(first.activeGPU, last.activeGPU), from: first.date, to: last.date };
  }, [chartData]);

  return (
    <d.Card>
      <d.CardHeader className="gap-1.5 space-y-0">
        <d.CardTitle className="text-sm">Active GPUs</d.CardTitle>
        <d.CardDescription>
          GPUs under lease, of <FormattedNumber value={totalGPU} /> network-wide
        </d.CardDescription>
      </d.CardHeader>

      <d.CardContent>
        <d.ChartContainer config={chartConfig} className={cn("aspect-auto h-[160px] w-full", isFetching && "pointer-events-none opacity-80")}>
          <d.BarChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
            <d.CartesianGrid vertical={false} />
            <d.XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={40}
              tickFormatter={value => {
                const date = parseISO(value);
                return isNaN(date.getTime()) ? value : format(date, "d MMM");
              }}
            />
            <d.ChartTooltip
              content={
                <d.ChartTooltipContent
                  nameKey="activeGPU"
                  labelFormatter={value => {
                    const date = parseISO(value);
                    return isNaN(date.getTime()) ? value : format(date, "MMM d, yyyy");
                  }}
                />
              }
            />
            <d.Bar dataKey="activeGPU" radius={3} fill="var(--color-activeGPU)" fillOpacity={0.32} />
          </d.BarChart>
        </d.ChartContainer>
      </d.CardContent>

      <d.CardFooter className="flex-col items-start gap-1 border-t pt-3.5">
        {trend && latestValue !== undefined && (
          <p className="text-xs font-medium text-foreground">
            {trend.percent === 0 ? "Unchanged" : trend.percent > 0 ? "Up" : "Down"}{" "}
            <FormattedNumber value={Math.abs(trend.percent)} style="percent" maximumFractionDigits={1} /> over 30 days · <FormattedNumber value={latestValue} />{" "}
            leased
          </p>
        )}
        <p className="text-[11px] text-muted-foreground">
          {trend && `${format(parseISO(trend.from), "d MMM")} – ${format(parseISO(trend.to), "d MMM yyyy")} · `}
          today excluded, still settling
        </p>
      </d.CardFooter>
    </d.Card>
  );
};
