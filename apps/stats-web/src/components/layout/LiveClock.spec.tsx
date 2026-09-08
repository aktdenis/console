// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";

import { LiveClock } from "@/components/layout/LiveClock";
import { render, screen } from "@testing-library/react";

describe(LiveClock.name, () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the digital time and rotates the hands to match, for a UTC moment", () => {
    setup({ isoDate: "2024-01-01T12:34:00Z" });

    expect(screen.getByText("12:34")).toBeInTheDocument();
    const [hourHand, minuteHand] = document.querySelectorAll("line");
    expect(hourHand).toHaveAttribute("transform", "rotate(17 50 50)");
    expect(minuteHand).toHaveAttribute("transform", "rotate(204 50 50)");
  });

  it("zero-pads single-digit hours and minutes", () => {
    setup({ isoDate: "2024-01-01T03:05:00Z" });

    expect(screen.getByText("03:05")).toBeInTheDocument();
  });

  it("reads the time in the given timezone rather than the host's local time", () => {
    setup({ isoDate: "2024-01-01T23:15:00Z", timeZone: "Pacific/Kiritimati" });

    expect(screen.getByText("13:15")).toBeInTheDocument();
  });

  function setup(input: { isoDate: string; timeZone?: string }) {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(input.isoDate));

    return render(<LiveClock timeZone={input.timeZone ?? "UTC"} timeZoneLabel="UTC" />);
  }
});
