// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import { DEPENDENCIES, ResourcesLeasedCapacityCard } from "@/components/charts/ResourcesLeasedCapacityCard";
import { computeNetworkCapacityRows } from "@/lib/networkCapacityRows";
import type { DashboardBlockStats, NetworkCapacity } from "@/types";
import { render } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

describe(ResourcesLeasedCapacityCard.name, () => {
  it("shows the capacity-at-a-glance tile to the left of the leased capacity tile", () => {
    const networkCapacity = mock<NetworkCapacity>({ totalCPU: 15_183_000, totalGPU: 422, totalMemory: 88 * 1024 ** 4, totalStorage: 734 * 1024 ** 4 });
    const { deps } = setup({ now: mock<DashboardBlockStats>(), networkCapacity });

    const legendProps = deps.CapacityLegendCard.mock.calls.at(0)?.at(0);
    const expectedRows = computeNetworkCapacityRows(networkCapacity);
    expect(legendProps?.rows.map(row => ({ key: row.key, label: row.label, percent: row.percent }))).toEqual(
      expectedRows.map(row => ({ key: row.key, label: row.label, percent: row.percent }))
    );
    expect(legendProps).toMatchObject({ className: "lg:col-span-1" });

    const legendOrder = vi.mocked(deps.CapacityLegendCard).mock.invocationCallOrder[0];
    const utilizationOrder = vi.mocked(deps.UtilizationCard).mock.invocationCallOrder[0];
    expect(legendOrder).toBeLessThan(utilizationOrder);
  });

  it("titles the tile Leased capacity", () => {
    const { deps } = setup({
      now: mock<DashboardBlockStats>({ activeCPU: 3_850_000, activeGPU: 167, activeMemory: 16 * 1024 ** 4, activeStorage: 53 * 1024 ** 4 }),
      networkCapacity: mock<NetworkCapacity>({ totalCPU: 15_183_000, totalGPU: 422, totalMemory: 88 * 1024 ** 4, totalStorage: 734 * 1024 ** 4 })
    });

    const props = deps.UtilizationCard.mock.calls.at(0)?.at(0);
    expect(props).toMatchObject({ title: "Leased capacity" });
  });

  it("computes each resource's percentage as leased/total, sourcing leased from now and total from networkCapacity", () => {
    const { rows } = setup({
      now: mock<DashboardBlockStats>({ activeCPU: 3_850_000, activeGPU: 167, activeMemory: 16 * 1024 ** 4, activeStorage: 53 * 1024 ** 4 }),
      networkCapacity: mock<NetworkCapacity>({ totalCPU: 15_183_000, totalGPU: 422, totalMemory: 88 * 1024 ** 4, totalStorage: 734 * 1024 ** 4 })
    });

    expect(rows.map(row => row.percent)).toEqual([
      3_850_000 / 15_183_000,
      167 / 422,
      (16 * 1024 ** 4) / (88 * 1024 ** 4),
      (53 * 1024 ** 4) / (734 * 1024 ** 4)
    ]);
  });

  function setup(props: { now: DashboardBlockStats; networkCapacity: NetworkCapacity }) {
    const deps = MockComponents(DEPENDENCIES);
    const result = render(<ResourcesLeasedCapacityCard {...props} dependencies={deps} />, {
      wrapper: ({ children }) => <IntlProvider locale="en-US">{children}</IntlProvider>
    });
    const rows = deps.UtilizationCard.mock.calls.at(0)?.at(0)?.rows ?? [];

    return { deps, rows, ...result };
  }
});
