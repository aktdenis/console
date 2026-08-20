"use client";
import React from "react";
import { Button, Card, CardContent, CardFooter, CardTitle, CustomTooltip } from "@akashnetwork/ui/components";
import { GraphUp, HelpCircle } from "iconoir-react";
import Link from "next/link";

import { DiffPercentageChip } from "@/components/DiffPercentageChip";

interface IStatsCardProps {
  number: React.ReactNode;
  subNumber?: React.ReactNode;
  text: string;
  diffNumber?: number;
  diffNumberUnit?: string;
  diffPercent?: number;
  tooltip?: string | React.ReactNode;
  graphPath?: string;
  actionButton?: string | React.ReactNode;
}

export const StatsCard: React.FunctionComponent<IStatsCardProps> = ({ number, subNumber, text, tooltip, actionButton, graphPath, diffNumber, diffPercent }) => {
  return (
    <Card className="flex flex-col justify-between rounded-xl">
      <CardContent className="flex flex-col gap-1.5 p-5">
        <div className="flex flex-row items-center gap-1.5">
          <CardTitle className="text-xs font-medium leading-none text-muted-foreground">{text}</CardTitle>
          {tooltip && (
            <CustomTooltip title={tooltip}>
              <HelpCircle className="text-xs text-muted-foreground" />
            </CustomTooltip>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="text-3xl font-semibold leading-none text-foreground">{number}</div>

          {(!!diffNumber || !!diffPercent) && (
            <div className="inline-flex items-center">
              {/* {!!diffNumber && (
                <div className="ml-2 text-xs text-muted-foreground">
                  <DiffNumber className="flex items-center" value={diffNumber} unit={diffNumberUnit} />
                </div>
              )} */}

              {!!diffPercent && <DiffPercentageChip value={diffPercent} />}
            </div>
          )}
        </div>

        {subNumber && <div className="text-xs text-muted-foreground">{subNumber}</div>}
      </CardContent>

      {graphPath && (
        <CardFooter className="p-0">
          <Link href={graphPath} className="w-full">
            <Button
              aria-label="graph"
              size="sm"
              className="w-full rounded-t-[0px] bg-secondary text-sm hover:bg-secondary/80 dark:bg-secondary/50"
              variant="ghost"
            >
              <span className="mr-2">Graph</span>
              <GraphUp className="text-xs" />
            </Button>
          </Link>

          {actionButton}
        </CardFooter>
      )}
    </Card>
  );
};
