// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { describe, expect, it } from "vitest";

import { DEPENDENCIES, GlobalGridCard, type GlobalGridCardProps } from "@/components/charts/GlobalGrid/GlobalGridCard";
import { render } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

const utilizationRows: GlobalGridCardProps["utilizationRows"] = [
  { key: "vcpu", label: "vCPU", percent: 0.272, activeLabel: "4,021.6", totalLabel: "of 14,795 cores" },
  { key: "gpu", label: "GPU", percent: 0.502, activeLabel: "211", totalLabel: "of 420 units" }
];

const featuredProviders: GlobalGridCardProps["featuredProviders"] = [
  { owner: "akash1abc", name: "provider.example.com", region: "US-East, US", gpuModels: ["h100"] },
  { owner: "akash1def", name: "provider.other.io", region: "NSW, AU", gpuModels: ["a100"] }
];

describe(GlobalGridCard.name, () => {
  it("renders each utilization row's label, percent, and active/total figures", () => {
    const { container } = setup({ utilizationRows, featuredProviders: [], markers: [], providerCountLabel: "" });

    expect(container.textContent).toContain("vCPU");
    expect(container.textContent).toContain("27.2%");
    expect(container.textContent).toContain("4,021.6");
    expect(container.textContent).toContain("of 14,795 cores");
    expect(container.textContent).toContain("GPU");
    expect(container.textContent).toContain("50.2%");
  });

  it("titles the capacity tile without the word advertised", () => {
    const { container } = setup({ utilizationRows, featuredProviders: [], markers: [], providerCountLabel: "" });

    expect(container.textContent).toContain("Leased versus total capacity");
    expect(container.textContent).not.toContain("advertised");
  });

  it("shows the given provider count label under the globe", () => {
    const { container } = setup({
      utilizationRows,
      featuredProviders: [],
      markers: [],
      providerCountLabel: "62 online providers across 12 countries · drag to rotate"
    });

    expect(container.textContent).toContain("62 online providers across 12 countries · drag to rotate");
  });

  it("passes the resolved markers through to the globe canvas", () => {
    const markers: GlobalGridCardProps["markers"] = [
      [37.4316, -78.6569],
      [50.1109, 8.6821]
    ];
    const { deps } = setup({ utilizationRows, featuredProviders: [], markers, providerCountLabel: "" });

    expect(deps.NetworkGlobeCanvas.mock.calls.at(-1)?.at(0)).toEqual(expect.objectContaining({ markers }));
  });

  it("lists each featured provider's name and region", () => {
    const { container } = setup({ utilizationRows, featuredProviders, markers: [], providerCountLabel: "" });

    expect(container.textContent).toContain("provider.example.com");
    expect(container.textContent).toContain("US-East, US");
    expect(container.textContent).toContain("provider.other.io");
    expect(container.textContent).toContain("NSW, AU");
  });

  it("shows a fallback message instead of fake providers when none are available", () => {
    const { container } = setup({ utilizationRows, featuredProviders: [], markers: [], providerCountLabel: "" });

    expect(container.textContent).toContain("Provider data is loading or unavailable");
  });

  it("links to the public provider directory and drops the view-all-providers button", () => {
    const { getByRole, queryByRole } = setup({ utilizationRows, featuredProviders, markers: [], providerCountLabel: "" });

    expect(getByRole("link", { name: /see full provider directory/i })).toHaveAttribute("href", "https://akash.network/ecosystem/providers");
    expect(queryByRole("link", { name: /^view all providers$/i })).not.toBeInTheDocument();
  });

  function setup(input: GlobalGridCardProps & { dependencies?: Partial<typeof DEPENDENCIES> }) {
    const deps = MockComponents(DEPENDENCIES, input.dependencies);
    const result = render(<GlobalGridCard {...input} dependencies={deps} />, {
      wrapper: ({ children }) => <IntlProvider locale="en-US">{children}</IntlProvider>
    });

    return { deps, ...result };
  }
});
