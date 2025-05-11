
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";

const NetWorthCard: React.FC = () => {
  const { calculateNetWorth } = useFinance();
  const { assets, liabilities, netWorth, receivables, payables } = calculateNetWorth();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">Net Worth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">₹{netWorth.toLocaleString('en-IN')}</div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-500">Assets</p>
            <p className="text-lg font-medium text-green-600">₹{assets.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Liabilities</p>
            <p className="text-lg font-medium text-red-500">₹{liabilities.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <p className="text-sm text-gray-500">Receivables</p>
            <p className="text-lg font-medium text-green-600">₹{receivables.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Payables</p>
            <p className="text-lg font-medium text-red-500">₹{payables.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetWorthCard;
