import { Business, StampCard } from '../types';

export function canAddStamp(card: StampCard, business: Business): { valid: boolean; reason?: string } {
  if (card.lastStampTime) {
    const cooldownMs = business.cooldownHours * 60 * 60 * 1000;
    const timeSinceLastStamp = Date.now() - card.lastStampTime;
    
    if (timeSinceLastStamp < cooldownMs) {
      const remainingHours = Math.ceil((cooldownMs - timeSinceLastStamp) / (60 * 60 * 1000));
      return {
        valid: false,
        reason: `Подождите ${remainingHours} ч. перед следующим штампом`
      };
    }
  }
  
  return { valid: true };
}

export function canGetReward(card: StampCard, business: Business): { valid: boolean; reason?: string } {
  if (card.stamps < business.stampCount) {
    return {
      valid: false,
      reason: `Нужно ${business.stampCount - card.stamps} штампов для награды`
    };
  }
  
  if (card.lastRewardTime) {
    const cooldownMs = business.cooldownHours * 60 * 60 * 1000;
    const timeSinceLastReward = Date.now() - card.lastRewardTime;
    
    if (timeSinceLastReward < cooldownMs) {
      const remainingHours = Math.ceil((cooldownMs - timeSinceLastReward) / (60 * 60 * 1000));
      return {
        valid: false,
        reason: `Подождите ${remainingHours} ч. после последней награды`
      };
    }
  }
  
  return { valid: true };
}

export function getStampsProgress(card: StampCard, business: Business): number {
  return (card.stamps / business.stampCount) * 100;
}

export function getRemainingStamps(card: StampCard, business: Business): number {
  return Math.max(0, business.stampCount - card.stamps);
}