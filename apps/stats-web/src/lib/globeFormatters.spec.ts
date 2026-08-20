import { describe, expect, it } from "vitest";

import { fmtBytes, fmtCPU, fmtNum } from "@/lib/globeFormatters";

describe(fmtNum.name, () => {
  it("adds thousands separators", () => {
    expect(fmtNum(15183)).toBe("15,183");
  });
});

describe(fmtBytes.name, () => {
  it("renders whole TB below the PB threshold", () => {
    expect(fmtBytes(88.2 * 1024 ** 4)).toBe("88 TB");
  });

  it("switches to one-decimal PB at 1024^5 bytes", () => {
    expect(fmtBytes(1.5 * 1024 ** 5)).toBe("1.5 PB");
  });

  it("stays in TB just below the PB threshold", () => {
    expect(fmtBytes(1024 ** 5 - 1)).toBe("1024 TB");
  });
});

describe(fmtCPU.name, () => {
  it("divides millicores by 1000 to get cores, spelled out below 1000 cores", () => {
    expect(fmtCPU(500_000)).toBe("500");
  });

  it("switches to a k suffix at 1000 cores", () => {
    expect(fmtCPU(15_183_000)).toBe("15k");
  });

  it("switches to an M suffix at 1,000,000 cores", () => {
    expect(fmtCPU(1_500_000_000)).toBe("1.5M");
  });
});
