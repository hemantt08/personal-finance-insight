
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  resetAccount: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user for initial setup
const demoUser = {
  id: 'user1',
  name: 'Demo User',
  email: 'demo@example.com'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing auth on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('authUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Auto-login with demo user for development
      setUser(demoUser);
      localStorage.setItem('authUser', JSON.stringify(demoUser));
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user));
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll just simulate a login
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For development, accept any credentials
      const loggedInUser = {
        id: 'user1',
        name: 'Demo User',
        email
      };
      
      setUser(loggedInUser);
      localStorage.setItem('authUser', JSON.stringify(loggedInUser));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${loggedInUser.name}!`
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll just simulate a registration
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email
      };
      
      setUser(newUser);
      localStorage.setItem('authUser', JSON.stringify(newUser));
      
      toast({
        title: "Registration Successful",
        description: `Welcome, ${name}!`
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Could not create your account.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
  };

  const resetAccount = () => {
    // Clear user-related data from localStorage
    localStorage.removeItem('accounts');
    localStorage.removeItem('people');
    localStorage.removeItem('assets');
    localStorage.removeItem('transactions');
    localStorage.removeItem('creditCardExtras');
    localStorage.removeItem('customCategories');
    
    toast({
      title: "Account Reset",
      description: "All your data has been cleared."
    });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        register, 
        logout, 
        resetAccount 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
