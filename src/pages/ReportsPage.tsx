
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import { FinanceProvider, useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FinanceChart from "@/components/FinanceChart";
import { Input } from "@/components/ui/input";
import DashboardCard from "@/components/DashboardCard";

const ReportsContent = () => {
  const { calculateMonthlyData, getMonthlyCategories, banks, investments, receivables, liabilities } = useFinance();
  
  // States for date filters
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  // Generate monthly income/expense data
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = `${selectedYear}-${String(i + 1).padStart(2, '0')}`;
    const { income, expense, balance } = calculateMonthlyData(month);
    return {
      name: new Date(selectedYear, i).toLocaleDateString('en-US', { month: 'short' }),
      income,
      expense,
      balance
    };
  });
  
  // Calculate yearly totals
  const yearlyTotals = monthlyData.reduce(
    (acc, month) => {
      acc.income += month.income;
      acc.expense += month.expense;
      acc.balance += month.balance;
      return acc;
    },
    { income: 0, expense: 0, balance: 0 }
  );
  
  // Get current month's expense categories
  const currentMonth = `${currentYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  const categoryData = getMonthlyCategories(currentMonth);
  
  // Convert to chart data format
  const categoryChartData = Object.entries(categoryData)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => ({
      name: category,
      value
    }));
  
  // Create asset allocation data
  const assetAllocationData = [
    { name: "Bank Accounts", value: banks.reduce((sum, bank) => sum + bank.balance, 0) },
    { name: "Investments", value: investments.reduce((sum, inv) => sum + inv.currentValue, 0) },
    { name: "Receivables", value: receivables.filter(r => !r.isPaid).reduce((sum, r) => sum + r.amount, 0) }
  ].filter(item => item.value > 0);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Financial Reports</h2>
        <div className="flex items-center space-x-2">
          <span>Year:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border rounded p-1"
          >
            {[currentYear - 2, currentYear - 1, currentYear].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Income"
          value={`$${yearlyTotals.income.toFixed(2)}`}
          valueClassName="text-green-600"
        />
        <DashboardCard
          title="Total Expenses"
          value={`$${yearlyTotals.expense.toFixed(2)}`}
          valueClassName="text-red-600"
        />
        <DashboardCard
          title="Net Savings"
          value={`$${yearlyTotals.balance.toFixed(2)}`}
          valueClassName={yearlyTotals.balance >= 0 ? "text-green-600" : "text-red-600"}
        />
      </div>
      
      <Tabs defaultValue="income-expense">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="income-expense">Income & Expense</TabsTrigger>
          <TabsTrigger value="categories">Expense Categories</TabsTrigger>
          <TabsTrigger value="assets">Asset Allocation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="income-expense" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Monthly Income & Expenses ({selectedYear})</CardTitle>
              <CardDescription>
                Track your monthly financial flow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FinanceChart
                data={monthlyData}
                type="bar"
                barKeys={['income', 'expense']}
                xAxisKey="name"
                colors={['#4ade80', '#f87171']}
                height={400}
                valueFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <div className="flex justify-center mt-4 space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#4ade80] rounded-full mr-2" />
                  <span className="text-sm text-gray-600">Income</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#f87171] rounded-full mr-2" />
                  <span className="text-sm text-gray-600">Expense</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Expense Categories (Current Month)</CardTitle>
              <CardDescription>
                Where your money is going
              </CardDescription>
            </CardHeader>
            <CardContent>
              {categoryChartData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-gray-500">No expenses recorded for this month</p>
                </div>
              ) : (
                <FinanceChart
                  data={categoryChartData}
                  type="pie"
                  dataKey="value"
                  height={400}
                  valueFormatter={(value) => `$${value.toFixed(2)}`}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assets" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Asset Allocation</CardTitle>
              <CardDescription>
                How your assets are distributed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assetAllocationData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-gray-500">No assets recorded</p>
                </div>
              ) : (
                <FinanceChart
                  data={assetAllocationData}
                  type="pie"
                  dataKey="value"
                  height={400}
                  valueFormatter={(value) => `$${value.toFixed(2)}`}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ReportsPage = () => {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <PageContainer 
          title="Reports" 
          description="Analyze your financial data"
        >
          <ReportsContent />
        </PageContainer>
      </div>
    </FinanceProvider>
  );
};

export default ReportsPage;
