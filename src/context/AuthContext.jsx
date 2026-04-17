import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { AUTH_TOKEN_KEY } from '../constants/constants';

// Không cần strict export với file Context
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Khởi tạo trạng thái loading dựa trên việc có token trong localStorage không
  const [loading, setLoading] = useState(() => !!localStorage.getItem(AUTH_TOKEN_KEY));

  // Hàm private để gọi backend lấy Profile mới nhất nếu có auth token
  const fetchProfile = useCallback(async () => {
    try {
      const response = await authService.getProfile();
      // Theo chuẩn Response backend: { success, message, data }
      if (response && response.success) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.warn("Failed to load profile via token, logged out:", error);
      // 401 Interceptor bên apiClient có rẽ nhánh tự điều hướng và xóa token rồi
      authService.removeToken();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check LocalStorage khi App bắt đầu khởi chạy lần đầu tiên
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchProfile();
    }
  }, [fetchProfile]);

  /**
   * Action được gọi khi User vừa Submit Form Login thành công và nhận JWT từ Backend
   * @param {string} token - JWT trả từ backend API
   * @param {Object} userData - User info (thường đính kèm luôn ở response API đăng nhập)
   */
  const loginCtx = useCallback((token, userData) => {
    authService.setToken(token);
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  /**
   * Action Đăng xuất gốc
   */
  const logoutCtx = useCallback(async () => {
    try {
      // Phải thử gọi api báo backend clear token nếu backend có tính năng lưu session
      if (isAuthenticated) {
        await authService.logout().catch((err) => console.log('Silent logout err:', err));
      }
    } finally {
      authService.removeToken();
      setUser(null);
      setIsAuthenticated(false);
      // Logic hard reset window (nếu chưa setup react-router-dom) hoặc redirect
      window.location.href = '/login';
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        fetchProfile, // Expose để component con gọi thủ công reload nếu cần
        loginCtx,
        logoutCtx,
      }}
    >
      {/* 
        Tùy chọn: Chặn màn hình bằng Loading Spinner 
        ở đây nếu không muốn UI giật flash (flicker) lúc mới bật app
      */}
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Đang tải cấu hình ứng dụng...</div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
