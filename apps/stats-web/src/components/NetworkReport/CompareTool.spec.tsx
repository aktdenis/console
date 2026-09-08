// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { describe, expect, it, vi } from "vitest";

import { AKT_DENOM, COMPUTE_DENOM, LEASE_COUNT_DENOM, MEMORY_DENOM, NET_AKT_BURNED_DENOM, USD_DENOM } from "@/components/charts/SpendChart/spendDenoms";
import { CompareTool, DEPENDENCIES } from "@/components/NetworkReport/CompareTool";
import type { GraphResponse } from "@/types";
import { fireEvent, render, screen } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

function snapshotResponse(count: number): GraphResponse {
  return {
    snapshots: Array.from({ length: count }, (_, i) => ({ date: `2026-08-${String(i + 1).padStart(2, "0")}`, value: (i + 1) * 10 })),
    currentValue: 0,
    compareValue: 0
  };
}

describe(CompareTool.name, () => {
  it("defaults to the first preset's metrics as chips", () => {
    setup({ viewMode: "chart" });

    expect(screen.getByRole("button", { name: USD_DENOM.tabLabel })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: COMPUTE_DENOM.tabLabel })).toBeInTheDocument();
  });

  it("fetches exactly the snapshot keys for the currently selected metrics", () => {
    const { deps } = setup({ viewMode: "chart" });

    expect(deps.useGraphSnapshots).toHaveBeenCalledWith([USD_DENOM.snapshotKey, COMPUTE_DENOM.snapshotKey]);
  });

  it("switches the fetched metrics when a different preset is clicked", () => {
    const { deps } = setup({ viewMode: "chart" });

    fireEvent.click(screen.getByRole("button", { name: "USD Spent vs Active Leases" }));

    expect(deps.useGraphSnapshots).toHaveBeenLastCalledWith([USD_DENOM.snapshotKey, LEASE_COUNT_DENOM.snapshotKey]);
  });

  it("removes a metric when its chip is clicked", () => {
    setup({ viewMode: "chart" });

    fireEvent.click(screen.getByRole("button", { name: COMPUTE_DENOM.tabLabel }));

    expect(screen.queryByRole("button", { name: COMPUTE_DENOM.tabLabel })).not.toBeInTheDocument();
    expect(screen.getByText("Select at least 2 metrics to compare.")).toBeInTheDocument();
  });

  it("checks a metric in the picker when added, up to the cap", () => {
    setup({ viewMode: "chart" });
    openPicker();

    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: AKT_DENOM.tabLabel }));
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: NET_AKT_BURNED_DENOM.tabLabel }));

    expect(screen.getByRole("menuitemcheckbox", { name: AKT_DENOM.tabLabel })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("menuitemcheckbox", { name: NET_AKT_BURNED_DENOM.tabLabel })).toHaveAttribute("aria-checked", "true");
  });

  it("ignores a further click once 4 metrics are already selected", () => {
    setup({ viewMode: "chart" });
    openPicker();

    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: AKT_DENOM.tabLabel }));
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: NET_AKT_BURNED_DENOM.tabLabel }));
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: MEMORY_DENOM.tabLabel }));

    expect(screen.getByRole("menuitemcheckbox", { name: MEMORY_DENOM.tabLabel })).toHaveAttribute("aria-checked", "false");
  });

  it("renders one chart line per selected metric in chart mode", () => {
    const { deps } = setup({ viewMode: "chart" });

    expect(deps.Line.mock.calls).toHaveLength(2);
    expect(deps.LineChart).toHaveBeenCalled();
  });

  it("renders a comparison table instead of a chart in table mode", () => {
    setup({ viewMode: "table" });

    expect(screen.getByRole("columnheader", { name: USD_DENOM.tabLabel })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: COMPUTE_DENOM.tabLabel })).toBeInTheDocument();
  });

  it("shows a download button next to the range toggle", () => {
    setup({ viewMode: "chart" });

    expect(screen.getByRole("button", { name: "Download chart" })).toBeInTheDocument();
  });

  function openPicker() {
    const trigger = screen.getByRole("button", { name: "Add metric" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "Enter" });
  }

  function setup(props: { viewMode: "chart" | "table" }) {
    const deps = MockComponents(DEPENDENCIES, {
      useGraphSnapshots: vi.fn((snapshots: string[]) =>
        snapshots.map(() => ({ data: snapshotResponse(10), isLoading: false }))
      ) as unknown as typeof DEPENDENCIES.useGraphSnapshots,
      LineChart: vi.fn(({ children }: any) => <svg>{children}</svg>) as unknown as typeof DEPENDENCIES.LineChart
    });
    const result = render(<CompareTool {...props} dependencies={deps} />, {
      wrapper: ({ children }) => <IntlProvider locale="en-US">{children}</IntlProvider>
    });

    return { deps, ...result };
  }
});
