import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../hooks/AppContext';
import { useTelegram } from '../hooks/useTelegram';
import { CardView } from '../components/client/CardView';
import { QRGenerator } from '../components/client/QRGenerator';
import { HistoryList } from '../components/client/HistoryList';
import { StampCard } from '../types';

export function ClientPage() {
  const navigate = useNavigate();
  const { businessId } = useParams();
  const { themeColors } = useTelegram();
  const { businesses, cards, user, setCurrentBusinessId } = useApp();
  const [activeTab, setActiveTab] = useState<'card' | 'qr' | 'history'>('card');

  const bid = businessId ? parseInt(businessId) : null;
  const business = businesses.find(b => b.id === bid);
  const userCard = cards.find(c => c.userId === user?.id && c.businessId === bid);

  const handleSelectBusiness = (id: number) => {
    setCurrentBusinessId(id);
    navigate(`/client/${id}`);
  };

  if (!bid || !business) {
    return (
      <div className="client-page">
        <div className="role-header">
          <h2 style={{ color: themeColors.textColor }}>Выберите бизнес</h2>
        </div>
        
        <div className="business-list">
          {businesses.length === 0 ? (
            <p style={{ color: themeColors.hintColor }}>
              Нет доступных программ лояльности
            </p>
          ) : (
            businesses.map(b => (
              <button
                key={b.id}
                className="business-item"
                onClick={() => handleSelectBusiness(b.id)}
                style={{
                  backgroundColor: themeColors.secondaryBgColor,
                  color: themeColors.textColor
                }}
              >
                <span className="business-name">{b.name}</span>
                <span className="business-desc">{b.description}</span>
              </button>
            ))
          )}
        </div>

        <button
          className="back-button"
          onClick={() => navigate('/')}
          style={{
            backgroundColor: themeColors.secondaryBgColor,
            color: themeColors.textColor
          }}
        >
          Назад
        </button>
      </div>
    );
  }

  const defaultCard: StampCard = {
    id: Date.now(),
    businessId: business.id,
    userId: user?.id || 0,
    stamps: 0,
    totalStamps: business.stampCount,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  return (
    <div className="client-page">
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'card' ? 'active' : ''}`}
          onClick={() => setActiveTab('card')}
          style={{
            color: activeTab === 'card' ? themeColors.buttonColor : themeColors.hintColor
          }}
        >
          Карта
        </button>
        <button
          className={`tab ${activeTab === 'qr' ? 'active' : ''}`}
          onClick={() => setActiveTab('qr')}
          style={{
            color: activeTab === 'qr' ? themeColors.buttonColor : themeColors.hintColor
          }}
        >
          QR-код
        </button>
        <button
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
          style={{
            color: activeTab === 'history' ? themeColors.buttonColor : themeColors.hintColor
          }}
        >
          История
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'card' && (
          <CardView card={userCard || defaultCard} business={business} />
        )}
        {activeTab === 'qr' && (
          <QRGenerator businessId={business.id} />
        )}
        {activeTab === 'history' && (
          <HistoryList businessId={business.id} />
        )}
      </div>

      <button
        className="back-button"
        onClick={() => navigate('/')}
        style={{
          backgroundColor: themeColors.secondaryBgColor,
          color: themeColors.textColor
        }}
      >
        Назад
      </button>
    </div>
  );
}