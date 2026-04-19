import apiClient from './apiClient';

export const transactionService = {
  /**
   * Truy xuất danh sách giao dịch (Có thể có query filter)
   */
  getTransactions: async (walletId = null, params = {}) => {
    // Nếu có truyền walletId, tải giao dịch của riêng ví đó. Ngược lại tải tất cả.
    const url = walletId ? `/wallets/${walletId}/transactions` : `/transactions`;
    return apiClient.get(url, { params });
  },

  /**
   * Tạo giao dịch mới
   */
  createTransaction: async (data) => {
    return apiClient.post('/transactions', data);
  },

  /**
   * Xem chi tiết 1 giao dịch
   */
  getTransaction: async (transactionId) => {
    return apiClient.get(`/transactions/${transactionId}`);
  },

  /**
   * Sửa giao dịch
   */
  updateTransaction: async (transactionId, data) => {
    return apiClient.patch(`/transactions/${transactionId}`, data);
  },

  /**
   * Xóa giao dịch
   */
  deleteTransaction: async (transactionId) => {
    return apiClient.delete(`/transactions/${transactionId}`);
  }
};
