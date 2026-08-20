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
import { Bar, BarChart, CartesianGrid, Cell, XAxis } from "recharts";

import { percIncrease } from "@/lib/mathHelpers";
import type { SnapshotValue } from "@/types";

const chartConfig = {
  activeLeaseCount: { label: "Active Leases", color: "hsl(var(--foreground))" }
} satisfies ChartConfig;

type ChartPoint = { date: string; activeLeaseCount: number; isInProgress: boolean };

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
  Bar,
  Cell
};

const WINDOW_DAYS = 30;

export type LeasesTrendChartProps = {
  /** Fully-settled days, full history - windowed to the last 30 days internally. */
  completedSnapshots: SnapshotValue[];
  /** Today's still-updating count - banded (shown, distinguished), not dropped. */
  currentValue: number;
  isFetching: boolean;
  dependencies?: typeof DEPENDENCIES;
};

export const LeasesTrendChart: FC<LeasesTrendChartProps> = ({ completedSnapshots, currentValue, isFetching, dependencies: d = DEPENDENCIES }) => {
  const chartData: ChartPoint[] = useMemo(() => {
    const windowed = completedSnapshots.slice(Math.max(completedSnapshots.length - WINDOW_DAYS, 0));
    return [
      ...windowed.map(snapshot => ({ date: snapshot.date, activeLeaseCount: snapshot.value, isInProgress: false })),
      { date: new Date().toISOString(), activeLeaseCount: currentValue, isInProgress: true }
    ];
  }, [completedSnapshots, currentValue]);

  const trend = useMemo(() => {
    if (chartData.length < 2) return null;
    const first = chartData[0];
    const last = chartData[chartData.length - 1];
    return { percent: percIncrease(first.activeLeaseCount, last.activeLeaseCount), from: first.date, to: last.date };
  }, [chartData]);

  return (
    <d.Card>
      <d.CardHeader className="gap-1.5 space-y-0">
        <d.CardTitle className="text-sm">Active Leases</d.CardTitle>
        <d.CardDescription>Open leases per day</d.CardDescription>
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
                  nameKey="activeLeaseCount"
                  labelFormatter={(value, payload) => {
                    const date = parseISO(value);
                    const label = isNaN(date.getTime()) ? value : format(date, "MMM d, yyyy");
                    return payload?.[0]?.payload?.isInProgress ? `${label} (in progress)` : label;
                  }}
                />
              }
            />
            <d.Bar dataKey="activeLeaseCount" radius={3}>
              {chartData.map(point => (
                <d.Cell key={point.date} fillOpacity={point.isInProgress ? 1 : 0.32} fill="var(--color-activeLeaseCount)" />
              ))}
            </d.Bar>
          </d.BarChart>
        </d.ChartContainer>
      </d.CardContent>

      <d.CardFooter className="flex-col items-start gap-1 border-t pt-3.5">
        {trend && (
          <p className="text-xs font-medium text-foreground">
            {trend.percent === 0 ? "Unchanged" : trend.percent > 0 ? "Up" : "Down"}{" "}
            <FormattedNumber value={Math.abs(trend.percent)} style="percent" maximumFractionDigits={1} /> over 30 days ·{" "}
            <FormattedNumber value={currentValue} /> active
          </p>
        )}
        <p className="text-[11px] text-muted-foreground">
          {trend && `${format(parseISO(trend.from), "d MMM")} – ${format(parseISO(trend.to), "d MMM yyyy")} · `}
          today's count still updating
        </p>
      </d.CardFooter>
    </d.Card>
  );
};
