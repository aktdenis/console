"use client";
import { type FC, type RefObject, useState } from "react";
import { Button } from "@akashnetwork/ui/components";
import { toCanvas } from "html-to-image";
import { Download } from "iconoir-react";

import { composeSnapshotImage } from "@/components/charts/chartSnapshot/composeSnapshotImage";

export type ChartDownloadButtonProps = {
  targetRef: RefObject<HTMLElement | null>;
  fileName: string;
  title: string;
  subtitle?: string;
};

export const ChartDownloadButton: FC<ChartDownloadButtonProps> = ({ targetRef, fileName, title, subtitle }) => {
  const [isExporting, setIsExporting] = useState(false);

  const downloadSnapshot = async () => {
    if (!targetRef.current || isExporting) return;

    setIsExporting(true);
    try {
      const chartCanvas = await toCanvas(targetRef.current, { pixelRatio: 2, backgroundColor: "#ffffff" });
      const snapshotCanvas = composeSnapshotImage(chartCanvas, { title, subtitle, url: window.location.href, capturedAt: new Date() });

      const link = document.createElement("a");
      link.href = snapshotCanvas.toDataURL("image/png");
      link.download = fileName;
      link.click();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="h-9 w-9 p-0"
      onClick={downloadSnapshot}
      disabled={isExporting}
      aria-label={isExporting ? "Preparing chart download" : "Download chart as image"}
    >
      <Download className="size-4" />
    </Button>
  );
};
