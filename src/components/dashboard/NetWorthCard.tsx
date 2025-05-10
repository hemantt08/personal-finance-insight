
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";

const NetWorthCard: React.FC = () => {
  const { calculateNetWorth } = useFinance();
  const { assets, liabilities, netWorth } = calculateNetWorth();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">Net Worth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">₹{netWorth.toFixed(2)}</div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-500">Assets</p>
            <p className="text-lg font-medium text-green-600">₹{assets.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Liabilities</p>
            <p className="text-lg font-medium text-red-500">₹{liabilities.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetWorthCard;
