// @vitest-environment jsdom
import { createRef } from "react";
import { toCanvas } from "html-to-image";
import { afterEach, describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";

import { ChartDownloadButton } from "@/components/charts/chartSnapshot/ChartDownloadButton";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

vi.mock("html-to-image", () => ({ toCanvas: vi.fn() }));

const mockedToCanvas = vi.mocked(toCanvas);

describe(ChartDownloadButton.name, () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("captures the target element at a higher pixel ratio for a crisp export", async () => {
    const { targetRef } = setup({});

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(mockedToCanvas).toHaveBeenCalledWith(targetRef.current, expect.objectContaining({ pixelRatio: 2 })));
  });

  it("triggers a download of the composed image under the given file name", async () => {
    const { clickSpy } = setup({ fileName: "akt-spent-snapshot.png" });
    let downloadedFileName: string | null = null;
    vi.spyOn(HTMLAnchorElement.prototype, "download", "set").mockImplementation(function (this: HTMLAnchorElement, value: string) {
      downloadedFileName = value;
    });

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(clickSpy).toHaveBeenCalled());
    expect(downloadedFileName).toBe("akt-spent-snapshot.png");
  });

  it("disables the button while exporting and re-enables it once done", async () => {
    let resolveToCanvas: (canvas: HTMLCanvasElement) => void = () => {};
    setup({});
    mockedToCanvas.mockReturnValue(new Promise(resolve => (resolveToCanvas = resolve)));

    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(screen.getByRole("button")).toBeDisabled());

    resolveToCanvas(document.createElement("canvas"));
    await waitFor(() => expect(screen.getByRole("button")).not.toBeDisabled());
  });

  it("does nothing when the target element isn't mounted yet", () => {
    setup({}, { withTarget: false });

    fireEvent.click(screen.getByRole("button"));

    expect(mockedToCanvas).not.toHaveBeenCalled();
  });

  function setup(props: { title?: string; subtitle?: string; fileName?: string }, options?: { withTarget?: boolean }) {
    vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/png;base64,fake");
    const fakeContext = mock<CanvasRenderingContext2D>({ measureText: vi.fn().mockReturnValue(mock<TextMetrics>({ width: 100 })) });
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(fakeContext as unknown as RenderingContext);
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    mockedToCanvas.mockClear();
    mockedToCanvas.mockResolvedValue(document.createElement("canvas"));
    const targetRef = createRef<HTMLDivElement>();

    const result = render(
      <>
        {options?.withTarget !== false && <div ref={targetRef} />}
        <ChartDownloadButton targetRef={targetRef} fileName={props.fileName ?? "chart-snapshot.png"} title={props.title ?? "Chart"} subtitle={props.subtitle} />
      </>
    );

    return { targetRef, clickSpy, ...result };
  }
});
