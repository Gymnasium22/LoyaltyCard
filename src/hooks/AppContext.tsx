import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useCloudStorage } from './useCloudStorage';
import { useTelegram } from './useTelegram';
import { User, Business, StampCard, Transaction, StaffMember, UserRole } from '../types';

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  businesses: Business[];
  addBusiness: (business: Business) => void;
  updateBusiness: (id: number, business: Partial<Business>) => void;
  cards: StampCard[];
  addCard: (card: StampCard) => void;
  updateCard: (id: number, card: Partial<StampCard>) => void;
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  staffMembers: StaffMember[];
  addStaffMember: (member: StaffMember) => void;
  removeStaffMember: (id: number) => void;
  currentBusinessId: number | null;
  setCurrentBusinessId: (id: number | null) => void;
  currentStaffBusinessId: number | null;
  setCurrentStaffBusinessId: (id: number | null) => void;
}

const AppContext = createContext<AppState | null>(null);

export function useApp(): AppState {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const { user, setUser } = useTelegram();
  const [role, setRole] = useState<UserRole>('client');
  const [businesses, setBusinesses] = useCloudStorage<Business[]>('businesses', []);
  const [cards, setCards] = useCloudStorage<StampCard[]>('cards', []);
  const [transactions, setTransactions] = useCloudStorage<Transaction[]>('transactions', []);
  const [staffMembers, setStaffMembers] = useCloudStorage<StaffMember[]>('staffMembers', []);
  const [currentBusinessId, setCurrentBusinessId] = useState<number | null>(null);
  const [currentStaffBusinessId, setCurrentStaffBusinessId] = useState<number | null>(null);

  const addBusiness = (business: Business) => {
    setBusinesses(prev => [...prev, business]);
  };

  const updateBusiness = (id: number, updates: Partial<Business>) => {
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const addCard = (card: StampCard) => {
    setCards(prev => {
      const existing = prev.find(c => c.businessId === card.businessId && c.userId === card.userId);
      if (existing) {
        return prev.map(c => c.id === existing.id ? card : c);
      }
      return [...prev, card];
    });
  };

  const updateCard = (id: number, updates: Partial<StampCard>) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [...prev, tx]);
  };

  const addStaffMember = (member: StaffMember) => {
    setStaffMembers(prev => [...prev, member]);
  };

  const removeStaffMember = (id: number) => {
    setStaffMembers(prev => prev.filter(m => m.id !== id));
  };

  const value: AppState = {
    user,
    setUser,
    role,
    setRole,
    businesses,
    addBusiness,
    updateBusiness,
    cards,
    addCard,
    updateCard,
    transactions,
    addTransaction,
    staffMembers,
    addStaffMember,
    removeStaffMember,
    currentBusinessId,
    setCurrentBusinessId,
    currentStaffBusinessId,
    setCurrentStaffBusinessId
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}