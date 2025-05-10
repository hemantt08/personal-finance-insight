
import { Person } from "./finance";

// Enhanced Person type for ledger functionality
export interface LedgerPerson extends Person {
  balance: number;
  email?: string;
  phone?: string;
  notes?: string;
  relationship?: "Family" | "Friend" | "Business" | "Other";
}

export interface LedgerTransaction {
  id: string;
  fromPersonId: string;
  toPersonId: string;
  amount: number;
  description: string;
  date: string;
  isPaid: boolean;
}
