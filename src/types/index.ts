export type UserRole = 'client' | 'staff' | 'owner';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username?: string;
  role: UserRole;
  businessId?: number;
}

export interface Business {
  id: number;
  ownerId: number;
  name: string;
  description: string;
  stampCount: number;
  reward: string;
  rewardDescription: string;
  cooldownHours: number;
  createdAt: number;
}

export interface StampCard {
  id: number;
  businessId: number;
  userId: number;
  stamps: number;
  totalStamps: number;
  lastStampTime?: number;
  lastRewardTime?: number;
  createdAt: number;
  updatedAt: number;
}

export interface Transaction {
  id: number;
  businessId: number;
  cardId: number;
  staffId: number;
  type: 'stamp' | 'reward';
  timestamp: number;
  details?: string;
}

export interface QRCoded {
  businessId: number;
  userId: number;
  timestamp: number;
  signature: string;
  nonce: string;
}

export interface ShiftStats {
  staffId: number;
  businessId: number;
  date: string;
  stampsGiven: number;
  rewardsGiven: number;
}

export interface StaffMember {
  id: number;
  userId: number;
  businessId: number;
  firstName: string;
  lastName: string;
  addedAt: number;
}