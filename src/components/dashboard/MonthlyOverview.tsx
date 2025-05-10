
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import FinanceChart from "../FinanceChart";

const MonthlyOverview: React.FC = () => {
  const { calculateMonthlyData } = useFinance();
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());
  
  // Generate data for monthly overview
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = `${selectedYear}-${String(i + 1).padStart(2, '0')}`;
    const { income, expense } = calculateMonthlyData(month);
    return {
      name: new Date(selectedYear, i).toLocaleDateString('en-US', { month: 'short' }),
      income,
      expense
    };
  });
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-medium">Monthly Overview {selectedYear}</CardTitle>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="text-sm border rounded p-1"
        >
          {[2023, 2024, 2025].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </CardHeader>
      <CardContent>
        <FinanceChart
          data={monthlyData}
          type="bar"
          barKeys={['income', 'expense']}
          xAxisKey="name"
          colors={['#4ade80', '#f87171']}
          height={250}
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
  );
};

export default MonthlyOverview;
