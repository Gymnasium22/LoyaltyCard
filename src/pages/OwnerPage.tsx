import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/AppContext';
import { useTelegram } from '../hooks/useTelegram';
import { BusinessSetup } from '../components/owner/BusinessSetup';
import { StaffManager } from '../components/owner/StaffManager';
import { Analytics } from '../components/owner/Analytics';
import { Business } from '../types';

export function OwnerPage() {
  const navigate = useNavigate();
  const { themeColors } = useTelegram();
  const { businesses, user, setCurrentBusinessId, setCurrentStaffBusinessId } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'setup' | 'staff' | 'analytics'>('list');

  const myBusinesses = businesses.filter(b => b.ownerId === user?.id);

  const handleSelectBusiness = (business: Business) => {
    setSelectedBusiness(business);
    setCurrentBusinessId(business.id);
    setCurrentStaffBusinessId(business.id);
  };

  const handleBack = () => {
    setSelectedBusiness(null);
    setShowCreate(false);
    setActiveTab('list');
  };

  if (selectedBusiness) {
    return (
      <div className="owner-page">
        <h2 style={{ color: themeColors.textColor }}>{selectedBusiness.name}</h2>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'setup' ? 'active' : ''}`}
            onClick={() => setActiveTab('setup')}
            style={{
              color: activeTab === 'setup' ? themeColors.buttonColor : themeColors.hintColor
            }}
          >
            Настройки
          </button>
          <button
            className={`tab ${activeTab === 'staff' ? 'active' : ''}`}
            onClick={() => setActiveTab('staff')}
            style={{
              color: activeTab === 'staff' ? themeColors.buttonColor : themeColors.hintColor
            }}
          >
            Сотрудники
          </button>
          <button
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
            style={{
              color: activeTab === 'analytics' ? themeColors.buttonColor : themeColors.hintColor
            }}
          >
            Аналитика
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'setup' && <BusinessSetup business={selectedBusiness} />}
          {activeTab === 'staff' && <StaffManager businessId={selectedBusiness.id} />}
          {activeTab === 'analytics' && <Analytics businessId={selectedBusiness.id} />}
        </div>

        <button
          onClick={handleBack}
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

  return (
    <div className="owner-page">
      <h2 style={{ color: themeColors.textColor }}>Мой бизнес</h2>

      {showCreate ? (
        <BusinessSetup />
      ) : (
        <>
          {myBusinesses.length === 0 ? (
            <p style={{ color: themeColors.hintColor }}>
              У вас пока нет бизнеса
            </p>
          ) : (
            <div className="business-list">
              {myBusinesses.map(b => (
                <button
                  key={b.id}
                  className="business-item"
                  onClick={() => handleSelectBusiness(b)}
                  style={{
                    backgroundColor: themeColors.secondaryBgColor,
                    color: themeColors.textColor
                  }}
                >
                  <span className="business-name">{b.name}</span>
                  <span className="business-desc">{b.description}</span>
                  <span className="business-stamps">
                    {b.stampCount} штампов → {b.reward}
                  </span>
                </button>
              ))}
            </div>
          )}

          <button
            className="create-button"
            onClick={() => setShowCreate(true)}
            style={{
              backgroundColor: themeColors.buttonColor,
              color: themeColors.buttonTextColor
            }}
          >
            {myBusinesses.length === 0 ? 'Создать бизнес' : 'Добавить бизнес'}
          </button>
        </>
      )}

      {showCreate && (
        <button
          onClick={() => setShowCreate(false)}
          style={{
            backgroundColor: themeColors.secondaryBgColor,
            color: themeColors.textColor
          }}
        >
          Отмена
        </button>
      )}

      <button
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