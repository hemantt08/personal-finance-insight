
import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  Account,
  AccountType,
  Person,
  Asset,
  Transaction,
  User,
  CreditCardExtra,
  TransactionMainType,
  TransactionSubType,
  TransactionCategory,
  NetWorthData,
  MonthlyData,
  AssetCategory
} from "../types/finance";
import { toast } from "@/components/ui/use-toast";

// Sample user data
const demoUser: User = {
  id: "user1",
  name: "Demo User",
  email: "demo@example.com",
  baseCurrency: "INR"
};

// Sample data for accounts
const initialAccounts: Account[] = [
  { 
    id: "1", 
    userId: "user1", 
    name: "HDFC Bank", 
    type: "Bank", 
    balance: 50000, 
    openingBalance: 50000, 
    color: "#60a5fa" 
  },
  { 
    id: "2", 
    userId: "user1", 
    name: "Wallet", 
    type: "Wallet", 
    balance: 2000, 
    openingBalance: 2000, 
    color: "#34d399" 
  },
  { 
    id: "3", 
    userId: "user1", 
    name: "Cash", 
    type: "Cash", 
    balance: 5000, 
    openingBalance: 5000, 
    color: "#fbbf24" 
  },
  { 
    id: "4", 
    userId: "user1", 
    name: "ICICI Credit Card", 
    type: "Credit Card", 
    balance: -15000, 
    openingBalance: 0, 
    color: "#f87171" 
  }
];

// Sample credit card data
const initialCreditCardExtras: CreditCardExtra[] = [
  {
    accountId: "4",
    creditLimit: 100000,
    currentOutstanding: 15000
  }
];

// Sample person data
const initialPeople: Person[] = [
  { id: "1", userId: "user1", name: "John", runningBalance: 1000 },
  { id: "2", userId: "user1", name: "Sarah", runningBalance: -500 },
  { id: "3", userId: "user1", name: "Credit Card Company", runningBalance: 0 }
];

// Sample asset data
const initialAssets: Asset[] = [
  {
    id: "1",
    userId: "user1",
    name: "Mutual Fund Portfolio",
    category: "Mutual Funds",
    amountInvested: 30000,
    currentValue: 32000
  },
  {
    id: "2",
    userId: "user1",
    name: "Bitcoin",
    category: "Cryptocurrency",
    amountInvested: 10000,
    currentValue: 12000
  }
];

// Sample transaction data
const initialTransactions: Transaction[] = [
  {
    id: "1",
    userId: "user1",
    amount: 25000,
    type: "Income",
    mainType: "Income",
    subType: "",
    date: "2023-05-01",
    accountId: "1",
    category: "Salary",
    description: "Monthly Salary",
    linkedPersonId: undefined,
    linkedAssetId: undefined
  },
  {
    id: "2",
    userId: "user1",
    amount: -5000,
    type: "Expense",
    mainType: "Expense",
    subType: "",
    date: "2023-05-05",
    accountId: "1",
    category: "Food",
    description: "Groceries",
    linkedPersonId: undefined,
    linkedAssetId: undefined
  },
  {
    id: "3",
    userId: "user1",
    amount: -2000,
    type: "Transfer",
    mainType: "Transfer",
    subType: "Internal Transfer",
    date: "2023-05-10",
    accountId: "1",
    category: "Other",
    description: "Transfer to wallet",
    linkedPersonId: undefined,
    linkedAssetId: undefined
  },
  {
    id: "4",
    userId: "user1",
    amount: 2000,
    type: "Transfer",
    mainType: "Transfer",
    subType: "Internal Transfer",
    date: "2023-05-10",
    accountId: "2",
    category: "Other",
    description: "Transfer from bank",
    linkedPersonId: undefined,
    linkedAssetId: undefined
  },
  {
    id: "5",
    userId: "user1",
    amount: -1000,
    type: "Transfer",
    mainType: "Transfer",
    subType: "Debt",
    date: "2023-05-15",
    accountId: "1",
    category: "Other",
    description: "Lent money to John",
    linkedPersonId: "1",
    linkedAssetId: undefined
  },
  {
    id: "6",
    userId: "user1",
    amount: -15000,
    type: "Expense",
    mainType: "Expense",
    subType: "",
    date: "2023-05-20",
    accountId: "4",
    category: "Shopping",
    description: "Purchase with credit card",
    linkedPersonId: undefined,
    linkedAssetId: undefined
  }
];

// Define custom categories
const defaultCategories: TransactionCategory[] = [
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
  "Salary",
  "Business",
  "Interest",
  "Rent",
  "Other"
];

