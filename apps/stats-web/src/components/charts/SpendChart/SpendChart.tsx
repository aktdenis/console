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
  ChartTooltipContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@akashnetwork/ui/components";
import { cn } from "@akashnetwork/ui/utils";
import { format, parseISO } from "date-fns";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { CHART_RANGE_OPTIONS, DEFAULT_CHART_RANGE_KEY } from "@/components/charts/chartRangeOptions";
import { ChartRangeToggle } from "@/components/charts/ChartRangeToggle";
import { ChartDownloadButton } from "@/components/charts/chartSnapshot/ChartDownloadButton";
import type { SpendDenom } from "@/components/charts/SpendChart/spendDenoms";
import { DiffPercentageChip } from "@/components/DiffPercentageChip";
import { percIncrease } from "@/lib/mathHelpers";
import type { SnapshotValue } from "@/types";

type ChartPoint = { date: string; value: number };

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
  BarChart,
  CartesianGrid,
  XAxis,
  Area,
  Bar,
  DiffPercentageChip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
};

export type SpendChartViewMode = "chart" | "table";

export type SpendChartProps = {
  denom: SpendDenom;
  /** Fully-settled days only - the in-progress "today" point is dropped by the caller. */
  completedSnapshots: SnapshotValue[];
  currentValue: number;
  compareValue: number;
  isFetching: boolean;
  className?: string;
  defaultRangeKey?: string;
  viewMode?: SpendChartViewMode;
  dependencies?: typeof DEPENDENCIES;
};

export const SpendChart: FC<SpendChartProps> = ({
  denom,
  completedSnapshots,
  currentValue,
  compareValue,
  isFetching,
  className,
  defaultRangeKey = DEFAULT_CHART_RANGE_KEY,
  viewMode = "chart",
  dependencies: d = DEPENDENCIES
}) => {
  const [rangeKey, setRangeKey] = useState<string>(defaultRangeKey);
  const activeRange = CHART_RANGE_OPTIONS.find(option => option.key === rangeKey) ?? CHART_RANGE_OPTIONS[1];
  const cardRef = useRef<HTMLDivElement>(null);

  const chartConfig = useMemo(
    () =>
      ({
        value: { label: denom.chartLabel, color: "hsl(var(--foreground))" }
      }) satisfies ChartConfig,
    [denom.chartLabel]
  );

  const rangedData: ChartPoint[] = useMemo(() => {
    const sliceStart = Math.max(completedSnapshots.length - activeRange.days, 0);
    return completedSnapshots.slice(sliceStart).map(snapshot => ({ date: snapshot.date, value: denom.toDisplayValue(snapshot.value) }));
  }, [completedSnapshots, activeRange.days, denom]);

  const latestCompleteDay = completedSnapshots.at(-1);
  const latestValue = latestCompleteDay ? denom.toDisplayValue(latestCompleteDay.value) : undefined;
  const latestDayDelta = percIncrease(compareValue, currentValue);

  const trend = useMemo(() => {
    if (rangedData.length < 2) return null;
    const first = rangedData[0];
    const last = rangedData[rangedData.length - 1];
    return { percent: percIncrease(first.value, last.value), from: first.date, to: last.date };
  }, [rangedData]);

  const csvData = useMemo(
    () => ({
      fields: [
        { label: "Date", value: "date" },
        { label: denom.chartLabel, value: "value" }
      ],
      rows: rangedData
    }),
    [rangedData, denom.chartLabel]
  );

  return (
    <d.Card ref={cardRef} className={className}>
      <d.CardHeader className="flex flex-col items-start gap-4 space-y-0 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <d.CardTitle className="text-base">
            {denom.titlePrefix} · {activeRange.label}
          </d.CardTitle>
          {latestValue !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold leading-none text-foreground">{denom.formatAmount(latestValue)}</span>
              <d.DiffPercentageChip value={latestDayDelta} />
            </div>
          )}
          <d.CardDescription>{denom.description}</d.CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <d.ChartRangeToggle options={CHART_RANGE_OPTIONS} value={rangeKey} onValueChange={setRangeKey} />
          <d.ChartDownloadButton
            targetRef={cardRef}
            fileName={`${denom.key}-spend-chart`}
            title={`${denom.titlePrefix} · ${activeRange.label}`}
            subtitle={denom.description}
            csv={csvData}
          />
        </div>
      </d.CardHeader>

      <d.CardContent>
        {viewMode === "table" ? (
          <div
            className={cn("h-[230px] overflow-y-auto rounded-md border print:h-auto print:overflow-visible", isFetching && "pointer-events-none opacity-80")}
          >
            <d.Table>
              <d.TableHeader className="sticky top-0 bg-card print:static">
                <d.TableRow>
                  <d.TableHead>Date</d.TableHead>
                  <d.TableHead className="text-right">{denom.chartLabel}</d.TableHead>
                </d.TableRow>
              </d.TableHeader>
              <d.TableBody>
                {[...rangedData].reverse().map(point => (
                  <d.TableRow key={point.date}>
                    <d.TableCell>{format(parseISO(point.date), "MMM d, yyyy")}</d.TableCell>
                    <d.TableCell className="text-right tabular-nums">{denom.formatTooltipAmount(point.value)}</d.TableCell>
                  </d.TableRow>
                ))}
              </d.TableBody>
            </d.Table>
          </div>
        ) : (
          <d.ChartContainer config={chartConfig} className={cn("aspect-auto h-[230px] w-full", isFetching && "pointer-events-none opacity-80")}>
            {denom.chartType === "bar" ? (
              <d.BarChart accessibilityLayer data={rangedData} margin={{ left: 12, right: 12 }}>
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
                      nameKey="value"
                      labelFormatter={value => {
                        const date = parseISO(value);
                        return isNaN(date.getTime()) ? value : format(date, "MMM d, yyyy");
                      }}
                      formatter={value => denom.formatTooltipAmount(Number(value))}
                    />
                  }
                />
                <d.Bar dataKey="value" fill="var(--color-value)" radius={3} />
              </d.BarChart>
            ) : (
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
                      nameKey="value"
                      labelFormatter={value => {
                        const date = parseISO(value);
                        return isNaN(date.getTime()) ? value : format(date, "MMM d, yyyy");
                      }}
                      formatter={value => denom.formatTooltipAmount(Number(value))}
                    />
                  }
                />
                <defs>
                  <linearGradient id={`fill-${denom.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <d.Area dataKey="value" type="monotone" stroke="var(--color-value)" fill={`url(#fill-${denom.key})`} fillOpacity={0.4} strokeWidth={2} />
              </d.AreaChart>
            )}
          </d.ChartContainer>
        )}
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
