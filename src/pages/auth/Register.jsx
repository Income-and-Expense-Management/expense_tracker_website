import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Tạo mới cấu hình</h2>
      <div className="space-y-4">
         <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
          <input type="text" className="w-full p-2 border rounded" placeholder="Ví dụ: Bảo Trần" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" className="w-full p-2 border rounded" placeholder="name@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <input type="password" className="w-full p-2 border rounded" placeholder="••••••••" />
        </div>
        <button className="w-full bg-green-600 text-white font-medium py-2 px-4 rounded hover:bg-green-700 mt-2">
          Đăng ký thông tin
        </button>
      </div>
      <div className="mt-4 text-center text-sm">
        Đã là thành viên? <Link to="/login" className="text-blue-600 hover:underline">Đăng nhập</Link>
      </div>
    </>
  );
};

export default Register;
