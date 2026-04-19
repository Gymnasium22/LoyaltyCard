import React, { useMemo } from 'react';
import { useApp } from '../../hooks/AppContext';
import { useTelegram } from '../../hooks/useTelegram';
import { Transaction } from '../../types';

interface ShiftStatsProps {
  businessId: number;
}

export function ShiftStats({ businessId }: ShiftStatsProps) {
  const { themeColors } = useTelegram();
  const { transactions, user, businesses } = useApp();

  const stats = useMemo(() => {
    if (!user) return { stamps: 0, rewards: 0 };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();

    const todayTransactions = transactions.filter(
      t => t.businessId === businessId && 
           t.staffId === user.id && 
           t.timestamp >= todayStart
    );

    const stamps = todayTransactions.filter(t => t.type === 'stamp').length;
    const rewards = todayTransactions.filter(t => t.type === 'reward').length;

    return { stamps, rewards };
  }, [transactions, businessId, user]);

  const business = businesses.find(b => b.id === businessId);

  const weekStats = useMemo(() => {
    if (!user) return [];

    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    
    const days: { date: string; stamps: number; rewards: number }[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dayStart = date.getTime();
      
      date.setDate(date.getDate() + 1);
      const dayEnd = date.getTime();

      const dayTransactions = transactions.filter(
        t => t.businessId === businessId && 
             t.staffId === user.id && 
             t.timestamp >= dayStart && 
             t.timestamp < dayEnd
      );

      days.push({
        date: date.toLocaleDateString('ru-RU', { weekday: 'short' }),
        stamps: dayTransactions.filter(t => t.type === 'stamp').length,
        rewards: dayTransactions.filter(t => t.type === 'reward').length
      });
    }

    return days;
  }, [transactions, businessId, user]);

  return (
    <div className="shift-stats">
      <h3 style={{ color: themeColors.textColor }}>
        Статистика {business?.name || ''}
      </h3>

      <div className="today-stats">
        <div className="stat-card" style={{ backgroundColor: themeColors.secondaryBgColor }}>
          <span className="stat-value" style={{ color: themeColors.textColor }}>
            {stats.stamps}
          </span>
          <span className="stat-label" style={{ color: themeColors.hintColor }}>
            Штампов сегодня
          </span>
        </div>
        <div className="stat-card" style={{ backgroundColor: themeColors.secondaryBgColor }}>
          <span className="stat-value" style={{ color: themeColors.textColor }}>
            {stats.rewards}
          </span>
          <span className="stat-label" style={{ color: themeColors.hintColor }}>
            Наград сегодня
          </span>
        </div>
      </div>

      <div className="week-chart">
        <h4 style={{ color: themeColors.textColor }}>За неделю</h4>
        <div className="chart-bars">
          {weekStats.map((day, i) => (
            <div key={i} className="chart-bar">
              <div className="bar-container">
                <div 
                  className="bar stamps"
                  style={{ 
                    height: `${Math.min(day.stamps * 10, 100)}%`,
                    backgroundColor: themeColors.buttonColor
                  }}
                />
              </div>
              <span className="bar-label" style={{ color: themeColors.hintColor }}>
                {day.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}