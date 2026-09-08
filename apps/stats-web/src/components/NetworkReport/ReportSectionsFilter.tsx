"use client";
import type { FC } from "react";
import { Button, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@akashnetwork/ui/components";
import { ListFilter, RotateCcw } from "lucide-react";

import { ALL_REPORT_SECTION_KEYS, REPORT_SECTIONS, type ReportSectionKey } from "@/components/NetworkReport/reportSections";
import { cn } from "@/lib/utils";

export type ReportSectionsFilterProps = {
  selected: ReportSectionKey[];
  onChange: (selected: ReportSectionKey[]) => void;
};

export const ReportSectionsFilter: FC<ReportSectionsFilterProps> = ({ selected, onChange }) => {
  const hiddenCount = REPORT_SECTIONS.length - selected.length;
  const triggerLabel = hiddenCount === 0 ? "All sections" : `${selected.length} of ${REPORT_SECTIONS.length} sections`;

  function toggle(key: ReportSectionKey) {
    onChange(selected.includes(key) ? selected.filter(k => k !== key) : [...selected, key]);
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 rounded-full">
            <ListFilter className="size-4" aria-hidden="true" />
            {triggerLabel}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {REPORT_SECTIONS.map(section => (
            <DropdownMenuCheckboxItem
              key={section.key}
              checked={selected.includes(section.key)}
              onSelect={event => event.preventDefault()}
              onCheckedChange={() => toggle(section.key)}
            >
              {section.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <span
        className={cn(
          "flex size-5 items-center justify-center rounded-full text-xs font-medium",
          hiddenCount === 0 ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
        )}
      >
        {hiddenCount}
      </span>

      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5 text-muted-foreground"
        disabled={hiddenCount === 0}
        onClick={() => onChange(ALL_REPORT_SECTION_KEYS)}
      >
        Reset filters
        <RotateCcw className="size-3.5" aria-hidden="true" />
      </Button>
    </div>
  );
};
