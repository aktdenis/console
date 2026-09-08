// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { describe, expect, it } from "vitest";

import { DEPENDENCIES, TopProvidersCard, type TopProvidersCardProps } from "@/components/charts/GlobalGrid/TopProvidersCard";
import { render } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

const rows: TopProvidersCardProps["rows"] = [
  { key: "a", name: "provider.a.example.com", region: "US-East, US", activeCores: 842 },
  { key: "b", name: "provider.b.example.com", region: "Amsterdam, NL", activeCores: 421 }
];

describe(TopProvidersCard.name, () => {
  it("lists each provider's name, region, and active core count in rank order", () => {
    const { container } = setup({ rows });

    expect(container.textContent).toContain("provider.a.example.com");
    expect(container.textContent).toContain("US-East, US");
    expect(container.textContent).toContain("842");
    expect(container.textContent).toContain("provider.b.example.com");
  });

  it("sizes each row's progress bar relative to the top row's active cores", () => {
    const { deps } = setup({ rows });

    expect(deps.Progress.mock.calls.at(0)?.at(0)).toMatchObject({ value: 100 });
    expect(deps.Progress.mock.calls.at(1)?.at(0)).toMatchObject({ value: (421 / 842) * 100 });
  });

  function setup(input: TopProvidersCardProps & { dependencies?: Partial<typeof DEPENDENCIES> }) {
    const deps = MockComponents(DEPENDENCIES, input.dependencies);
    const result = render(<TopProvidersCard {...input} dependencies={deps} />, {
      wrapper: ({ children }) => <IntlProvider locale="en-US">{children}</IntlProvider>
    });

    return { deps, ...result };
  }
});
