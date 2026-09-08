// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { TooltipProvider } from "@akashnetwork/ui/components";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import { DEPENDENCIES, ResourcesLeasedSection } from "@/components/charts/ResourcesLeasedSection";
import { COMPUTE_DENOM, GRAPHICS_DENOM, MEMORY_DENOM, STORAGE_DENOM } from "@/components/charts/SpendChart/spendDenoms";
import type { DashboardBlockStats } from "@/types";
import { fireEvent, render, screen } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

describe(ResourcesLeasedSection.name, () => {
  it("orders the tabs compute, graphics, memory, storage, with compute active by default", () => {
    setup({ now: mock<DashboardBlockStats>(), compare: mock<DashboardBlockStats>() });

    const resourceTabs = screen.getAllByRole("tab").filter(tab => tab.hasAttribute("aria-label"));
    expect(resourceTabs.map(tab => tab.getAttribute("aria-label"))).toEqual(["Compute", "Graphics", "Memory", "Storage"]);
    expect(screen.getByRole("tab", { name: "Compute" })).toHaveAttribute("data-state", "active");
  });

  it("shows the classic per-resource tabs by default and switches to the bubble chart view", () => {
    const { deps } = setup({ now: mock<DashboardBlockStats>(), compare: mock<DashboardBlockStats>() });

    expect(screen.getByRole("tab", { name: "Compute" })).toBeInTheDocument();
    expect(deps.ResourcesLeasedBubbleChartContainer).not.toHaveBeenCalled();

    selectView("Bubble");

    expect(screen.queryByRole("tab", { name: "Compute" })).not.toBeInTheDocument();
    expect(deps.ResourcesLeasedBubbleChartContainer).toHaveBeenCalled();
  });

  it("shows a checkmark next to the active view in the view dropdown", () => {
    setup({ now: mock<DashboardBlockStats>(), compare: mock<DashboardBlockStats>() });

    const trigger = screen.getByRole("button", { name: "Classic" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "Enter" });

    expect(screen.getByRole("menuitem", { name: /^Classic/ })).toHaveTextContent("Classic");
    expect(screen.getByRole("menuitem", { name: /^Bubble/ })).toBeInTheDocument();
  });

  it("shows the become-a-provider CTA below the resources card", () => {
    const { deps } = setup({ now: mock<DashboardBlockStats>(), compare: mock<DashboardBlockStats>() });

    expect(deps.NetworkProviderCta).toHaveBeenCalled();
  });

  it("shows the GPU price list above the become-a-provider CTA", () => {
    const { deps } = setup({ now: mock<DashboardBlockStats>(), compare: mock<DashboardBlockStats>() });

    expect(deps.GpuPriceListContainer).toHaveBeenCalled();
    const gpuPriceListCallOrder = vi.mocked(deps.GpuPriceListContainer).mock.invocationCallOrder[0];
    const ctaCallOrder = vi.mocked(deps.NetworkProviderCta).mock.invocationCallOrder[0];
    expect(gpuPriceListCallOrder).toBeLessThan(ctaCallOrder);
  });

  it("hides the week/month granularity toggle in classic view and shows it in bubble view, defaulting to week", () => {
    const { deps } = setup({ now: mock<DashboardBlockStats>(), compare: mock<DashboardBlockStats>() });

    expect(screen.queryByText("Week")).not.toBeInTheDocument();

    selectView("Bubble");

    expect(screen.getByRole("combobox")).toHaveTextContent("Week");
    expect(deps.ResourcesLeasedBubbleChartContainer.mock.calls.at(-1)?.at(0)).toEqual({ granularityKey: "week" });
  });

  it("passes the selected granularity through to the bubble chart container", () => {
    const { deps } = setup({ now: mock<DashboardBlockStats>(), compare: mock<DashboardBlockStats>() });

    selectView("Bubble");
    selectGranularity("Month");

    expect(deps.ResourcesLeasedBubbleChartContainer.mock.calls.at(-1)?.at(0)).toEqual({ granularityKey: "month" });
  });

  it("shows compute's leased CPU by default, converted from millicores to cores, not the other resources'", () => {
    const { deps } = setup({ now: mock<DashboardBlockStats>({ activeCPU: 3_850_000, activeGPU: 167 }), compare: mock<DashboardBlockStats>() });

    expect(screen.getByText("3.85K")).toBeInTheDocument();
    expect(deps.SpendChartContainer.mock.calls.find(call => call.at(0)?.denom === COMPUTE_DENOM)).toBeDefined();
  });

  it("switches to graphics's leased count and chart when the Graphics tab is selected, as a raw count", () => {
    const { deps } = setup({ now: mock<DashboardBlockStats>({ activeCPU: 3_850_000, activeGPU: 167 }), compare: mock<DashboardBlockStats>() });

    fireEvent.mouseDown(screen.getByRole("tab", { name: "Graphics" }));

    expect(screen.getByText("167")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Graphics" })).toHaveAttribute("data-state", "active");
    expect(deps.SpendChartContainer.mock.calls.find(call => call.at(0)?.denom === GRAPHICS_DENOM)).toBeDefined();
  });

  it("switches to memory's leased amount and chart when the Memory tab is selected, converted from bytes to TB", () => {
    const { deps } = setup({ now: mock<DashboardBlockStats>({ activeMemory: 16_000_000_000_000 }), compare: mock<DashboardBlockStats>() });

    fireEvent.mouseDown(screen.getByRole("tab", { name: "Memory" }));

    expect(screen.getByText("16")).toBeInTheDocument();
    expect(deps.SpendChartContainer.mock.calls.find(call => call.at(0)?.denom === MEMORY_DENOM)).toBeDefined();
  });

  it("switches to storage's leased amount and chart when the Storage tab is selected, converted from bytes to TB", () => {
    const { deps } = setup({ now: mock<DashboardBlockStats>({ activeStorage: 53_000_000_000_000 }), compare: mock<DashboardBlockStats>() });

    fireEvent.mouseDown(screen.getByRole("tab", { name: "Storage" }));

    expect(screen.getByText("53")).toBeInTheDocument();
    expect(deps.SpendChartContainer.mock.calls.find(call => call.at(0)?.denom === STORAGE_DENOM)).toBeDefined();
  });

  it("joins each chart to the tabs above it, with no gap and no double border between them", () => {
    const { deps } = setup({ now: mock<DashboardBlockStats>(), compare: mock<DashboardBlockStats>() });

    for (const call of deps.SpendChartContainer.mock.calls) {
      expect(call.at(0)).toMatchObject({ className: "rounded-t-none border-t-0" });
    }
  });

  function selectView(label: "Classic" | "Bubble") {
    const trigger = screen.getByRole("button", { name: "Classic" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "Enter" });
    fireEvent.click(screen.getByRole("menuitem", { name: new RegExp(`^${label}`) }));
  }

  function selectGranularity(label: "Week" | "Month") {
    const trigger = screen.getByRole("combobox");
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "Enter" });
    const option = screen.getByRole("option", { name: label });
    ["pointerdown", "mousedown", "pointerup", "mouseup", "click"].forEach(type => fireEvent(option, new MouseEvent(type, { bubbles: true })));
  }

  function setup(props: { now: DashboardBlockStats; compare: DashboardBlockStats }) {
    const deps = MockComponents(DEPENDENCIES);
    const result = render(<ResourcesLeasedSection {...props} dependencies={deps} />, {
      wrapper: ({ children }) => (
        <IntlProvider locale="en-US">
          <TooltipProvider>{children}</TooltipProvider>
        </IntlProvider>
      )
    });

    return { deps, ...props, ...result };
  }
});
