// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { describe, expect, it } from "vitest";

import { DEPENDENCIES, GlobalGridCard, type GlobalGridCardProps } from "@/components/charts/GlobalGrid/GlobalGridCard";
import { render } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

const stats: GlobalGridCardProps["stats"] = {
  activeProviderCount: 62,
  totalCPU: 15_183_000,
  totalGPU: 422,
  totalMemory: 88.2 * 1024 ** 4,
  totalStorage: 734.3 * 1024 ** 4
};

describe(GlobalGridCard.name, () => {
  it("formats the stat strip using the ported website formatters", () => {
    const { container } = setup({ stats, footer: null, markers: [] });

    expect(container.textContent).toContain("62");
    expect(container.textContent).toContain("15k");
    expect(container.textContent).toContain("422");
    expect(container.textContent).toContain("88 TB");
    expect(container.textContent).toContain("734 TB");
  });

  it("passes the resolved markers through to the globe canvas", () => {
    const markers: GlobalGridCardProps["markers"] = [
      [37.4316, -78.6569],
      [50.1109, 8.6821]
    ];
    const { deps } = setup({ stats, footer: null, markers });

    expect(deps.NetworkGlobeCanvas.mock.calls.at(-1)?.at(0)).toEqual(expect.objectContaining({ markers }));
  });

  it("shows the country/US-split footer and the description count when provider data loaded", () => {
    const { container } = setup({
      stats,
      footer: { countryCount: 20, usCount: 28, elsewhereCount: 33, medianUptime30d: 0.999 },
      markers: []
    });

    expect(container.textContent).toContain("61 online providers across 20 countries");
    expect(container.textContent).toContain("28 providers in the United States, 33 elsewhere");
    expect(container.textContent).toContain("99.90%");
  });

  it("does not show a fake zero footer when provider data failed to load", () => {
    const { container } = setup({ stats, footer: null, markers: [] });

    expect(container.textContent).not.toContain("0 providers in the United States");
    expect(container.textContent).toContain("Provider location data is loading or unavailable");
  });

  function setup(input: GlobalGridCardProps & { dependencies?: Partial<typeof DEPENDENCIES> }) {
    const deps = MockComponents(DEPENDENCIES, input.dependencies);
    const result = render(<GlobalGridCard {...input} dependencies={deps} />, {
      wrapper: ({ children }) => <IntlProvider locale="en-US">{children}</IntlProvider>
    });

    return { deps, ...result };
  }
});
