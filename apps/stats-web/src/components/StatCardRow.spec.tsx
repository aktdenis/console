// @vitest-environment jsdom
import { TooltipProvider } from "@akashnetwork/ui/components";
import { describe, expect, it } from "vitest";

import { StatCardRow } from "@/components/StatCardRow";
import { render, screen } from "@testing-library/react";

describe(StatCardRow.name, () => {
  it("renders one cell per item, in order, with its label and value", () => {
    setup({
      items: [
        { key: "a", label: "AKT Spent", value: "1.2k" },
        { key: "b", label: "ACT Spent", value: "3.4k" }
      ]
    });

    const labels = screen.getAllByText(/Spent/);
    expect(labels.map(el => el.textContent)).toEqual(["AKT Spent", "ACT Spent"]);
    expect(screen.getByText("1.2k")).toBeInTheDocument();
    expect(screen.getByText("3.4k")).toBeInTheDocument();
  });

  it("shows a tooltip icon only for items that provide one", () => {
    const { container } = setup({
      items: [
        { key: "a", label: "AKT Spent", value: "1.2k", tooltip: "Total AKT spent" },
        { key: "b", label: "ACT Spent", value: "3.4k" }
      ]
    });

    expect(container.querySelectorAll("svg")).toHaveLength(1);
  });

  function setup(props: Parameters<typeof StatCardRow>[0]) {
    return render(<StatCardRow {...props} />, { wrapper: ({ children }) => <TooltipProvider>{children}</TooltipProvider> });
  }
});
