import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { useApp } from '../../hooks/AppContext';
import { useTelegram } from '../../hooks/useTelegram';
import { generateQRData } from '../../utils/qrCrypto';
import { canAddStamp, canGetReward, getRemainingStamps } from '../../utils/stampValidation';
import { Business, StampCard } from '../../types';

interface CardViewProps {
  card: StampCard;
  business: Business;
}

export function CardView({ card, business }: CardViewProps) {
  const { updateCard, addTransaction, user } = useApp();
  const { themeColors, hapticImpact, hapticNotification } = useTelegram();
  const [qrData, setQrData] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [stampError, setStampError] = useState<string | null>(null);

  useEffect(() => {
    if (user && business) {
      const data = generateQRData(business.id, user.id);
      setQrData(data);
    }
  }, [user, business]);

  const handleReward = () => {
    const rewardCheck = canGetReward(card, business);
    
    if (!rewardCheck.valid) {
      setStampError(rewardCheck.reason || 'Нельзя получить награду');
      hapticNotification('warning');
      return;
    }

    const newStamps = 0;
    const updatedCard: StampCard = {
      ...card,
      stamps: newStamps,
      lastRewardTime: Date.now(),
      updatedAt: Date.now()
    };

    updateCard(card.id, updatedCard);
    addTransaction({
      id: Date.now(),
      businessId: business.id,
      cardId: card.id,
      staffId: user?.id || 0,
      type: 'reward',
      timestamp: Date.now(),
      details: `Получена награда: ${business.reward}`
    });

    setShowConfetti(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: [themeColors.buttonColor, '#FFD700', '#FFA500']
    });
    hapticNotification('success');

    setTimeout(() => setShowConfetti(false), 3000);

    const qrNew = generateQRData(business.id, user?.id || 0);
    setQrData(qrNew);
  };

  const progress = (card.stamps / business.stampCount) * 100;
  const remaining = getRemainingStamps(card, business);

  return (
    <div className="card-view">
      <div className="business-header">
        <h2 style={{ color: themeColors.textColor }}>{business.name}</h2>
        <p style={{ color: themeColors.hintColor }}>{business.description}</p>
      </div>

      <div className="stamp-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${progress}%`,
              backgroundColor: themeColors.buttonColor 
            }}
          />
        </div>
        <div className="progress-text">
          <span style={{ color: themeColors.textColor }}>
            {card.stamps} / {business.stampCount} штампов
          </span>
          {remaining > 0 && (
            <span style={{ color: themeColors.hintColor }}>
              Осталось {remaining} для награды
            </span>
          )}
        </div>
      </div>

      <div className="stamps-grid">
        {Array.from({ length: business.stampCount }).map((_, i) => (
          <div
            key={i}
            className={`stamp ${i < card.stamps ? 'filled' : 'empty'}`}
            style={{
              backgroundColor: i < card.stamps ? themeColors.buttonColor : 'transparent',
              borderColor: themeColors.buttonColor
            }}
          >
            {i < card.stamps && '✓'}
          </div>
        ))}
      </div>

      {remaining === 0 && (
        <button
          className="reward-button"
          onClick={handleReward}
          style={{
            backgroundColor: themeColors.buttonColor,
            color: themeColors.buttonTextColor
          }}
        >
          Получить {business.reward}!
        </button>
      )}

      {stampError && (
        <div className="error-message" style={{ color: themeColors.linkColor }}>
          {stampError}
        </div>
      )}

      <div className="qr-section">
        <p style={{ color: themeColors.hintColor }}>Покажите QR-код сотруднику</p>
        <div className="qr-code">
          <QRCodeSVG value={qrData} size={180} level="H" />
        </div>
      </div>
    </div>
  );
}