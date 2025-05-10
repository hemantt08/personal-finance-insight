
import React from "react";
import { Link } from "react-router-dom";
import { useFinance } from "@/context/FinanceContext";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AddTransaction from "../transactions/AddTransaction";

const Header: React.FC = () => {
  const { calculateNetWorth } = useFinance();
  const { netWorth } = calculateNetWorth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary">
              FinTrack
            </Link>
            <div className="hidden md:flex space-x-6 ml-10">
              <Link to="/" className="font-medium text-gray-600 hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link to="/transactions" className="font-medium text-gray-600 hover:text-primary transition-colors">
                Transactions
              </Link>
              <Link to="/accounts" className="font-medium text-gray-600 hover:text-primary transition-colors">
                Accounts
              </Link>
              <Link to="/reports" className="font-medium text-gray-600 hover:text-primary transition-colors">
                Reports
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="text-sm text-gray-600">Net Worth</div>
              <div className="text-lg font-semibold">₹{netWorth.toFixed(2)}</div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" size="sm" className="flex items-center">
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Transaction</DialogTitle>
                  <DialogDescription>
                    Record your income or expenses.
                  </DialogDescription>
                </DialogHeader>
                <AddTransaction />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
