import { type FC, useMemo } from "react";
import { FormattedNumber } from "react-intl";
import type { ChartConfig } from "@akashnetwork/ui/components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, ChartContainer, ChartTooltip, ChartTooltipContent } from "@akashnetwork/ui/components";
import { cn } from "@akashnetwork/ui/utils";
import { format, parseISO } from "date-fns";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import type { SnapshotValue } from "@/types";

const chartConfig = {
  activeGPU: { label: "Active GPUs", color: "hsl(var(--foreground))" }
} satisfies ChartConfig;

type ChartPoint = { date: string; activeGPU: number };

export const DEPENDENCIES = {
  Card,
  CardContent,
  CardDescription,
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

  return (
    <d.Card>
      <d.CardHeader className="gap-1.5 space-y-0">
        <d.CardTitle className="text-sm">Active GPUs</d.CardTitle>
        <d.CardDescription>
          GPUs under lease, of <FormattedNumber value={totalGPU} /> network-wide
        </d.CardDescription>
      </d.CardHeader>

      <d.CardContent>
        <d.ChartContainer config={chartConfig} className={cn("aspect-auto h-[240px] w-full", isFetching && "pointer-events-none opacity-80")}>
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
    </d.Card>
  );
};
