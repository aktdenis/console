// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { describe, expect, it } from "vitest";

import { COMPUTE_DENOM, GRAPHICS_DENOM, LEASE_COUNT_DENOM, MEMORY_DENOM, STORAGE_DENOM } from "@/components/charts/SpendChart/spendDenoms";
import { ComputeLeasedReport, DEPENDENCIES } from "@/components/NetworkReport/ComputeLeasedReport";
import { render, screen } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

describe(ComputeLeasedReport.name, () => {
  it("renders all four resources as their own chart, not behind a tab switcher", () => {
    const { deps } = setup();

    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(deps.SpendChartContainer.mock.calls.map(call => call.at(0)?.denom)).toEqual([
      LEASE_COUNT_DENOM,
      COMPUTE_DENOM,
      GRAPHICS_DENOM,
      MEMORY_DENOM,
      STORAGE_DENOM
    ]);
  });

  it("defaults the per-resource charts to a 3-month range, matching the dashboard's classic view", () => {
    const { deps } = setup();

    const resourceCalls = deps.SpendChartContainer.mock.calls.slice(1);
    for (const call of resourceCalls) {
      expect(call.at(0)).toMatchObject({ defaultRangeKey: "3M" });
    }
  });

  function setup() {
    const deps = MockComponents(DEPENDENCIES);
    const result = render(<ComputeLeasedReport viewMode="chart" dependencies={deps} />, {
      wrapper: ({ children }) => <IntlProvider locale="en-US">{children}</IntlProvider>
    });

    return { deps, ...result };
  }
});
