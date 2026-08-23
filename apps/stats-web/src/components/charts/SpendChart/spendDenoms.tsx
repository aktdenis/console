import type { ReactNode } from "react";
import { FormattedNumber } from "react-intl";

import { AKTLabel } from "@/components/AKTLabel";
import { ACTLabel } from "@/components/UsdLabel";
import { udenomToDenom } from "@/lib/mathHelpers";
import { Snapshots } from "@/types";

export type SpendDenom = {
  key: string;
  snapshotKey: Snapshots;
  tabLabel: string;
  titlePrefix: string;
  chartLabel: string;
  description: string;
  totalTooltip: string;
  /** Converts a raw snapshot value into the unit formatAmount/formatTotal expect. */
  toDisplayValue: (value: number) => number;
  formatTotal: (value: number) => ReactNode;
  formatAmount: (value: number) => ReactNode;
  formatTooltipAmount: (value: number) => ReactNode;
};

export const AKT_DENOM: SpendDenom = {
  key: "akt",
  snapshotKey: Snapshots.dailyUAktSpent,
  tabLabel: "AKT Spent",
  titlePrefix: "AKT Spent",
  chartLabel: "Daily AKT Spent",
  description: "Lease settlement per day, AKT equivalent",
  totalTooltip: "Total AKT spent to rent computing power on the Akash network since the beginning of the network (March 2021).",
  toDisplayValue: udenomToDenom,
  formatTotal: value => <FormattedNumber value={value} notation="compact" maximumFractionDigits={2} />,
  formatAmount: value => (
    <>
      <FormattedNumber value={value} notation="compact" maximumFractionDigits={2} />
      <AKTLabel />
    </>
  ),
  formatTooltipAmount: value => (
    <>
      <FormattedNumber value={value} maximumFractionDigits={2} /> AKT
    </>
  )
};

export const ACT_DENOM: SpendDenom = {
  key: "act",
  snapshotKey: Snapshots.dailyUActSpent,
  tabLabel: "ACT Spent",
  titlePrefix: "ACT Spent",
  chartLabel: "Daily ACT Spent",
  description: "Lease settlement per day, ACT equivalent",
  totalTooltip: "Total ACT spent to rent computing power on the Akash network (includes historical USDC at 1:1).",
  toDisplayValue: udenomToDenom,
  formatTotal: value => <FormattedNumber value={value} style="currency" currency="USD" notation="compact" maximumFractionDigits={2} />,
  formatAmount: value => (
    <>
      <FormattedNumber value={value} style="currency" currency="USD" notation="compact" maximumFractionDigits={2} />
      <ACTLabel />
    </>
  ),
  formatTooltipAmount: value => (
    <>
      <FormattedNumber value={value} style="currency" currency="USD" maximumFractionDigits={2} /> ACT
    </>
  )
};

export const USD_DENOM: SpendDenom = {
  key: "usd",
  snapshotKey: Snapshots.dailyUUsdSpent,
  tabLabel: "USD Spent",
  titlePrefix: "USD Spent",
  chartLabel: "Daily USD Spent",
  description: "Lease settlement per day, USD equivalent",
  totalTooltip:
    "This is the total amount spent (ACT + AKT converted to USD) to rent computing power on the akash network since the beginning of the network. (March 2021)",
  toDisplayValue: udenomToDenom,
  formatTotal: value => <FormattedNumber value={value} style="currency" currency="USD" notation="compact" maximumFractionDigits={2} />,
  formatAmount: value => <FormattedNumber value={value} style="currency" currency="USD" notation="compact" maximumFractionDigits={2} />,
  formatTooltipAmount: value => <FormattedNumber value={value} style="currency" currency="USD" maximumFractionDigits={2} />
};

export const LEASE_COUNT_DENOM: SpendDenom = {
  key: "leases",
  snapshotKey: Snapshots.activeLeaseCount,
  tabLabel: "Active Leases",
  titlePrefix: "Active Leases",
  chartLabel: "Active Leases",
  description: "Open leases per day",
  totalTooltip: "The number of leases currently active on the network.",
  toDisplayValue: value => value,
  formatTotal: value => <FormattedNumber value={value} notation="compact" compactDisplay="short" />,
  formatAmount: value => <FormattedNumber value={value} notation="compact" compactDisplay="short" />,
  formatTooltipAmount: value => <FormattedNumber value={value} />
};

