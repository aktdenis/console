import type { ReactNode } from "react";
import { FormattedNumber } from "react-intl";

import { AKTLabel } from "@/components/AKTLabel";
import { ACTLabel } from "@/components/UsdLabel";
import { Snapshots } from "@/types";

export type SpendDenom = {
  key: string;
  snapshotKey: Snapshots;
  tabLabel: string;
  titlePrefix: string;
  chartLabel: string;
  description: string;
  totalTooltip: string;
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
  formatTotal: value => <FormattedNumber value={value} style="currency" currency="USD" notation="compact" maximumFractionDigits={2} />,
  formatAmount: value => <FormattedNumber value={value} style="currency" currency="USD" notation="compact" maximumFractionDigits={2} />,
  formatTooltipAmount: value => <FormattedNumber value={value} style="currency" currency="USD" maximumFractionDigits={2} />
};
