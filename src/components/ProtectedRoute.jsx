import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Đang load context (được fetch lấy thông tin profile trong AuthContext)
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-500 font-medium">Đang tải cấu hình an ninh...</div>
      </div>
    );
  }

  // Không đăng nhập -> đẩy về Login, thay thế lịch sử history
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Ok, Render Layout/Pages con
  return <Outlet />;
};

export default ProtectedRoute;
