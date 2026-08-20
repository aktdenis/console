// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { describe, expect, it } from "vitest";

import { DailySpendChart, type DailySpendChartProps, DEPENDENCIES } from "@/components/charts/DailySpendChart/DailySpendChart";
import type { SnapshotValue } from "@/types";
import { render } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

function daysOfSnapshots(count: number): SnapshotValue[] {
  return Array.from({ length: count }, (_, i) => ({
    date: `2026-07-${String((i % 28) + 1).padStart(2, "0")}`,
    value: (i + 1) * 1_000_000
  }));
}

describe(DailySpendChart.name, () => {
  it("slices to the default 30-day window when more data is available", () => {
    const { deps } = setup({ completedSnapshots: daysOfSnapshots(45), currentValue: 50_000_000, compareValue: 48_000_000, isFetching: false });

    expect(deps.AreaChart.mock.calls.at(-1)?.at(0)?.data).toHaveLength(30);
  });

  it("passes through all available data when there is less than the default window", () => {
    const { deps } = setup({ completedSnapshots: daysOfSnapshots(10), currentValue: 50_000_000, compareValue: 48_000_000, isFetching: false });

    expect(deps.AreaChart.mock.calls.at(-1)?.at(0)?.data).toHaveLength(10);
  });

  it("converts micro-denominated values before charting", () => {
    const { deps } = setup({ completedSnapshots: [{ date: "2026-07-01", value: 11_618_116_660 }], currentValue: 0, compareValue: 0, isFetching: false });

    expect(deps.AreaChart.mock.calls.at(-1)?.at(0)?.data).toEqual([{ date: "2026-07-01", dailyUsdSpent: 11618.11666 }]);
  });

  it("shows the latest complete day's value with the existing now/compare delta, not the in-progress value", () => {
    const { deps } = setup({
      completedSnapshots: [{ date: "2026-07-01", value: 10_000_000 }],
      currentValue: 12_000_000,
      compareValue: 10_000_000,
      isFetching: false
    });

    expect(deps.DiffPercentageChip.mock.calls.at(-1)?.at(0)).toEqual(expect.objectContaining({ value: 0.2 }));
  });

  it("dims the chart while fetching", () => {
    const { deps } = setup({ completedSnapshots: daysOfSnapshots(5), currentValue: 0, compareValue: 0, isFetching: true });

    expect(deps.ChartContainer).toHaveBeenCalledWith(expect.objectContaining({ className: expect.stringContaining("opacity-80") }), {});
  });

  function setup(props: DailySpendChartProps) {
    const deps = MockComponents(DEPENDENCIES);
    const result = render(<DailySpendChart {...props} dependencies={deps} />, {
      wrapper: ({ children }) => <IntlProvider locale="en-US">{children}</IntlProvider>
    });

    return { deps, ...result };
  }
});
