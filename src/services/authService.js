import apiClient from './apiClient';
import { AUTH_TOKEN_KEY } from '../constants/constants';

export const authService = {
  /**
   * Đăng ký người dùng mới
   * @param {Object} data - { email, password, full_name }
   */
  register: (data) => apiClient.post('/auth/register', data),

  /**
   * Đăng nhập cơ bản qua email/password
   * @param {Object} data - { email, password }
   */
  login: (data) => apiClient.post('/auth/login', data),

  /**
   * Đăng nhập qua Google (xử lý token từ firebase/google client)
   * @param {Object} data - { idToken }
   */
  loginGoogle: (data) => apiClient.post('/auth/google', data),

  /**
   * Lấy thông tin profile người dùng hiện hành (Cần token)
   */
  getProfile: () => apiClient.get('/auth/profile'),

  /**
   * Cập nhật thông tin profile
   * @param {Object} data - Dữ liệu cần cập nhật
   */
  updateProfile: (data) => apiClient.patch('/auth/profile', data),

  /**
   * Thay đổi mật khẩu
   * @param {Object} data - { old_password, new_password, vv }
   */
  changePassword: (data) => apiClient.patch('/auth/change-password', data),

  /**
   * Đăng xuất, gọi backend để invalidate token (nếu cần thủ tục trên backend)
   */
  logout: () => apiClient.post('/auth/logout'),

  /**
   * Utility func để tự quản lý lưu token bên trong LocalStorage
   * @param {string} token 
   */
  setToken: (token) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  /**
   * Utility func để xóa token
   */
  removeToken: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};
