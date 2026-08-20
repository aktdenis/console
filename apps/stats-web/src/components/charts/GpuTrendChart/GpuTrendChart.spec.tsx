// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { describe, expect, it } from "vitest";

import { DEPENDENCIES, GpuTrendChart, type GpuTrendChartProps } from "@/components/charts/GpuTrendChart/GpuTrendChart";
import type { SnapshotValue } from "@/types";
import { render } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

function daysOfSnapshots(count: number): SnapshotValue[] {
  const start = new Date("2025-01-01T00:00:00.000Z");
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(start);
    date.setUTCDate(date.getUTCDate() + i);
    return { date: date.toISOString().slice(0, 10), value: 180 + i };
  });
}

describe(GpuTrendChart.name, () => {
  it("charts only the completed days - no in-progress point is appended", () => {
    const sample = daysOfSnapshots(5);
    const { deps } = setup({ completedSnapshots: sample, totalGPU: 422, isFetching: false });

    expect(deps.AreaChart.mock.calls.at(-1)?.at(0)?.data).toHaveLength(5);
  });

  it("windows completed days to the last 30 when more history is available", () => {
    const { deps } = setup({ completedSnapshots: daysOfSnapshots(400), totalGPU: 422, isFetching: false });

    expect(deps.AreaChart.mock.calls.at(-1)?.at(0)?.data).toHaveLength(30);
  });

  it("dims the chart while fetching", () => {
    const { deps } = setup({ completedSnapshots: daysOfSnapshots(2), totalGPU: 422, isFetching: true });

    expect(deps.ChartContainer).toHaveBeenCalledWith(expect.objectContaining({ className: expect.stringContaining("opacity-80") }), {});
  });

  it("renders the network-wide total via CardDescription", () => {
    const { deps } = setup({ completedSnapshots: daysOfSnapshots(2), totalGPU: 422, isFetching: false });

    expect(deps.CardDescription).toHaveBeenCalled();
  });

  function setup(props: GpuTrendChartProps) {
    const deps = MockComponents(DEPENDENCIES);
    const result = render(<GpuTrendChart {...props} dependencies={deps} />, {
      wrapper: ({ children }) => <IntlProvider locale="en-US">{children}</IntlProvider>
    });

    return { deps, ...result };
  }
});
