
import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  Bank, 
  Transaction, 
  Receivable, 
  Liability, 
  Investment, 
  Person, 
  NetWorthData,
  MonthlyData,
  TransactionType,
  TransactionCategory
} from "../types/finance";
import { toast } from "@/components/ui/use-toast";

// Sample data
const initialBanks: Bank[] = [
  { id: "1", name: "Main Bank", balance: 5000, currency: "USD", color: "#60a5fa" },
  { id: "2", name: "Savings", balance: 10000, currency: "USD", color: "#34d399" },
];

const initialPeople: Person[] = [
  { id: "1", name: "John" },
  { id: "2", name: "Sarah" },
  { id: "3", name: "Credit Card Company" },
];

const initialTransactions: Transaction[] = [
  {
    id: "1",
    amount: 1500,
    type: "Income",
    date: "2023-05-01",
    bankId: "1",
    category: "Other",
    description: "Salary",
    payerPayee: "Employer"
  },
  {
    id: "2",
    amount: 50,
    type: "Expense",
    date: "2023-05-05",
    bankId: "1",
    category: "Food",
    description: "Groceries",
    payerPayee: "Supermarket"
  },
];

const initialReceivables: Receivable[] = [
  {
    id: "1",
    personId: "1",
    amount: 100,
    description: "Lunch",
    date: "2023-05-10",
    isPaid: false
  },
];

const initialLiabilities: Liability[] = [
  {
    id: "1",
    personId: "3",
    amount: 500,
    description: "Credit Card",
    date: "2023-05-15",
    isPaid: false
  },
];

const initialInvestments: Investment[] = [
  {
    id: "1",
    name: "Stock Portfolio",
    amount: 2000,
    currentValue: 2200,
    category: "Stocks"
  },
];

// Define context type
interface FinanceContextType {
  banks: Bank[];
  people: Person[];
  transactions: Transaction[];
  receivables: Receivable[];
  liabilities: Liability[];
  investments: Investment[];
  addBank: (bank: Omit<Bank, "id">) => void;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  addReceivable: (receivable: Omit<Receivable, "id">) => void;
  addLiability: (liability: Omit<Liability, "id">) => void;
  addInvestment: (investment: Omit<Investment, "id">) => void;
  addPerson: (person: Omit<Person, "id">) => void;
  toggleReceivablePaid: (id: string) => void;
  toggleLiabilityPaid: (id: string) => void;
  updateBank: (bank: Bank) => void;
  deleteTransaction: (id: string) => void;
  calculateNetWorth: () => NetWorthData;
  calculateMonthlyData: (month: string) => MonthlyData;
  getLiabilitySummary: () => { total: number, count: number };
  getReceivableSummary: () => { total: number, count: number };
  getTransactionsByMonth: (month: string) => Transaction[];
  getMonthlyCategories: (month: string) => Record<TransactionCategory, number>;
  getRecentTransactions: (limit: number) => Transaction[];
}

