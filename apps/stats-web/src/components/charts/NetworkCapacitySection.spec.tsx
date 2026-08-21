// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";

import { DEPENDENCIES, NetworkCapacitySection } from "@/components/charts/NetworkCapacitySection";
import type { NetworkCapacity } from "@/types";
import { render } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

describe(NetworkCapacitySection.name, () => {
  it("forwards the globe-relevant subset of network capacity to the global grid", () => {
    const { deps, networkCapacity } = setup();

    expect(deps.GlobalGridContainer.mock.calls.at(0)?.at(0)).toEqual({
      stats: {
        activeProviderCount: networkCapacity.activeProviderCount,
        totalCPU: networkCapacity.totalCPU,
        totalGPU: networkCapacity.totalGPU,
        totalMemory: networkCapacity.totalMemory,
        totalStorage: networkCapacity.totalStorage
      }
    });
  });

  it("forwards the full network capacity to the utilization card", () => {
    const { deps, networkCapacity } = setup();

    expect(deps.NetworkCapacityCard.mock.calls.at(0)?.at(0)).toEqual({ networkCapacity });
  });

  function setup(input?: { dependencies?: Partial<typeof DEPENDENCIES> }) {
    const deps = MockComponents(DEPENDENCIES, input?.dependencies);
    const networkCapacity = mock<NetworkCapacity>({
      activeProviderCount: 63,
      totalCPU: 14_922_000,
      totalGPU: 430,
      totalMemory: 87.7 * 1024 ** 4,
      totalStorage: 733.1 * 1024 ** 4
    });
    const result = render(<NetworkCapacitySection networkCapacity={networkCapacity} dependencies={deps} />);

    return { deps, networkCapacity, ...result };
  }
});
