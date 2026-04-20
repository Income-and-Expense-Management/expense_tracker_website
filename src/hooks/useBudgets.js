import { useState, useCallback, useEffect } from 'react';
import { budgetService } from '../services/budgetService';
import { useAppMessage } from './useAppMessage';

export const useBudgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError } = useAppMessage();

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await budgetService.getBudgets();
      if (res?.success) {
        setBudgets(res.data || []);
      } else {
        notifyError(res?.message || 'Lỗi khi tải danh sách ngân sách');
      }
    } catch (error) {
      notifyError('Lỗi khi tải danh sách ngân sách');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [notifyError]);

  const addBudget = async (data) => {
    try {
      setLoading(true);
      const res = await budgetService.createBudget(data);
      if (res?.success) {
        notifySuccess(res.message || 'Thêm ngân sách thành công');
        await fetchBudgets();
        return true;
      }

      // Show server-provided message when available
      notifyError(res?.message || 'Thêm thất bại');
      return false;
    } catch (error) {
      notifyError(error?.message || 'Thêm thất bại');
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateBudget = async (id, data) => {
    try {
      setLoading(true);
      const res = await budgetService.updateBudget(id, data);
      if (res?.success) {
        notifySuccess(res.message || 'Cập nhật ngân sách thành công');
        await fetchBudgets();
        return true;
      }
      notifyError(res?.message || 'Cập nhật thất bại');
      return false;
    } catch (error) {
      notifyError(error?.message || 'Cập nhật thất bại');
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteBudget = async (id) => {
    try {
      setLoading(true);
      const res = await budgetService.deleteBudget(id);
      if (res?.success) {
        notifySuccess(res.message || 'Xoá ngân sách thành công');
        await fetchBudgets();
        return true;
      }
      notifyError(res?.message || 'Xoá thất bại');
      return false;
    } catch (error) {
      notifyError(error?.message || 'Xoá thất bại');
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  return { budgets, loading, fetchBudgets, addBudget, updateBudget, deleteBudget };
};
