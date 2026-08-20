// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { describe, expect, it } from "vitest";

import { ChainStrip, type ChainStripProps } from "@/components/charts/ChainStrip";
import { render, screen } from "@testing-library/react";

const chainStats: ChainStripProps["chainStats"] = {
  height: 28_252_057,
  transactionCount: 39_211_941,
  bondedTokens: 91_730_000_000_000,
  totalSupply: 296_980_000_000_000,
  stakingAPR: 0.0389,
  inflation: 0.04,
  communityPool: 4_460_000_000_000
};

describe(ChainStrip.name, () => {
  it("renders all six labels", () => {
    setup({ chainStats, totalUUsdSpent: 5_910_000_000_000, totalLeaseCount: 566_996 });

    ["Block height", "Transactions", "Bonded", "Staking APR", "Community pool", "All-time spend"].forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("computes the bonded percentage as bondedTokens/totalSupply, matching a hand calculation", () => {
    setup({ chainStats, totalUUsdSpent: 5_910_000_000_000, totalLeaseCount: 566_996 });

    expect(screen.getByText(/30\.9%/)).toBeInTheDocument();
  });

  it("omits the Staking APR card when stakingAPR is undefined, matching the existing dashboard guard", () => {
    setup({ chainStats: { ...chainStats, stakingAPR: undefined }, totalUUsdSpent: 5_910_000_000_000, totalLeaseCount: 566_996 });

    expect(screen.queryByText("Staking APR")).not.toBeInTheDocument();
  });

  it("shows all-time spend and lease count from the now period, converted from micro-denominated units", () => {
    setup({ chainStats, totalUUsdSpent: 5_910_000_000_000, totalLeaseCount: 566_996 });

    expect(screen.getByText(/566,996/)).toBeInTheDocument();
  });

  function setup(props: ChainStripProps) {
    return render(<ChainStrip {...props} />, { wrapper: ({ children }) => <IntlProvider locale="en-US">{children}</IntlProvider> });
  }
});
