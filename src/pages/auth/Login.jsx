import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const { loginCtx } = useAuth();
  const navigate = useNavigate();

  const handleFakeLogin = () => {
    // Tạm giả lập logic đăng nhập thành công
    loginCtx('fake-jwt-token', { full_name: 'Bảo Trần', email: 'bao@test.com' });
    navigate('/');
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Đăng nhập tài khoản</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" className="w-full p-2 border rounded" placeholder="name@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <input type="password" className="w-full p-2 border rounded" placeholder="••••••••" />
        </div>
        <button 
          onClick={handleFakeLogin}
          className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 mt-2"
        >
          Tiến vào Dashboard
        </button>
      </div>
      <div className="mt-4 text-center text-sm">
        Chưa có tài khoản? <Link to="/register" className="text-blue-600 hover:underline">Đăng ký ngay</Link>
      </div>
    </>
  );
};

export default Login;
