import type { FC, ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger, Tooltip, TooltipContent, TooltipTrigger } from "@akashnetwork/ui/components";
import { InfoCircle } from "iconoir-react";

export type StatCardTabItem = {
  value: string;
  label: string;
  tooltip?: string;
  content: ReactNode;
  panel: ReactNode;
};

export type StatCardTabsProps = {
  items: StatCardTabItem[];
  defaultValue: string;
};

export const StatCardTabs: FC<StatCardTabsProps> = ({ items, defaultValue }) => (
  <Tabs defaultValue={defaultValue}>
    <TabsList className="h-auto w-full justify-start gap-0 rounded-none border-0 bg-transparent p-0">
      {items.map(item => (
        <TabsTrigger
          key={item.value}
          value={item.value}
          aria-label={item.label}
          className="group relative flex flex-1 flex-col items-start gap-2 whitespace-normal rounded-none border border-border bg-card p-6 text-left shadow-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:bg-accent data-[state=active]:text-foreground data-[state=active]:shadow-none [&:not(:first-child)]:-ml-px"
        >
          <span className="absolute inset-x-0 bottom-0 h-1 bg-transparent group-data-[state=active]:bg-foreground" />
          <span className="flex items-center gap-1.5 text-sm font-medium text-card-foreground">
            {item.label}
            {item.tooltip && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircle className="size-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-balance">{item.tooltip}</TooltipContent>
              </Tooltip>
            )}
          </span>
          <span className="flex items-center gap-2 text-2xl font-bold text-card-foreground">{item.content}</span>
        </TabsTrigger>
      ))}
    </TabsList>

    {items.map(item => (
      <TabsContent key={item.value} value={item.value} className="mt-0">
        {item.panel}
      </TabsContent>
    ))}
  </Tabs>
);
