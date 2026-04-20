import apiClient from './apiClient';

export const walletService = {
  getWallets: async () => {
    return await apiClient.get('/wallets');
  },
  createWallet: async (data) => {
    return await apiClient.post('/wallets', data);
  },
  updateWallet: async (id, data) => {
    return await apiClient.patch(`/wallets/${id}`, data);
  }
  ,
  deleteWallet: async (id) => {
    return await apiClient.delete(`/wallets/${id}`);
  }
};
