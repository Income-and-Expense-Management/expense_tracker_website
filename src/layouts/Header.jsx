import { useAuth } from "../hooks/useAuth";

const Header = () => {
  const { user } = useAuth();

  return (
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
          <label className="text-sm text-gray-500 font-medium">
            Ví đang chọn:
          </label>
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
              {user?.full_name || "Người dùng"}
            </span>
          </div>
          {/* Avatar lấy chữ cái đầu bằng khối màu bệt */}
          <div className="w-10 h-10 rounded-full bg-green-500 border-2 border-white ring-1 ring-[#E0E4E8] flex items-center justify-center text-white font-bold text-lg">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
