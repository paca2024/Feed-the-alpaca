import { TelegramWebApp } from '../types/telegram';

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export const initTelegramApp = () => {
  const webApp = window.Telegram?.WebApp;
  
  if (!webApp) {
    console.warn('Telegram WebApp is not available');
    return false;
  }

  try {
    // Configure main button
    webApp.MainButton.text = "Play Again";
    webApp.MainButton.color = "#9333EA";
    webApp.MainButton.textColor = "#FFFFFF";
    
    // Set theme params
    webApp.setHeaderColor("#111827");
    webApp.setBackgroundColor("#111827");

    // Expand the WebApp to full screen
    webApp.expand();
    
    return true;
  } catch (error) {
    console.error('Error initializing Telegram WebApp:', error);
    return false;
  }
};

export const showMainButton = (callback: () => void) => {
  const webApp = window.Telegram?.WebApp;
  if (!webApp) return;
  
  try {
    webApp.MainButton.onClick(callback);
    webApp.MainButton.show();
  } catch (error) {
    console.error('Error showing main button:', error);
  }
};

export const hideMainButton = () => {
  try {
    window.Telegram?.WebApp?.MainButton.hide();
  } catch (error) {
    console.error('Error hiding main button:', error);
  }
};