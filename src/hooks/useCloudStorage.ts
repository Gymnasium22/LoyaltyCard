import { useState, useEffect, useCallback } from 'react';
import { setCache, getCache, removeCache } from '../utils/mergeConflicts';

const STORAGE_PREFIX = 'loyalty_';

export function useCloudStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [data, setData] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [cloudStorage, setCloudStorage] = useState<any>(null);

  useEffect(() => {
    const initCloudStorage = async () => {
      try {
        const stored = (window as any).Telegram?.WebApp?.CloudStorage;
        if (stored) {
          setCloudStorage(stored);
          
          await stored.getItem(STORAGE_PREFIX + key, (value: string | null) => {
            if (value) {
              try {
                setData(JSON.parse(value));
              } catch {
                setData(initialValue);
              }
            } else {
              const cached = getCache<T>(key);
              setData(cached ?? initialValue);
            }
            setLoading(false);
          });
        } else {
          const cached = getCache<T>(key);
          setData(cached ?? initialValue);
          setLoading(false);
        }
      } catch (e) {
        console.error('CloudStorage init error:', e);
        const cached = getCache<T>(key);
        setData(cached ?? initialValue);
        setLoading(false);
      }
    };

    initCloudStorage();
  }, [key, initialValue]);

  const updateValue = useCallback(async (value: T | ((prev: T) => T)) => {
    const newValue = typeof value === 'function' ? (value as (prev: T) => T)(data) : value;
    setData(newValue);
    setCache(key, newValue);

    if (cloudStorage) {
      try {
        await cloudStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(newValue));
      } catch (e) {
        console.error('CloudStorage set error:', e);
      }
    }
  }, [data, cloudStorage, key]);

  return [data, updateValue, loading];
}

export async function setCloudItem(key: string, value: any): Promise<void> {
  const cloudStorage = (window as any).Telegram?.WebApp?.CloudStorage;
  
  if (cloudStorage) {
    await cloudStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } else {
    setCache(key, value);
  }
}

export async function getCloudItem<T>(key: string): Promise<T | null> {
  const cloudStorage = (window as any).Telegram?.WebApp?.CloudStorage;
  
  if (cloudStorage) {
    return new Promise((resolve) => {
      cloudStorage.getItem(STORAGE_PREFIX + key, (value: string | null) => {
        if (value) {
          try {
            resolve(JSON.parse(value));
          } catch {
            resolve(null);
          }
        } else {
          resolve(getCache<T>(key));
        }
      });
    });
  }
  
  return getCache<T>(key);
}

export async function removeCloudItem(key: string): Promise<void> {
  const cloudStorage = (window as any).Telegram?.WebApp?.CloudStorage;
  
  if (cloudStorage) {
    await cloudStorage.removeItem(STORAGE_PREFIX + key);
  }
  removeCache(key);
}