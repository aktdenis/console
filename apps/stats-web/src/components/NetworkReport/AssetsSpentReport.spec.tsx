// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { describe, expect, it } from "vitest";

import { ACT_DENOM, AKT_DENOM, USD_DENOM } from "@/components/charts/SpendChart/spendDenoms";
import { AssetsSpentReport, DEPENDENCIES } from "@/components/NetworkReport/AssetsSpentReport";
import { render, screen } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

describe(AssetsSpentReport.name, () => {
  it("renders ACT and AKT charts side by side, not behind a tab switcher", () => {
    const { deps } = setup({ viewMode: "chart" });

    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(deps.SpendChartContainer.mock.calls.map(call => call.at(0)?.denom)).toEqual([USD_DENOM, ACT_DENOM, AKT_DENOM]);
  });

  it("passes the current view mode through to every chart", () => {
    const { deps } = setup({ viewMode: "table" });

    for (const call of deps.SpendChartContainer.mock.calls) {
      expect(call.at(0)).toMatchObject({ viewMode: "table" });
    }
  });

  function setup(props: { viewMode: "chart" | "table" }) {
    const deps = MockComponents(DEPENDENCIES);
    const result = render(<AssetsSpentReport {...props} dependencies={deps} />, {
      wrapper: ({ children }) => <IntlProvider locale="en-US">{children}</IntlProvider>
    });

    return { deps, ...result };
  }
});
