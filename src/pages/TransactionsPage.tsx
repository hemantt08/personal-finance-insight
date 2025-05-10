
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import { FinanceProvider, useFinance } from "@/context/FinanceContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AddTransaction from "@/components/transactions/AddTransaction";
import { Transaction } from "@/types/finance";

const TransactionContent = () => {
  const { transactions, banks, deleteTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const bankName = (id: string) => {
    const bank = banks.find(b => b.id === id);
    return bank ? bank.name : 'Unknown';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredTransactions = transactions.filter((transaction) => {
    // Apply search filter
    const searchMatch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        transaction.payerPayee.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply type filter
    const typeMatch = typeFilter === "all" || transaction.type === typeFilter;
    
    // Apply date filter
    const dateMatch = !dateFilter || transaction.date.startsWith(dateFilter);
    
    return searchMatch && typeMatch && dateMatch;
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id);
    }
  };

  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Income">Income</SelectItem>
              <SelectItem value="Expense">Expense</SelectItem>
              <SelectItem value="Transfer">Transfer</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            type="month"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-[180px]"
          />
          
          <Button onClick={() => setIsAddDialogOpen(true)}>
            Add Transaction
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Payer/Payee</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              sortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{bankName(transaction.bankId)}</TableCell>
                  <TableCell>{transaction.payerPayee}</TableCell>
                  <TableCell className={`text-right font-medium ${
                    transaction.type === "Income" ? "text-green-600" : 
                    transaction.type === "Expense" ? "text-red-600" : ""
                  }`}>
                    {transaction.type === "Income" ? "+" : transaction.type === "Expense" ? "-" : ""}
                    ₹{transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
            <DialogDescription>
              Record your income or expenses.
            </DialogDescription>
          </DialogHeader>
          <AddTransaction onSuccess={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const TransactionsPage = () => {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <PageContainer 
          title="Transactions" 
          description="Manage your income and expenses"
        >
          <TransactionContent />
        </PageContainer>
      </div>
    </FinanceProvider>
  );
};

export default TransactionsPage;
