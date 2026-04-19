import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../hooks/AppContext';
import { useTelegram } from '../hooks/useTelegram';
import { QRScanner } from '../components/staff/QRScanner';
import { StampConfirm } from '../components/staff/StampConfirm';
import { ShiftStats } from '../components/staff/ShiftStats';

export function StaffPage() {
  const navigate = useNavigate();
  const { businessId } = useParams();
  const { themeColors } = useTelegram();
  const { businesses, user, setCurrentStaffBusinessId } = useApp();
  const [scanData, setScanData] = useState<{ businessId: number; userId: number } | null>(null);
  const [activeTab, setActiveTab] = useState<'scan' | 'stats'>('scan');

  const bid = businessId ? parseInt(businessId) : null;

  const handleSelectBusiness = (id: number) => {
    setCurrentStaffBusinessId(id);
    navigate(`/staff/${id}`);
  };

  if (!bid) {
    return (
      <div className="staff-page">
        <h2 style={{ color: themeColors.textColor }}>Выберите бизнес</h2>
        
        <div className="business-list">
          {businesses.map(b => (
            <button
              key={b.id}
              className="business-item"
              onClick={() => handleSelectBusiness(b.id)}
              style={{
                backgroundColor: themeColors.secondaryBgColor,
                color: themeColors.textColor
              }}
            >
              {b.name}
            </button>
          ))}
        </div>

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

  const handleScan = (data: { businessId: number; userId: number }) => {
    setScanData(data);
  };

  const handleConfirmCancel = () => {
    setScanData(null);
  };

  const handleConfirmSuccess = () => {
    setScanData(null);
    setActiveTab('stats');
  };

  return (
    <div className="staff-page">
      <h2 style={{ color: themeColors.textColor }}>
        Сотрудник: {businesses.find(b => b.id === bid)?.name}
      </h2>

      {scanData ? (
        <StampConfirm
          businessId={scanData.businessId}
          userId={scanData.userId}
          onConfirm={handleConfirmSuccess}
          onCancel={handleConfirmCancel}
        />
      ) : (
        <>
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'scan' ? 'active' : ''}`}
              onClick={() => setActiveTab('scan')}
              style={{
                color: activeTab === 'scan' ? themeColors.buttonColor : themeColors.hintColor
              }}
            >
              Сканер
            </button>
            <button
              className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
              style={{
                color: activeTab === 'stats' ? themeColors.buttonColor : themeColors.hintColor
              }}
            >
              Статистика
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'scan' && <QRScanner onScan={handleScan} />}
            {activeTab === 'stats' && <ShiftStats businessId={bid} />}
          </div>
        </>
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