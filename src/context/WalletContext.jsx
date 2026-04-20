import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { walletService } from '../services/walletService';
import { useAppMessage } from '../hooks/useAppMessage';
import { useAuth } from '../hooks/useAuth';

export const WalletContext = createContext(undefined);

export const WalletProvider = ({ children }) => {
  const [wallets, setWallets] = useState([]);
  const [selectedWalletId, setSelectedWalletId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError, contextHolder } = useAppMessage();
  const { isAuthenticated } = useAuth();

  const fetchWallets = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const response = await walletService.getWallets();
      if (response && response.success) {
        setWallets(response.data);
        setSelectedWalletId(prev => {
          if (response.data.length === 0) return null;
          if (!prev) return response.data[0].id;
          return prev;
        });
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
  }, [isAuthenticated, notifyError]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWallets();
  }, [fetchWallets]);

  const addWallet = async (walletData) => {
    try {
      const response = await walletService.createWallet(walletData);
      if (response && response.success) {
        notifySuccess('Thêm ví thành công!');
        fetchWallets();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      if (error?.errors && Array.isArray(error.errors)) {
        return { success: false, errors: error.errors };
      }
      notifyError(error?.message || 'Có lỗi xảy ra khi tạo ví, vui lòng thử lại!');
      return { success: false };
    }
  };

  const updateWallet = async (id, walletData) => {
    try {
      const response = await walletService.updateWallet(id, walletData);
      if (response && response.success) {
        notifySuccess('Cập nhật ví thành công!');
        fetchWallets();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      if (error?.errors && Array.isArray(error.errors)) {
        return { success: false, errors: error.errors };
      }
      notifyError(error?.message || 'Có lỗi xảy ra khi cập nhật ví, vui lòng thử lại!');
      return { success: false };
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallets,
        loading,
        selectedWalletId,
        setSelectedWalletId,
        fetchWallets,
        addWallet,
        updateWallet
      }}
    >
      {contextHolder}
      {children}
    </WalletContext.Provider>
  );
};
