import { type FC, useMemo } from "react";
import type { ChartConfig } from "@akashnetwork/ui/components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, ChartContainer, ChartTooltip, ChartTooltipContent } from "@akashnetwork/ui/components";
import { cn } from "@akashnetwork/ui/utils";
import { format, parseISO } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

export type SnapshotAreaChartData = Array<{ date: string; value: number }>;

export const DEPENDENCIES = {
  AreaChart,
  ChartContainer,
  CartesianGrid,
  XAxis,
  ChartTooltip,
  ChartTooltipContent,
  Area,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
};

export type SnapshotAreaChartProps = {
  title: string;
  description: string;
  seriesLabel: string;
  data: SnapshotAreaChartData;
  isFetching: boolean;
  dependencies?: typeof DEPENDENCIES;
};

export const SnapshotAreaChart: FC<SnapshotAreaChartProps> = ({ title, description, seriesLabel, data, isFetching, dependencies: d = DEPENDENCIES }) => {
  const chartConfig = useMemo(
    () =>
      ({
        value: { label: seriesLabel, color: "hsl(var(--foreground))" }
      }) satisfies ChartConfig,
    [seriesLabel]
  );

  return (
    <d.Card>
      <d.CardHeader>
        <d.CardTitle className="text-lg">{title}</d.CardTitle>
        <d.CardDescription>{description}</d.CardDescription>
      </d.CardHeader>
      <d.CardContent>
        <d.ChartContainer config={chartConfig} className={cn("aspect-auto h-[250px] w-full", isFetching && "pointer-events-none")} role="chart-container">
          <d.AreaChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }} role="area-chart">
            <d.CartesianGrid vertical={false} />
            <d.XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={value => {
                const date = parseISO(value);
                return isNaN(date.getTime()) ? value : format(date, "M/d");
              }}
            />
            <d.ChartTooltip
              content={
                <d.ChartTooltipContent
                  nameKey="value"
                  labelFormatter={value => {
                    const date = parseISO(value);
                    return isNaN(date.getTime()) ? value : format(date, "MMM d, yyyy");
                  }}
                />
              }
            />
            <d.Area
              dataKey="value"
              type="monotone"
              stroke="var(--color-value)"
              fill="var(--color-value)"
              fillOpacity={0.15}
              strokeWidth={2}
              className={cn(isFetching && "opacity-80")}
            />
          </d.AreaChart>
        </d.ChartContainer>
      </d.CardContent>
    </d.Card>
  );
};
