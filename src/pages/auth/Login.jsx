import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { validateLoginForm } from '../../utils/validation';
import { useAppMessage } from '../../hooks/useAppMessage';

const Login = () => {
  const { loginCtx } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { notifySuccess, notifyError, contextHolder } = useAppMessage();

  // Bắt tin nhắn thành công được ném từ trang đăng ký qua navigate state
  useEffect(() => {
    if (location.state?.successMessage) {
      notifySuccess(location.state.successMessage);
      // Thay thế location state hiện tại thành null để ko hiện lại message khi reload lại trang
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate, notifySuccess]);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Nếu field đang có lỗi, xoá lỗi đó ngay khi người dùng bắt đầu gõ tiếp
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    }
    setErrorMsg('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setFieldErrors({});

    // Client-side Validation (kiểm tra input trước khi gọi backend)
    const { isValid, errors } = validateLoginForm(formData);
    
    if (!isValid) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const response = await authService.login(formData);
      // Theo API_DOCUMENT.md -> { success: true, message: "...", data: { token, user: { ... } } }
      if (response && response.success && response.data) {
        const { token, user } = response.data;
        // Gọi hàm loginCtx để nạp JWT vào LocalStorage + update Global State
        loginCtx(token, user);
        // Hướng người dùng vào giao diện chính
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      // apiClient trả thẳng error payload về: { success: false, message: "...", errors: [...] }
      if (error && error.errors && Array.isArray(error.errors)) {
        // Ánh xạ mảng lỗi form (từ validation backend) sang object tương ứng với tên Input field
        const errorsMap = {};
        error.errors.forEach(err => {
          errorsMap[err.field] = err.message;
        });
        setFieldErrors(errorsMap);
        setErrorMsg(error.message || 'Dữ liệu nhập vào chưa hợp lệ, vui lòng kiểm tra lại.');
      } else if (error && error.message) {
        // Trường hợp lỗi chung (như sai tài khoản mật khẩu, bị khoá)
        setErrorMsg(error.message);
      } else {
        // Fallback network error
        setErrorMsg('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {contextHolder}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-wide uppercase mb-2">WELCOME BACK</h2>
        <p className="text-gray-500 font-medium">Welcome back! Please enter your details.</p>
      </div>
      
      {/* KHỐI HIỂN THỊ CẢNH BÁO CHUNG THẤT BẠI */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded-[12px]">
          {errorMsg}
        </div>
      )}

      {/* FORM LẤY DỮ LIỆU */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1.5">Email</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg outline-none focus:border-green-500 transition-colors placeholder-gray-400 bg-white`} 
            placeholder="Enter your email" 
            required
            disabled={loading}
          />
          {fieldErrors.email && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{fieldErrors.email}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1.5">Password</label>
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg outline-none focus:border-green-500 transition-colors placeholder-gray-400 bg-white`} 
            placeholder="********" 
            required
            minLength={6}
            disabled={loading}
          />
          {fieldErrors.password && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{fieldErrors.password}</p>}
        </div>
        
        <div className="flex items-center justify-end mt-2 pt-1 pb-3">
          <a href="#" className="text-sm font-bold text-gray-900 hover:text-green-600">Forgot password</a>
        </div>

        <div className="pt-2">
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#4ab466] text-white font-bold py-3.5 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors shadow-sm"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
        
        <div className="pt-2">
          <button 
            type="button"
            className="w-full bg-white border border-gray-300 text-gray-800 font-bold py-3.5 px-4 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-3 transition-colors shadow-sm"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </form>

      {/* ĐIỀU HƯỚNG TRANG */}
      <div className="mt-8 text-center text-sm font-semibold text-gray-500">
        Don't have an account? <Link to="/register" className="text-[#de6062] hover:text-red-500">Sign up for free!</Link>
      </div>
    </div>
  );
};

export default Login;
