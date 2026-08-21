import { type FC, useMemo, useState } from "react";
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
  ChartTooltipContent,
  Tabs,
  TabsList,
  TabsTrigger
} from "@akashnetwork/ui/components";
import { cn } from "@akashnetwork/ui/utils";
import { format, parseISO } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { AKTLabel } from "@/components/AKTLabel";
import { DiffPercentageChip } from "@/components/DiffPercentageChip";
import { percIncrease, udenomToDenom } from "@/lib/mathHelpers";
import type { SnapshotValue } from "@/types";

const RANGE_OPTIONS = [
  { key: "7D", days: 7 },
  { key: "30D", days: 30 },
  { key: "3M", days: 90 },
  { key: "1Y", days: 365 },
  { key: "All", days: Number.MAX_SAFE_INTEGER }
] as const;

const DEFAULT_RANGE_KEY: (typeof RANGE_OPTIONS)[number]["key"] = "30D";

const chartConfig = {
  dailyAktSpent: { label: "Daily AKT Spent", color: "hsl(var(--foreground))" }
} satisfies ChartConfig;

type ChartPoint = { date: string; dailyAktSpent: number };

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
  Tabs,
  TabsList,
  TabsTrigger,
  AreaChart,
  CartesianGrid,
  XAxis,
  Area,
  DiffPercentageChip,
  AKTLabel
};

export type AktSpendChartProps = {
  /** Fully-settled days only - the in-progress "today" point is dropped by the caller. */
  completedSnapshots: SnapshotValue[];
  currentValue: number;
  compareValue: number;
  isFetching: boolean;
  dependencies?: typeof DEPENDENCIES;
};

export const AktSpendChart: FC<AktSpendChartProps> = ({ completedSnapshots, currentValue, compareValue, isFetching, dependencies: d = DEPENDENCIES }) => {
  const [rangeKey, setRangeKey] = useState<string>(DEFAULT_RANGE_KEY);
  const selectedDays = RANGE_OPTIONS.find(option => option.key === rangeKey)?.days ?? RANGE_OPTIONS[1].days;

  const rangedData: ChartPoint[] = useMemo(() => {
    const sliceStart = Math.max(completedSnapshots.length - selectedDays, 0);
    return completedSnapshots.slice(sliceStart).map(snapshot => ({ date: snapshot.date, dailyAktSpent: udenomToDenom(snapshot.value) }));
  }, [completedSnapshots, selectedDays]);

  const latestCompleteDay = completedSnapshots.at(-1);
  const latestValue = latestCompleteDay ? udenomToDenom(latestCompleteDay.value) : undefined;
  const latestDayDelta = percIncrease(compareValue, currentValue);

  const trend = useMemo(() => {
    if (rangedData.length < 2) return null;
    const first = rangedData[0];
    const last = rangedData[rangedData.length - 1];
    return { percent: percIncrease(first.dailyAktSpent, last.dailyAktSpent), from: first.date, to: last.date };
  }, [rangedData]);

  const rangeLabel = RANGE_OPTIONS.find(option => option.key === rangeKey)?.key ?? DEFAULT_RANGE_KEY;

  return (
    <d.Card>
      <d.CardHeader className="flex flex-col items-start gap-4 space-y-0 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <d.CardTitle className="text-base">AKT Daily Spend</d.CardTitle>
          {latestValue !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold leading-none text-foreground">
                <FormattedNumber value={latestValue} maximumFractionDigits={0} notation="compact" compactDisplay="short" />
                <d.AKTLabel />
              </span>
              <d.DiffPercentageChip value={latestDayDelta} />
            </div>
          )}
          <d.CardDescription>Lease settlement per day, AKT equivalent</d.CardDescription>
        </div>

        <d.Tabs value={rangeKey} onValueChange={setRangeKey} className="w-full sm:w-auto">
          <d.TabsList className="h-auto w-full justify-between p-0.5 sm:w-auto sm:justify-start">
            {RANGE_OPTIONS.map(option => (
              <d.TabsTrigger key={option.key} value={option.key} className="px-2 py-1 text-xs sm:px-2.5">
                {option.key}
              </d.TabsTrigger>
            ))}
          </d.TabsList>
        </d.Tabs>
      </d.CardHeader>

      <d.CardContent>
        <d.ChartContainer config={chartConfig} className={cn("aspect-auto h-[230px] w-full", isFetching && "pointer-events-none opacity-80")}>
          <d.AreaChart accessibilityLayer data={rangedData} margin={{ left: 12, right: 12 }}>
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
                  nameKey="dailyAktSpent"
                  labelFormatter={value => {
                    const date = parseISO(value);
                    return isNaN(date.getTime()) ? value : format(date, "MMM d, yyyy");
                  }}
                  formatter={value => (
                    <>
                      <FormattedNumber value={Number(value)} maximumFractionDigits={2} /> AKT
                    </>
                  )}
                />
              }
            />
            <d.Area
              dataKey="dailyAktSpent"
              type="monotone"
              stroke="var(--color-dailyAktSpent)"
              fill="var(--color-dailyAktSpent)"
              fillOpacity={0.15}
              strokeWidth={2}
            />
          </d.AreaChart>
        </d.ChartContainer>
      </d.CardContent>

      <d.CardFooter className="flex-col items-start gap-1 border-t pt-4">
        {trend && (
          <p className="font-medium text-foreground">
            Trending {trend.percent === 0 ? "flat" : trend.percent > 0 ? "up" : "down"}{" "}
            <FormattedNumber value={Math.abs(trend.percent)} style="percent" maximumFractionDigits={1} /> over{" "}
            {rangeLabel === "All" ? "the full history" : `the last ${rangeLabel}`}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {trend && `${format(parseISO(trend.from), "d MMM")} – ${format(parseISO(trend.to), "d MMM yyyy")} · `}
          today excluded, still settling
        </p>
      </d.CardFooter>
    </d.Card>
  );
};
