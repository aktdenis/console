"use client";
import { type FC, type RefObject, useState } from "react";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@akashnetwork/ui/components";
import { Parser } from "@json2csv/plainjs";
import { toCanvas } from "html-to-image";
import { Download } from "iconoir-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { composeSnapshotImage } from "@/components/charts/chartSnapshot/composeSnapshotImage";

export type ChartCsvData = {
  fields: { label: string; value: string }[];
  rows: Record<string, unknown>[];
};

export type ChartDownloadButtonProps = {
  targetRef: RefObject<HTMLElement | null>;
  /** Base file name, no extension - each format appends its own. */
  fileName: string;
  title: string;
  subtitle?: string;
  csv: ChartCsvData;
};

function downloadUrl(href: string, fileName: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName;
  link.click();
}

function formatPdfCell(value: unknown): string {
  if (typeof value === "number") return value.toLocaleString();
  return value === null || value === undefined ? "—" : String(value);
}

export const ChartDownloadButton: FC<ChartDownloadButtonProps> = ({ targetRef, fileName, title, subtitle, csv }) => {
  const [isExporting, setIsExporting] = useState(false);

  const downloadPng = async () => {
    if (!targetRef.current || isExporting) return;

    setIsExporting(true);
    try {
      const chartCanvas = await toCanvas(targetRef.current, { pixelRatio: 2, backgroundColor: "#ffffff" });
      const snapshotCanvas = composeSnapshotImage(chartCanvas, { title, subtitle, url: window.location.href, capturedAt: new Date() });
      downloadUrl(snapshotCanvas.toDataURL("image/png"), `${fileName}.png`);
    } finally {
      setIsExporting(false);
    }
  };

  const downloadCsv = () => {
    const csvContent = new Parser({ fields: csv.fields }).parse(csv.rows);
    downloadUrl(encodeURI(`data:text/csv;charset=utf-8,${csvContent}`), `${fileName}.csv`);
  };

  const downloadPdf = () => {
    const doc = new jsPDF({ orientation: csv.fields.length > 4 ? "landscape" : "portrait" });

    doc.setFontSize(14);
    doc.text(title, 40, 40);
    if (subtitle) {
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text(subtitle, 40, 58);
    }

    autoTable(doc, {
      startY: subtitle ? 72 : 56,
      head: [csv.fields.map(field => field.label)],
      body: csv.rows.map(row => csv.fields.map(field => formatPdfCell(row[field.value])))
    });

    downloadUrl(doc.output("datauristring"), `${fileName}.pdf`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-8 w-8 p-0" disabled={isExporting} aria-label={isExporting ? "Preparing chart download" : "Download chart"}>
          <Download className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={downloadPng}>Download as PNG</DropdownMenuItem>
        <DropdownMenuItem onClick={downloadCsv}>Download as CSV</DropdownMenuItem>
        <DropdownMenuItem onClick={downloadPdf}>Download as PDF</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
