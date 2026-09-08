// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { describe, expect, it } from "vitest";

import { DEPENDENCIES, GlobalGridCard, type GlobalGridCardProps } from "@/components/charts/GlobalGrid/GlobalGridCard";
import { render } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

const featuredProviders: GlobalGridCardProps["featuredProviders"] = [
  { owner: "akash1abc", name: "provider.example.com", region: "US-East, US", gpuModels: [{ vendor: "nvidia", model: "h100", ram: "80Gi", interface: "SXM5" }] },
  { owner: "akash1def", name: "provider.other.io", region: "NSW, AU", gpuModels: [{ vendor: "nvidia", model: "a100", ram: "80Gi", interface: "SXM4" }] }
];

const topProviders: GlobalGridCardProps["topProviders"] = [{ key: "akash1abc", name: "provider.example.com", region: "US-East, US", activeCores: 842 }];

describe(GlobalGridCard.name, () => {
  it("shows the given provider count label under the globe", () => {
    const { container } = setup({
      featuredProviders: [],
      topProviders: [],
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
    const { deps } = setup({ featuredProviders: [], topProviders: [], markers, providerCountLabel: "" });

    expect(deps.NetworkGlobeCanvas.mock.calls.at(-1)?.at(0)).toEqual(expect.objectContaining({ markers }));
  });

  it("lists each featured provider's name and region", () => {
    const { container } = setup({ featuredProviders, topProviders: [], markers: [], providerCountLabel: "" });

    expect(container.textContent).toContain("provider.example.com");
    expect(container.textContent).toContain("US-East, US");
    expect(container.textContent).toContain("provider.other.io");
    expect(container.textContent).toContain("NSW, AU");
  });

  it("shows a fallback message instead of fake providers when none are available", () => {
    const { container } = setup({ featuredProviders: [], topProviders: [], markers: [], providerCountLabel: "" });

    expect(container.textContent).toContain("Provider data is loading or unavailable");
  });

  it("links to the public provider directory and drops the view-all-providers button", () => {
    const { getByRole, queryByRole } = setup({ featuredProviders, topProviders: [], markers: [], providerCountLabel: "" });

    expect(getByRole("link", { name: /see full provider directory/i })).toHaveAttribute("href", "https://akash.network/ecosystem/providers");
    expect(queryByRole("link", { name: /^view all providers$/i })).not.toBeInTheDocument();
  });

  it("passes the resolved top providers through to the leaderboard", () => {
    const { deps } = setup({ featuredProviders: [], topProviders, markers: [], providerCountLabel: "" });

    expect(deps.TopProvidersCard.mock.calls.at(0)?.at(0)).toEqual({ rows: topProviders });
  });

  it("hides the leaderboard entirely when there are no top providers", () => {
    const { deps } = setup({ featuredProviders: [], topProviders: [], markers: [], providerCountLabel: "" });

    expect(deps.TopProvidersCard).not.toHaveBeenCalled();
  });

  function setup(input: GlobalGridCardProps & { dependencies?: Partial<typeof DEPENDENCIES> }) {
    const deps = MockComponents(DEPENDENCIES, input.dependencies);
    const result = render(<GlobalGridCard {...input} dependencies={deps} />, {
      wrapper: ({ children }) => <IntlProvider locale="en-US">{children}</IntlProvider>
    });

    return { deps, ...result };
  }
});