// Create context
export const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Provider component
export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [banks, setBanks] = useState<Bank[]>(() => {
    const saved = localStorage.getItem("banks");
    return saved ? JSON.parse(saved) : initialBanks;
  });
  
  const [people, setPeople] = useState<Person[]>(() => {
    const saved = localStorage.getItem("people");
    return saved ? JSON.parse(saved) : initialPeople;
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : initialTransactions;
  });
  
  const [receivables, setReceivables] = useState<Receivable[]>(() => {
    const saved = localStorage.getItem("receivables");
    return saved ? JSON.parse(saved) : initialReceivables;
  });
  
  const [liabilities, setLiabilities] = useState<Liability[]>(() => {
    const saved = localStorage.getItem("liabilities");
    return saved ? JSON.parse(saved) : initialLiabilities;
  });
  
  const [investments, setInvestments] = useState<Investment[]>(() => {
    const saved = localStorage.getItem("investments");
    return saved ? JSON.parse(saved) : initialInvestments;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("banks", JSON.stringify(banks));
  }, [banks]);
  
  useEffect(() => {
    localStorage.setItem("people", JSON.stringify(people));
  }, [people]);
  
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);
  
  useEffect(() => {
    localStorage.setItem("receivables", JSON.stringify(receivables));
  }, [receivables]);
  
  useEffect(() => {
    localStorage.setItem("liabilities", JSON.stringify(liabilities));
  }, [liabilities]);
  
  useEffect(() => {
    localStorage.setItem("investments", JSON.stringify(investments));
  }, [investments]);

  // Helper functions
  const generateId = () => Math.random().toString(36).substring(2, 11);

  // Context functions
  const addBank = (bank: Omit<Bank, "id">) => {
    const newBank = { ...bank, id: generateId() };
    setBanks([...banks, newBank]);
    toast({
      title: "Bank Added",
      description: `${bank.name} has been added to your accounts.`,
    });
  };

  const updateBank = (bank: Bank) => {
    setBanks(banks.map(b => b.id === bank.id ? bank : b));
    toast({
      title: "Bank Updated",
      description: `${bank.name} has been updated.`,
    });
  };

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = { ...transaction, id: generateId() };
    setTransactions([...transactions, newTransaction]);
    
    // Update bank balance
    const bank = banks.find(b => b.id === transaction.bankId);
    if (bank) {
      const updatedBank = { ...bank };
      if (transaction.type === "Income") {
        updatedBank.balance += transaction.amount;
      } else if (transaction.type === "Expense") {
        updatedBank.balance -= transaction.amount;
      }
      updateBank(updatedBank);
    }
    
    toast({
      title: "Transaction Added",
      description: `${transaction.type} of ${transaction.amount} has been recorded.`,
    });
  };

  const deleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      // Revert bank balance changes
      const bank = banks.find(b => b.id === transaction.bankId);
      if (bank) {
        const updatedBank = { ...bank };
        if (transaction.type === "Income") {
          updatedBank.balance -= transaction.amount;
        } else if (transaction.type === "Expense") {
          updatedBank.balance += transaction.amount;
        }
        updateBank(updatedBank);
      }
      
      setTransactions(transactions.filter(t => t.id !== id));
      
      toast({
        title: "Transaction Deleted",
        description: `Transaction has been removed.`,
      });
    }
  };

  const addReceivable = (receivable: Omit<Receivable, "id">) => {
    const newReceivable = { ...receivable, id: generateId() };
    setReceivables([...receivables, newReceivable]);
    toast({
      title: "Receivable Added",
      description: `Amount of ${receivable.amount} to be received has been recorded.`,
    });
  };

  const toggleReceivablePaid = (id: string) => {
    setReceivables(
      receivables.map(r => 
        r.id === id ? { ...r, isPaid: !r.isPaid } : r
      )
    );
  };

  const addLiability = (liability: Omit<Liability, "id">) => {
    const newLiability = { ...liability, id: generateId() };
    setLiabilities([...liabilities, newLiability]);
    toast({
      title: "Liability Added",
      description: `Amount of ${liability.amount} to be paid has been recorded.`,
    });
  };

  const toggleLiabilityPaid = (id: string) => {
    setLiabilities(
      liabilities.map(l => 
        l.id === id ? { ...l, isPaid: !l.isPaid } : l
      )
    );
  };

  const addInvestment = (investment: Omit<Investment, "id">) => {
    const newInvestment = { ...investment, id: generateId() };
    setInvestments([...investments, newInvestment]);
    toast({
      title: "Investment Added",
      description: `${investment.name} investment has been recorded.`,
    });
  };

  const addPerson = (person: Omit<Person, "id">) => {
    const newPerson = { ...person, id: generateId() };
    setPeople([...people, newPerson]);
    toast({
      title: "Contact Added",
      description: `${person.name} has been added to your contacts.`,
    });
  };

  const calculateNetWorth = (): NetWorthData => {
    const bankTotal = banks.reduce((sum, bank) => sum + bank.balance, 0);
    const investmentTotal = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const receivableTotal = receivables
      .filter(r => !r.isPaid)
      .reduce((sum, r) => sum + r.amount, 0);
    
    const liabilityTotal = liabilities
      .filter(l => !l.isPaid)
      .reduce((sum, l) => sum + l.amount, 0);
    
    const assets = bankTotal + investmentTotal + receivableTotal;
    return { 
      assets, 
      liabilities: liabilityTotal, 
      netWorth: assets - liabilityTotal 
    };
  };

  const getLiabilitySummary = () => {
    const unpaidLiabilities = liabilities.filter(l => !l.isPaid);
    return {
      total: unpaidLiabilities.reduce((sum, l) => sum + l.amount, 0),
      count: unpaidLiabilities.length
    };
  };

  const getReceivableSummary = () => {
    const unpaidReceivables = receivables.filter(r => !r.isPaid);
    return {
      total: unpaidReceivables.reduce((sum, r) => sum + r.amount, 0),
      count: unpaidReceivables.length
    };
  };

  const getTransactionsByMonth = (month: string) => {
    return transactions.filter(t => t.date.startsWith(month));
  };

  const calculateMonthlyData = (month: string): MonthlyData => {
    const monthTransactions = getTransactionsByMonth(month);
    
    const income = monthTransactions
      .filter(t => t.type === "Income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = monthTransactions
      .filter(t => t.type === "Expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income,
      expense,
      balance: income - expense
    };
  };

  const getMonthlyCategories = (month: string): Record<TransactionCategory, number> => {
    const monthTransactions = getTransactionsByMonth(month);
    const expenseTransactions = monthTransactions.filter(t => t.type === "Expense");
    
    const categories: Record<TransactionCategory, number> = {
      Personal: 0,
      Food: 0,
      Transportation: 0,
      Utilities: 0,
      Entertainment: 0,
      Travel: 0,
      Shopping: 0,
      Health: 0,
      Education: 0,
      Gift: 0,
      Investment: 0,
      Other: 0
    };
    
    expenseTransactions.forEach(t => {
      categories[t.category] += t.amount;
    });
    
    return categories;
  };

  const getRecentTransactions = (limit: number): Transaction[] => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  const value = {
    banks,
    people,
    transactions,
    receivables,
    liabilities,
    investments,
    addBank,
    addTransaction,
    addReceivable,
    addLiability,
    addInvestment,
    addPerson,
    toggleReceivablePaid,
    toggleLiabilityPaid,
    updateBank,
    deleteTransaction,
    calculateNetWorth,
    calculateMonthlyData,
    getLiabilitySummary,
    getReceivableSummary,
    getTransactionsByMonth,
    getMonthlyCategories,
    getRecentTransactions
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
