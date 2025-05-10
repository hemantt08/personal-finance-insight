
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddDebtForm from "../debts/AddDebtForm";

const DebtSummary: React.FC = () => {
  const { receivables, liabilities, people, getLiabilitySummary, getReceivableSummary } = useFinance();
  const liabilitySummary = getLiabilitySummary();
  const receivableSummary = getReceivableSummary();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  const personName = (id: string) => {
    const person = people.find(p => p.id === id);
    return person ? person.name : 'Unknown';
  };

  const getPendingItems = (isLiability: boolean) => {
    const items = isLiability 
      ? liabilities.filter(item => !item.isPaid)
      : receivables.filter(item => !item.isPaid);
    
    return items.slice(0, 3);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-medium">Debts & Receivables</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <PlusIcon className="h-4 w-4 mr-1" /> Add
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Debt or Receivable</DialogTitle>
              <DialogDescription>
                Record money you owe or money owed to you.
              </DialogDescription>
            </DialogHeader>
            <AddDebtForm />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="liabilities">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="liabilities">
              I Owe ({liabilitySummary.count})
            </TabsTrigger>
            <TabsTrigger value="receivables">
              Owed to Me ({receivableSummary.count})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="liabilities" className="mt-0">
            <div className="mb-3 flex justify-between items-center">
              <span className="text-sm text-gray-500">Total pending</span>
              <span className="font-medium text-red-500">${liabilitySummary.total.toFixed(2)}</span>
            </div>
            
            <div className="space-y-3">
              {getPendingItems(true).length > 0 ? (
                getPendingItems(true).map((liability) => (
                  <div key={liability.id} className="flex justify-between p-2 bg-red-50 rounded-md">
                    <div>
                      <p className="font-medium">{personName(liability.personId)}</p>
                      <p className="text-sm text-gray-500">{liability.description}</p>
                    </div>
                    <div className="font-medium">${liability.amount.toFixed(2)}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No pending liabilities</p>
                </div>
              )}
              
              {liabilitySummary.count > 3 && (
                <Button variant="link" size="sm" asChild className="w-full">
                  <a href="/debts">View all ({liabilitySummary.count})</a>
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="receivables" className="mt-0">
            <div className="mb-3 flex justify-between items-center">
              <span className="text-sm text-gray-500">Total pending</span>
              <span className="font-medium text-green-500">${receivableSummary.total.toFixed(2)}</span>
            </div>
            
            <div className="space-y-3">
              {getPendingItems(false).length > 0 ? (
                getPendingItems(false).map((receivable) => (
                  <div key={receivable.id} className="flex justify-between p-2 bg-green-50 rounded-md">
                    <div>
                      <p className="font-medium">{personName(receivable.personId)}</p>
                      <p className="text-sm text-gray-500">{receivable.description}</p>
                    </div>
                    <div className="font-medium">${receivable.amount.toFixed(2)}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No pending receivables</p>
                </div>
              )}
              
              {receivableSummary.count > 3 && (
                <Button variant="link" size="sm" asChild className="w-full">
                  <a href="/debts">View all ({receivableSummary.count})</a>
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// PlusIcon component
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

export default DebtSummary;
