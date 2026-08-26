/** Display names for the raw model slugs /v1/gpu-prices returns - that endpoint doesn't format them itself. */
const GPU_MODEL_LABELS: Record<string, string> = {
  h100: "H100",
  h200: "H200",
  a100: "A100",
  l40s: "L40S",
  l40: "L40",
  l4: "L4",
  a10: "A10",
  a6000: "RTX A6000",
  rtx4090: "RTX 4090",
  rtx3090: "RTX 3090",
  t4: "T4",
  v100: "V100",
  p100: "P100",
  mi300x: "MI300X"
};

export function formatGpuModelName(vendor: string, model: string, ram: string): string {
  const label = GPU_MODEL_LABELS[model.toLowerCase()] ?? model.toUpperCase();
  return ram ? `${label} ${ram}` : label;
}

/** Parses SDL-style RAM strings ("80Gi", "141Gi") into a plain GiB number for sorting - 0 when unparseable. */
export function parseRamGiB(ram: string): number {
  return parseFloat(ram) || 0;
}
