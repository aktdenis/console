// @vitest-environment jsdom
import { TooltipProvider } from "@akashnetwork/ui/components";
import { describe, expect, it } from "vitest";

import { StatCardTabs } from "@/components/StatCardTabs";
import { fireEvent, render, screen } from "@testing-library/react";

const ITEMS = [
  { value: "akt", label: "AKT Spent", content: "2.81M AKT", panel: "AKT panel content" },
  { value: "act", label: "ACT Spent", content: "$2.13M ACT", panel: "ACT panel content" }
];

describe(StatCardTabs.name, () => {
  it("shows the default tab's card content and panel, not the other tab's", () => {
    setup({ defaultValue: "akt" });

    expect(screen.getByText("2.81M AKT")).toBeInTheDocument();
    expect(screen.getByText("AKT panel content")).toBeInTheDocument();
    expect(screen.queryByText("ACT panel content")).not.toBeInTheDocument();
  });

  it("switches the panel when a different card is selected", () => {
    setup({ defaultValue: "akt" });

    fireEvent.mouseDown(screen.getByRole("tab", { name: "ACT Spent" }));

    expect(screen.getByText("ACT panel content")).toBeInTheDocument();
    expect(screen.queryByText("AKT panel content")).not.toBeInTheDocument();
  });

  it("marks only the selected card as active", () => {
    setup({ defaultValue: "akt" });

    expect(screen.getByRole("tab", { name: "AKT Spent" })).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("tab", { name: "ACT Spent" })).toHaveAttribute("data-state", "inactive");
  });

  function setup(props: { defaultValue: string }) {
    return render(
      <TooltipProvider>
        <StatCardTabs items={ITEMS} defaultValue={props.defaultValue} />
      </TooltipProvider>
    );
  }
});
