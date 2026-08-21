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
  it("renders one item per option, showing its full label text", () => {
    setup({ value: "30D" });

    expect(screen.getByText("Last 7 Days")).toBeInTheDocument();
    expect(screen.getByText("Last 30 Days")).toBeInTheDocument();
    expect(screen.getByText("All Time")).toBeInTheDocument();
  });

  it("reports the clicked option's key", () => {
    const { onValueChange } = setup({ value: "30D" });

    fireEvent.click(screen.getByText("All Time"));

    expect(onValueChange).toHaveBeenCalledWith("All");
  });

  it("does not report a deselect when the already-active option is clicked again", () => {
    const { onValueChange } = setup({ value: "30D" });

    fireEvent.click(screen.getByText("Last 30 Days"));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  function setup(input: { value: string }) {
    const onValueChange = vi.fn();
    const result = render(<ChartRangeToggle options={OPTIONS} value={input.value} onValueChange={onValueChange} />);

    return { onValueChange, ...result };
  }
});
