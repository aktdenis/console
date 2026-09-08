// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import { DEPENDENCIES, NetworkCapacitySection } from "@/components/charts/NetworkCapacitySection";
import { computeNetworkCapacityRows } from "@/lib/networkCapacityRows";
import type { NetworkCapacity } from "@/types";
import { render } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

describe(NetworkCapacitySection.name, () => {
  it("shows the network capacity bubbles above the global grid", () => {
    const { deps, networkCapacity } = setup();

    const rows = deps.NetworkCapacityBubbles.mock.calls.at(0)?.at(0)?.rows ?? [];
    const expectedRows = computeNetworkCapacityRows(networkCapacity);
    expect(rows.map(row => ({ key: row.key, label: row.label, percent: row.percent }))).toEqual(
      expectedRows.map(row => ({ key: row.key, label: row.label, percent: row.percent }))
    );
  });

  it("shows the median uptime tile to the left of the network capacity bubbles, at a quarter width", () => {
    const { deps } = setup();

    expect(deps.MedianUptimeCardContainer.mock.calls.at(0)?.at(0)).toEqual({ className: "lg:col-span-1" });
    expect(deps.NetworkCapacityBubbles.mock.calls.at(0)?.at(0)).toMatchObject({ className: "lg:col-span-3" });
    const uptimeOrder = vi.mocked(deps.MedianUptimeCardContainer).mock.invocationCallOrder[0];
    const bubblesOrder = vi.mocked(deps.NetworkCapacityBubbles).mock.invocationCallOrder[0];
    expect(uptimeOrder).toBeLessThan(bubblesOrder);
  });

  it("shows the power capacity tiles below the network capacity bubbles", () => {
    const { deps } = setup();

    const bubblesOrder = vi.mocked(deps.NetworkCapacityBubbles).mock.invocationCallOrder[0];
    const powerOrder = vi.mocked(deps.PowerCapacityContainer).mock.invocationCallOrder[0];
    const globalGridOrder = vi.mocked(deps.GlobalGridContainer).mock.invocationCallOrder[0];
    expect(bubblesOrder).toBeLessThan(powerOrder);
    expect(powerOrder).toBeLessThan(globalGridOrder);
  });

  it("shows the global grid", () => {
    const { deps } = setup();

    expect(deps.GlobalGridContainer).toHaveBeenCalled();
  });

  it("shows the provider constellation between the global grid and the become-a-provider CTA", () => {
    const { deps } = setup();

    expect(deps.EcosystemConstellationContainer).toHaveBeenCalled();
    const globalGridOrder = vi.mocked(deps.GlobalGridContainer).mock.invocationCallOrder[0];
    const constellationOrder = vi.mocked(deps.EcosystemConstellationContainer).mock.invocationCallOrder[0];
    const ctaOrder = vi.mocked(deps.NetworkProviderCta).mock.invocationCallOrder[0];
    expect(globalGridOrder).toBeLessThan(constellationOrder);
    expect(constellationOrder).toBeLessThan(ctaOrder);
  });

  it("shows the become-a-provider CTA below the global grid", () => {
    const { deps } = setup();

    expect(deps.NetworkProviderCta).toHaveBeenCalled();
  });

  function setup(input?: { dependencies?: Partial<typeof DEPENDENCIES> }) {
    const deps = MockComponents(DEPENDENCIES, input?.dependencies);
    const networkCapacity = mock<NetworkCapacity>();
    const result = render(<NetworkCapacitySection networkCapacity={networkCapacity} dependencies={deps} />);

    return { deps, networkCapacity, ...result };
  }
});
