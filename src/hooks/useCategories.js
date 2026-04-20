import { useState, useCallback, useRef } from 'react';
import { categoryService } from '../services/categoryService';
import { useAppMessage } from './useAppMessage';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError } = useAppMessage();
  const currentType = useRef('EXPENSE'); // State ẩn để nhớ type đang filter

  const fetchCategories = useCallback(async (type = 'EXPENSE') => {
    currentType.current = type;
    setLoading(true);
    try {
      const response = await categoryService.getCategories(type);
      if (response && response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      if (error && error.message) {
        notifyError(error.message);
      } else {
        notifyError('Không thể tải danh sách danh mục');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = async (categoryData) => {
    try {
      const response = await categoryService.createCategory(categoryData);
      if (response && response.success) {
        notifySuccess('Thêm danh mục thành công!');
        fetchCategories(currentType.current); // Làm mới danh sách và giữ đúng type
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      if (error?.errors && Array.isArray(error.errors)) {
        return { success: false, errors: error.errors };
      }
      notifyError(error?.message || 'Có lỗi xảy ra khi tạo, vui lòng thử lại!');
      return { success: false };
    }
  };

  const editCategory = async (id, categoryData) => {
    try {
      const response = await categoryService.updateCategory(id, categoryData);
      if (response && response.success) {
        notifySuccess('Cập nhật danh mục thành công!');
        fetchCategories(currentType.current); // Làm mới danh sách và giữ filter
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      if (error?.errors && Array.isArray(error.errors)) {
        return { success: false, errors: error.errors };
      }
      notifyError(error?.message || 'Có lỗi xảy ra khi cập nhật!');
      return { success: false };
    }
  };

  const removeCategory = async (id) => {
    try {
      const response = await categoryService.deleteCategory(id);
      if (response && response.success) {
        notifySuccess('Xóa danh mục thành công!');
        fetchCategories(currentType.current); // Làm mới danh sách và giữ filter
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      notifyError(error?.message || 'Không thể xóa danh mục này!');
      return { success: false };
    }
  };

  return { categories, loading, fetchCategories, addCategory, editCategory, removeCategory };
};
