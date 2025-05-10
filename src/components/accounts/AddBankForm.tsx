
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
import { useFinance } from "@/context/FinanceContext";

const formSchema = z.object({
  name: z.string().min(1, { message: "Bank name is required" }),
  balance: z.coerce.number().nonnegative({ message: "Balance must be a positive number" }),
  currency: z.string().default("INR"),
  color: z.string().default("#60a5fa"),
});

type FormValues = z.infer<typeof formSchema>;

interface AddBankFormProps {
  onSuccess?: () => void;
}

const AddBankForm: React.FC<AddBankFormProps> = ({ onSuccess }) => {
  const { addBank } = useFinance();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      balance: 0,
      currency: "INR",
      color: "#60a5fa",
    },
  });

  function onSubmit(values: FormValues) {
    // Explicitly type the values to match Omit<Bank, "id">
    const bankData = {
      name: values.name,
      balance: values.balance,
      currency: values.currency,
      color: values.color,
    };
    
    addBank(bankData);
    form.reset();
    if (onSuccess) onSuccess();
  }

  return (
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
              <FormLabel>Initial Balance</FormLabel>
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
        <Button type="submit" className="w-full">Add Bank</Button>
      </form>
    </Form>
  );
};

export default AddBankForm;
