// @vitest-environment jsdom
import { describe, expect, it } from "vitest";

import { DEPENDENCIES, SnapshotAreaChart, type SnapshotAreaChartProps } from "@/components/charts/SnapshotAreaChart/SnapshotAreaChart";
import { render } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

describe(SnapshotAreaChart.name, () => {
  it("renders the title and description", () => {
    const { deps } = setup({ title: "Daily Spend", description: "Last 30 days", seriesLabel: "USD", data: [], isFetching: false });

    expect(deps.CardTitle).toHaveBeenCalledWith(expect.objectContaining({ children: "Daily Spend" }), {});
    expect(deps.CardDescription).toHaveBeenCalledWith(expect.objectContaining({ children: "Last 30 days" }), {});
  });

  it("passes the series data through to the area chart", () => {
    const sample = [{ date: "2026-08-01", value: 100 }];
    const { deps } = setup({ title: "Daily Spend", description: "Last 30 days", seriesLabel: "USD", data: sample, isFetching: false });

    expect(deps.AreaChart.mock.calls.at(-1)?.at(0)?.data).toEqual(sample);
  });

  it("applies pointer-events-none to the chart container while fetching", () => {
    const { deps } = setup({ title: "Daily Spend", description: "Last 30 days", seriesLabel: "USD", data: [], isFetching: true });

    expect(deps.ChartContainer).toHaveBeenCalledWith(expect.objectContaining({ className: expect.stringContaining("pointer-events-none") }), {});
  });

  function setup(props: SnapshotAreaChartProps) {
    const deps = MockComponents(DEPENDENCIES);
    render(<SnapshotAreaChart {...props} dependencies={deps} />);

    return { deps };
  }
});
