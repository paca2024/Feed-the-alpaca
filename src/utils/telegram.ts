import crypto from 'crypto';

interface TelegramWebAppUser {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramWebAppInitData {
  query_id?: string;
  user?: TelegramWebAppUser;
  auth_date?: number;
  hash?: string;
}

export function validateTelegramWebAppData(initData: string, botToken: string): TelegramWebAppInitData | null {
  try {
    // Parse the initial data
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    // Sort parameters alphabetically
    const paramsList: string[] = [];
    urlParams.sort();
    urlParams.forEach((value, key) => {
      paramsList.push(`${key}=${value}`);
    });
    const dataCheckString = paramsList.join('\n');

    // Create secret key from bot token
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Calculate hash
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // Validate hash
    if (hash !== calculatedHash) {
      return null;
    }

    // Parse and return the validated data
    const data: TelegramWebAppInitData = {};
    urlParams.forEach((value, key) => {
      try {
        if (key === 'user') {
          data.user = JSON.parse(value);
        } else {
          (data as any)[key] = value;
        }
      } catch (e) {
        (data as any)[key] = value;
      }
    });

    return data;
  } catch (e) {
    return null;
  }
}