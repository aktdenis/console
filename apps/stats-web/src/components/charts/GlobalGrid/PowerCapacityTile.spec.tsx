// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { describe, expect, it } from "vitest";

import { PowerCapacityTile, type PowerCapacityTileProps } from "@/components/charts/GlobalGrid/PowerCapacityTile";
import { render } from "@testing-library/react";

describe(PowerCapacityTile.name, () => {
  it("shows the title, value in megawatts, and caption", () => {
    const { container } = setup({ title: "Estimated GPU power capacity", valueMW: 12.345, caption: "Estimated, not metered." });

    expect(container.textContent).toContain("Estimated GPU power capacity");
    expect(container.textContent).toContain("12.35");
    expect(container.textContent).toContain("MW");
    expect(container.textContent).toContain("Estimated, not metered.");
  });

  it("shows a placeholder while the value is loading", () => {
    const { container } = setup({ title: "GPU power in active leases", valueMW: null, caption: "Estimated, not metered." });

    expect(container.textContent).toContain("—");
  });

  function setup(props: PowerCapacityTileProps) {
    return render(<PowerCapacityTile {...props} />, { wrapper: ({ children }) => <IntlProvider locale="en-US">{children}</IntlProvider> });
  }
});
