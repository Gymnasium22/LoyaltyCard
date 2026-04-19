import { QRCoded } from '../types';

export function generateQRData(businessId: number, userId: number): string {
  const nonce = Math.random().toString(36).substring(2, 15);
  const timestamp = Date.now();
  const signature = generateSignature(businessId, userId, timestamp, nonce);
  
  const data: QRCoded = {
    businessId,
    userId,
    timestamp,
    signature,
    nonce
  };
  
  return btoa(JSON.stringify(data));
}

export function generateSignature(businessId: number, userId: number, timestamp: number, nonce: string): string {
  const payload = `${businessId}:${userId}:${timestamp}:${nonce}`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36) + timestamp.toString(36);
}

export function validateQRData(encodedData: string): QRCoded | null {
  try {
    const decoded = JSON.parse(atob(encodedData)) as QRCoded;
    
    if (!decoded.businessId || !decoded.userId || !decoded.timestamp || !decoded.signature) {
      return null;
    }
    
    const expectedSignature = generateSignature(
      decoded.businessId,
      decoded.userId,
      decoded.timestamp,
      decoded.nonce
    );
    
    if (decoded.signature !== expectedSignature) {
      return null;
    }
    
    return decoded;
  } catch {
    return null;
  }
}

export function isQRExpired(timestamp: number, maxAgeMs: number = 300000): boolean {
  return Date.now() - timestamp > maxAgeMs;
}