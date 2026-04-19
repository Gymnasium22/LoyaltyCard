import { useState, useCallback, useRef, useEffect } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

interface ScanResult {
  decodedText: string;
  format: string;
}

export function useQRScanner() {
  const [scanning, setScanning] = useState(false);
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = useRef('qr-scanner-container');

  const startScanning = useCallback(async (onScan: (data: string) => void) => {
    try {
      setError(null);
      
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(containerId.current);
      }

      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          const result: ScanResult = {
            decodedText,
            format: 'QR_CODE'
          };
          setLastResult(result);
          onScan(decodedText);
        },
        () => {}
      );

      setScanning(true);
    } catch (e) {
      console.error('Scanner start error:', e);
      setError('Не удалось запустить сканер');
    }
  }, []);

  const stopScanning = useCallback(async () => {
    if (scannerRef.current && scanning) {
      try {
        await scannerRef.current.stop();
        setScanning(false);
      } catch (e) {
        console.error('Scanner stop error:', e);
      }
    }
  }, [scanning]);

  useEffect(() => {
    return () => {
      if (scannerRef.current && scanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  return {
    scanning,
    lastResult,
    error,
    startScanning,
    stopScanning,
    containerId: containerId.current
  };
}