import apiClient from './apiClient';

export const dashboardService = {
  /**
   * Lấy danh sách ví (đính kèm current_balance do backend tự tính)
   */
  getWallets: () => apiClient.get('/wallets'),

  /**
   * Lấy lịch sử giao dịch (có thể truyền params để filter tháng/năm)
   */
  getTransactions: () => apiClient.get('/transactions'),

  /**
   * Lấy cấu hình các budgets (ngân sách)
   */
  getBudgets: () => apiClient.get('/budgets'),

  /**
   * Lấy thống kê đặc thù từ cụm API Wallets (Tuỳ chọn)
   */
  getWalletStatistics: (walletId) => apiClient.get(`/wallets/${walletId}/transactions/statistics`),
};
