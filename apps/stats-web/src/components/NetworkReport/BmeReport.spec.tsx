// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";

import {
  ACT_BURNED_FOR_AKT_DENOM,
  ACT_MINTED_DENOM,
  AKT_BURNED_FOR_ACT_DENOM,
  AKT_REMINTED_DENOM,
  COLLATERAL_RATIO_DENOM,
  NET_AKT_BURNED_DENOM,
  OUTSTANDING_ACT_DENOM,
  VAULT_AKT_DENOM
} from "@/components/charts/SpendChart/spendDenoms";
import { BmeReport, DEPENDENCIES } from "@/components/NetworkReport/BmeReport";
import type { BmeDashboardData } from "@/types";
import { render, screen } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

describe(BmeReport.name, () => {
  it("shows a spinner while loading with no data yet", () => {
    setup({ useBmeDashboardData: () => mock<ReturnType<typeof DEPENDENCIES.useBmeDashboardData>>({ data: undefined, isLoading: true }) });

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders nothing once loading settles with no usable data", () => {
    const { container } = setup({
      useBmeDashboardData: () => mock<ReturnType<typeof DEPENDENCIES.useBmeDashboardData>>({ data: undefined, isLoading: false })
    });

    expect(container).toBeEmptyDOMElement();
  });

  it("groups every metric as a chart, not behind a tab switcher, once data loads", () => {
    const { deps } = setup({
      useBmeDashboardData: () => mock<ReturnType<typeof DEPENDENCIES.useBmeDashboardData>>({ data: mock<BmeDashboardData>(), isLoading: false })
    });

    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(deps.SpendChartContainer.mock.calls.map(call => call.at(0)?.denom)).toEqual([
      OUTSTANDING_ACT_DENOM,
      VAULT_AKT_DENOM,
      NET_AKT_BURNED_DENOM,
      COLLATERAL_RATIO_DENOM,
      AKT_BURNED_FOR_ACT_DENOM,
      ACT_MINTED_DENOM,
      ACT_BURNED_FOR_AKT_DENOM,
      AKT_REMINTED_DENOM
    ]);
  });

  function setup(dependencies: Partial<typeof DEPENDENCIES>) {
    const deps = MockComponents(DEPENDENCIES, dependencies);
    const result = render(<BmeReport viewMode="chart" dependencies={deps} />);

    return { deps, ...result };
  }
});
