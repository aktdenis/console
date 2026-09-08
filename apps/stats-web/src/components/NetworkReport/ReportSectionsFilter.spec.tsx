// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";

import { ALL_REPORT_SECTION_KEYS } from "@/components/NetworkReport/reportSections";
import { ReportSectionsFilter } from "@/components/NetworkReport/ReportSectionsFilter";
import { fireEvent, render, screen } from "@testing-library/react";

describe(ReportSectionsFilter.name, () => {
  it("shows all sections selected and a zero hidden-count by default", () => {
    setup({ selected: ALL_REPORT_SECTION_KEYS });

    expect(screen.getByRole("button", { name: "All sections" })).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("reports the remaining keys when a section is unchecked", () => {
    const { onChange } = setup({ selected: ALL_REPORT_SECTION_KEYS });

    openFilter();
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: "BME" }));

    expect(onChange).toHaveBeenCalledWith(ALL_REPORT_SECTION_KEYS.filter(key => key !== "bme"));
  });

  it("shows the hidden count and lets Reset filters restore every section", () => {
    const { onChange } = setup({ selected: ["assets-spent", "compute-capacity"] });

    expect(screen.getByText("2 of 6 sections")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reset filters" }));

    expect(onChange).toHaveBeenCalledWith(ALL_REPORT_SECTION_KEYS);
  });

  it("disables Reset filters when nothing is hidden", () => {
    setup({ selected: ALL_REPORT_SECTION_KEYS });

    expect(screen.getByRole("button", { name: "Reset filters" })).toBeDisabled();
  });

  function openFilter() {
    const trigger = screen.getByRole("button", { name: /sections$/ });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "Enter" });
  }

  function setup(input: { selected: typeof ALL_REPORT_SECTION_KEYS }) {
    const onChange = vi.fn();
    const result = render(<ReportSectionsFilter selected={input.selected} onChange={onChange} />);
    return { onChange, ...result };
  }
});
