"use client";
import type { FC } from "react";
import { useMemo, useRef, useState } from "react";
import type { ChartConfig } from "@akashnetwork/ui/components";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@akashnetwork/ui/components";
import { cn } from "@akashnetwork/ui/utils";
import { format, parseISO } from "date-fns";
import { ListPlus, X } from "lucide-react";
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts";

import { CHART_RANGE_OPTIONS, DEFAULT_CHART_RANGE_KEY } from "@/components/charts/chartRangeOptions";
import { ChartRangeToggle } from "@/components/charts/ChartRangeToggle";
import { ChartDownloadButton } from "@/components/charts/chartSnapshot/ChartDownloadButton";
import type { SpendDenom } from "@/components/charts/SpendChart/spendDenoms";
import {
  ALL_COMPARE_METRICS,
  COMPARE_METRIC_GROUPS,
  COMPARE_PRESETS,
  COMPARE_SERIES_COLORS,
  MAX_COMPARE_METRICS
} from "@/components/NetworkReport/compareMetrics";
import type { StatsViewMode } from "@/components/NetworkReport/ViewModeToggle";
import { mergeSeriesByDate, normalizeRowsToPercentChange } from "@/lib/compareSeries";
import { useGraphSnapshots } from "@/queries";

export const DEPENDENCIES = {
  useGraphSnapshots,
  ChartContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
  Line,
  ChartTooltip,
  ChartTooltipContent
};

export type CompareToolProps = {
  viewMode: StatsViewMode;
  dependencies?: typeof DEPENDENCIES;
};

function findMetric(key: string) {
  return ALL_COMPARE_METRICS.find(metric => metric.key === key);
}

