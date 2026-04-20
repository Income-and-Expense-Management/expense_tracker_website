import apiClient from './apiClient';

const API_PATH = '/categories';

export const categoryService = {
  // Lấy danh sách danh mục (hỗ trợ filter theo type)
  getCategories: async (type = '', include_inactive = true) => {
    const params = type ? { type, include_inactive: include_inactive } : { include_inactive: include_inactive };
    return await apiClient.get(API_PATH, { params });
  },

  // Lấy chi tiết 1 danh mục
  getCategoryById: async (id) => {
    return await apiClient.get(`${API_PATH}/${id}`);
  },

  // Tạo danh mục mới
  createCategory: async (categoryData) => {
    return await apiClient.post(API_PATH, categoryData);
  },

  // Cập nhật thông tin danh mục
  updateCategory: async (id, categoryData) => {
    return await apiClient.patch(`${API_PATH}/${id}`, categoryData);
  },

  // Xóa danh mục
  deleteCategory: async (id) => {
    return await apiClient.delete(`${API_PATH}/${id}`);
  }
};
