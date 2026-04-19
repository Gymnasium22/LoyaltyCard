import { useEffect, useState, useCallback } from 'react';
import type { User } from '../types';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: any;
    };
  }
}

export interface ThemeColors {
  bgColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  hintColor: string;
  linkColor: string;
  secondaryBgColor: string;
}

export function useTelegram() {
  const [user, setUser] = useState<User | null>(null);
  const [themeColors, setThemeColors] = useState<ThemeColors>({
    bgColor: '#ffffff',
    textColor: '#000000',
    buttonColor: '#2481cc',
    buttonTextColor: '#ffffff',
    hintColor: '#999999',
    linkColor: '#2481cc',
    secondaryBgColor: '#f0f0f0'
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
      try {
        tg.ready();
      } catch {}
      setIsReady(true);
      
      try {
        const unsafe = tg.initDataUnsafe?.user;
        if (unsafe) {
          setUser({
            id: unsafe.id,
            firstName: unsafe.first_name,
            lastName: unsafe.last_name,
            username: unsafe.username,
            role: 'client'
          });
        }
      } catch {}
      
      try {
        if (tg.themeParams) {
          setThemeColors({
            bgColor: tg.themeParams.bg_color || '#ffffff',
            textColor: tg.themeParams.text_color || '#000000',
            buttonColor: tg.themeParams.button_color || '#2481cc',
            buttonTextColor: tg.themeParams.button_text_color || '#ffffff',
            hintColor: tg.themeParams.hint_color || '#999999',
            linkColor: tg.themeParams.link_color || '#2481cc',
            secondaryBgColor: tg.themeParams.secondary_bg_color || '#f0f0f0'
          });
        }
      } catch {}
    } else {
      setIsReady(true);
      const devUserId = 123456789;
      setUser({
        id: devUserId,
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser',
        role: 'client'
      });
    }
  }, []);

  const expand = useCallback(() => {
    try {
      window.Telegram?.WebApp?.expand();
    } catch {}
  }, []);

  const close = useCallback(() => {
    try {
      window.Telegram?.WebApp?.close();
    } catch {}
  }, []);

  const hapticImpact = useCallback((style: 'light' | 'medium' | 'heavy' | 'soft' | 'rigid' = 'medium') => {
    try {
      window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(style);
    } catch {}
  }, []);

  const hapticNotification = useCallback((type: 'success' | 'warning' | 'error' = 'success') => {
    try {
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred(type);
    } catch {}
  }, []);

  const showMainButton = useCallback((text: string, onClick: () => void) => {
    try {
      const btn = window.Telegram?.WebApp?.MainButton;
      if (btn) {
        btn.setText(text);
        btn.onClick(onClick);
        btn.show();
      }
    } catch {}
  }, []);

  const hideMainButton = useCallback(() => {
    try {
      window.Telegram?.WebApp?.MainButton?.hide();
    } catch {}
  }, []);

  return {
    user,
    setUser,
    themeColors,
    isReady,
    expand,
    close,
    hapticImpact,
    hapticNotification,
    showMainButton,
    hideMainButton
  };
}