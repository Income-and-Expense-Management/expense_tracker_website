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
    <>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Tạo mới cấu hình</h2>
      
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
      <form onSubmit={handleRegister} className="space-y-5">
         <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ & tên</label>
          <input 
            type="text" 
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border ${fieldErrors.full_name ? 'border-red-500 bg-red-50' : 'border-[#E0E4E8] bg-[#F4F6F8]'} rounded-[12px] outline-none focus:border-green-500 transition-colors placeholder-gray-400`} 
            placeholder="Ví dụ: Nguyễn Văn A" 
            required
            disabled={loading}
          />
          {fieldErrors.full_name && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{fieldErrors.full_name}</p>}
        </div>

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
          {loading ? 'Đang xử lý...' : 'Đăng ký tài khoản'}
        </button>
      </form>

      {/* ĐIỀU HƯỚNG */}
      <div className="mt-6 pt-5 border-t border-[#E0E4E8] text-center text-sm font-medium text-gray-600">
        Đã là thành viên? <Link to="/login" className="text-green-600 hover:text-green-700">Đăng nhập ngay</Link>
      </div>
    </>
  );
};

export default Register;
