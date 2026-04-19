import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({}); // Lưu trữ lỗi backend từ Zod/Validation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    }
    setErrorMsg('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    setFieldErrors({});

    // Client-side Validation (kiểm tra input trước khi gọi backend)
    let hasError = false;
    const newFieldErrors = {};
    if (!formData.full_name || formData.full_name.trim().length < 2) {
      newFieldErrors.full_name = "Họ tên phải có ít nhất 2 ký tự.";
      hasError = true;
    }
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newFieldErrors.email = "Vui lòng nhập định dạng email hợp lệ.";
      hasError = true;
    }
    if (!formData.password || formData.password.length < 6) {
      newFieldErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
      hasError = true;
    }

    if (hasError) {
      setFieldErrors(newFieldErrors);
      setLoading(false);
      return;
    }

    try {
      // POST /auth/register
      const response = await authService.register(formData);
      if (response && response.success) {
        setSuccessMsg('Tạo tài khoản thành công! Tự động chuyển hướng...');
        setFormData({ full_name: '', email: '', password: '' });
        
        // Delay 1.5 giây để người dùng kịp đọc tin nhắn Success sau đó về trang Login
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (error) {
      if (error && error.errors && Array.isArray(error.errors)) {
        // Phân tích "errors": [{ field: "email", message: "Email đã tồn tại" }]
        const errorsMap = {};
        error.errors.forEach(err => {
          errorsMap[err.field] = err.message;
        });
        setFieldErrors(errorsMap);
        setErrorMsg(error.message || 'Hồ sơ chưa hợp lệ, bạn vui lòng kiểm tra lại!');
      } else if (error && error.message) {
        // Các HTTP Status Code khác (Ví dụ 500 Server Error)
        setErrorMsg(error.message);
      } else {
        setErrorMsg('Không thể tạo tài khoản lúc này, vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-wide uppercase mb-2">CREATE ACCOUNT</h2>
        <p className="text-gray-500 font-medium">Join us today! Please enter your details.</p>
      </div>
      
      {/* THÔNG BÁO LỖI HOẶC THÀNH CÔNG */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded-[12px]">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm border border-green-200 rounded-[12px]">
          {successMsg}
        </div>
      )}

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
