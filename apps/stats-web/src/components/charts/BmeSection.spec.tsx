// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";

import { BmeSection, DEPENDENCIES } from "@/components/charts/BmeSection";
import type { BmeStatusHistoryResponse } from "@/queries";
import type { BmeDashboardData } from "@/types";
import { render, screen } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

describe(BmeSection.name, () => {
  it("shows a spinner while either query is loading and there's no data yet", () => {
    setup({
      useBmeDashboardData: () => mock<ReturnType<typeof DEPENDENCIES.useBmeDashboardData>>({ data: undefined, isLoading: true }),
      useBmeStatusHistory: () => mock<ReturnType<typeof DEPENDENCIES.useBmeStatusHistory>>({ data: undefined, isLoading: false })
    });

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders nothing once loading settles with no usable data", () => {
    const { container } = setup({
      useBmeDashboardData: () => mock<ReturnType<typeof DEPENDENCIES.useBmeDashboardData>>({ data: undefined, isLoading: false }),
      useBmeStatusHistory: () => mock<ReturnType<typeof DEPENDENCIES.useBmeStatusHistory>>({ data: undefined, isLoading: false })
    });

    expect(container).toBeEmptyDOMElement();
  });

  it("renders BmeDashboard with the fetched data once both queries resolve", () => {
    const dashboardData = mock<BmeDashboardData>();
    const statusHistory = mock<BmeStatusHistoryResponse>();
    const { deps } = setup({
      useBmeDashboardData: () => mock<ReturnType<typeof DEPENDENCIES.useBmeDashboardData>>({ data: dashboardData, isLoading: false }),
      useBmeStatusHistory: () => mock<ReturnType<typeof DEPENDENCIES.useBmeStatusHistory>>({ data: statusHistory, isLoading: false })
    });

    expect(deps.BmeDashboard.mock.calls.at(0)?.at(0)).toEqual({ dashboardData, statusHistory });
  });

  it("defaults statusHistory to an empty array when it hasn't loaded yet but dashboard data has", () => {
    const dashboardData = mock<BmeDashboardData>();
    const { deps } = setup({
      useBmeDashboardData: () => mock<ReturnType<typeof DEPENDENCIES.useBmeDashboardData>>({ data: dashboardData, isLoading: false }),
      useBmeStatusHistory: () => mock<ReturnType<typeof DEPENDENCIES.useBmeStatusHistory>>({ data: undefined, isLoading: false })
    });

    expect(deps.BmeDashboard.mock.calls.at(0)?.at(0)).toMatchObject({ statusHistory: [] });
  });

  function setup(dependencies: Partial<typeof DEPENDENCIES>) {
    const deps = MockComponents(DEPENDENCIES, dependencies);
    const result = render(<BmeSection dependencies={deps} />);

    return { deps, ...result };
  }
});
