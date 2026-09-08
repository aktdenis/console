// @vitest-environment jsdom
import { TooltipProvider } from "@akashnetwork/ui/components";
import { describe, expect, it, vi } from "vitest";

import { DownloadPdfButton } from "@/components/NetworkReport/DownloadPdfButton";
import { fireEvent, render, screen } from "@testing-library/react";

describe(DownloadPdfButton.name, () => {
  it("triggers the browser print dialog when clicked", () => {
    const print = vi.spyOn(window, "print").mockImplementation(() => {});
    render(<DownloadPdfButton />, { wrapper: ({ children }) => <TooltipProvider>{children}</TooltipProvider> });

    fireEvent.click(screen.getByRole("button", { name: "Download report as PDF" }));

    expect(print).toHaveBeenCalledOnce();
    print.mockRestore();
  });
});
