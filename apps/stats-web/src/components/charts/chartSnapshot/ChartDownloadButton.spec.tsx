// @vitest-environment jsdom
import { createRef } from "react";
import { toCanvas } from "html-to-image";
import { afterEach, describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import { ChartDownloadButton } from "@/components/charts/chartSnapshot/ChartDownloadButton";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("html-to-image", () => ({ toCanvas: vi.fn() }));

const mockedToCanvas = vi.mocked(toCanvas);

const CSV = {
  fields: [
    { label: "Date", value: "date" },
    { label: "Value", value: "value" }
  ],
  rows: [{ date: "2026-01-01", value: 12.5 }]
};

describe(ChartDownloadButton.name, () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("captures the target element at a higher pixel ratio for a crisp export", async () => {
    const { targetRef } = setup({});

    await openMenu();
    await userEvent.click(screen.getByRole("menuitem", { name: "Download as PNG" }));

    await waitFor(() => expect(mockedToCanvas).toHaveBeenCalledWith(targetRef.current, expect.objectContaining({ pixelRatio: 2 })));
  });

  it("triggers a download of the composed image under the given file name plus .png", async () => {
    const { downloadedFileName } = setup({ fileName: "akt-spent-snapshot" });

    await openMenu();
    await userEvent.click(screen.getByRole("menuitem", { name: "Download as PNG" }));

    await waitFor(() => expect(downloadedFileName()).toBe("akt-spent-snapshot.png"));
  });

  it("disables the trigger while exporting and re-enables it once done", async () => {
    let resolveToCanvas: (canvas: HTMLCanvasElement) => void = () => {};
    setup({});
    mockedToCanvas.mockReturnValue(new Promise(resolve => (resolveToCanvas = resolve)));

    await openMenu();
    await userEvent.click(screen.getByRole("menuitem", { name: "Download as PNG" }));
    await waitFor(() => expect(screen.getByRole("button")).toBeDisabled());

    resolveToCanvas(document.createElement("canvas"));
    await waitFor(() => expect(screen.getByRole("button")).not.toBeDisabled());
  });

  it("does nothing when the target element isn't mounted yet", async () => {
    setup({}, { withTarget: false });

    await openMenu();
    await userEvent.click(screen.getByRole("menuitem", { name: "Download as PNG" }));

    expect(mockedToCanvas).not.toHaveBeenCalled();
  });

  it("downloads the chart data as a csv under the given file name plus .csv", async () => {
    const { downloadedFileName, downloadedHref } = setup({ fileName: "akt-spent-snapshot" });

    await openMenu();
    await userEvent.click(screen.getByRole("menuitem", { name: "Download as CSV" }));

    expect(downloadedFileName()).toBe("akt-spent-snapshot.csv");
    expect(decodeURI(downloadedHref() ?? "")).toBe('data:text/csv;charset=utf-8,"Date","Value"\n"2026-01-01",12.5');
  });

  function openMenu() {
    return userEvent.click(screen.getByRole("button"));
  }

  function setup(props: { title?: string; subtitle?: string; fileName?: string }, options?: { withTarget?: boolean }) {
    vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/png;base64,fake");
    const fakeContext = mock<CanvasRenderingContext2D>({ measureText: vi.fn().mockReturnValue(mock<TextMetrics>({ width: 100 })) });
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(fakeContext as unknown as RenderingContext);

    let downloadedFileName: string | null = null;
    vi.spyOn(HTMLAnchorElement.prototype, "download", "set").mockImplementation(function (this: HTMLAnchorElement, value: string) {
      downloadedFileName = value;
    });
    let downloadedHref: string | null = null;
    vi.spyOn(HTMLAnchorElement.prototype, "href", "set").mockImplementation(function (this: HTMLAnchorElement, value: string) {
      downloadedHref = value;
    });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    mockedToCanvas.mockClear();
    mockedToCanvas.mockResolvedValue(document.createElement("canvas"));
    const targetRef = createRef<HTMLDivElement>();

    const result = render(
      <>
        {options?.withTarget !== false && <div ref={targetRef} />}
        <ChartDownloadButton
          targetRef={targetRef}
          fileName={props.fileName ?? "chart-snapshot"}
          title={props.title ?? "Chart"}
          subtitle={props.subtitle}
          csv={CSV}
        />
      </>
    );

    return { targetRef, downloadedFileName: () => downloadedFileName, downloadedHref: () => downloadedHref, ...result };
  }
});
