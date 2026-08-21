export const SNAPSHOT_WIDTH = 1920;
export const SNAPSHOT_HEIGHT = 1080;

export type Rect = { x: number; y: number; width: number; height: number };

/** Scales an image to fit inside `area` without distortion, centered on both axes. */
export function fitCentered(imageWidth: number, imageHeight: number, area: Rect): Rect {
  const scale = Math.min(area.width / imageWidth, area.height / imageHeight);
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  return {
    x: area.x + (area.width - width) / 2,
    y: area.y + (area.height - height) / 2,
    width,
    height
  };
}

export function formatSnapshotTimestamp(date: Date): string {
  return `${new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(date)} UTC`;
}
