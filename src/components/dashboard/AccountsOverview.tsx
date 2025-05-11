
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import AddBankForm from "../accounts/AddBankForm";
import AccountTypeTag from "../accounts/AccountTypeTag";
import { AccountType } from "@/types/finance";

const AccountsOverview: React.FC = () => {
  const { accounts, creditCardExtras } = useFinance();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // Group accounts by type
  const accountsByType = accounts.reduce((acc, account) => {
    if (!acc[account.type]) {
      acc[account.type] = [];
    }
    acc[account.type].push(account);
    return acc;
  }, {} as Record<AccountType, typeof accounts>);

  const getCreditCardInfo = (accountId: string) => {
    return creditCardExtras.find(cc => cc.accountId === accountId);
  };

  const renderAccountsByType = (type: AccountType) => {
    if (!accountsByType[type] || accountsByType[type].length === 0) {
      return null;
    }

    return (
      <div key={type} className="mb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">{type}s</h3>
        <div className="space-y-2">
          {accountsByType[type].map((account) => {
            const isCreditCard = account.type === "Credit Card";
            const ccInfo = isCreditCard ? getCreditCardInfo(account.id) : null;
            
            return (
              <div 
                key={account.id} 
                className="flex items-center justify-between p-3 rounded-md"
                style={{ backgroundColor: `${account.color}15` }}
              >
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3" 
                    style={{ backgroundColor: account.color }} 
                  />
                  <span className="font-medium">{account.name}</span>
                </div>
                <div className="flex flex-col items-end">
                  <div className="font-medium">
                    ₹{account.balance.toLocaleString('en-IN')}
                  </div>
                  {isCreditCard && ccInfo && (
                    <div className="text-xs text-gray-500">
                      {ccInfo.currentOutstanding > ccInfo.creditLimit ? (
                        <span className="text-red-500">Over Limit!</span>
                      ) : (
                        <span>Available: ₹{(ccInfo.creditLimit - ccInfo.currentOutstanding).toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-medium">Accounts</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <PlusIcon className="h-4 w-4 mr-1" /> Add
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Account</DialogTitle>
              <DialogDescription>
                Add a new account to track your finances.
              </DialogDescription>
            </DialogHeader>
            <AddBankForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accounts.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500">No accounts yet</p>
              <Button 
                variant="link" 
                onClick={() => setIsDialogOpen(true)}
                className="mt-2"
              >
                Add your first account
              </Button>
            </div>
          ) : (
            <>
              {renderAccountsByType("Bank")}
              {renderAccountsByType("Wallet")}
              {renderAccountsByType("Cash")}
              {renderAccountsByType("Credit Card")}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountsOverview;
