# BudgetIOS

Современное веб-приложение для управления бюджетом с синхронизацией в реальном времени и поддержкой PWA.

## 🚀 Особенности

- **React + Vite** - Быстрая разработка и сборка
- **Firebase Auth** - Безопасная аутентификация
- **Firestore** - База данных в реальном времени
- **TailwindCSS** - Современный дизайн
- **PWA** - Установка на рабочий стол
- **GitHub Pages** - Готов к деплою

## ⚡ Быстрый старт

```bash
# Клонирование репозитория
git clone https://github.com/USERNAME/BudgetIOS.git
cd BudgetIOS

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev
```

## 🔧 Команды

```bash
# Разработка
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр сборки
npm run preview

# Деплой на GitHub Pages
npm run deploy
```

## 🌐 Деплой на GitHub Pages

1. Замените `USERNAME` в `package.json` на ваш GitHub логин
2. Создайте репозиторий `BudgetIOS` на GitHub
3. Запушьте код в репозиторий
4. Выполните деплой:

```bash
npm run deploy
```

Приложение будет доступно по адресу: `https://USERNAME.github.io/BudgetIOS/`

## 📱 PWA установка

После деплоя приложение можно установить на телефон:

1. Откройте сайт в браузере
2. Нажмите "Добавить на главный экран" или "Установить"
3. Приложение появится как нативное

## 🔐 Firebase настройка

Приложение уже настроено с Firebase проектом. Если нужно использовать свой проект:

1. Создайте проект в [Firebase Console](https://console.firebase.google.com)
2. Включите Authentication (Email/Password)
3. Включите Firestore Database
4. Замените конфигурацию в `src/firebase.js`

## 💰 Функционал

- ✅ Регистрация и вход пользователей
- ✅ Добавление доходов и расходов
- ✅ Категории транзакций
- ✅ Синхронизация в реальном времени
- ✅ Удаление операций
- ✅ Статистика баланса
- ✅ Адаптивный дизайн

## 🛠 Технологии

- React 19
- Vite 7
- Firebase 10
- TailwindCSS 3
- Lucide React
- PWA

## 📋 Требования

- Node.js 18+
- npm или yarn

---

✨ **BudgetIOS** - Управляйте финансами с удовольствием!

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
