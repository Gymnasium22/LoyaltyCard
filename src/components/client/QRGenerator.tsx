import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../../hooks/AppContext';
import { useTelegram } from '../../hooks/useTelegram';
import { generateQRData } from '../../utils/qrCrypto';

interface QRGeneratorProps {
  businessId: number;
}

export function QRGenerator({ businessId }: QRGeneratorProps) {
  const { user, businesses } = useApp();
  const { themeColors } = useTelegram();
  const [qrData, setQrData] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (user) {
      const data = generateQRData(businessId, user.id);
      setQrData(data);
    }
  }, [businessId, user, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(k => k + 1);
  };

  const business = businesses.find(b => b.id === businessId);

  return (
    <div className="qr-generator">
      <h3 style={{ color: themeColors.textColor }}>
        Ваш QR-код для {business?.name || 'бизнеса'}
      </h3>
      <p style={{ color: themeColors.hintColor }}>
        Покажите этот код сотруднику для получения штампа
      </p>

      <div className="qr-code-container">
        <QRCodeSVG value={qrData} size={200} level="H" />
      </div>

      <button
        className="refresh-button"
        onClick={handleRefresh}
        style={{
          backgroundColor: themeColors.buttonColor,
          color: themeColors.buttonTextColor
        }}
      >
        Обновить QR-код
      </button>
    </div>
  );
}