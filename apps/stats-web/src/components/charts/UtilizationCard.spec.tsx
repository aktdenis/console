// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { describe, expect, it } from "vitest";

import { UtilizationCard, type UtilizationRow } from "@/components/charts/UtilizationCard";
import { render, screen } from "@testing-library/react";

describe(UtilizationCard.name, () => {
  it("renders the title and description", () => {
    setup({ title: "Network Capacity", description: "Leased versus total advertised capacity", rows: [] });

    expect(screen.getByText("Network Capacity")).toBeInTheDocument();
    expect(screen.getByText("Leased versus total advertised capacity")).toBeInTheDocument();
  });

  it("promotes the description to the heading spot when no title is given, instead of leaving it muted with nothing above it", () => {
    setup({ description: "Leased versus total network capacity", rows: [] });

    expect(screen.getByRole("heading", { name: "Leased versus total network capacity" })).toBeInTheDocument();
  });

  it("renders each row's label, percent, active label, and total label", () => {
    const rows: UtilizationRow[] = [{ key: "vcpu", label: "vCPU", percent: 0.5, activeLabel: "4,100", totalLabel: "of 15,183 cores" }];

    setup({ title: "Network Capacity", description: "desc", rows });

    expect(screen.getByText("vCPU")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getByText("4,100")).toBeInTheDocument();
    expect(screen.getByText("of 15,183 cores")).toBeInTheDocument();
  });

  it("fills the progress bar to the row's percent, as a 0-100 scale", () => {
    const rows: UtilizationRow[] = [{ key: "vcpu", label: "vCPU", percent: 0.5, activeLabel: "4,100", totalLabel: "of 15,183 cores" }];

    const { container } = setup({ title: "Network Capacity", description: "desc", rows });

    expect(container.querySelector('[style*="translateX(-50%)"]')).not.toBeNull();
  });

  function setup(props: { title?: string; description: string; rows: UtilizationRow[] }) {
    const result = render(<UtilizationCard {...props} />, {
      wrapper: ({ children }) => <IntlProvider locale="en-US">{children}</IntlProvider>
    });

    return { ...result };
  }
});
