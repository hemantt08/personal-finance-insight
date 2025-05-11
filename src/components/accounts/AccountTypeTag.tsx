
import React from "react";
import { AccountType } from "@/types/finance";
import { Bank, CreditCard, Wallet, Banknote } from "lucide-react";

interface AccountTypeTagProps {
  type: AccountType;
  className?: string;
}

const AccountTypeTag: React.FC<AccountTypeTagProps> = ({ type, className }) => {
  const getTypeDetails = () => {
    switch (type) {
      case "Bank":
        return { icon: <Bank className="h-4 w-4" />, color: "bg-blue-100 text-blue-800", label: "Bank" };
      case "Credit Card":
        return { icon: <CreditCard className="h-4 w-4" />, color: "bg-purple-100 text-purple-800", label: "Credit Card" };
      case "Wallet":
        return { icon: <Wallet className="h-4 w-4" />, color: "bg-green-100 text-green-800", label: "Wallet" };
      case "Cash":
        return { icon: <Banknote className="h-4 w-4" />, color: "bg-yellow-100 text-yellow-800", label: "Cash" };
      default:
        return { icon: <Bank className="h-4 w-4" />, color: "bg-gray-100 text-gray-800", label: type };
    }
  };

  const { icon, color, label } = getTypeDetails();

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color} ${className}`}>
      {icon}
      <span className="ml-1">{label}</span>
    </div>
  );
};

export default AccountTypeTag;
