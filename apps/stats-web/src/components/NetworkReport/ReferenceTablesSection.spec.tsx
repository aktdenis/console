// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import { DEPENDENCIES, ReferenceTablesSection } from "@/components/NetworkReport/ReferenceTablesSection";
import type { DashboardBlockStats, NetworkCapacity } from "@/types";
import { render } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

describe(ReferenceTablesSection.name, () => {
  it("renders GPU pricing before leased capacity before network capacity, when all are shown", () => {
    const { deps, container } = setup({ showGpuPricing: true, showLeasedCapacity: true, showNetworkCapacity: true });

    expect(deps.GpuPriceListContainer).toHaveBeenCalled();
    expect(deps.UtilizationCard).toHaveBeenCalled();
    expect(deps.NetworkCapacityTable).toHaveBeenCalled();

    const order = [deps.GpuPriceListContainer, deps.UtilizationCard, deps.NetworkCapacityTable].map(dep => vi.mocked(dep).mock.invocationCallOrder[0]);
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(container.children).toHaveLength(1);
  });

  it("hides each table independently based on its own visibility flag", () => {
    const { deps } = setup({ showGpuPricing: false, showLeasedCapacity: true, showNetworkCapacity: false });

    expect(deps.GpuPriceListContainer).not.toHaveBeenCalled();
    expect(deps.UtilizationCard).toHaveBeenCalled();
    expect(deps.NetworkCapacityTable).not.toHaveBeenCalled();
  });

  function setup(input: { showGpuPricing: boolean; showLeasedCapacity: boolean; showNetworkCapacity: boolean }) {
    const deps = MockComponents(DEPENDENCIES);
    const result = render(
      <ReferenceTablesSection now={mock<DashboardBlockStats>()} networkCapacity={mock<NetworkCapacity>()} dependencies={deps} {...input} />
    );

    return { deps, ...result };
  }
});
