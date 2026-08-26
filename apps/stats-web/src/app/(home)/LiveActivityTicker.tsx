"use client";
import { useEffect, useMemo, useState } from "react";
import { FormattedRelativeTime } from "react-intl";

import { AKTAmount } from "@/components/AKTAmount";
import { useFriendlyMessageType } from "@/hooks/useFriendlyMessageType";
import { getSplitText } from "@/hooks/useShortText";
import type { Block, TransactionDetail } from "@/types";

const ROTATE_INTERVAL_MS = 4000;

type ActivityEvent =
  | { kind: "block"; key: string; datetime: string; height: number; proposer: string; txCount: number }
  | { kind: "transaction"; key: string; datetime: string; height: number; hash: string; messageType: string; isSuccess: boolean; fee: number };

function buildFeed(blocks: Block[], transactions: TransactionDetail[]): ActivityEvent[] {
  const blockEvents: ActivityEvent[] = blocks.map(block => ({
    kind: "block",
    key: `block-${block.height}`,
    datetime: block.datetime,
    height: block.height,
    proposer: block.proposer.moniker,
    txCount: block.transactionCount
  }));

  const transactionEvents: ActivityEvent[] = transactions.map(tx => ({
    kind: "transaction",
    key: `tx-${tx.hash}`,
    datetime: tx.datetime,
    height: tx.height,
    hash: tx.hash,
    messageType: tx.messages[0]?.isReceiver ? "Receive" : tx.messages[0]?.type ?? "",
    isSuccess: tx.isSuccess,
    fee: tx.fee
  }));

  return [...blockEvents, ...transactionEvents].sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
}

function ActivityLine({ event }: { event: ActivityEvent }) {
  const friendlyType = useFriendlyMessageType(event.kind === "transaction" ? event.messageType : "");

  return (
    <div className="flex w-full items-center justify-between gap-x-5">
      <div className="flex min-w-0 items-center gap-x-3">
        <span className="whitespace-nowrap text-xs text-muted-foreground">
          <FormattedRelativeTime
            value={(new Date(event.datetime).getTime() - Date.now()) / 1000}
            numeric="auto"
            unit="second"
            style="short"
            updateIntervalInSeconds={7}
          />
        </span>
        <span className="truncate text-sm font-semibold text-foreground">
          {event.kind === "block" ? "New block produced" : event.isSuccess ? friendlyType || "Transaction" : "Transaction failed"}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-x-5">
        {event.kind === "block" ? (
          <span className="font-mono text-sm text-muted-foreground">
            #{event.height} · {event.proposer} · {event.txCount} tx
          </span>
        ) : (
          <>
            <span className="font-mono text-sm text-muted-foreground">
              {getSplitText(event.hash, 6, 6)} · block #{event.height}
            </span>
            {event.fee > 0 && (
              <span className="font-mono text-sm text-muted-foreground">
                <AKTAmount uakt={event.fee} showAKTLabel />
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export type LiveActivityTickerProps = {
  latestBlocks: Block[];
  latestTransactions: TransactionDetail[];
};

export const LiveActivityTicker: React.FunctionComponent<LiveActivityTickerProps> = ({ latestBlocks, latestTransactions }) => {
  const feed = useMemo(() => buildFeed(latestBlocks, latestTransactions), [latestBlocks, latestTransactions]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (feed.length < 2) return;
    const timer = setInterval(() => setIndex(current => (current + 1) % feed.length), ROTATE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [feed.length]);

  if (feed.length === 0) return null;

  const current = feed[index % feed.length];

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-2.5">
      <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-success">
        <span className="size-1.5 animate-pulse rounded-full bg-success" />
        Live
      </span>
      <div key={current.key} className="min-w-0 flex-1 duration-300 animate-in fade-in slide-in-from-bottom-1">
        <ActivityLine event={current} />
      </div>
    </div>
  );
};
