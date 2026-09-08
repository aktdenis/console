// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";

import { BlockchainReport, DEPENDENCIES } from "@/components/NetworkReport/BlockchainReport";
import type { DashboardData } from "@/types";
import { render, screen } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

describe(BlockchainReport.name, () => {
  it("shows blocks and transactions side by side instead of behind a tab switcher", () => {
    const { deps } = setup(mock<DashboardData>()["chainStats"]);

    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(deps.BlocksTable).toHaveBeenCalled();
    expect(deps.TransactionsTable).toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "Blocks" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Transactions" })).toBeInTheDocument();
  });

  it("shows the chain stat row above the tables", () => {
    setup(mock<DashboardData>()["chainStats"]);

    expect(screen.getByText("Height")).toBeInTheDocument();
    expect(screen.getByText("Community Pool")).toBeInTheDocument();
  });

  function setup(chainStats: DashboardData["chainStats"]) {
    const deps = MockComponents(DEPENDENCIES);
    const result = render(<BlockchainReport chainStats={chainStats} dependencies={deps} />, {
      wrapper: ({ children }) => <IntlProvider locale="en-US">{children}</IntlProvider>
    });

    return { deps, ...result };
  }
});
