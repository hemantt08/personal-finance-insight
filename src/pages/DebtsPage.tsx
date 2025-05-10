
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import { FinanceProvider, useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AddDebtForm from "@/components/debts/AddDebtForm";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const DebtsContent = () => {
  const { liabilities, receivables, people, toggleLiabilityPaid, toggleReceivablePaid } = useFinance();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPaid, setShowPaid] = useState(false);
  
  const personName = (id: string) => {
    const person = people.find(p => p.id === id);
    return person ? person.name : 'Unknown';
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const filteredLiabilities = showPaid 
    ? liabilities 
    : liabilities.filter(l => !l.isPaid);
    
  const filteredReceivables = showPaid 
    ? receivables 
    : receivables.filter(r => !r.isPaid);
    
  // Sort by date (newest first)
  const sortedLiabilities = [...filteredLiabilities].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const sortedReceivables = [...filteredReceivables].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Calculate totals
  const liabilitiesTotal = filteredLiabilities
    .filter(l => !l.isPaid)
    .reduce((sum, l) => sum + l.amount, 0);
    
  const receivablesTotal = filteredReceivables
    .filter(r => !r.isPaid)
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Debts & Receivables</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          Add Debt/Receivable
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="show-paid" 
          checked={showPaid}
          onCheckedChange={setShowPaid}
        />
        <Label htmlFor="show-paid">Show paid items</Label>
      </div>
      
      <Tabs defaultValue="liabilities">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="liabilities">
            Money I Owe (${liabilitiesTotal.toFixed(2)})
          </TabsTrigger>
          <TabsTrigger value="receivables">
            Money Owed to Me (${receivablesTotal.toFixed(2)})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="liabilities" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Liabilities</CardTitle>
            </CardHeader>
            <CardContent>
              {sortedLiabilities.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No liabilities found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedLiabilities.map((liability) => (
                    <div 
                      key={liability.id} 
                      className={`flex justify-between p-4 rounded-lg border ${
                        liability.isPaid ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-100'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{personName(liability.personId)}</div>
                        <div className="text-sm text-gray-500">{liability.description}</div>
                        <div className="text-xs text-gray-400 mt-1">{formatDate(liability.date)}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${liability.amount.toFixed(2)}</div>
                        <Button 
                          variant={liability.isPaid ? "outline" : "default"} 
                          size="sm" 
                          className="mt-2"
                          onClick={() => toggleLiabilityPaid(liability.id)}
                        >
                          {liability.isPaid ? "Mark as Unpaid" : "Mark as Paid"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="receivables" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Receivables</CardTitle>
            </CardHeader>
            <CardContent>
              {sortedReceivables.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No receivables found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedReceivables.map((receivable) => (
                    <div 
                      key={receivable.id} 
                      className={`flex justify-between p-4 rounded-lg border ${
                        receivable.isPaid ? 'bg-gray-50 border-gray-200' : 'bg-green-50 border-green-100'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{personName(receivable.personId)}</div>
                        <div className="text-sm text-gray-500">{receivable.description}</div>
                        <div className="text-xs text-gray-400 mt-1">{formatDate(receivable.date)}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${receivable.amount.toFixed(2)}</div>
                        <Button 
                          variant={receivable.isPaid ? "outline" : "default"} 
                          size="sm" 
                          className="mt-2"
                          onClick={() => toggleReceivablePaid(receivable.id)}
                        >
                          {receivable.isPaid ? "Mark as Unpaid" : "Mark as Received"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
    </div>
  );
};

const DebtsPage = () => {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <PageContainer 
          title="Debts & Receivables" 
          description="Manage money you owe and money owed to you"
        >
          <DebtsContent />
        </PageContainer>
      </div>
    </FinanceProvider>
  );
};

export default DebtsPage;