// Define context type
interface FinanceContextType {
  user: User | null;
  accounts: Account[];
  people: Person[];
  assets: Asset[];
  transactions: Transaction[];
  creditCardExtras: CreditCardExtra[];
  customCategories: TransactionCategory[];
  addAccount: (account: Omit<Account, "id" | "userId" | "balance">, creditCardInfo?: { creditLimit: number, currentOutstanding: number }) => void;
  addTransaction: (transaction: Omit<Transaction, "id" | "userId">) => void;
  addPerson: (person: Omit<Person, "id" | "userId" | "runningBalance">) => void;
  addAsset: (asset: Omit<Asset, "id" | "userId">) => void;
  updateAccount: (account: Account) => void;
  updatePerson: (person: Person) => void;
  deleteTransaction: (id: string) => void;
  getPersonBalance: (personId: string) => number;
  calculateNetWorth: () => NetWorthData;
  calculateMonthlyData: (month: string) => MonthlyData;
  getReceivableSummary: () => { total: number, count: number };
  getPayableSummary: () => { total: number, count: number };
  getTransactionsByMonth: (month: string) => Transaction[];
  getMonthlyCategories: (month: string) => Record<TransactionCategory, number>;
  getRecentTransactions: (limit: number) => Transaction[];
  getCreditCardInfo: (accountId: string) => CreditCardExtra | undefined;
  addCustomCategory: (category: TransactionCategory) => void;
  removeCustomCategory: (category: TransactionCategory) => void;
  resetData: () => void;
}

