export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
export const AUTH_TOKEN_KEY = 'app_auth_token';

// Google Identity Services (Web Client ID)
// Set in Vite env as: VITE_GOOGLE_CLIENT_ID=
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export const TRANSACTION_TYPES = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
};

export const CURRENCY_DEFAULT = 'VND';

export const ICON_LIST = {
  [TRANSACTION_TYPES.INCOME]: [
    'ic_salary', 'ic_investment', 'ic_bonus', 'ic_gift', 'ic_others'
  ],
  [TRANSACTION_TYPES.EXPENSE]: [
    'ic_bills', 'ic_education', 'ic_food', 'ic_health', 'ic_transport', 'ic_shopping', 'ic_entertainment', 'ic_other'
  ]
}