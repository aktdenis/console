export const REPORT_SECTIONS = [
  { key: "compare", label: "Compare" },
  { key: "assets-spent", label: "Assets Spent" },
  { key: "compute-capacity", label: "Compute Capacity" },
  { key: "compute-leased", label: "Compute Leased" },
  { key: "bme", label: "BME" },
  { key: "blockchain", label: "Blockchain" }
] as const;

export type ReportSectionKey = (typeof REPORT_SECTIONS)[number]["key"];

export const ALL_REPORT_SECTION_KEYS: ReportSectionKey[] = REPORT_SECTIONS.map(section => section.key);
