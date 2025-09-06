import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types for our global state
export interface Transaction {
  id: number;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
  dayNumber?: number; // Which day this transaction belongs to
}

export interface Quest {
  id: number;
  title: string;
  description: string;
  progress: number;
  current: number;
  target: number;
  reward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Rare' | 'Epic' | 'Legendary';
  icon: string;
  type: 'budget' | 'investment' | 'savings' | 'debt';
  category?: string;
  amount?: number;
  period?: string;
  createdDate: string;
}

export interface DayData {
  dayNumber: number;
  date: string;
  completed: boolean;
  transactions: Transaction[];
  totalExpenses: number;
}

interface AppContextType {
  // Map data
  completedDays: Set<number>;
  dayTransactions: { [dayNumber: number]: Transaction[] };
  
  // Quest data
  quests: Quest[];
  
  // Actions
  addTransactionToDay: (transaction: Transaction, dayNumber: number) => void;
  addQuest: (quest: Omit<Quest, 'id'>) => void;
  updateQuestProgress: (questId: number, newProgress: number, newCurrent: number) => void;
  markDayCompleted: (dayNumber: number) => void;
  
  // Getters
  getDayTransactions: (dayNumber: number) => Transaction[];
  getDayTotalExpenses: (dayNumber: number) => number;
  getCurrentDay: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [dayTransactions, setDayTransactions] = useState<{ [dayNumber: number]: Transaction[] }>({});
  const [quests, setQuests] = useState<Quest[]>([
    // Default long-term quests
    {
      id: 1,
      title: 'Emergency Fund',
      description: 'Save ₹1,00,000 for emergencies',
      progress: 65,
      current: 65000,
      target: 100000,
      reward: 500,
      difficulty: 'Epic',
      icon: '🛡️',
      type: 'savings',
      createdDate: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Investment Portfolio',
      description: 'Build a ₹5,00,000 investment portfolio',
      progress: 32,
      current: 160000,
      target: 500000,
      reward: 1000,
      difficulty: 'Legendary',
      icon: '📈',
      type: 'investment',
      createdDate: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'Debt Freedom',
      description: 'Pay off all credit card debt',
      progress: 78,
      current: 78000,
      target: 100000,
      reward: 750,
      difficulty: 'Rare',
      icon: '⚔️',
      type: 'debt',
      createdDate: new Date().toISOString(),
    },
  ]);

  const getCurrentDay = () => {
    // For simplicity, start from day 1 for all users
    // In a real app, this could be stored per user in AsyncStorage
    return 1;
  };

  const addTransactionToDay = (transaction: Transaction, dayNumber: number) => {
    const transactionWithDay = { ...transaction, dayNumber };
    
    setDayTransactions(prev => ({
      ...prev,
      [dayNumber]: [...(prev[dayNumber] || []), transactionWithDay],
    }));

    // Mark day as completed if it has transactions
    setCompletedDays(prev => new Set([...prev, dayNumber]));
  };

  const addQuest = (questData: Omit<Quest, 'id'>) => {
    const newQuest: Quest = {
      ...questData,
      id: Date.now(), // Simple ID generation
    };
    
    setQuests(prev => [...prev, newQuest]);
  };

  const updateQuestProgress = (questId: number, newProgress: number, newCurrent: number) => {
    setQuests(prev => 
      prev.map(quest => 
        quest.id === questId 
          ? { ...quest, progress: newProgress, current: newCurrent }
          : quest
      )
    );
  };

  const markDayCompleted = (dayNumber: number) => {
    setCompletedDays(prev => new Set([...prev, dayNumber]));
  };

  const getDayTransactions = (dayNumber: number): Transaction[] => {
    return dayTransactions[dayNumber] || [];
  };

  const getDayTotalExpenses = (dayNumber: number): number => {
    const transactions = getDayTransactions(dayNumber);
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((total, t) => total + Math.abs(t.amount), 0);
  };

  const value: AppContextType = {
    completedDays,
    dayTransactions,
    quests,
    addTransactionToDay,
    addQuest,
    updateQuestProgress,
    markDayCompleted,
    getDayTransactions,
    getDayTotalExpenses,
    getCurrentDay,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