/** CPU is stored in millicores; toDisplayValue converts to whole cores. */
export const COMPUTE_DENOM: SpendDenom = {
  key: "compute",
  snapshotKey: Snapshots.activeCPU,
  tabLabel: "Compute",
  titlePrefix: "Compute",
  chartLabel: "Leased CPU",
  description: "Leased CPU per day",
  totalTooltip: "Currently leased CPU capacity across all active deployments.",
  toDisplayValue: value => value / 1000,
  formatTotal: value => <FormattedNumber value={value} maximumFractionDigits={2} notation="compact" compactDisplay="short" />,
  formatAmount: value => (
    <>
      <FormattedNumber value={value} maximumFractionDigits={2} notation="compact" compactDisplay="short" />
      <span className="text-sm font-normal"> CPU</span>
    </>
  ),
  formatTooltipAmount: value => (
    <>
      <FormattedNumber value={value} maximumFractionDigits={2} /> CPU
    </>
  )
};

export const GRAPHICS_DENOM: SpendDenom = {
  key: "graphics",
  snapshotKey: Snapshots.activeGPU,
  tabLabel: "Graphics",
  titlePrefix: "Graphics",
  chartLabel: "Leased GPU",
  description: "Leased GPUs per day",
  totalTooltip: "Currently leased GPUs across all active deployments.",
  toDisplayValue: value => value,
  formatTotal: value => <FormattedNumber value={value} maximumFractionDigits={2} notation="compact" compactDisplay="short" />,
  formatAmount: value => (
    <>
      <FormattedNumber value={value} maximumFractionDigits={2} notation="compact" compactDisplay="short" />
      <span className="text-sm font-normal"> GPU</span>
    </>
  ),
  formatTooltipAmount: value => (
    <>
      <FormattedNumber value={value} maximumFractionDigits={2} /> GPU
    </>
  )
};

/** Bytes stored raw; toDisplayValue fixes the series to decimal TB so the chart's own unit never shifts point to point. */
export const MEMORY_DENOM: SpendDenom = {
  key: "memory",
  snapshotKey: Snapshots.activeMemory,
  tabLabel: "Memory",
  titlePrefix: "Memory",
  chartLabel: "Leased Memory",
  description: "Leased memory per day, TB",
  totalTooltip: "Currently leased memory across all active deployments.",
  toDisplayValue: value => value / 1_000_000_000_000,
  formatTotal: value => <FormattedNumber value={value} maximumFractionDigits={2} notation="compact" compactDisplay="short" />,
  formatAmount: value => (
    <>
      <FormattedNumber value={value} maximumFractionDigits={2} notation="compact" compactDisplay="short" />
      <span className="text-sm font-normal"> TB</span>
    </>
  ),
  formatTooltipAmount: value => (
    <>
      <FormattedNumber value={value} maximumFractionDigits={2} /> TB
    </>
  )
};

export const STORAGE_DENOM: SpendDenom = {
  key: "storage",
  snapshotKey: Snapshots.activeStorage,
  tabLabel: "Storage",
  titlePrefix: "Storage",
  chartLabel: "Leased Storage",
  description: "Leased storage per day, TB",
  totalTooltip: "Currently leased storage across all active deployments.",
  toDisplayValue: value => value / 1_000_000_000_000,
  formatTotal: value => <FormattedNumber value={value} maximumFractionDigits={2} notation="compact" compactDisplay="short" />,
  formatAmount: value => (
    <>
      <FormattedNumber value={value} maximumFractionDigits={2} notation="compact" compactDisplay="short" />
      <span className="text-sm font-normal"> TB</span>
    </>
  ),
  formatTooltipAmount: value => (
    <>
      <FormattedNumber value={value} maximumFractionDigits={2} /> TB
    </>
  )
};
