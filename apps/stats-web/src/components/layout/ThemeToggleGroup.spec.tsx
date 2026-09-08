// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import type { DEPENDENCIES } from "@/components/layout/ThemeToggleGroup";
import { ThemeToggleGroup } from "@/components/layout/ThemeToggleGroup";
import { fireEvent, render, screen } from "@testing-library/react";

describe(ThemeToggleGroup.name, () => {
  it("marks the current theme's button as pressed", () => {
    setup({ theme: "dark" });

    expect(screen.getByRole("button", { name: "Dark" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Light" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "System" })).toHaveAttribute("aria-pressed", "false");
  });

  it("switches theme and persists it to a cookie when a different option is clicked", () => {
    const { setTheme } = setup({ theme: "dark" });
    document.cookie = "theme=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

    fireEvent.click(screen.getByRole("button", { name: "System" }));

    expect(setTheme).toHaveBeenCalledWith("system");
    expect(document.cookie).toContain("theme=system");
  });

  it("offers exactly light, dark, and system", () => {
    setup({ theme: "light" });

    expect(screen.getByRole("button", { name: "Light" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dark" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "System" })).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  function setup(input: { theme: string }) {
    const setTheme = vi.fn();
    const useTheme: typeof DEPENDENCIES.useTheme = () => mock<ReturnType<typeof DEPENDENCIES.useTheme>>({ theme: input.theme, setTheme });
    const result = render(<ThemeToggleGroup dependencies={{ useTheme }} />);
    return { setTheme, ...result };
  }
});
