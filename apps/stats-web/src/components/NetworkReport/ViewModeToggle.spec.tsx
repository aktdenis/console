// @vitest-environment jsdom
import { TooltipProvider } from "@akashnetwork/ui/components";
import { describe, expect, it, vi } from "vitest";

import { ViewModeToggle } from "@/components/NetworkReport/ViewModeToggle";
import { fireEvent, render, screen } from "@testing-library/react";

describe(ViewModeToggle.name, () => {
  it("marks the current value's option checked", () => {
    setup({ value: "chart" });

    expect(screen.getByRole("radio", { name: "Chart view" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Table view" })).toHaveAttribute("aria-checked", "false");
  });

  it("reports table when the table option is clicked", () => {
    const { onValueChange } = setup({ value: "chart" });

    fireEvent.click(screen.getByRole("radio", { name: "Table view" }));

    expect(onValueChange).toHaveBeenCalledWith("table");
  });

  it("still reports chart when the already-active chart option is clicked", () => {
    const { onValueChange } = setup({ value: "chart" });

    fireEvent.click(screen.getByRole("radio", { name: "Chart view" }));

    expect(onValueChange).toHaveBeenCalledWith("chart");
  });

  function setup(input: { value: "chart" | "table" }) {
    const onValueChange = vi.fn();
    const result = render(<ViewModeToggle value={input.value} onValueChange={onValueChange} />, {
      wrapper: ({ children }) => <TooltipProvider>{children}</TooltipProvider>
    });
    return { onValueChange, ...result };
  }
});
