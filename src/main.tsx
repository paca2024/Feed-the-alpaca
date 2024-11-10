import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { validateTelegramWebAppData } from './utils/telegram';
import { initTelegramApp } from './utils/telegram-config';

// Initialize Telegram WebApp if available
const isTelegramWebApp = window.Telegram?.WebApp;

if (isTelegramWebApp) {
  // Initialize Telegram WebApp configuration
  initTelegramApp();
  
  // Validate the WebApp data if we have a bot token
  const initDataString = window.Telegram.WebApp.initData;
  const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  
  if (BOT_TOKEN && initDataString && !validateTelegramWebAppData(initDataString, BOT_TOKEN)) {
    document.body.innerHTML = '<div style="padding: 20px; text-align: center; color: #fff;">Invalid Telegram WebApp data</div>';
    throw new Error('Invalid Telegram WebApp data');
  }

  // Let Telegram know the Web App is ready
  window.Telegram.WebApp.ready();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App isTelegramWebApp={Boolean(isTelegramWebApp)} />
  </StrictMode>
);