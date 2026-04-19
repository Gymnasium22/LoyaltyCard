import React, { useMemo } from 'react';
import { useApp } from '../../hooks/AppContext';
import { useTelegram } from '../../hooks/useTelegram';
import { exportToCSV } from '../../hooks/useCSVExport';

interface AnalyticsProps {
  businessId: number;
}

export function Analytics({ businessId }: AnalyticsProps) {
  const { themeColors } = useTelegram();
  const { transactions, businesses } = useApp();

  const business = businesses.find(b => b.id === businessId);

  const stats = useMemo(() => {
    const allTx = transactions.filter(t => t.businessId === businessId);
    
    const totalStamps = allTx.filter(t => t.type === 'stamp').length;
    const totalRewards = allTx.filter(t => t.type === 'reward').length;
    
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weekTx = allTx.filter(t => t.timestamp > weekAgo);
    const weekStamps = weekTx.filter(t => t.type === 'stamp').length;
    const weekRewards = weekTx.filter(t => t.type === 'reward').length;

    const uniqueUsers = new Set(allTx.map(t => t.cardId)).size;

    return { totalStamps, totalRewards, weekStamps, weekRewards, uniqueUsers };
  }, [transactions, businessId]);

  const dailyStats = useMemo(() => {
    const days: { date: string; stamps: number; rewards: number }[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dayStart = date.getTime();
      
      date.setDate(date.getDate() + 1);
      const dayEnd = date.getTime();

      const dayTx = transactions.filter(
        t => t.businessId === businessId && t.timestamp >= dayStart && t.timestamp < dayEnd
      );

      days.push({
        date: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
        stamps: dayTx.filter(t => t.type === 'stamp').length,
        rewards: dayTx.filter(t => t.type === 'reward').length
      });
    }

    return days;
  }, [transactions, businessId]);

  const handleExport = () => {
    const data = transactions.filter(t => t.businessId === businessId);
    exportToCSV(data, `analytics_${business?.name || 'business'}`);
  };

  return (
    <div className="analytics">
      <h3 style={{ color: themeColors.textColor }}>
        Аналитика {business?.name || ''}
      </h3>

      <div className="stats-grid">
        <div className="stat-card" style={{ backgroundColor: themeColors.secondaryBgColor }}>
          <span className="stat-value" style={{ color: themeColors.buttonColor }}>
            {stats.totalStamps}
          </span>
          <span className="stat-label" style={{ color: themeColors.hintColor }}>
            Всего штампов
          </span>
        </div>
        
        <div className="stat-card" style={{ backgroundColor: themeColors.secondaryBgColor }}>
          <span className="stat-value" style={{ color: themeColors.buttonColor }}>
            {stats.totalRewards}
          </span>
          <span className="stat-label" style={{ color: themeColors.hintColor }}>
            Всего наград
          </span>
        </div>
        
        <div className="stat-card" style={{ backgroundColor: themeColors.secondaryBgColor }}>
          <span className="stat-value" style={{ color: themeColors.buttonColor }}>
            {stats.weekStamps}
          </span>
          <span className="stat-label" style={{ color: themeColors.hintColor }}>
            Штампов за неделю
          </span>
        </div>
        
        <div className="stat-card" style={{ backgroundColor: themeColors.secondaryBgColor }}>
          <span className="stat-value" style={{ color: themeColors.buttonColor }}>
            {stats.uniqueUsers}
          </span>
          <span className="stat-label" style={{ color: themeColors.hintColor }}>
            Уникальных клиентов
          </span>
        </div>
      </div>

      <div className="chart-section">
        <h4 style={{ color: themeColors.textColor }}>По дням (7 дней)</h4>
        <div className="chart">
          {dailyStats.map((day, i) => (
            <div key={i} className="chart-column">
              <div className="bars">
                <div 
                  className="bar reward"
                  style={{ 
                    height: `${day.rewards > 0 ? (day.rewards / Math.max(...dailyStats.map(d => d.stamps))) * 100 : 0}%`,
                    backgroundColor: '#FFD700'
                  }}
                />
                <div 
                  className="bar stamp"
                  style={{ 
                    height: `${day.stamps > 0 ? (day.stamps / Math.max(...dailyStats.map(d => d.stamps))) * 100 : 0}%`,
                    backgroundColor: themeColors.buttonColor
                  }}
                />
              </div>
              <span className="chart-label" style={{ color: themeColors.hintColor }}>
                {day.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        className="export-button"
        onClick={handleExport}
        style={{
          backgroundColor: themeColors.buttonColor,
          color: themeColors.buttonTextColor
        }}
      >
        Экспорт в CSV
      </button>
    </div>
  );
}