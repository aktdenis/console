import { describe, expect, it } from "vitest";

import { pickVisibleNodes } from "./EcosystemConstellation";

import type { ConstellationNode } from "@/lib/ecosystemConstellation";

describe(pickVisibleNodes.name, () => {
  it("returns every node unchanged when there are fewer than the cap", () => {
    const nodes = [node({ owner: "a", hasActiveDeployments: true }), node({ owner: "b", hasActiveDeployments: false })];

    expect(pickVisibleNodes(nodes)).toEqual(nodes);
  });

  it("samples roughly 70% from providers with active deployments when both pools are large enough", () => {
    const nodes = [
      ...Array.from({ length: 60 }, (_, i) => node({ owner: `busy-${i}`, hasActiveDeployments: true })),
      ...Array.from({ length: 60 }, (_, i) => node({ owner: `idle-${i}`, hasActiveDeployments: false }))
    ];

    const picked = pickVisibleNodes(nodes);
    const withDeployments = picked.filter(n => n.hasActiveDeployments).length;

    expect(picked).toHaveLength(32);
    expect(withDeployments).toBe(22);
    expect(picked.length - withDeployments).toBe(10);
  });

  it("backfills from the other pool when one side doesn't have enough candidates to hit its target", () => {
    const nodes = [
      ...Array.from({ length: 60 }, (_, i) => node({ owner: `busy-${i}`, hasActiveDeployments: true })),
      ...Array.from({ length: 3 }, (_, i) => node({ owner: `idle-${i}`, hasActiveDeployments: false }))
    ];

    const picked = pickVisibleNodes(nodes);

    expect(picked).toHaveLength(32);
    expect(picked.filter(n => !n.hasActiveDeployments)).toHaveLength(3);
    expect(picked.filter(n => n.hasActiveDeployments)).toHaveLength(29);
  });

  it("returns a stable sample across repeated calls with the same input", () => {
    const nodes = Array.from({ length: 80 }, (_, i) => node({ owner: `p-${i}`, hasActiveDeployments: i % 2 === 0 }));

    expect(pickVisibleNodes(nodes).map(n => n.owner)).toEqual(pickVisibleNodes(nodes).map(n => n.owner));
  });
});

function node(overrides: Partial<ConstellationNode> & { owner: string }): ConstellationNode {
  return {
    name: `${overrides.owner}.example.com`,
    region: "Region, XX",
    gpuModels: [],
    uptime30d: 99,
    hasActiveDeployments: false,
    ...overrides
  };
}
