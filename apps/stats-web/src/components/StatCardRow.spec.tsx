// @vitest-environment jsdom
import { TooltipProvider } from "@akashnetwork/ui/components";
import { describe, expect, it } from "vitest";

import { StatCardRow } from "@/components/StatCardRow";
import { render, screen } from "@testing-library/react";

const ITEMS = [
  { key: "daily", label: "USD Spent (24h)", tooltip: "Amount spent in the last 24h.", content: "$11,231.89" },
  { key: "total", label: "Total spent USD", content: "$568K" }
];

describe(StatCardRow.name, () => {
  it("renders every item's label and content", () => {
    setup({ items: ITEMS });

    expect(screen.getByText("USD Spent (24h)")).toBeInTheDocument();
    expect(screen.getByText("$11,231.89")).toBeInTheDocument();
    expect(screen.getByText("Total spent USD")).toBeInTheDocument();
    expect(screen.getByText("$568K")).toBeInTheDocument();
  });

  it("only shows an info icon for items with a tooltip", () => {
    setup({ items: ITEMS });

    const dailyCard = screen.getByText("USD Spent (24h)").closest("div");
    const totalCard = screen.getByText("Total spent USD").closest("div");
    expect(dailyCard?.querySelector("svg")).not.toBeNull();
    expect(totalCard?.querySelector("svg")).toBeNull();
  });

  function setup(props: { items: typeof ITEMS }) {
    return render(
      <TooltipProvider>
        <StatCardRow items={props.items} />
      </TooltipProvider>
    );
  }
});
