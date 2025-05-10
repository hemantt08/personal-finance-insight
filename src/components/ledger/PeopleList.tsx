
import React from "react";
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DashboardCard from "@/components/DashboardCard";
import { BadgeIndianRupee } from "lucide-react";

const PeopleList = () => {
  const { people, getPersonBalance } = useFinance();

  if (people.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No people added yet. Add a person to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="Total People"
          value={people.length}
          icon={<BadgeIndianRupee />}
        />
        <DashboardCard
          title="Total Owed to You"
          value={`₹${people.reduce((sum, person) => {
            const balance = getPersonBalance(person.id);
            return balance > 0 ? sum + balance : sum;
          }, 0).toLocaleString('en-IN')}`}
          valueClassName="text-green-600"
        />
        <DashboardCard
          title="Total You Owe"
          value={`₹${people.reduce((sum, person) => {
            const balance = getPersonBalance(person.id);
            return balance < 0 ? sum + Math.abs(balance) : sum;
          }, 0).toLocaleString('en-IN')}`}
          valueClassName="text-red-600"
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>People Ledger</CardTitle>
          <CardDescription>Manage your accounts with other people</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {people.map((person) => {
                const balance = getPersonBalance(person.id);
                const status = balance > 0 ? "Owes you" : balance < 0 ? "You owe" : "Settled";
                const statusColor = balance > 0 ? "text-green-600" : balance < 0 ? "text-red-600" : "text-gray-600";
                
                return (
                  <TableRow key={person.id}>
                    <TableCell className="font-medium">{person.name}</TableCell>
                    <TableCell>
                      {balance !== 0 && (
                        <span className={statusColor}>
                          ₹{Math.abs(balance).toLocaleString('en-IN')}
                        </span>
                      )}
                      {balance === 0 && <span>-</span>}
                    </TableCell>
                    <TableCell className={`text-right ${statusColor}`}>{status}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PeopleList;
