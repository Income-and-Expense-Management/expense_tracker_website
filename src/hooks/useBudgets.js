import { useState, useCallback, useEffect } from 'react';
import { budgetService } from '../services/budgetService';
import { useAppMessage } from './useAppMessage';

export const useBudgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showMessage } = useAppMessage();

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await budgetService.getBudgets();
      if (res?.success) {
        setBudgets(res.data || []);
      }
    } catch (error) {
      showMessage('error', 'Lỗi khi tải danh sách ngân sách');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  const addBudget = async (data) => {
    try {
      setLoading(true);
      const res = await budgetService.createBudget(data);
      if (res?.success) {
        showMessage('success', 'Thêm ngân sách thành công');
        await fetchBudgets();
        return true;
      }
    } catch (error) {
      showMessage('error', 'Thêm thất bại');
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
        showMessage('success', 'Cập nhật ngân sách thành công');
        await fetchBudgets();
        return true;
      }
    } catch (error) {
      showMessage('error', 'Cập nhật thất bại');
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
        showMessage('success', 'Xoá ngân sách thành công');
        await fetchBudgets();
        return true;
      }
    } catch (error) {
      showMessage('error', 'Xoá thất bại');
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
