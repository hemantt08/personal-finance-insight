
import React from "react";
import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import { FinanceProvider, useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PlusIcon } from "lucide-react";
import AddBankForm from "@/components/accounts/AddBankForm";
import { Bank } from "@/types/finance";

const formSchema = z.object({
  name: z.string().min(1, { message: "Bank name is required" }),
  balance: z.coerce.number().nonnegative({ message: "Balance must be a positive number" }),
  currency: z.string().default("USD"),
  color: z.string().default("#60a5fa"),
});

type FormValues = z.infer<typeof formSchema>;

const AccountsContent = () => {
  const { banks, updateBank } = useFinance();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingBank, setEditingBank] = React.useState<Bank | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      balance: 0,
      currency: "INR",
      color: "#60a5fa",
    },
  });
  
  React.useEffect(() => {
    if (editingBank) {
      form.reset({
        name: editingBank.name,
        balance: editingBank.balance,
        currency: editingBank.currency,
        color: editingBank.color,
      });
    }
  }, [editingBank, form]);
  
  const handleEditBank = (bank: Bank) => {
    setEditingBank(bank);
  };
  
  const onSubmit = (values: FormValues) => {
    if (editingBank) {
      updateBank({ ...editingBank, ...values });
      setEditingBank(null);
      setIsDialogOpen(false);
    }
  };
  
  const calculateTotal = () => {
    return banks.reduce((total, bank) => total + bank.balance, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500">Total Balance</p>
          <h2 className="text-3xl font-bold">₹{calculateTotal().toFixed(2)}</h2>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" /> Add Account
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banks.map((bank) => (
          <Card key={bank.id} className="overflow-hidden border-l-4" style={{ borderLeftColor: bank.color }}>
            <CardHeader className="pb-2">
              <CardTitle>{bank.name}</CardTitle>
              <CardDescription>{bank.currency}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">
                  ₹{bank.balance.toFixed(2)}
                </div>
                <Button variant="outline" size="sm" onClick={() => handleEditBank(bank)}>
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Add Account Dialog */}
      <Dialog open={isDialogOpen && !editingBank} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setEditingBank(null);
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Bank Account</DialogTitle>
            <DialogDescription>
              Add a new bank account to track your finances.
            </DialogDescription>
          </DialogHeader>
          <AddBankForm onSuccess={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Edit Account Dialog */}
      <Dialog open={!!editingBank} onOpenChange={(open) => {
        if (!open) setEditingBank(null);
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Bank Account</DialogTitle>
            <DialogDescription>
              Update your bank account details.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Bank name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Balance</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Input placeholder="INR" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Color</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input type="color" className="w-12 h-10 p-1" {...field} />
                        <span className="text-sm text-gray-500">{field.value}</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Update Bank</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const AccountsPage = () => {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <PageContainer 
          title="Accounts" 
          description="Manage your bank accounts and balances"
        >
          <AccountsContent />
        </PageContainer>
      </div>
    </FinanceProvider>
  );
};

export default AccountsPage;
