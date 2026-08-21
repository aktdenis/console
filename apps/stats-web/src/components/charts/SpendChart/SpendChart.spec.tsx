// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { describe, expect, it } from "vitest";

import { DEPENDENCIES, SpendChart, type SpendChartProps } from "@/components/charts/SpendChart/SpendChart";
import { ACT_DENOM, AKT_DENOM } from "@/components/charts/SpendChart/spendDenoms";
import type { SnapshotValue } from "@/types";
import { render } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

function daysOfSnapshots(count: number): SnapshotValue[] {
  const start = new Date("2026-07-01T00:00:00Z");
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(start);
    date.setUTCDate(date.getUTCDate() + i);
    return { date: date.toISOString().slice(0, 10), value: (i + 1) * 1_000_000 };
  });
}

describe(SpendChart.name, () => {
  it.each([
    { denom: AKT_DENOM, expectedTitle: "AKT Spent · Last 30 days" },
    { denom: ACT_DENOM, expectedTitle: "ACT Spent · Last 30 days" }
  ])("titles the card with $denom.key's own prefix and the default range", ({ denom, expectedTitle }) => {
    const { container } = setup({ denom, completedSnapshots: daysOfSnapshots(5), currentValue: 0, compareValue: 0, isFetching: false });

    expect(container.textContent).toContain(expectedTitle);
  });

  it("slices to the default 30-day window when more data is available", () => {
    const { deps } = setup({
      denom: AKT_DENOM,
      completedSnapshots: daysOfSnapshots(45),
      currentValue: 50_000_000,
      compareValue: 48_000_000,
      isFetching: false
    });

    expect(deps.AreaChart.mock.calls.at(-1)?.at(0)?.data).toHaveLength(30);
  });

  it("passes through all available data when there is less than the default window", () => {
    const { deps } = setup({
      denom: AKT_DENOM,
      completedSnapshots: daysOfSnapshots(10),
      currentValue: 50_000_000,
      compareValue: 48_000_000,
      isFetching: false
    });

    expect(deps.AreaChart.mock.calls.at(-1)?.at(0)?.data).toHaveLength(10);
  });

  it("converts micro-denominated values before charting", () => {
    const { deps } = setup({
      denom: AKT_DENOM,
      completedSnapshots: [{ date: "2026-07-01", value: 11_618_116_660 }],
      currentValue: 0,
      compareValue: 0,
      isFetching: false
    });

    expect(deps.AreaChart.mock.calls.at(-1)?.at(0)?.data).toEqual([{ date: "2026-07-01", value: 11618.11666 }]);
  });

  it("shows the latest complete day's value with the existing now/compare delta, not the in-progress value", () => {
    const { deps } = setup({
      denom: AKT_DENOM,
      completedSnapshots: [{ date: "2026-07-01", value: 10_000_000 }],
      currentValue: 12_000_000,
      compareValue: 10_000_000,
      isFetching: false
    });

    expect(deps.DiffPercentageChip.mock.calls.at(-1)?.at(0)).toEqual(expect.objectContaining({ value: 0.2 }));
  });

  it("renders the latest value through the denom's own formatter, not a hardcoded currency", () => {
    const { container } = setup({
      denom: ACT_DENOM,
      completedSnapshots: [{ date: "2026-07-01", value: 10_000_000 }],
      currentValue: 10_000_000,
      compareValue: 10_000_000,
      isFetching: false
    });

    expect(container.textContent).toContain("$10");
    expect(container.textContent).toContain("ACT");
  });

  it("dims the chart while fetching", () => {
    const { deps } = setup({ denom: AKT_DENOM, completedSnapshots: daysOfSnapshots(5), currentValue: 0, compareValue: 0, isFetching: true });

    expect(deps.ChartContainer).toHaveBeenCalledWith(expect.objectContaining({ className: expect.stringContaining("opacity-80") }), {});
  });

  function setup(props: SpendChartProps) {
    const deps = MockComponents(DEPENDENCIES);
    const result = render(<SpendChart {...props} dependencies={deps} />, {
      wrapper: ({ children }) => <IntlProvider locale="en-US">{children}</IntlProvider>
    });

    return { deps, ...result };
  }
});
