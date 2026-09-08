// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";

import { computeNetworkCapacityRows } from "@/lib/networkCapacityRows";
import type { NetworkCapacity } from "@/types";
import { render } from "@testing-library/react";

describe(computeNetworkCapacityRows.name, () => {
  it("computes each resource's utilization percent as active over total", () => {
    const networkCapacity = mock<NetworkCapacity>({
      activeCPU: 3_850_000,
      totalCPU: 15_183_000,
      activeGPU: 167,
      totalGPU: 422,
      activeMemory: 16 * 1024 ** 4,
      totalMemory: 88 * 1024 ** 4,
      activeStorage: 53 * 1024 ** 4,
      totalStorage: 734 * 1024 ** 4
    });

    const rows = computeNetworkCapacityRows(networkCapacity);

    expect(rows.map(row => row.key)).toEqual(["vcpu", "gpu", "memory", "storage"]);
    expect(rows.map(row => row.percent)).toEqual([
      3_850_000 / 15_183_000,
      167 / 422,
      (16 * 1024 ** 4) / (88 * 1024 ** 4),
      (53 * 1024 ** 4) / (734 * 1024 ** 4)
    ]);
  });

  it("labels each row with the total (not active) amount, converted to its display unit", () => {
    const networkCapacity = mock<NetworkCapacity>({ totalCPU: 15_183_000, totalGPU: 422 });

    const rows = computeNetworkCapacityRows(networkCapacity);
    const { getByText } = render(<IntlProvider locale="en-US">{rows.find(row => row.key === "gpu")?.valueLabel}</IntlProvider>);

    expect(getByText("422")).toBeInTheDocument();
  });
});
