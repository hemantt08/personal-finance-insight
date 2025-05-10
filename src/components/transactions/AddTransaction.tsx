
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFinance } from "@/context/FinanceContext";
import { TransactionCategory, TransactionType } from "@/types/finance";

const formSchema = z.object({
  amount: z.coerce.number().positive({ message: "Amount must be positive" }),
  type: z.enum(["Income", "Expense", "Transfer"] as const),
  date: z.string(),
  bankId: z.string(),
  category: z.enum([
    "Personal", 
    "Food", 
    "Transportation", 
    "Utilities", 
    "Entertainment", 
    "Travel", 
    "Shopping", 
    "Health", 
    "Education", 
    "Gift", 
    "Investment", 
    "Other"
  ] as const),
  description: z.string(),
  payerPayee: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddTransactionProps {
  onSuccess?: () => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ onSuccess }) => {
  const { addTransaction, banks } = useFinance();
  
  // Get current date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      type: "Expense" as TransactionType,
      date: today,
      bankId: banks[0]?.id || "",
      category: "Other" as TransactionCategory,
      description: "",
      payerPayee: "",
    },
  });

  function onSubmit(values: FormValues) {
    // Explicitly create a transaction object with all required fields
    const transaction = {
      amount: values.amount,
      type: values.type,
      date: values.date,
      bankId: values.bankId,
      category: values.category,
      description: values.description,
      payerPayee: values.payerPayee,
    };
    
    addTransaction(transaction);
    form.reset({
      ...form.getValues(),
      amount: 0,
      description: "",
      payerPayee: "",
    });
    if (onSuccess) onSuccess();
  }

  const transactionCategories: TransactionCategory[] = [
    "Personal", 
    "Food", 
    "Transportation", 
    "Utilities", 
    "Entertainment", 
    "Travel", 
    "Shopping", 
    "Health", 
    "Education", 
    "Gift", 
    "Investment", 
    "Other"
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Income">Income</SelectItem>
                    <SelectItem value="Expense">Expense</SelectItem>
                    <SelectItem value="Transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bankId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank.id} value={bank.id}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {transactionCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Transaction description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payerPayee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {form.watch("type") === "Income" ? "Payer" : "Payee"}
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder={form.watch("type") === "Income" ? "Who paid you?" : "Who did you pay?"} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Add Transaction</Button>
      </form>
    </Form>
  );
};

export default AddTransaction;
