import React, { useState } from 'react';
import { useQRScanner } from '../../hooks/useQRScanner';
import { useTelegram } from '../../hooks/useTelegram';
import { validateQRData, isQRExpired } from '../../utils/qrCrypto';

interface QRScannerProps {
  onScan: (data: { businessId: number; userId: number }) => void;
}

export function QRScanner({ onScan }: QRScannerProps) {
  const { themeColors, hapticNotification } = useTelegram();
  const { scanning, error, startScanning, stopScanning, containerId } = useQRScanner();
  const [scanError, setScanError] = useState<string | null>(null);

  const handleStart = async () => {
    setScanError(null);
    await startScanning((data) => {
      const decoded = validateQRData(data);
      
      if (!decoded) {
        setScanError('Неверный QR-код');
        hapticNotification('error');
        return;
      }
      
      if (isQRExpired(decoded.timestamp)) {
        setScanError('QR-код истек');
        hapticNotification('error');
        return;
      }

      onScan({
        businessId: decoded.businessId,
        userId: decoded.userId
      });
      stopScanning();
      hapticNotification('success');
    });
  };

  const handleStop = async () => {
    await stopScanning();
  };

  return (
    <div className="qr-scanner">
      <h3 style={{ color: themeColors.textColor }}>Сканирование QR</h3>

      {!scanning ? (
        <button
          className="start-scan-button"
          onClick={handleStart}
          style={{
            backgroundColor: themeColors.buttonColor,
            color: themeColors.buttonTextColor
          }}
        >
          Начать сканирование
        </button>
      ) : (
        <>
          <div id={containerId} className="scanner-container" />
          <button
            className="stop-scan-button"
            onClick={handleStop}
            style={{
              backgroundColor: themeColors.secondaryBgColor,
              color: themeColors.textColor
            }}
          >
            Остановить
          </button>
        </>
      )}

      {error && (
        <div className="error" style={{ color: themeColors.linkColor }}>
          {error}
        </div>
      )}

      {scanError && (
        <div className="error" style={{ color: themeColors.linkColor }}>
          {scanError}
        </div>
      )}
    </div>
  );
}