// Create context
export const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Provider component
export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : demoUser;
  });
  
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem("accounts");
    return saved ? JSON.parse(saved) : initialAccounts;
  });
  
  const [creditCardExtras, setCreditCardExtras] = useState<CreditCardExtra[]>(() => {
    const saved = localStorage.getItem("creditCardExtras");
    return saved ? JSON.parse(saved) : initialCreditCardExtras;
  });
  
  const [people, setPeople] = useState<Person[]>(() => {
    const saved = localStorage.getItem("people");
    return saved ? JSON.parse(saved) : initialPeople;
  });
  
  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem("assets");
    return saved ? JSON.parse(saved) : initialAssets;
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : initialTransactions;
  });
  
  const [customCategories, setCustomCategories] = useState<TransactionCategory[]>(() => {
    const saved = localStorage.getItem("customCategories");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [user]);
  
  useEffect(() => {
    localStorage.setItem("accounts", JSON.stringify(accounts));
  }, [accounts]);
  
  useEffect(() => {
    localStorage.setItem("creditCardExtras", JSON.stringify(creditCardExtras));
  }, [creditCardExtras]);
  
  useEffect(() => {
    localStorage.setItem("people", JSON.stringify(people));
  }, [people]);
  
  useEffect(() => {
    localStorage.setItem("assets", JSON.stringify(assets));
  }, [assets]);
  
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);
  
  useEffect(() => {
    localStorage.setItem("customCategories", JSON.stringify(customCategories));
  }, [customCategories]);

  // Helper functions
  const generateId = () => Math.random().toString(36).substring(2, 11);

  // Data integrity engine functions
  const recalcAccount = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return;
    
    // Start with opening balance
    let balance = account.openingBalance;
    
    // Add all transactions for this account
    transactions.forEach(t => {
      if (t.accountId === accountId) {
        balance += t.amount;
      }
    });
    
    // Update account
    const updatedAccount = { ...account, balance };
    setAccounts(prev => prev.map(a => a.id === accountId ? updatedAccount : a));
    
    // Update credit card info if applicable
    if (account.type === "Credit Card") {
      recalcCreditCardOutstanding(accountId);
    }
  };
  
  const recalcPerson = (personId: string) => {
    const person = people.find(p => p.id === personId);
    if (!person) return;
    
    // Calculate running balance
    let runningBalance = 0;
    
    transactions.forEach(t => {
      if (t.linkedPersonId === personId) {
        if (t.mainType === "Transfer" && t.subType === "Debt") {
          runningBalance += t.amount > 0 ? -t.amount : Math.abs(t.amount); // Negative for "I owe", positive for "Owes me"
        } else if (t.mainType === "Transfer" && t.subType === "Repayment") {
          runningBalance += t.amount; // Opposite direction of debt
        }
      }
    });
    
    // Update person
    const updatedPerson = { ...person, runningBalance };
    setPeople(prev => prev.map(p => p.id === personId ? updatedPerson : p));
  };
  
  const recalcCreditCardOutstanding = (accountId: string) => {
    const ccExtra = creditCardExtras.find(cc => cc.accountId === accountId);
    if (!ccExtra) return;
    
    // Calculate outstanding amount from transactions
    let outstanding = 0;
    
    transactions.forEach(t => {
      if (t.accountId === accountId) {
        if (t.mainType === "Expense") {
          outstanding += Math.abs(t.amount);
        } else if (t.mainType === "Credit Card Payment" || (t.mainType === "Transfer" && t.subType === "Internal Transfer")) {
          outstanding -= t.amount > 0 ? t.amount : 0; // Only consider positive amounts (payments)
        }
      }
    });
    
    // Ensure outstanding is not below zero
    outstanding = Math.max(0, outstanding);
    
    // Update credit card extra
    const updatedCcExtra = { ...ccExtra, currentOutstanding: outstanding };
    setCreditCardExtras(prev => prev.map(cc => cc.accountId === accountId ? updatedCcExtra : cc));
  };
  
  const recalcAllBalances = () => {
    // Recalculate all account balances
    accounts.forEach(account => {
      recalcAccount(account.id);
    });
    
    // Recalculate all person balances
    people.forEach(person => {
      recalcPerson(person.id);
    });
  };
  
  // Reset all data
  const resetData = () => {
    setUser(demoUser);
    setAccounts([]);
    setPeople([]);
    setAssets([]);
    setTransactions([]);
    setCreditCardExtras([]);
    setCustomCategories([]);
    
    // Clear localStorage
    localStorage.removeItem("accounts");
    localStorage.removeItem("people");
    localStorage.removeItem("assets");
    localStorage.removeItem("transactions");
    localStorage.removeItem("creditCardExtras");
    localStorage.removeItem("customCategories");
    
    toast({
      title: "Data Reset",
      description: "All financial data has been cleared.",
    });
  };

  // Context functions
  const addAccount = (
    accountData: Omit<Account, "id" | "userId" | "balance">, 
    creditCardInfo?: { creditLimit: number, currentOutstanding: number }
  ) => {
    if (!user) return;
    
    const newAccount: Account = { 
      ...accountData, 
      id: generateId(), 
      userId: user.id, 
      balance: accountData.openingBalance 
    };
    
    setAccounts(prev => [...prev, newAccount]);
    
    // If this is a credit card, add the credit card extra info
    if (accountData.type === "Credit Card" && creditCardInfo) {
      const newCcExtra: CreditCardExtra = {
        accountId: newAccount.id,
        creditLimit: creditCardInfo.creditLimit,
        currentOutstanding: creditCardInfo.currentOutstanding
      };
      
      setCreditCardExtras(prev => [...prev, newCcExtra]);
      
      // If there's an outstanding amount, create a transaction for it
      if (creditCardInfo.currentOutstanding > 0) {
        const newTransaction: Transaction = {
          id: generateId(),
          userId: user.id,
          date: new Date().toISOString().split('T')[0],
          amount: -creditCardInfo.currentOutstanding,
          accountId: newAccount.id,
          category: "Other",
          description: "Initial credit card balance",
          mainType: "Expense",
          subType: "",
        };
        
        setTransactions(prev => [...prev, newTransaction]);
      }
    }
    
    toast({
      title: "Account Added",
      description: `${accountData.name} has been added to your accounts.`,
    });
  };

  const updateAccount = (account: Account) => {
    setAccounts(accounts.map(a => a.id === account.id ? account : a));
    toast({
      title: "Account Updated",
      description: `${account.name} has been updated.`,
    });
  };
  
  const updatePerson = (person: Person) => {
    setPeople(people.map(p => p.id === person.id ? person : p));
    toast({
      title: "Person Updated",
      description: `${person.name} has been updated.`,
    });
  };

  const addTransaction = (transactionData: Omit<Transaction, "id" | "userId">) => {
    if (!user) return;
    
    const newTransaction: Transaction = { 
      ...transactionData, 
      id: generateId(), 
      userId: user.id 
    };
    
    setTransactions(prev => [...prev, newTransaction]);
    
    // Update balances based on transaction type
    const sourceAccount = accounts.find(a => a.id === transactionData.accountId);
    if (!sourceAccount) return;
    
    // Handle different transaction types
    if (transactionData.mainType === "Income" || transactionData.mainType === "Expense") {
      // Simple account balance update
      recalcAccount(transactionData.accountId);
    } 
    else if (transactionData.mainType === "Transfer") {
      if (transactionData.subType === "Internal Transfer" && transactionData.linkedPersonId) {
        // This is an internal transfer between accounts
        // Add the opposite transaction to the target account
        const targetTransaction: Transaction = {
          id: generateId(),
          userId: user.id,
          date: transactionData.date,
          amount: -transactionData.amount, // Opposite amount
          accountId: transactionData.linkedPersonId, // Using linkedPersonId to store target account for now
          category: transactionData.category,
          description: transactionData.description,
          mainType: "Transfer",
          subType: "Internal Transfer",
          linkedPersonId: transactionData.accountId, // Link back to source
        };
        
        setTransactions(prev => [...prev, targetTransaction]);
        
        // Recalculate both accounts
        recalcAccount(transactionData.accountId);
        recalcAccount(transactionData.linkedPersonId);
      } 
      else if (transactionData.subType === "Debt" && transactionData.linkedPersonId) {
        // Update person balance
        recalcAccount(transactionData.accountId);
        recalcPerson(transactionData.linkedPersonId);
      } 
      else if (transactionData.subType === "Repayment" && transactionData.linkedPersonId) {
        // Update person balance
        recalcAccount(transactionData.accountId);
        recalcPerson(transactionData.linkedPersonId);
      }
    } 
    else if (transactionData.mainType === "Credit Card Payment") {
      // Source account (bank) decreases
      // Target account (credit card) decreases liability
      if (transactionData.linkedPersonId) {
        recalcAccount(transactionData.accountId); // Bank
        recalcAccount(transactionData.linkedPersonId); // Credit Card
      }
    }
    
    toast({
      title: "Transaction Added",
      description: `${transactionData.mainType} of ₹${Math.abs(transactionData.amount).toLocaleString('en-IN')} has been recorded.`,
    });
  };

  const deleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;
    
    // Check for paired transactions (like internal transfers)
    let pairedTransactionId: string | undefined;
    
    if (transaction.mainType === "Transfer" && transaction.subType === "Internal Transfer") {
      const pairedTransaction = transactions.find(t => 
        t.mainType === "Transfer" && 
        t.subType === "Internal Transfer" &&
        t.linkedPersonId === transaction.accountId &&
        t.accountId === transaction.linkedPersonId &&
        t.date === transaction.date
      );
      
      if (pairedTransaction) {
        pairedTransactionId = pairedTransaction.id;
      }
    }
    
    // Remove the transaction(s)
    setTransactions(transactions.filter(t => t.id !== id && t.id !== pairedTransactionId));
    
    // Recalculate affected balances
    recalcAccount(transaction.accountId);
    
    if (transaction.linkedPersonId) {
      // Check if it's a person or an account
      if (transaction.mainType === "Transfer" && transaction.subType === "Internal Transfer") {
        recalcAccount(transaction.linkedPersonId);
      } else {
        recalcPerson(transaction.linkedPersonId);
      }
    }
    
    if (transaction.linkedAssetId) {
      // TODO: Handle asset recalculation if needed
    }
    
    toast({
      title: "Transaction Deleted",
      description: `Transaction has been removed.`,
    });
  };

  const addPerson = (personData: Omit<Person, "id" | "userId" | "runningBalance">) => {
    if (!user) return;
    
    const newPerson: Person = { 
      ...personData, 
      id: generateId(), 
      userId: user.id, 
      runningBalance: 0 
    };
    
    setPeople([...people, newPerson]);
    
    toast({
      title: "Person Added",
      description: `${personData.name} has been added to your contacts.`,
    });
  };

  const addAsset = (assetData: Omit<Asset, "id" | "userId">) => {
    if (!user) return;
    
    const newAsset: Asset = { 
      ...assetData, 
      id: generateId(), 
      userId: user.id 
    };
    
    setAssets([...assets, newAsset]);
    
    toast({
      title: "Asset Added",
      description: `${assetData.name} has been added to your investments.`,
    });
  };

  // Calculate balance for a person
  const getPersonBalance = (personId: string): number => {
    const person = people.find(p => p.id === personId);
    return person ? person.runningBalance : 0;
  };

  const calculateNetWorth = (): NetWorthData => {
    // Bank accounts, wallet, cash are assets
    const cashAssets = accounts
      .filter(a => a.type !== "Credit Card")
      .reduce((sum, account) => sum + account.balance, 0);
    
    // Investment assets
    const investmentValue = assets.reduce((sum, asset) => sum + (asset.currentValue || asset.amountInvested), 0);
    
    // Credit card liabilities
    const creditCardLiabilities = accounts
      .filter(a => a.type === "Credit Card")
      .reduce((sum, account) => sum + Math.abs(Math.min(0, account.balance)), 0);
    
    // Additional liabilities from credit card extras
    const additionalCcLiabilities = creditCardExtras.reduce((sum, cc) => {
      return sum + cc.currentOutstanding;
    }, 0);
    
    // Receivables (positive person balances)
    const receivables = people.reduce((sum, person) => {
      return sum + (person.runningBalance > 0 ? person.runningBalance : 0);
    }, 0);
    
    // Payables (negative person balances)
    const payables = people.reduce((sum, person) => {
      return sum + (person.runningBalance < 0 ? Math.abs(person.runningBalance) : 0);
    }, 0);
    
    const totalAssets = cashAssets + investmentValue + receivables;
    const totalLiabilities = creditCardLiabilities + additionalCcLiabilities + payables;
    
    return { 
      assets: totalAssets, 
      liabilities: totalLiabilities, 
      netWorth: totalAssets - totalLiabilities,
      receivables,
      payables
    };
  };

  const getReceivableSummary = () => {
    const receivablePeople = people.filter(p => p.runningBalance > 0);
    return {
      total: receivablePeople.reduce((sum, p) => sum + p.runningBalance, 0),
      count: receivablePeople.length
    };
  };

  const getPayableSummary = () => {
    const payablePeople = people.filter(p => p.runningBalance < 0);
    return {
      total: payablePeople.reduce((sum, p) => sum + Math.abs(p.runningBalance), 0),
      count: payablePeople.length
    };
  };

  const getTransactionsByMonth = (month: string) => {
    return transactions.filter(t => t.date.startsWith(month));
  };

  const calculateMonthlyData = (month: string): MonthlyData => {
    const monthTransactions = getTransactionsByMonth(month);
    
    const income = monthTransactions
      .filter(t => t.mainType === "Income")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const expense = monthTransactions
      .filter(t => t.mainType === "Expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    return {
      income,
      expense,
      balance: income - expense
    };
  };

  const getMonthlyCategories = (month: string): Record<TransactionCategory, number> => {
    const monthTransactions = getTransactionsByMonth(month);
    const expenseTransactions = monthTransactions.filter(t => t.mainType === "Expense");
    
    const categories = {} as Record<TransactionCategory, number>;
    
    // Initialize all categories to 0
    [...defaultCategories, ...customCategories].forEach(cat => {
      categories[cat] = 0;
    });
    
    // Add up expenses by category
    expenseTransactions.forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + Math.abs(t.amount);
    });
    
    return categories;
  };

  const getRecentTransactions = (limit: number): Transaction[] => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  const getCreditCardInfo = (accountId: string): CreditCardExtra | undefined => {
    return creditCardExtras.find(cc => cc.accountId === accountId);
  };

  const addCustomCategory = (category: TransactionCategory) => {
    if (defaultCategories.includes(category) || customCategories.includes(category)) {
      toast({
        title: "Category Exists",
        description: `The category ${category} already exists.`,
        variant: "destructive"
      });
      return;
    }
    
    setCustomCategories(prev => [...prev, category]);
    
    toast({
      title: "Category Added",
      description: `${category} has been added to your custom categories.`,
    });
  };

  const removeCustomCategory = (category: TransactionCategory) => {
    // Check if category is in use
    const isCategoryInUse = transactions.some(t => t.category === category);
    
    if (isCategoryInUse) {
      toast({
        title: "Cannot Remove Category",
        description: `The category ${category} is in use by transactions and cannot be removed.`,
        variant: "destructive"
      });
      return;
    }
    
    if (defaultCategories.includes(category)) {
      toast({
        title: "Cannot Remove Default Category",
        description: `The category ${category} is a default category and cannot be removed.`,
        variant: "destructive"
      });
      return;
    }
    
    setCustomCategories(prev => prev.filter(c => c !== category));
    
    toast({
      title: "Category Removed",
      description: `${category} has been removed from your custom categories.`,
    });
  };

  const value = {
    user,
    accounts,
    people,
    assets,
    transactions,
    creditCardExtras,
    customCategories,
    addAccount,
    addTransaction,
    addPerson,
    addAsset,
    updateAccount,
    updatePerson,
    deleteTransaction,
    getPersonBalance,
    calculateNetWorth,
    calculateMonthlyData,
    getReceivableSummary,
    getPayableSummary,
    getTransactionsByMonth,
    getMonthlyCategories,
    getRecentTransactions,
    getCreditCardInfo,
    addCustomCategory,
    removeCustomCategory,
    resetData
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

// Custom hook for using the finance context
export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};
