import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const MainLayout = () => {
  const { logoutCtx, user } = useAuth();
  const location = useLocation();

  // Hàm helper highlight menu dựa theo current route
  const getMenuClass = (path) => {
    const baseClass = "block p-3 rounded-[12px] font-medium transition-colors mb-2";
    if (location.pathname === path) {
      // Active state: Nền xanh nhạt, text xanh lá primary, border xanh để nhấn mà k dùng shadow
      return `${baseClass} bg-green-50 text-green-700 border border-green-200`;
    }
    // Inactive state: Text xám, hover làm nền xám nhạt (chuẩn flat, không hover đổ bóng)
    return `${baseClass} text-gray-600 hover:bg-[#F4F6F8] hover:text-gray-800 border border-transparent`;
  };

  return (
    <div className="flex h-screen bg-[#F4F6F8] overflow-hidden">
      
      {/* ============================================================== */}
      {/* SIDEBAR AREA (Bên trái) */}
      {/* ============================================================== */}
      <aside className="w-64 bg-white border-r border-[#E0E4E8] flex-col hidden md:flex shrink-0 z-10">
        
        {/* KHU VỰC LOGO */}
        <div className="h-[72px] flex items-center px-6 border-b border-[#E0E4E8]">
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-1">
            <span className="text-green-600">Khéo</span>
            <span className="text-yellow-500">Chi</span>
          </h1>
        </div>

        {/* MENU KIỀU CHO TÁC VỤ */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <Link to="/dashboard" className={getMenuClass('/dashboard')}>Tổng quan</Link>
          <Link to="/transactions" className={getMenuClass('/transactions')}>Giao dịch</Link>
          <Link to="/wallets" className={getMenuClass('/wallets')}>Ví của tôi</Link>
          <Link to="/budgets" className={getMenuClass('/budgets')}>Ngân sách</Link>
          <Link to="/categories" className={getMenuClass('/categories')}>Danh mục</Link>
        </nav>

        {/* FOOTER CỦA SIDEBAR (LOGOUT) */}
        <div className="p-4 border-t border-[#E0E4E8]">
          <button 
            onClick={logoutCtx}
            className="w-full text-left p-3 text-red-600 hover:bg-red-50 rounded-[12px] font-medium transition-colors border border-transparent hover:border-red-200 flex items-center gap-2"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* MAIN CONTENT AREA */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER */}
        <header className="h-[72px] bg-white border-b border-[#E0E4E8] flex items-center justify-between px-6 shrink-0 z-10">
          
          <div className="flex items-center gap-4">
            {/* Nút bật/tắt menu trên mobile */}
            <button className="md:hidden border border-[#E0E4E8] bg-[#F4F6F8] px-3 py-1.5 rounded-[12px] text-gray-600 font-medium">
              Menu
            </button>
            {/* Tiêu đề trang động/tĩnh */}
            <h2 className="text-xl font-bold text-gray-800">Overview</h2>
          </div>

          <div className="flex items-center gap-5">
            
            {/* Dropdown "Chọn Ví" (Wallet Selector) */}
            <div className="hidden sm:flex items-center gap-2">
              <label className="text-sm text-gray-500 font-medium">Nguồn quỹ:</label>
              <select className="bg-[#F4F6F8] border border-[#E0E4E8] text-gray-800 text-sm font-medium rounded-[12px] px-3 py-2 outline-none focus:border-green-500 hover:border-gray-300 transition-colors cursor-pointer appearance-none pr-8 relative">
                <option value="all">Tất cả ví</option>
                <option value="cash">Ví tiền mặt</option>
                <option value="credit">Thẻ tín dụng</option>
              </select>
            </div>

            {/* Vạch kẻ phân cách */}
            <div className="h-8 w-px bg-[#E0E4E8] hidden sm:block"></div>

            {/* KHU VỰC USER PROFILE */}
            <div className="flex items-center gap-3 cursor-pointer hover:bg-[#F4F6F8] p-1.5 pr-2 rounded-[12px] transition-colors border border-transparent hover:border-[#E0E4E8]">
              {/* Cột tên (ẩn trên mobile) */}
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-bold text-gray-800 leading-tight">
                  {user?.full_name || 'Người dùng'}
                </span>
                <span className="text-[11px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md mt-0.5 border border-green-100">
                  Thành viên
                </span>
              </div>
              {/* Avatar lấy chữ cái đầu bằng khối màu bệt */}
              <div className="w-10 h-10 rounded-[12px] bg-green-500 border-2 border-white ring-1 ring-[#E0E4E8] flex items-center justify-center text-white font-bold text-lg">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>

          </div>
        </header>

        {/* CONTAINER CHỨA NỘI DUNG MÀN HÌNH CHÍNH */}
        <main className="flex-1 p-6 overflow-y-auto bg-[#F4F6F8]">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default MainLayout;
