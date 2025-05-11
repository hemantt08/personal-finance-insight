
import React from "react";
import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import { FinanceProvider } from "@/context/FinanceContext";
import NetWorthCard from "@/components/dashboard/NetWorthCard";
import AccountsOverview from "@/components/dashboard/AccountsOverview";
import DebtSummary from "@/components/dashboard/DebtSummary";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import MonthlyOverview from "@/components/dashboard/MonthlyOverview";
import ExpenseBreakdown from "@/components/dashboard/ExpenseBreakdown";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { useState } from "react";
import AddTransaction from "@/components/transactions/AddTransaction";

const Dashboard = () => {
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <PageContainer title="Dashboard" description="Your financial overview">
          <div className="flex justify-end mb-6">
            <Button onClick={() => setIsAddTransactionOpen(true)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NetWorthCard />
            <AccountsOverview />
            <DebtSummary />
          </div>
          
          <div className="mt-6">
            <RecentTransactions />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <MonthlyOverview />
            <ExpenseBreakdown />
          </div>
          
          <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add Transaction</DialogTitle>
                <DialogDescription>
                  Record an income, expense, or transfer.
                </DialogDescription>
              </DialogHeader>
              <AddTransaction onSuccess={() => setIsAddTransactionOpen(false)} />
            </DialogContent>
          </Dialog>
        </PageContainer>
      </div>
    </FinanceProvider>
  );
};

export default Dashboard;
