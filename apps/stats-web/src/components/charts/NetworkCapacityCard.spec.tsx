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
  it("computes each resource's percentage as active/total, matching a hand calculation", () => {
    const { deps } = setup({ networkCapacity });

    const percentages = deps.Progress.mock.calls.map(call => call.at(0)?.value);
    expect(percentages).toEqual([
      (4_100_000 / 15_183_000) * 100,
      (260 / 422) * 100,
      ((19.8 * 1024 ** 4) / (88.2 * 1024 ** 4)) * 100,
      ((59.5 * 1024 ** 4) / (734.3 * 1024 ** 4)) * 100
    ]);
  });

  it("divides CPU millicores by 1000 without touching GPU's raw unit count", () => {
    const { container } = setup({ networkCapacity });

    expect(container.textContent).toContain("4,100");
    expect(container.textContent).toContain("15,183");
    expect(container.textContent).toContain("260");
    expect(container.textContent).toContain("422");
  });

  it("formats memory and storage via bytesToShrink in binary (TiB) units, not hand-rolled math", () => {
    const { container } = setup({ networkCapacity });

    expect(container.textContent).toContain("TiB");
    expect(container.textContent).toContain("19.8");
    expect(container.textContent).toContain("88.2");
    expect(container.textContent).toContain("59.5");
    expect(container.textContent).toContain("734.3");
  });

  function setup(input: { networkCapacity: NetworkCapacity; dependencies?: Partial<typeof DEPENDENCIES> }) {
    const deps = MockComponents(DEPENDENCIES, input.dependencies);
    const result = render(<NetworkCapacityCard networkCapacity={input.networkCapacity} dependencies={deps} />, {
      wrapper: ({ children }) => <IntlProvider locale="en-US">{children}</IntlProvider>
    });

    return { deps, ...result };
  }
});
