"use client";
import { Card, CardContent, Spinner, Table, TableBody, TableHead, TableHeader, TableRow } from "@akashnetwork/ui/components";

import { TransactionRow } from "@/components/blockchain/TransactionRow";
import { useTransactions } from "@/queries";

export const TransactionsTable: React.FunctionComponent = () => {
  const { data: transactions, isLoading } = useTransactions(20, {
    refetchInterval: 7000
  });

  return (
    <Card className="flex w-full flex-col justify-between overflow-hidden">
      <CardContent className="px-0">
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center pt-8">
              <Spinner size="large" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tx Hash</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Height</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>{transactions?.map(tx => <TransactionRow key={tx.hash} transaction={tx} blockHeight={tx.height} />)}</TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
