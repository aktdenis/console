export const CHART_RANGE_OPTIONS = [
  { key: "All", days: Number.MAX_SAFE_INTEGER, label: "All", footerPhrase: "the full history" },
  { key: "1Y", days: 365, label: "Last Year", footerPhrase: "the last year" },
  { key: "3M", days: 90, label: "Last 3 months", footerPhrase: "the last 3 months" },
  { key: "30D", days: 30, label: "Last 30 days", footerPhrase: "the last 30 days" },
  { key: "7D", days: 7, label: "Last 7 days", footerPhrase: "the last 7 days" }
] as const;

export type ChartRangeKey = (typeof CHART_RANGE_OPTIONS)[number]["key"];

export const DEFAULT_CHART_RANGE_KEY: ChartRangeKey = "30D";
