// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";

import { DEPENDENCIES, ResourcesLeasedCapacityCard } from "@/components/charts/ResourcesLeasedCapacityCard";
import type { DashboardBlockStats, NetworkCapacity } from "@/types";
import { render } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

describe(ResourcesLeasedCapacityCard.name, () => {
  it("describes the card as leased versus total capacity, with no title of its own - the page heading above it already says Resources Leased", () => {
    const { deps } = setup({
      now: mock<DashboardBlockStats>({ activeCPU: 3_850_000, activeGPU: 167, activeMemory: 16 * 1024 ** 4, activeStorage: 53 * 1024 ** 4 }),
      networkCapacity: mock<NetworkCapacity>({ totalCPU: 15_183_000, totalGPU: 422, totalMemory: 88 * 1024 ** 4, totalStorage: 734 * 1024 ** 4 })
    });

    const props = deps.UtilizationCard.mock.calls.at(0)?.at(0);
    expect(props).toMatchObject({ description: "Leased versus total network capacity" });
    expect(props?.title).toBeUndefined();
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
