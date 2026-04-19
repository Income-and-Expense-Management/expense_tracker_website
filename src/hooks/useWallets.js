import { useState, useEffect, useCallback } from 'react';
import { walletService } from '../services/walletService';
import { useAppMessage } from './useAppMessage';

export const useWallets = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError } = useAppMessage();

  const fetchWallets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await walletService.getWallets();
      if (response && response.success) {
        setWallets(response.data);
      }
    } catch (error) {
      if (error && error.message) {
        notifyError(error.message);
      } else {
        notifyError('Không thể tải danh sách ví');
      }
    } finally {
      setLoading(false);
    }
  }, []); // Cố định fetchWallets, bỏ qua dependency notifyError để tránh infinite loop

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const addWallet = async (walletData) => {
    try {
      const response = await walletService.createWallet(walletData);
      if (response && response.success) {
        notifySuccess('Thêm ví thành công!');
        fetchWallets(); // Làm mới danh sách ví sau khi tạo
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      // Bắt lỗi khi tạo ví
      if (error?.errors && Array.isArray(error.errors)) {
        return { success: false, errors: error.errors };
      }
      notifyError(error?.message || 'Có lỗi xảy ra khi tạo ví, vui lòng thử lại!');
      return { success: false };
    }
  };

  return { wallets, loading, fetchWallets, addWallet };
};
