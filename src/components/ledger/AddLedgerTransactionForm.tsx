
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
import { format } from "date-fns";

const formSchema = z.object({
  fromPersonId: z.string().min(1, { message: "From person is required" }),
  toPersonId: z.string().min(1, { message: "To person is required" }),
  amount: z.coerce.number().positive({ message: "Amount must be a positive number" }),
  description: z.string().min(1, { message: "Description is required" }),
  date: z.string().min(1, { message: "Date is required" }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddLedgerTransactionFormProps {
  onSuccess?: () => void;
}

const AddLedgerTransactionForm: React.FC<AddLedgerTransactionFormProps> = ({ onSuccess }) => {
  const { people, addLedgerTransaction } = useFinance();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromPersonId: "",
      toPersonId: "",
      amount: 0,
      description: "",
      date: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  function onSubmit(values: FormValues) {
    if (values.fromPersonId === values.toPersonId) {
      form.setError("toPersonId", { 
        message: "From and To person cannot be the same" 
      });
      return;
    }
    
    const transactionData = {
      fromPersonId: values.fromPersonId,
      toPersonId: values.toPersonId,
      amount: values.amount,
      description: values.description,
      date: values.date,
      isPaid: false,
    };
    
    addLedgerTransaction(transactionData);
    form.reset();
    if (onSuccess) onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fromPersonId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Person</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select person" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {people.map((person) => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.name}
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
            name="toPersonId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To Person</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select person" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {people.map((person) => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.name}
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
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (₹)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
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
                <Input placeholder="e.g., Dinner payment, Loan, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
        
        <Button type="submit" className="w-full">Add Transaction</Button>
      </form>
    </Form>
  );
};

export default AddLedgerTransactionForm;
