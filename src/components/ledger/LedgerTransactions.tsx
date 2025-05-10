
import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import AddLedgerTransactionForm from "./AddLedgerTransactionForm";

const LedgerTransactions = () => {
  const { ledgerTransactions, people } = useFinance();
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const getPersonName = (id: string) => {
    const person = people.find(p => p.id === id);
    return person ? person.name : "Unknown";
  };

  return (
    <div className="space-y-6">
      {!showAddTransaction ? (
        <div className="flex justify-end">
          <Button onClick={() => setShowAddTransaction(true)}>
            Add Transaction
          </Button>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Add Ledger Transaction</CardTitle>
            <CardDescription>Record a transaction between people</CardDescription>
          </CardHeader>
          <CardContent>
            <AddLedgerTransactionForm onSuccess={() => setShowAddTransaction(false)} />
          </CardContent>
        </Card>
      )}
      
      {ledgerTransactions && ledgerTransactions.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>All transactions between people</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledgerTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{format(new Date(transaction.date), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{getPersonName(transaction.fromPersonId)}</TableCell>
                    <TableCell>{getPersonName(transaction.toPersonId)}</TableCell>
                    <TableCell>₹{transaction.amount.toLocaleString('en-IN')}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="text-right">
                      <span className={transaction.isPaid ? "text-green-600" : "text-amber-600"}>
                        {transaction.isPaid ? "Paid" : "Pending"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        !showAddTransaction && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No ledger transactions recorded yet. Add a transaction to get started.
              </p>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
};

export default LedgerTransactions;
