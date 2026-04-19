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
        if (response.data.length > 0 && !selectedWalletId) {
          setSelectedWalletId(response.data[0].id);
        } else if (response.data.length === 0) {
          setSelectedWalletId(null);
        }
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
  }, [isAuthenticated, selectedWalletId, notifyError]);

  useEffect(() => {
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

  return (
    <WalletContext.Provider
      value={{
        wallets,
        loading,
        selectedWalletId,
        setSelectedWalletId,
        fetchWallets,
        addWallet
      }}
    >
      {contextHolder}
      {children}
    </WalletContext.Provider>
  );
};
