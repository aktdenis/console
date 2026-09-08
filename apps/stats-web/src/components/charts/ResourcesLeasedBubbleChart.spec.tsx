// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { TooltipProvider } from "@akashnetwork/ui/components";
import { describe, expect, it } from "vitest";

import { ResourcesLeasedBubbleChart, type ResourcesLeasedBubbleChartProps } from "@/components/charts/ResourcesLeasedBubbleChart";
import { COMPUTE_DENOM, GRAPHICS_DENOM } from "@/components/charts/SpendChart/spendDenoms";
import type { SnapshotValue } from "@/types";
import { render, screen } from "@testing-library/react";

const BUCKET_LABEL_PATTERN = /^\d{1,2} [A-Z][a-z]{2}$/;

describe(ResourcesLeasedBubbleChart.name, () => {
  it("labels a row for each series entry", () => {
    setup({
      granularityKey: "week",
      series: [
        { denom: COMPUTE_DENOM, completedSnapshots: makeSnapshots(200) },
        { denom: GRAPHICS_DENOM, completedSnapshots: makeSnapshots(200) }
      ]
    });

    expect(screen.getByText("Compute")).toBeInTheDocument();
    expect(screen.getByText("Graphics")).toBeInTheDocument();
  });

  it("shows 12 weekly buckets for the week granularity", () => {
    setup({ granularityKey: "week", series: [{ denom: COMPUTE_DENOM, completedSnapshots: makeSnapshots(200) }] });

    expect(screen.getAllByText(BUCKET_LABEL_PATTERN)).toHaveLength(12);
  });

  it("shows 6 monthly buckets for the month granularity", () => {
    setup({ granularityKey: "month", series: [{ denom: COMPUTE_DENOM, completedSnapshots: makeSnapshots(200) }] });

    expect(screen.getAllByText(BUCKET_LABEL_PATTERN)).toHaveLength(6);
  });

  function makeSnapshots(count: number): SnapshotValue[] {
    return Array.from({ length: count }, (_, i) => ({ date: `2026-${String((i % 12) + 1).padStart(2, "0")}-01`, value: i + 1 }));
  }

  function setup(props: ResourcesLeasedBubbleChartProps) {
    return render(<ResourcesLeasedBubbleChart {...props} />, {
      wrapper: ({ children }) => (
        <IntlProvider locale="en-US">
          <TooltipProvider>{children}</TooltipProvider>
        </IntlProvider>
      )
    });
  }
});
