const CACHE_PREFIX = 'loyalty_cache_';

export function setCache<T>(key: string, value: T, ttlMs?: number): void {
  const data = {
    value,
    timestamp: Date.now(),
    ttl: ttlMs
  };
  localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(data));
}

export function getCache<T>(key: string): T | null {
  const stored = localStorage.getItem(CACHE_PREFIX + key);
  if (!stored) return null;
  
  try {
    const data = JSON.parse(stored) as { value: T; timestamp: number; ttl?: number };
    
    if (data.ttl) {
      if (Date.now() - data.timestamp > data.ttl) {
        localStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }
    }
    
    return data.value;
  } catch {
    return null;
  }
}

export function removeCache(key: string): void {
  localStorage.removeItem(CACHE_PREFIX + key);
}

export function clearCache(): void {
  const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX));
  keys.forEach(k => localStorage.removeItem(k));
}