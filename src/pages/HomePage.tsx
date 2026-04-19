import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';
import { useApp } from '../hooks/AppContext';

export function HomePage() {
  const navigate = useNavigate();
  const { themeColors, user } = useTelegram();
  const { setRole } = useApp();

  const handleRoleSelect = (role: 'client' | 'staff' | 'owner') => {
    setRole(role);
    navigate(`/${role}`);
  };

  return (
    <div className="home-page">
      <div className="user-info">
        {user && (
          <>
            <h2 style={{ color: themeColors.textColor }}>
              Привет, {user.firstName}!
            </h2>
            <p style={{ color: themeColors.hintColor }}>
              Выберите режим работы
            </p>
          </>
        )}
      </div>

      <div className="role-selection">
        <button
          className="role-button"
          onClick={() => handleRoleSelect('client')}
          style={{
            backgroundColor: themeColors.secondaryBgColor,
            color: themeColors.textColor
          }}
        >
          <span className="role-icon">🎁</span>
          <span className="role-label">Клиент</span>
          <span className="role-desc">
            Получайте штампы и награды
          </span>
        </button>

        <button
          className="role-button"
          onClick={() => handleRoleSelect('staff')}
          style={{
            backgroundColor: themeColors.secondaryBgColor,
            color: themeColors.textColor
          }}
        >
          <span className="role-icon">📱</span>
          <span className="role-label">Сотрудник</span>
          <span className="role-desc">
            Сканируйте QR и ставьте штампы
          </span>
        </button>

        <button
          className="role-button"
          onClick={() => handleRoleSelect('owner')}
          style={{
            backgroundColor: themeColors.secondaryBgColor,
            color: themeColors.textColor
          }}
        >
          <span className="role-icon">🏢</span>
          <span className="role-label">Владелец</span>
          <span className="role-desc">
            Управляйте бизнесом
          </span>
        </button>
      </div>
    </div>
  );
}