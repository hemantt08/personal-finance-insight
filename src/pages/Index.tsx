
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

const Dashboard = () => {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <PageContainer title="Dashboard" description="Your financial overview">
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
        </PageContainer>
      </div>
    </FinanceProvider>
  );
};

export default Dashboard;
