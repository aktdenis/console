import type { GpuPriceModel } from "@/queries/useGpuPrices";

/**
 * Approximate max board power per GPU model, in watts - published vendor spec sheets, not
 * metered draw. Models not listed here fall back to GPU_POWER_DRAW_FALLBACK_WATTS so a new
 * model doesn't silently drop out of the estimate before this table is updated.
 */
const GPU_POWER_DRAW_WATTS: Record<string, number> = {
  b300: 1400,
  h200: 700,
  h100: 700,
  a100: 400,
  l40s: 350,
  l40: 300,
  l4: 72,
  a10: 150,
  a6000: 300,
  pro6000se: 600,
  pro6000we: 300,
  pro6000mq: 300,
  rtx8000: 260,
  rtx6000: 300,
  rtx5090: 575,
  rtx4090: 450,
  rtx3090ti: 450,
  rtx3090: 350,
  t4: 70,
  v100: 300,
  p100: 250,
  mi300x: 750
};

const GPU_POWER_DRAW_FALLBACK_WATTS = 300;

export type GpuPowerCapacityEstimate = { totalMW: number; activeMW: number };

export function estimateGpuPowerCapacityMW(models: GpuPriceModel[]): GpuPowerCapacityEstimate {
  const totalWatts = models.reduce((sum, model) => sum + model.availability.total * wattsFor(model.model), 0);
  const activeWatts = models.reduce((sum, model) => sum + (model.availability.total - model.availability.available) * wattsFor(model.model), 0);

  return { totalMW: totalWatts / 1_000_000, activeMW: activeWatts / 1_000_000 };
}

function wattsFor(model: string): number {
  return GPU_POWER_DRAW_WATTS[model.toLowerCase()] ?? GPU_POWER_DRAW_FALLBACK_WATTS;
}
