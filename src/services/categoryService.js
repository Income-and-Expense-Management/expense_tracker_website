import apiClient from './apiClient';

export const categoryService = {
  getCategories: () => apiClient.get('/categories')
};