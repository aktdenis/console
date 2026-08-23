// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { describe, expect, it } from "vitest";

import { DEPENDENCIES, NetworkCapacityCard } from "@/components/charts/NetworkCapacityCard";
import type { NetworkCapacity } from "@/types";
import { render } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

const networkCapacity: NetworkCapacity = {
  activeProviderCount: 61,
  activeCPU: 4_100_000,
  activeGPU: 260,
  activeMemory: 19.8 * 1024 ** 4,
  activeStorage: 59.5 * 1024 ** 4,
  pendingCPU: 0,
  pendingGPU: 0,
  pendingMemory: 0,
  pendingStorage: 0,
  availableCPU: 0,
  availableGPU: 0,
  availableMemory: 0,
  availableStorage: 0,
  totalCPU: 15_183_000,
  totalGPU: 422,
  totalMemory: 88.2 * 1024 ** 4,
  totalStorage: 734.3 * 1024 ** 4
};

describe(NetworkCapacityCard.name, () => {
  it("titles the card and describes it as leased versus total capacity", () => {
    const { deps } = setup({ networkCapacity });

    expect(deps.UtilizationCard.mock.calls.at(0)?.at(0)).toMatchObject({
      title: "Network Capacity",
      description: "Leased versus total advertised capacity"
    });
  });

  it("computes each resource's percentage as active/total, matching a hand calculation", () => {
    const { rows } = setup({ networkCapacity });

    expect(rows.map(row => row.percent)).toEqual([
      4_100_000 / 15_183_000,
      260 / 422,
      (19.8 * 1024 ** 4) / (88.2 * 1024 ** 4),
      (59.5 * 1024 ** 4) / (734.3 * 1024 ** 4)
    ]);
  });

  it("divides CPU millicores by 1000 without touching GPU's raw unit count", () => {
    const { rows } = setup({ networkCapacity });

    expect(renderRowText(rows[0])).toContain("4,100");
    expect(renderRowText(rows[0])).toContain("15,183");
    expect(renderRowText(rows[1])).toContain("260");
    expect(renderRowText(rows[1])).toContain("422");
  });

  it("formats memory and storage via bytesToShrink in binary (TiB) units, not hand-rolled math", () => {
    const { rows } = setup({ networkCapacity });

    expect(renderRowText(rows[2])).toContain("TiB");
    expect(renderRowText(rows[2])).toContain("19.8");
    expect(renderRowText(rows[2])).toContain("88.2");
    expect(renderRowText(rows[3])).toContain("59.5");
    expect(renderRowText(rows[3])).toContain("734.3");
  });

  function renderRowText(row: { activeLabel: React.ReactNode; totalLabel: React.ReactNode }) {
    const { container } = render(
      <>
        {row.activeLabel}
        {row.totalLabel}
      </>,
      { wrapper: ({ children }) => <IntlProvider locale="en-US">{children}</IntlProvider> }
    );

    return container.textContent ?? "";
  }

  function setup(input: { networkCapacity: NetworkCapacity; dependencies?: Partial<typeof DEPENDENCIES> }) {
    const deps = MockComponents(DEPENDENCIES, input.dependencies);
    const result = render(<NetworkCapacityCard networkCapacity={input.networkCapacity} dependencies={deps} />, {
      wrapper: ({ children }) => <IntlProvider locale="en-US">{children}</IntlProvider>
    });
    const rows = deps.UtilizationCard.mock.calls.at(0)?.at(0)?.rows ?? [];

    return { deps, rows, ...result };
  }
});
