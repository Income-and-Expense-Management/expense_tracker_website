import apiClient from './apiClient';

export const budgetService = {
  getBudgets: async () => {
    const response = await apiClient.get('/budgets/');
    return response;
  },
  
  getBudgetById: async (id) => {
    const response = await apiClient.get(`/budgets/${id}`);
    return response;
  },
  
  createBudget: async (data) => {
    const response = await apiClient.post('/budgets/', data);
    return response;
  },
  
  updateBudget: async (id, data) => {
    const response = await apiClient.patch(`/budgets/${id}`, data);
    return response;
  },
  
  deleteBudget: async (id) => {
    const response = await apiClient.delete(`/budgets/${id}`);
    return response;
  }
};
