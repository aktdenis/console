// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { describe, expect, it } from "vitest";

import { MedianUptimeCard, type MedianUptimeCardProps } from "@/components/charts/GlobalGrid/MedianUptimeCard";
import { render } from "@testing-library/react";

describe(MedianUptimeCard.name, () => {
  it("shows the median uptime as a percent with two decimal places", () => {
    const { container } = setup({ medianUptime: 0.974 });

    expect(container.textContent).toContain("97.40%");
  });

  it("shows a placeholder when there is no uptime data", () => {
    const { container } = setup({ medianUptime: null });

    expect(container.textContent).toContain("—");
  });

  function setup(props: MedianUptimeCardProps) {
    return render(<MedianUptimeCard {...props} />, { wrapper: ({ children }) => <IntlProvider locale="en-US">{children}</IntlProvider> });
  }
});
