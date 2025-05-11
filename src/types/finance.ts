
export interface User {
  id: string;
  name: string;
  email: string;
  baseCurrency: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: number;
  openingBalance: number;
  color: string;
}

export type AccountType = "Bank" | "Wallet" | "Credit Card" | "Cash";

export interface CreditCardExtra {
  accountId: string;
  creditLimit: number;
  currentOutstanding: number;
}

export interface Person {
  id: string;
  userId: string;
  name: string;
  runningBalance: number;
}

export interface Asset {
  id: string;
  userId: string;
  name: string;
  category: AssetCategory;
  amountInvested: number;
  currentValue?: number;
}

export type AssetCategory = 
  | "Stocks" 
  | "Mutual Funds" 
  | "Cryptocurrency" 
  | "Property" 
  | "Gold" 
  | "Fixed Deposit" 
  | "Other";

export type TransactionCategory = 
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
  | "Salary"
  | "Business"
  | "Interest"
  | "Rent"
  | "Other";

export type TransactionMainType = "Income" | "Expense" | "Transfer" | "Investment" | "Credit Card Payment";

export type TransactionSubType = "Internal Transfer" | "Debt" | "Repayment" | "Buy" | "Sell" | "";

export interface Transaction {
  id: string;
  userId: string;
  date: string;
  amount: number;
  accountId: string;
  category: TransactionCategory;
  description: string;
  mainType: TransactionMainType;
  subType: TransactionSubType;
  linkedPersonId?: string;
  linkedAssetId?: string;
}

export interface NetWorthData {
  assets: number;
  liabilities: number;
  netWorth: number;
  receivables: number;
  payables: number;
}

export interface MonthlyData {
  income: number;
  expense: number;
  balance: number;
}
