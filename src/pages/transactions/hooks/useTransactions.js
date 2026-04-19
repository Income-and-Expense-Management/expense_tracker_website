import { useState, useCallback } from 'react';
import { transactionService } from '../../../services/transactionService';
import { useAppMessage } from '../../../hooks/useAppMessage';
import dayjs from 'dayjs';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError } = useAppMessage();

  const fetchTransactions = useCallback(async (walletId = null, month = dayjs()) => {
    if (!walletId) {
      setTransactions([]);
      return;
    }
    setLoading(true);
    try {
      const startDate = month.startOf('month').toISOString();
      const endDate = month.endOf('month').toISOString();

      const response = await transactionService.getTransactions(walletId, {
        start_date: startDate,
        end_date: endDate
      });

      if (response && response.success) {
         setTransactions(response.data);
      }
    } catch (error) {
       notifyError(error?.message || 'Không thể tải danh sách giao dịch');
    } finally {
       setLoading(false);
    }
  }, [notifyError]);

  const addTransaction = async (data) => {
    try {
      const response = await transactionService.createTransaction(data);
      if (response && response.success) {
        notifySuccess('Tạo giao dịch thành công');
        return { success: true, data: response.data };
      }
      return { success: false };
    } catch (error) {
      notifyError(error?.message || 'Lỗi tạo giao dịch');
      return { success: false, errors: error?.errors };
    }
  };

  const editTransaction = async (id, data) => {
    try {
      const response = await transactionService.updateTransaction(id, data);
      if (response && response.success) {
        notifySuccess('Giao dịch đã được cập nhật');
        return { success: true, data: response.data };
      }
      return { success: false };
    } catch (error) {
      notifyError(error?.message || 'Lỗi cập nhật giao dịch');
      return { success: false, errors: error?.errors };
    }
  };

  const removeTransaction = async (id) => {
    try {
      await transactionService.deleteTransaction(id);
      notifySuccess('Xoá giao dịch thành công');
      return { success: true };
    } catch (error) {
      notifyError(error?.message || 'Lỗi xoá giao dịch');
      return { success: false };
    }
  };

  return {
    transactions,
    loading,
    fetchTransactions,
    addTransaction,
    editTransaction,
    removeTransaction
  };
};
