// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { describe, expect, it } from "vitest";

import { DEPENDENCIES, LeasesTrendChart, type LeasesTrendChartProps } from "@/components/charts/LeasesTrendChart/LeasesTrendChart";
import type { SnapshotValue } from "@/types";
import { render } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

function daysOfSnapshots(count: number): SnapshotValue[] {
  const start = new Date("2025-01-01T00:00:00.000Z");
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(start);
    date.setUTCDate(date.getUTCDate() + i);
    return { date: date.toISOString().slice(0, 10), value: 700 + i };
  });
}

describe(LeasesTrendChart.name, () => {
  it("bands the in-progress day as a distinct, full-opacity cell appended after the completed days", () => {
    const { deps } = setup({ completedSnapshots: daysOfSnapshots(3), currentValue: 800, isFetching: false });

    const chartData = deps.BarChart.mock.calls.at(-1)?.at(0)?.data;
    expect(chartData).toHaveLength(4);
    expect(chartData.at(-1)).toEqual(expect.objectContaining({ activeLeaseCount: 800, isInProgress: true }));

    const cellCalls = deps.Cell.mock.calls;
    expect(cellCalls.at(-1)?.at(0)).toEqual(expect.objectContaining({ fillOpacity: 1 }));
    expect(cellCalls[0]?.at(0)).toEqual(expect.objectContaining({ fillOpacity: 0.32 }));
  });

  it("windows completed days to the last 30 when more history is available", () => {
    const { deps } = setup({ completedSnapshots: daysOfSnapshots(400), currentValue: 800, isFetching: false });

    const chartData = deps.BarChart.mock.calls.at(-1)?.at(0)?.data;
    expect(chartData).toHaveLength(31);
  });

  it("computes the trend across the completed days plus the in-progress point", () => {
    const { deps } = setup({ completedSnapshots: [{ date: "2026-07-01", value: 100 }], currentValue: 150, isFetching: false });

    expect(deps.CardFooter).toHaveBeenCalled();
  });

  function setup(props: LeasesTrendChartProps) {
    const deps = MockComponents(DEPENDENCIES);
    const result = render(<LeasesTrendChart {...props} dependencies={deps} />, {
      wrapper: ({ children }) => <IntlProvider locale="en-US">{children}</IntlProvider>
    });

    return { deps, ...result };
  }
});
