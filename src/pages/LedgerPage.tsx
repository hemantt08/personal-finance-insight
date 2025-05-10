
import React, { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PeopleList from "@/components/ledger/PeopleList";
import AddPersonForm from "@/components/ledger/AddPersonForm";
import LedgerTransactions from "@/components/ledger/LedgerTransactions";

const LedgerPage = () => {
  const { people } = useFinance();
  const [activeTab, setActiveTab] = useState<"people" | "transactions">("people");
  const [showAddPerson, setShowAddPerson] = useState(false);

  return (
    <PageContainer 
      title="Ledger" 
      description="Manage accounts between you and other people"
    >
      <Tabs defaultValue="people" className="w-full" onValueChange={(value) => setActiveTab(value as "people" | "transactions")}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="people">People</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          
          {activeTab === "people" && (
            <Button onClick={() => setShowAddPerson(!showAddPerson)}>
              {showAddPerson ? "Cancel" : "Add Person"}
            </Button>
          )}
        </div>
        
        <TabsContent value="people">
          {showAddPerson ? (
            <Card>
              <CardHeader>
                <CardTitle>Add New Person</CardTitle>
                <CardDescription>Add a new person to your ledger</CardDescription>
              </CardHeader>
              <CardContent>
                <AddPersonForm onSuccess={() => setShowAddPerson(false)} />
              </CardContent>
            </Card>
          ) : (
            <PeopleList />
          )}
        </TabsContent>
        
        <TabsContent value="transactions">
          <LedgerTransactions />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default LedgerPage;
