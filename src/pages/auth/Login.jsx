import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';

const Login = () => {
  const { loginCtx } = useAuth();
  const navigate = useNavigate();

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
    <>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Đăng nhập tài khoản</h2>
      
      {/* KHỐI HIỂN THỊ CẢNH BÁO CHUNG THẤT BẠI */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded-[12px]">
          {errorMsg}
        </div>
      )}

      {/* FORM LẤY DỮ LIỆU */}
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Địa chỉ Email</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border ${fieldErrors.email ? 'border-red-500 bg-red-50' : 'border-[#E0E4E8] bg-[#F4F6F8]'} rounded-[12px] outline-none focus:border-green-500 transition-colors placeholder-gray-400`} 
            placeholder="name@example.com" 
            required
            disabled={loading}
          />
          {fieldErrors.email && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{fieldErrors.email}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</label>
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border ${fieldErrors.password ? 'border-red-500 bg-red-50' : 'border-[#E0E4E8] bg-[#F4F6F8]'} rounded-[12px] outline-none focus:border-green-500 transition-colors placeholder-gray-400`} 
            placeholder="••••••••" 
            required
            minLength={6}
            disabled={loading}
          />
          {fieldErrors.password && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{fieldErrors.password}</p>}
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white font-medium py-2.5 px-4 rounded-[12px] hover:bg-green-600 mt-2 disabled:opacity-50 transition-colors shadow-none"
        >
          {loading ? 'Đang xác thực...' : 'Đăng nhập vào hệ thống'}
        </button>
      </form>

      {/* ĐIỀU HƯỚNG TRANG */}
      <div className="mt-6 pt-5 border-t border-[#E0E4E8] text-center text-sm font-medium text-gray-600">
        Chưa có tài khoản? <Link to="/register" className="text-green-600 hover:text-green-700">Đăng ký ngay</Link>
      </div>
    </>
  );
};

export default Login;
