import { describe, expect, it } from "vitest";

import { estimateGpuPowerCapacityMW } from "@/lib/gpuPowerCapacity";
import type { GpuPriceModel } from "@/queries/useGpuPrices";

function gpuModel(overrides: Partial<GpuPriceModel>): GpuPriceModel {
  return {
    vendor: "nvidia",
    model: "h100",
    ram: "80Gi",
    interface: "SXM5",
    availability: { total: 10, available: 4 },
    price: null,
    ...overrides
  };
}

describe(estimateGpuPowerCapacityMW.name, () => {
  it("sums total and active wattage across models, converted to megawatts", () => {
    const models = [
      gpuModel({ model: "h100", availability: { total: 10, available: 4 } }),
      gpuModel({ model: "t4", availability: { total: 100, available: 100 } })
    ];

    const result = estimateGpuPowerCapacityMW(models);

    expect(result.totalMW).toBeCloseTo((10 * 700 + 100 * 70) / 1_000_000, 6);
    expect(result.activeMW).toBeCloseTo((6 * 700 + 0 * 70) / 1_000_000, 6);
  });

  it("falls back to a default wattage for an unrecognized model", () => {
    const models = [gpuModel({ model: "some-future-gpu", availability: { total: 4, available: 0 } })];

    const result = estimateGpuPowerCapacityMW(models);

    expect(result.totalMW).toBeGreaterThan(0);
  });

  it("returns zero for an empty model list", () => {
    const result = estimateGpuPowerCapacityMW([]);

    expect(result).toEqual({ totalMW: 0, activeMW: 0 });
  });

  it("matches GPU model names case-insensitively", () => {
    const upper = estimateGpuPowerCapacityMW([gpuModel({ model: "H100", availability: { total: 1, available: 0 } })]);
    const lower = estimateGpuPowerCapacityMW([gpuModel({ model: "h100", availability: { total: 1, available: 0 } })]);

    expect(upper).toEqual(lower);
  });
});
