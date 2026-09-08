import {
  ACT_BURNED_FOR_AKT_DENOM,
  ACT_DENOM,
  ACT_MINTED_DENOM,
  AKT_BURNED_FOR_ACT_DENOM,
  AKT_DENOM,
  AKT_REMINTED_DENOM,
  COLLATERAL_RATIO_DENOM,
  COMPUTE_DENOM,
  GRAPHICS_DENOM,
  LEASE_COUNT_DENOM,
  MEMORY_DENOM,
  NET_AKT_BURNED_DENOM,
  OUTSTANDING_ACT_DENOM,
  type SpendDenom,
  STORAGE_DENOM,
  USD_DENOM,
  VAULT_AKT_DENOM
} from "@/components/charts/SpendChart/spendDenoms";

export type CompareMetricGroup = {
  label: string;
  metrics: SpendDenom[];
};

/** Only metrics backed by a daily {date,value} snapshot series are comparable - point-in-time tables (network/leased capacity, GPU pricing, blockchain stats) have no trend to overlay. */
export const COMPARE_METRIC_GROUPS: CompareMetricGroup[] = [
  { label: "Assets Spent", metrics: [USD_DENOM, ACT_DENOM, AKT_DENOM] },
  { label: "Compute Leased", metrics: [LEASE_COUNT_DENOM, COMPUTE_DENOM, GRAPHICS_DENOM, MEMORY_DENOM, STORAGE_DENOM] },
  {
    label: "BME",
    metrics: [
      OUTSTANDING_ACT_DENOM,
      VAULT_AKT_DENOM,
      NET_AKT_BURNED_DENOM,
      COLLATERAL_RATIO_DENOM,
      AKT_BURNED_FOR_ACT_DENOM,
      ACT_MINTED_DENOM,
      ACT_BURNED_FOR_AKT_DENOM,
      AKT_REMINTED_DENOM
    ]
  }
];

export const ALL_COMPARE_METRICS: SpendDenom[] = COMPARE_METRIC_GROUPS.flatMap(group => group.metrics);

export const MAX_COMPARE_METRICS = 4;

export type ComparePreset = {
  label: string;
  metricKeys: string[];
};

export const COMPARE_PRESETS: ComparePreset[] = [
  { label: "USD Spent vs Compute Leased", metricKeys: [USD_DENOM.key, COMPUTE_DENOM.key] },
  { label: "USD Spent vs Active Leases", metricKeys: [USD_DENOM.key, LEASE_COUNT_DENOM.key] },
  { label: "Leased GPU vs Leased Compute", metricKeys: [GRAPHICS_DENOM.key, COMPUTE_DENOM.key] },
  { label: "AKT Burned for ACT vs ACT Minted", metricKeys: [AKT_BURNED_FOR_ACT_DENOM.key, ACT_MINTED_DENOM.key] }
];

/** Matches the shadcn chart-1..5 theme tokens already defined for this app, so compare colors stay on-palette in both themes. */
export const COMPARE_SERIES_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];
