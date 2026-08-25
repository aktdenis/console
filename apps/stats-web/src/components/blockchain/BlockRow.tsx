"use client";
import { FormattedRelativeTime } from "react-intl";
import { TableCell, TableRow } from "@akashnetwork/ui/components";
import Link from "next/link";

import { getShortText } from "@/hooks/useShortText";
import { UrlService } from "@/lib/urlUtils";
import type { Block } from "@/types";

type Props = {
  errors?: string;
  block: Block;
};

export const BlockRow: React.FunctionComponent<Props> = ({ block }) => {
  return (
    <TableRow>
      <TableCell>
        <Link href={UrlService.block(block.height)}>{block.height}</Link>
      </TableCell>
      <TableCell>
        <Link href={UrlService.validator(block.proposer.operatorAddress)}>
          <span className="max-[150px] line-clamp-1">{getShortText(block.proposer.moniker, 20)}</span>
        </Link>
      </TableCell>
      <TableCell>{block.transactionCount}</TableCell>
      <TableCell className="whitespace-nowrap">
        <span className="text-sm">
          <FormattedRelativeTime
            value={(new Date(block.datetime).getTime() - new Date().getTime()) / 1000}
            numeric="auto"
            unit="second"
            style="short"
            updateIntervalInSeconds={7}
          />
        </span>
      </TableCell>
    </TableRow>
  );
};
