import { type FC, useMemo, useRef, useState } from "react";
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
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { ChartRangeToggle } from "@/components/charts/ChartRangeToggle";
import { ChartDownloadButton } from "@/components/charts/chartSnapshot/ChartDownloadButton";
import { DiffPercentageChip } from "@/components/DiffPercentageChip";
import { percIncrease, udenomToDenom } from "@/lib/mathHelpers";
import type { SnapshotValue } from "@/types";

const RANGE_OPTIONS = [
  { key: "All", days: Number.MAX_SAFE_INTEGER, label: "All", footerPhrase: "the full history" },
  { key: "1Y", days: 365, label: "Last Year", footerPhrase: "the last year" },
  { key: "3M", days: 90, label: "Last 3 months", footerPhrase: "the last 3 months" },
  { key: "30D", days: 30, label: "Last 30 days", footerPhrase: "the last 30 days" },
  { key: "7D", days: 7, label: "Last 7 days", footerPhrase: "the last 7 days" }
] as const;

const DEFAULT_RANGE_KEY: (typeof RANGE_OPTIONS)[number]["key"] = "30D";

const chartConfig = {
  dailyUsdSpent: { label: "Daily USD Spent", color: "hsl(var(--foreground))" }
} satisfies ChartConfig;

type ChartPoint = { date: string; dailyUsdSpent: number };

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
  ChartRangeToggle,
  ChartDownloadButton,
  AreaChart,
  CartesianGrid,
  XAxis,
  Area,
  DiffPercentageChip
};

export type DailySpendChartProps = {
  /** Fully-settled days only - the in-progress "today" point is dropped by the caller. */
  completedSnapshots: SnapshotValue[];
  currentValue: number;
  compareValue: number;
  isFetching: boolean;
  dependencies?: typeof DEPENDENCIES;
};

export const DailySpendChart: FC<DailySpendChartProps> = ({ completedSnapshots, currentValue, compareValue, isFetching, dependencies: d = DEPENDENCIES }) => {
  const [rangeKey, setRangeKey] = useState<string>(DEFAULT_RANGE_KEY);
  const activeRange = RANGE_OPTIONS.find(option => option.key === rangeKey) ?? RANGE_OPTIONS[1];
  const cardRef = useRef<HTMLDivElement>(null);

  const rangedData: ChartPoint[] = useMemo(() => {
    const sliceStart = Math.max(completedSnapshots.length - activeRange.days, 0);
    return completedSnapshots.slice(sliceStart).map(snapshot => ({ date: snapshot.date, dailyUsdSpent: udenomToDenom(snapshot.value) }));
  }, [completedSnapshots, activeRange.days]);

  const latestCompleteDay = completedSnapshots.at(-1);
  const latestValue = latestCompleteDay ? udenomToDenom(latestCompleteDay.value) : undefined;
  const latestDayDelta = percIncrease(compareValue, currentValue);

  const trend = useMemo(() => {
    if (rangedData.length < 2) return null;
    const first = rangedData[0];
    const last = rangedData[rangedData.length - 1];
    return { percent: percIncrease(first.dailyUsdSpent, last.dailyUsdSpent), from: first.date, to: last.date };
  }, [rangedData]);

  return (
    <d.Card ref={cardRef}>
      <d.CardHeader className="flex flex-col items-start gap-4 space-y-0 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <d.CardTitle className="text-base">USD Spent · {activeRange.label}</d.CardTitle>
          {latestValue !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold leading-none text-foreground">
                <FormattedNumber value={latestValue} style="currency" currency="USD" maximumFractionDigits={0} notation="compact" compactDisplay="short" />
              </span>
              <d.DiffPercentageChip value={latestDayDelta} />
            </div>
          )}
          <d.CardDescription>Lease settlement per day, USD equivalent</d.CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <d.ChartRangeToggle options={RANGE_OPTIONS} value={rangeKey} onValueChange={setRangeKey} />
          <d.ChartDownloadButton
            targetRef={cardRef}
            fileName="usd-spend-chart.png"
            title={`USD Spent · ${activeRange.label}`}
            subtitle="Lease settlement per day, USD equivalent"
          />
        </div>
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
                  nameKey="dailyUsdSpent"
                  labelFormatter={value => {
                    const date = parseISO(value);
                    return isNaN(date.getTime()) ? value : format(date, "MMM d, yyyy");
                  }}
                  formatter={value => <FormattedNumber value={Number(value)} style="currency" currency="USD" maximumFractionDigits={2} />}
                />
              }
            />
            <d.Area
              dataKey="dailyUsdSpent"
              type="monotone"
              stroke="var(--color-dailyUsdSpent)"
              fill="var(--color-dailyUsdSpent)"
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
            <FormattedNumber value={Math.abs(trend.percent)} style="percent" maximumFractionDigits={1} /> over {activeRange.footerPhrase}
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
