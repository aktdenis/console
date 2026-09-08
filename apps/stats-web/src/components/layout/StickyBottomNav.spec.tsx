// @vitest-environment jsdom
import { TooltipProvider } from "@akashnetwork/ui/components";
import { describe, expect, it } from "vitest";

import { DEPENDENCIES, StickyBottomNav } from "@/components/layout/StickyBottomNav";
import { render, screen } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

describe(StickyBottomNav.name, () => {
  it("links to every section, including report mode", () => {
    setup({ pathname: "/" });

    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Assets Spent" })).toHaveAttribute("href", "/assets-spent");
    expect(screen.getByRole("link", { name: "Compute Capacity" })).toHaveAttribute("href", "/compute-capacity");
    expect(screen.getByRole("link", { name: "Compute Leased" })).toHaveAttribute("href", "/compute-leased");
    expect(screen.getByRole("link", { name: "BME" })).toHaveAttribute("href", "/bme");
    expect(screen.getByRole("link", { name: "Blockchain" })).toHaveAttribute("href", "/blockchain");
    expect(screen.getByRole("link", { name: "Report Mode" })).toHaveAttribute("href", "/network-report");
  });

  it("marks the link matching the current page as current", () => {
    setup({ pathname: "/blockchain" });

    expect(screen.getByRole("link", { name: "Blockchain" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Overview" })).not.toHaveAttribute("aria-current");
  });

  it("links the akash sign to akash.network in a new tab", () => {
    setup({ pathname: "/" });

    const akashLink = screen.getByRole("link", { name: "Go to akash.network" });
    expect(akashLink).toHaveAttribute("href", "https://akash.network");
    expect(akashLink).toHaveAttribute("target", "_blank");
  });

  function setup(input: { pathname: string }) {
    const dependencies = MockComponents(DEPENDENCIES, { usePathname: () => input.pathname });

    return render(<StickyBottomNav dependencies={dependencies} />, { wrapper: ({ children }) => <TooltipProvider>{children}</TooltipProvider> });
  }
});
