import React from 'react';
import { useTelegram } from '../../hooks/useTelegram';
import { useApp } from '../../hooks/AppContext';
import { Transaction } from '../../types';
import { exportToCSV } from '../../hooks/useCSVExport';

interface HistoryListProps {
  businessId?: number;
}

export function HistoryList({ businessId }: HistoryListProps) {
  const { themeColors } = useTelegram();
  const { transactions, user } = useApp();

  const filteredTransactions = transactions.filter(t => 
    t.cardId && (!businessId || t.businessId === businessId)
  ).sort((a, b) => b.timestamp - a.timestamp);

  const handleExport = () => {
    exportToCSV(filteredTransactions, 'history');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (filteredTransactions.length === 0) {
    return (
      <div className="history-empty">
        <p style={{ color: themeColors.hintColor }}>История пуста</p>
      </div>
    );
  }

  return (
    <div className="history-list">
      <div className="history-header">
        <h3 style={{ color: themeColors.textColor }}>История</h3>
        <button 
          className="export-button"
          onClick={handleExport}
          style={{
            backgroundColor: themeColors.secondaryBgColor,
            color: themeColors.textColor
          }}
        >
          Экспорт CSV
        </button>
      </div>

      <div className="transactions">
        {filteredTransactions.map(tx => (
          <div 
            key={tx.id} 
            className="transaction-item"
            style={{
              borderColor: themeColors.secondaryBgColor
            }}
          >
            <div className="transaction-icon">
              {tx.type === 'stamp' ? '📮' : '🎁'}
            </div>
            <div className="transaction-info">
              <span style={{ color: themeColors.textColor }}>
                {tx.type === 'stamp' ? 'Штамп получен' : tx.details || 'Награда получена'}
              </span>
              <span style={{ color: themeColors.hintColor }}>
                {formatDate(tx.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}