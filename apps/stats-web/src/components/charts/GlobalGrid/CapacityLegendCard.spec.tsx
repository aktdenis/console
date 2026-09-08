// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { describe, expect, it } from "vitest";

import { CapacityLegendCard, type CapacityLegendCardProps } from "@/components/charts/GlobalGrid/CapacityLegendCard";
import { render } from "@testing-library/react";

describe(CapacityLegendCard.name, () => {
  it("shows the average of every row's percent", () => {
    const { container } = setup({
      rows: [
        { key: "a", label: "A", percent: 0.2, valueLabel: "1" },
        { key: "b", label: "B", percent: 0.6, valueLabel: "3" }
      ]
    });

    expect(container.textContent).toContain("40%");
  });

  function setup(props: CapacityLegendCardProps) {
    return render(<CapacityLegendCard {...props} />, { wrapper: ({ children }) => <IntlProvider locale="en-US">{children}</IntlProvider> });
  }
});
