
export interface Bank {
  id: string;
  name: string;
  balance: number;
  currency: string;
  color: string;
}

export interface Person {
  id: string;
  name: string;
}

export type TransactionCategory = 
  | "Personal" 
  | "Food" 
  | "Transportation" 
  | "Utilities" 
  | "Entertainment" 
  | "Travel" 
  | "Shopping" 
  | "Health" 
  | "Education" 
  | "Gift" 
  | "Investment" 
  | "Other";

export type TransactionType = "Income" | "Expense" | "Transfer";

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  date: string;
  bankId: string;
  category: TransactionCategory;
  description: string;
  payerPayee: string;
}

export interface Receivable {
  id: string;
  personId: string;
  amount: number;
  description: string;
  date: string;
  isPaid: boolean;
}

export interface Liability {
  id: string;
  personId: string;
  amount: number;
  description: string;
  date: string;
  isPaid: boolean;
}

export interface Investment {
  id: string;
  name: string;
  amount: number;
  currentValue: number;
  category: string;
}

export interface NetWorthData {
  assets: number;
  liabilities: number;
  netWorth: number;
}

export interface MonthlyData {
  income: number;
  expense: number;
  balance: number;
}
