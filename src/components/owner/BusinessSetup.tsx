import React, { useState } from 'react';
import { useApp } from '../../hooks/AppContext';
import { useTelegram } from '../../hooks/useTelegram';
import { Business } from '../../types';

interface BusinessSetupProps {
  business?: Business;
}

export function BusinessSetup({ business }: BusinessSetupProps) {
  const { themeColors, hapticImpact } = useTelegram();
  const { addBusiness, updateBusiness, user } = useApp();
  
  const [name, setName] = useState(business?.name || '');
  const [description, setDescription] = useState(business?.description || '');
  const [stampCount, setStampCount] = useState(business?.stampCount || 10);
  const [reward, setReward] = useState(business?.reward || 'Скидка 10%');
  const [rewardDescription, setRewardDescription] = useState(business?.rewardDescription || 'Скидка 10% на следующий заказ');
  const [cooldownHours, setCooldownHours] = useState(business?.cooldownHours || 24);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!user) {
      setError('Пользователь не определен');
      return;
    }

    if (!name.trim()) {
      setError('Введите название');
      return;
    }

    if (stampCount < 3 || stampCount > 20) {
      setError('Количество штампов должно быть от 3 до 20');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (business) {
        updateBusiness(business.id, {
          name,
          description,
          stampCount,
          reward,
          rewardDescription,
          cooldownHours
        });
      } else {
        const newBusiness: Business = {
          id: Date.now(),
          ownerId: user.id,
          name,
          description,
          stampCount,
          reward,
          rewardDescription,
          cooldownHours,
          createdAt: Date.now()
        };
        addBusiness(newBusiness);
      }

      hapticImpact('medium');
    } catch (e) {
      setError('Ошибка сохранения');
    }

    setSaving(false);
  };

  return (
    <div className="business-setup">
      <h3 style={{ color: themeColors.textColor }}>
        {business ? 'Настройка бизнеса' : 'Создание бизнеса'}
      </h3>

      <div className="form-group">
        <label style={{ color: themeColors.hintColor }}>Название</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название компании"
          style={{
            backgroundColor: themeColors.secondaryBgColor,
            color: themeColors.textColor,
            borderColor: themeColors.secondaryBgColor
          }}
        />
      </div>

      <div className="form-group">
        <label style={{ color: themeColors.hintColor }}>Описание</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Описание программы лояльности"
          style={{
            backgroundColor: themeColors.secondaryBgColor,
            color: themeColors.textColor,
            borderColor: themeColors.secondaryBgColor
          }}
        />
      </div>

      <div className="form-group">
        <label style={{ color: themeColors.hintColor }}>
          Штампов для награды: {stampCount}
        </label>
        <input
          type="range"
          min="3"
          max="20"
          value={stampCount}
          onChange={(e) => setStampCount(parseInt(e.target.value))}
          style={{ accentColor: themeColors.buttonColor }}
        />
      </div>

      <div className="form-group">
        <label style={{ color: themeColors.hintColor }}>Награда</label>
        <input
          type="text"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
          placeholder="Например: Скидка 10%"
          style={{
            backgroundColor: themeColors.secondaryBgColor,
            color: themeColors.textColor,
            borderColor: themeColors.secondaryBgColor
          }}
        />
      </div>

      <div className="form-group">
        <label style={{ color: themeColors.hintColor }}>Описание награды</label>
        <textarea
          value={rewardDescription}
          onChange={(e) => setRewardDescription(e.target.value)}
          placeholder="Описание награды"
          style={{
            backgroundColor: themeColors.secondaryBgColor,
            color: themeColors.textColor,
            borderColor: themeColors.secondaryBgColor
          }}
        />
      </div>

      <div className="form-group">
        <label style={{ color: themeColors.hintColor }}>
          Кулдаун (часы): {cooldownHours}
        </label>
        <input
          type="range"
          min="1"
          max="72"
          value={cooldownHours}
          onChange={(e) => setCooldownHours(parseInt(e.target.value))}
          style={{ accentColor: themeColors.buttonColor }}
        />
      </div>

      {error && (
        <div className="error" style={{ color: themeColors.linkColor }}>
          {error}
        </div>
      )}

      <button
        className="save-button"
        onClick={handleSave}
        disabled={saving}
        style={{
          backgroundColor: themeColors.buttonColor,
          color: themeColors.buttonTextColor
        }}
      >
        {saving ? 'Сохранение...' : 'Сохранить'}
      </button>
    </div>
  );
}