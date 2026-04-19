import React, { useState } from 'react';
import { useApp } from '../../hooks/AppContext';
import { useTelegram } from '../../hooks/useTelegram';
import { canAddStamp } from '../../utils/stampValidation';
import { StampCard, Business } from '../../types';

interface StampConfirmProps {
  businessId: number;
  userId: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function StampConfirm({ businessId, userId, onConfirm, onCancel }: StampConfirmProps) {
  const { themeColors, hapticImpact } = useTelegram();
  const { businesses, cards, updateCard, addCard, addTransaction, user } = useApp();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const business = businesses.find(b => b.id === businessId);
  const card = cards.find(c => c.businessId === businessId && c.userId === userId);

  const handleConfirm = async () => {
    if (!business || !user) return;

    setLoading(true);
    setError(null);

    const existingCard = card;

    if (existingCard) {
      const stampCheck = canAddStamp(existingCard, business);
      if (!stampCheck.valid) {
        setError(stampCheck.reason || 'Нельзя поставить штамп');
        setLoading(false);
        return;
      }

      const updatedCard: StampCard = {
        ...existingCard,
        stamps: existingCard.stamps + 1,
        lastStampTime: Date.now(),
        updatedAt: Date.now()
      };

      updateCard(existingCard.id, updatedCard);

      addTransaction({
        id: Date.now(),
        businessId,
        cardId: existingCard.id,
        staffId: user.id,
        type: 'stamp',
        timestamp: Date.now()
      });
    } else {
      const newCard: StampCard = {
        id: Date.now(),
        businessId,
        userId,
        stamps: 1,
        totalStamps: business.stampCount,
        lastStampTime: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      addCard(newCard);

      addTransaction({
        id: Date.now(),
        businessId,
        cardId: newCard.id,
        staffId: user.id,
        type: 'stamp',
        timestamp: Date.now()
      });
    }

    hapticImpact('medium');
    setLoading(false);
    onConfirm();
  };

  if (!business) {
    return (
      <div className="stamp-confirm">
        <p style={{ color: themeColors.hintColor }}>Бизнес не найден</p>
        <button onClick={onCancel} style={{ backgroundColor: themeColors.secondaryBgColor }}>
          Назад
        </button>
      </div>
    );
  }

  return (
    <div className="stamp-confirm">
      <h3 style={{ color: themeColors.textColor }}>Подтверждение штампа</h3>
      
      <div className="confirm-info">
        <p style={{ color: themeColors.textColor }}>
          Бизнес: <strong>{business.name}</strong>
        </p>
        <p style={{ color: themeColors.textColor }}>
          Текущих штампов: <strong>{card?.stamps || 0} / {business.stampCount}</strong>
        </p>
      </div>

      {error && (
        <div className="error" style={{ color: themeColors.linkColor }}>
          {error}
        </div>
      )}

      <div className="confirm-buttons">
        <button
          className="confirm-button"
          onClick={handleConfirm}
          disabled={loading}
          style={{
            backgroundColor: themeColors.buttonColor,
            color: themeColors.buttonTextColor
          }}
        >
          {loading ? '...' : 'Поставить штам��'}
        </button>
        
        <button
          className="cancel-button"
          onClick={onCancel}
          disabled={loading}
          style={{
            backgroundColor: themeColors.secondaryBgColor,
            color: themeColors.textColor
          }}
        >
          Отмена
        </button>
      </div>
    </div>
  );
}