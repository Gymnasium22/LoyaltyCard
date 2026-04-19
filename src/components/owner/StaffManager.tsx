import React, { useState } from 'react';
import { useApp } from '../../hooks/AppContext';
import { useTelegram } from '../../hooks/useTelegram';
import { StaffMember } from '../../types';

interface StaffManagerProps {
  businessId: number;
}

export function StaffManager({ businessId }: StaffManagerProps) {
  const { themeColors } = useTelegram();
  const { staffMembers, addStaffMember, removeStaffMember, user } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');

  const businessStaff = staffMembers.filter(m => m.businessId === businessId);

  const handleAdd = () => {
    if (!user || !newFirstName.trim() || !newLastName.trim()) return;

    const newMember: StaffMember = {
      id: Date.now(),
      userId: Date.now(),
      businessId,
      firstName: newFirstName,
      lastName: newLastName,
      addedAt: Date.now()
    };

    addStaffMember(newMember);
    setNewFirstName('');
    setNewLastName('');
    setShowAdd(false);
  };

  const handleRemove = (id: number) => {
    removeStaffMember(id);
  };

  return (
    <div className="staff-manager">
      <h3 style={{ color: themeColors.textColor }}>Управление сотрудниками</h3>

      {businessStaff.length === 0 ? (
        <p style={{ color: themeColors.hintColor }}>Нет сотрудников</p>
      ) : (
        <div className="staff-list">
          {businessStaff.map(member => (
            <div 
              key={member.id} 
              className="staff-item"
              style={{
                borderColor: themeColors.secondaryBgColor
              }}
            >
              <div className="staff-info">
                <span style={{ color: themeColors.textColor }}>
                  {member.firstName} {member.lastName}
                </span>
              </div>
              <button
                className="remove-button"
                onClick={() => handleRemove(member.id)}
                style={{
                  backgroundColor: themeColors.linkColor,
                  color: '#fff'
                }}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      )}

      {showAdd ? (
        <div className="add-form">
          <input
            type="text"
            value={newFirstName}
            onChange={(e) => setNewFirstName(e.target.value)}
            placeholder="Имя"
            style={{
              backgroundColor: themeColors.secondaryBgColor,
              color: themeColors.textColor,
              borderColor: themeColors.secondaryBgColor
            }}
          />
          <input
            type="text"
            value={newLastName}
            onChange={(e) => setNewLastName(e.target.value)}
            placeholder="Фамилия"
            style={{
              backgroundColor: themeColors.secondaryBgColor,
              color: themeColors.textColor,
              borderColor: themeColors.secondaryBgColor
            }}
          />
          <div className="add-buttons">
            <button
              onClick={handleAdd}
              style={{
                backgroundColor: themeColors.buttonColor,
                color: themeColors.buttonTextColor
              }}
            >
              Добавить
            </button>
            <button
              onClick={() => setShowAdd(false)}
              style={{
                backgroundColor: themeColors.secondaryBgColor,
                color: themeColors.textColor
              }}
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <button
          className="add-button"
          onClick={() => setShowAdd(true)}
          style={{
            backgroundColor: themeColors.buttonColor,
            color: themeColors.buttonTextColor
          }}
        >
          Добавить сотрудника
        </button>
      )}
    </div>
  );
}