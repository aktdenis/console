// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";

import { BlockchainSection, DEPENDENCIES } from "@/components/charts/BlockchainSection";
import type { DashboardData } from "@/types";
import { fireEvent, render, screen } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

describe(BlockchainSection.name, () => {
  it("shows the chain height, transaction count, community pool, bonded tokens, inflation, and staking APR", () => {
    setup({
      chainStats: mock<DashboardData["chainStats"]>({
        height: 28_260_231,
        transactionCount: 15_000_000,
        communityPool: 500_000_000_000,
        bondedTokens: 200_000_000_000_000,
        inflation: 0.1,
        stakingAPR: 0.15
      })
    });

    expect(screen.getByText("Height")).toBeInTheDocument();
    expect(screen.getByText("28,260,231")).toBeInTheDocument();
    expect(screen.getByText("Transactions", { selector: "span" })).toBeInTheDocument();
    expect(screen.getByText("15,000,000")).toBeInTheDocument();
    expect(screen.getByText("Community Pool")).toBeInTheDocument();
    expect(screen.getByText("Bonded Tokens")).toBeInTheDocument();
    expect(screen.getByText("Inflation")).toBeInTheDocument();
    expect(screen.getByText("10.00%")).toBeInTheDocument();
    expect(screen.getByText("Staking APR")).toBeInTheDocument();
    expect(screen.getByText("15.00%")).toBeInTheDocument();
  });

  it("omits the Staking APR card when it isn't available", () => {
    setup({
      chainStats: mock<DashboardData["chainStats"]>({
        height: 100,
        transactionCount: 100,
        communityPool: 100,
        bondedTokens: 100,
        inflation: 0.1,
        stakingAPR: undefined
      })
    });

    expect(screen.queryByText("Staking APR")).not.toBeInTheDocument();
  });

  it("defaults to the Blocks tab and shows the Blocks table", () => {
    const { deps } = setup({ chainStats: mock<DashboardData["chainStats"]>() });

    expect(screen.getByRole("tab", { name: "Blocks" })).toHaveAttribute("data-state", "active");
    expect(deps.BlocksTable).toHaveBeenCalled();
  });

  it("switches to the Transactions tab and shows the Transactions table", () => {
    const { deps } = setup({ chainStats: mock<DashboardData["chainStats"]>() });

    fireEvent.mouseDown(screen.getByRole("tab", { name: "Transactions" }));

    expect(screen.getByRole("tab", { name: "Transactions" })).toHaveAttribute("data-state", "active");
    expect(deps.TransactionsTable).toHaveBeenCalled();
  });

  it("shows the search bar for looking up an address, block height, or transaction hash", () => {
    const { deps } = setup({ chainStats: mock<DashboardData["chainStats"]>() });

    expect(deps.SearchBar).toHaveBeenCalled();
  });

  function setup(props: { chainStats: DashboardData["chainStats"] }) {
    const deps = MockComponents(DEPENDENCIES);
    const result = render(<BlockchainSection {...props} dependencies={deps} />, {
      wrapper: ({ children }) => <IntlProvider locale="en-US">{children}</IntlProvider>
    });

    return { deps, ...result };
  }
});
