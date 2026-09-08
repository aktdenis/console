import type { FC } from "react";
import { FormattedNumber } from "react-intl";
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@akashnetwork/ui/components";

import type { CapacityBubbleRow } from "@/components/charts/GlobalGrid/NetworkCapacityBubbles";

export type NetworkCapacityTableProps = {
  rows: CapacityBubbleRow[];
  className?: string;
};

export const NetworkCapacityTable: FC<NetworkCapacityTableProps> = ({ rows, className }) => (
  <Card className={className}>
    <CardHeader className="gap-1.5 space-y-0">
      <CardTitle className="text-base">Network capacity</CardTitle>
    </CardHeader>

    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Resource</TableHead>
            <TableHead className="text-right">Total capacity</TableHead>
            <TableHead className="text-right">Utilization</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.key}>
              <TableCell className="font-medium">{row.label}</TableCell>
              <TableCell className="text-right tabular-nums">{row.valueLabel}</TableCell>
              <TableCell className="text-right tabular-nums">
                <FormattedNumber value={row.percent} style="percent" maximumFractionDigits={1} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);
