import { fitCentered, formatSnapshotTimestamp, SNAPSHOT_HEIGHT, SNAPSHOT_WIDTH } from "@/components/charts/chartSnapshot/chartSnapshotLayout";

const MARGIN = 64;
const HEADER_HEIGHT = 220;
const FOOTER_HEIGHT = 120;

export type SnapshotInfo = {
  title: string;
  subtitle?: string;
  url: string;
  capturedAt: Date;
};

/** Composites a captured chart canvas onto a branded 1920x1080 snapshot, ready to export as a PNG. */
export function composeSnapshotImage(chartCanvas: HTMLCanvasElement, info: SnapshotInfo): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = SNAPSHOT_WIDTH;
  canvas.height = SNAPSHOT_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, SNAPSHOT_WIDTH, SNAPSHOT_HEIGHT);

  ctx.fillStyle = "#737373";
  ctx.font = "600 28px Arial, sans-serif";
  ctx.fillText("Akash Stats", MARGIN, 76);

  ctx.fillStyle = "#0a0a0a";
  ctx.font = "700 44px Arial, sans-serif";
  ctx.fillText(info.title, MARGIN, 148);

  if (info.subtitle) {
    ctx.fillStyle = "#737373";
    ctx.font = "400 26px Arial, sans-serif";
    ctx.fillText(info.subtitle, MARGIN, 188);
  }

  const chartArea = fitCentered(chartCanvas.width, chartCanvas.height, {
    x: MARGIN,
    y: HEADER_HEIGHT,
    width: SNAPSHOT_WIDTH - MARGIN * 2,
    height: SNAPSHOT_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT
  });
  ctx.drawImage(chartCanvas, chartArea.x, chartArea.y, chartArea.width, chartArea.height);

  const footerY = SNAPSHOT_HEIGHT - FOOTER_HEIGHT;
  ctx.strokeStyle = "#e5e5e5";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(MARGIN, footerY);
  ctx.lineTo(SNAPSHOT_WIDTH - MARGIN, footerY);
  ctx.stroke();

  ctx.fillStyle = "#737373";
  ctx.font = "400 22px Arial, sans-serif";
  ctx.fillText(`Snapshot taken ${formatSnapshotTimestamp(info.capturedAt)}`, MARGIN, footerY + 48);

  const urlText = info.url;
  const urlWidth = ctx.measureText(urlText).width;
  ctx.fillText(urlText, SNAPSHOT_WIDTH - MARGIN - urlWidth, footerY + 48);

  return canvas;
}