export const CompareTool: FC<CompareToolProps> = ({ viewMode, dependencies: d = DEPENDENCIES }) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(COMPARE_PRESETS[0].metricKeys);
  const [rangeKey, setRangeKey] = useState<string>(DEFAULT_CHART_RANGE_KEY);
  const activeRange = CHART_RANGE_OPTIONS.find(option => option.key === rangeKey) ?? CHART_RANGE_OPTIONS[1];
  const cardRef = useRef<HTMLDivElement>(null);

  const selectedMetrics = useMemo(() => selectedKeys.map(findMetric).filter((metric): metric is SpendDenom => !!metric), [selectedKeys]);
  const queries = d.useGraphSnapshots(selectedMetrics.map(metric => metric.snapshotKey));
  const isLoading = queries.some(query => query.isLoading);

  const rangedRows = useMemo(() => {
    const seriesList = selectedMetrics.map((metric, index) => {
      const snapshots = queries[index]?.data?.snapshots ?? [];
      const windowed = snapshots.slice(Math.max(snapshots.length - activeRange.days, 0));
      return { key: metric.key, points: windowed.map(point => ({ date: point.date, value: metric.toDisplayValue(point.value) })) };
    });
    return mergeSeriesByDate(seriesList);
  }, [selectedMetrics, queries, activeRange.days]);

  const normalizedRows = useMemo(
    () =>
      normalizeRowsToPercentChange(
        rangedRows,
        selectedMetrics.map(metric => metric.key)
      ),
    [rangedRows, selectedMetrics]
  );

  const chartConfig = useMemo(
    () =>
      selectedMetrics.reduce((config, metric, index) => {
        config[metric.key] = { label: metric.tabLabel, color: COMPARE_SERIES_COLORS[index] };
        return config;
      }, {} as ChartConfig),
    [selectedMetrics]
  );

  const csvData = useMemo(
    () => ({
      fields: [{ label: "Date", value: "date" }, ...selectedMetrics.map(metric => ({ label: metric.tabLabel, value: metric.key }))],
      rows: rangedRows
    }),
    [rangedRows, selectedMetrics]
  );

  function toggleMetric(key: string) {
    setSelectedKeys(current => {
      if (current.includes(key)) return current.filter(existing => existing !== key);
      if (current.length >= MAX_COMPARE_METRICS) return current;
      return [...current, key];
    });
  }

  function applyPreset(metricKeys: string[]) {
    setSelectedKeys(metricKeys);
  }

  return (
    <Card ref={cardRef}>
      <CardHeader className="flex flex-col items-start gap-4 space-y-0 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <CardTitle className="text-base">Compare</CardTitle>
          <CardDescription>Overlay any metrics, indexed to % change so unlike units read on one axis.</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {COMPARE_PRESETS.map(preset => (
            <Button key={preset.label} variant="outline" size="sm" className="h-7 rounded-full text-xs" onClick={() => applyPreset(preset.metricKeys)}>
              {preset.label}
            </Button>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1.5 rounded-full text-xs">
                <ListPlus className="size-3.5" aria-hidden="true" />
                Add metric
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-h-80 overflow-y-auto">
              {COMPARE_METRIC_GROUPS.map((group, groupIndex) => (
                <div key={group.label}>
                  {groupIndex > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
                  {group.metrics.map(metric => (
                    <DropdownMenuCheckboxItem
                      key={metric.key}
                      checked={selectedKeys.includes(metric.key)}
                      disabled={!selectedKeys.includes(metric.key) && selectedKeys.length >= MAX_COMPARE_METRICS}
                      onSelect={event => event.preventDefault()}
                      onCheckedChange={() => toggleMetric(metric.key)}
                    >
                      {metric.tabLabel}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="ml-auto flex items-center gap-2">
            <ChartRangeToggle options={CHART_RANGE_OPTIONS} value={rangeKey} onValueChange={setRangeKey} />
            <ChartDownloadButton
              targetRef={cardRef}
              fileName={`compare-${selectedMetrics.map(metric => metric.key).join("-")}`}
              title={`Compare · ${activeRange.label}`}
              subtitle={selectedMetrics.map(metric => metric.tabLabel).join(" vs ")}
              csv={csvData}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedMetrics.map((metric, index) => (
            <button
              key={metric.key}
              type="button"
              onClick={() => toggleMetric(metric.key)}
              className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            >
              <span className="size-2 rounded-full" style={{ backgroundColor: COMPARE_SERIES_COLORS[index] }} />
              {metric.tabLabel}
              <X className="size-3 text-muted-foreground" aria-hidden="true" />
            </button>
          ))}
        </div>

        {selectedMetrics.length < 2 ? (
          <div className="flex min-h-[230px] items-center justify-center rounded-md border text-sm text-muted-foreground">
            Select at least 2 metrics to compare.
          </div>
        ) : isLoading ? (
          <div className="flex min-h-[230px] items-center justify-center rounded-md border">
            <Spinner size="large" />
          </div>
        ) : viewMode === "table" ? (
          <div className="max-h-[400px] overflow-y-auto rounded-md border print:max-h-none print:overflow-visible">
            <Table>
              <TableHeader className="sticky top-0 bg-card print:static">
                <TableRow>
                  <TableHead>Date</TableHead>
                  {selectedMetrics.map(metric => (
                    <TableHead key={metric.key} className="text-right">
                      {metric.tabLabel}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...rangedRows].reverse().map(row => (
                  <TableRow key={row.date}>
                    <TableCell>{format(parseISO(row.date), "MMM d, yyyy")}</TableCell>
                    {selectedMetrics.map(metric => {
                      const value = row[metric.key];
                      return (
                        <TableCell key={metric.key} className="text-right tabular-nums">
                          {typeof value === "number" ? metric.formatTooltipAmount(value) : "—"}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <d.ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
            <d.LineChart accessibilityLayer data={normalizedRows} margin={{ left: 12, right: 12 }}>
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
              <d.YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={value => `${value}%`} width={48} />
              <d.ReferenceLine y={0} stroke="hsl(var(--border))" />
              <d.ChartTooltip
                content={
                  <d.ChartTooltipContent
                    labelFormatter={value => {
                      const date = parseISO(value);
                      return isNaN(date.getTime()) ? value : format(date, "MMM d, yyyy");
                    }}
                    formatter={(value, name) => (
                      <span className="flex w-full items-center justify-between gap-4">
                        <span className="text-muted-foreground">{chartConfig[name as string]?.label ?? name}</span>
                        <span className={cn("font-medium tabular-nums", Number(value) < 0 && "text-red-500")}>
                          {Number(value) >= 0 ? "+" : ""}
                          {Number(value).toFixed(1)}%
                        </span>
                      </span>
                    )}
                  />
                }
              />
              {selectedMetrics.map((metric, index) => (
                <d.Line
                  key={metric.key}
                  dataKey={metric.key}
                  type="monotone"
                  stroke={COMPARE_SERIES_COLORS[index]}
                  strokeWidth={2}
                  dot={false}
                  connectNulls={false}
                />
              ))}
            </d.LineChart>
          </d.ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
