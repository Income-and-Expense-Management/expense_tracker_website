import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { validateLoginForm } from '../../utils/validation';
import { useAppMessage } from '../../hooks/useAppMessage';
import { GOOGLE_CLIENT_ID } from '../../constants/constants';

const decodeJwtPayload = (jwt) => {
  if (!jwt) return null;
  const parts = jwt.split('.');
  if (parts.length !== 3) return null;
  const base64Url = parts[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
  try {
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

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

  const handleGoogleLogin = async (credentialResponse) => {
    const idToken = credentialResponse?.credential;
    if (!idToken) {
      setErrorMsg('Không lấy được Google credential. Vui lòng thử lại.');
      return;
    }

    const payload = decodeJwtPayload(idToken);
    const email = payload?.email;
    const fullName = payload?.name;

    if (!email) {
      setErrorMsg('Google token thiếu email. Vui lòng thử lại.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setFieldErrors({});

    try {
      const response = await authService.loginGoogle({
        id_token: idToken,
        email,
        full_name: fullName,
      });
      if (response && response.success && response.data) {
        const { token, user } = response.data;
        loginCtx(token, user);
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      if (error && error.message) {
        setErrorMsg(error.message);
        notifyError(error.message);
      } else {
        setErrorMsg('Đăng nhập Google thất bại. Vui lòng thử lại sau.');
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
          {!GOOGLE_CLIENT_ID ? (
            <button
              type="button"
              disabled
              className="w-full bg-white border border-gray-300 text-gray-400 font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-3 shadow-sm cursor-not-allowed"
              title="Thiếu cấu hình VITE_GOOGLE_CLIENT_ID"
            >
              Sign in with Google
            </button>
          ) : (
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  setErrorMsg('Đăng nhập Google thất bại. Vui lòng thử lại.');
                  notifyError('Đăng nhập Google thất bại.');
                }}
                useOneTap={false}
                theme="outline"
                size="large"
                shape="rectangular"
                text="signin_with"
                width="400"
              />
            </div>
          )}
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
