// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";

import { ChartRangeToggle } from "@/components/charts/ChartRangeToggle";
import { fireEvent, render, screen } from "@testing-library/react";

const OPTIONS = [
  { key: "7D", days: 7, label: "Last 7 Days" },
  { key: "30D", days: 30, label: "Last 30 Days" },
  { key: "All", days: Number.MAX_SAFE_INTEGER, label: "All Time" }
];

describe(ChartRangeToggle.name, () => {
  it("shows the current value's label in the dropdown trigger", () => {
    setup({ value: "30D" });

    expect(screen.getByRole("combobox")).toHaveTextContent("Last 30 Days");
  });

  it("lists every option, marking the current value's option checked", () => {
    setup({ value: "30D" });

    openDropdown();

    expect(screen.getByRole("option", { name: "Last 7 Days" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Last 30 Days" })).toHaveAttribute("data-state", "checked");
    expect(screen.getByRole("option", { name: "All Time" })).toBeInTheDocument();
  });

  it("reports the selected option's key", () => {
    const { onValueChange } = setup({ value: "30D" });

    openDropdown();
    const option = screen.getByRole("option", { name: "All Time" });
    ["pointerdown", "mousedown", "pointerup", "mouseup", "click"].forEach(type => fireEvent(option, new MouseEvent(type, { bubbles: true })));

    expect(onValueChange).toHaveBeenCalledWith("All");
  });

  function openDropdown() {
    const trigger = screen.getByRole("combobox");
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "Enter" });
  }

  function setup(input: { value: string }) {
    const onValueChange = vi.fn();
    const result = render(<ChartRangeToggle options={OPTIONS} value={input.value} onValueChange={onValueChange} />);

    return { onValueChange, ...result };
  }
});
