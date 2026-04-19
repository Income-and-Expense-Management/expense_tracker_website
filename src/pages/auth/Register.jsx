import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { validateRegisterForm } from '../../utils/validation';
import { useAppMessage } from '../../hooks/useAppMessage';

const Register = () => {
  const navigate = useNavigate();
  const { notifySuccess, notifyError, contextHolder } = useAppMessage();

  const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({}); // Lưu trữ lỗi backend từ Zod/Validation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    // Client-side Validation (kiểm tra input trước khi gọi backend)
    const { isValid, errors } = validateRegisterForm(formData);

    if (!isValid) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      // POST /auth/register
      const response = await authService.register(formData);
      if (response && response.success) {
        setFormData({ full_name: '', email: '', password: '' });
        // Chuyển hướng ngay lập tức và truyền state message sang trang Login
        navigate('/login', { state: { successMessage: 'Đăng kí thành công! Hãy đăng nhập.' } });
      }
    } catch (error) {
      if (error && error.errors && Array.isArray(error.errors)) {
        // Phân tích "errors": [{ field: "email", message: "Email đã tồn tại" }]
        const errorsMap = {};
        error.errors.forEach(err => {
          errorsMap[err.field] = err.message;
        });
        setFieldErrors(errorsMap);
        notifyError(error.message || 'Hồ sơ chưa hợp lệ, bạn vui lòng kiểm tra lại!');
      } else if (error && error.message) {
        // Các HTTP Status Code khác (Ví dụ 500 Server Error)
        notifyError(error.message);
      } else {
        notifyError('Không thể tạo tài khoản lúc này, vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {contextHolder}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-wide uppercase mb-2">CREATE ACCOUNT</h2>
        <p className="text-gray-500 font-medium">Join us today! Please enter your details.</p>
      </div>

      {/* KHUNG FORM INPUT */}
      <form onSubmit={handleRegister} className="space-y-4">
         <div>
          <label className="block text-sm font-bold text-gray-800 mb-1.5">Full Name</label>
          <input 
            type="text" 
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${fieldErrors.full_name ? 'border-red-500' : 'border-gray-300'} rounded-lg outline-none focus:border-green-500 transition-colors placeholder-gray-400 bg-white`} 
            placeholder="John Doe" 
            required
            disabled={loading}
          />
          {fieldErrors.full_name && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{fieldErrors.full_name}</p>}
        </div>

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

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#4ab466] text-white font-bold py-3.5 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors shadow-sm"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </div>
      </form>

      {/* ĐIỀU HƯỚNG */}
      <div className="mt-8 text-center text-sm font-semibold text-gray-500">
        Already have an account? <Link to="/login" className="text-[#de6062] hover:text-red-500">Log in</Link>
      </div>
    </div>
  );
};

export default Register;
