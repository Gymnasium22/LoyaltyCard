# Loyalty Stamp Card - Telegram Mini App

Цифровая система лояльности для Telegram.

## Функционал

- **Клиент**: просмотр карточек, QR-код, история, получение наград
- **Сотрудник**: сканер QR, постановка штампов, статистика
- **Владелец**: создание бизнеса, управление сотрудниками, аналитика

## Технологии

- React + TypeScript + Vite
- Telegram WebApp SDK
- Telegram CloudStorage
- React Router
- qrcode.react + html5-qrcode
- canvas-confetti

## Деплой на GitHub Pages

1. Создайте репозиторий на GitHub
2. Включите GitHub Pages в настройках (Settings → Pages → Source: GitHub Actions)
3. Настройте vite.config.ts:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/repo-name/',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
```

4. Запушьте код и дождитесь завершения GitHub Action

## Настройка BotFather

1. Откройте @BotFather в Telegram
2. /newbot - создайте бота
3. /mybots → выберите бота → Bot Settings → Menu Button → Configure Menu Button
4. Выберите URL и введите адрес: `https://username.github.io/repo-name/`
5. Добавьте описание бота

## Тестирование локально

### VS Code

1. `npm install`
2. `npm run dev`

Откройте http://localhost:5173

Для полной функциональности используйте ngrok:
```bash
ngrok http 5173
```

Скопируйте URL ngrok и используйте его как webhook URL для бота.

## Структура проекта

```
src/
├── components/
│   ├── client/     # Компоненты клиента
│   ├── staff/     # Компоненты сотрудника
│   └── owner/     # Компоненты владельца
├── hooks/         # Хуки
├── pages/         # Страницы
├── types/        # TypeScript типы
└── utils/       # Утилиты
```

## Защита от накрутки

- QR-коды подписываются криптографически
- Ограничение cooldown между штампами
- Проверка подписи QR при сканировании

## Лицензия

MIT