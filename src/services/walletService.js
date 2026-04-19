import apiClient from './apiClient';

export const walletService = {
  getWallets: async () => {
    return await apiClient.get('/wallets');
  },
  createWallet: async (data) => {
    return await apiClient.post('/wallets', data);
  }
};
