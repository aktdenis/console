"use client";
import type { FC } from "react";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@akashnetwork/ui/components";
import { FileDown } from "lucide-react";

export const DownloadPdfButton: FC = () => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline" size="icon" className="size-8" onClick={() => window.print()} aria-label="Download report as PDF">
        <FileDown className="size-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>Download as PDF</TooltipContent>
  </Tooltip>
);
