
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import FinanceChart from "../FinanceChart";

const ExpenseBreakdown: React.FC = () => {
  const { getMonthlyCategories } = useFinance();
  
  // Get current month in YYYY-MM format
  const currentDate = new Date();
  const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  
  const [selectedMonth, setSelectedMonth] = React.useState(currentMonth);
  
  // Generate months for the dropdown
  const months = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    months.push({ value: monthValue, label: monthLabel });
  }
  
  // Get category data
  const categoryData = getMonthlyCategories(selectedMonth);
  
  // Convert to chart data format
  const chartData = Object.entries(categoryData)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => ({
      name: category,
      value
    }));
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-medium">Expense Breakdown</CardTitle>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="text-sm border rounded p-1"
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center">
            <p className="text-gray-500">No expenses this month</p>
          </div>
        ) : (
          <FinanceChart
            data={chartData}
            type="pie"
            dataKey="value"
            height={250}
            valueFormatter={(value) => `₹${value.toFixed(2)}`}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseBreakdown;
