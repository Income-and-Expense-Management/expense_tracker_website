import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LayoutDashboard, Receipt, Wallet, PieChart, Tags, LogOut } from "lucide-react";

const Sidebar = () => {
  const { logoutCtx } = useAuth();
  const location = useLocation();

  // Hàm helper highlight menu dựa theo current route
  const getMenuClass = (path) => {
    const baseClass = "flex items-center gap-3 p-3 rounded-[12px] font-medium transition-colors mb-2";
    if (location.pathname === path) {
      // Active state
      return `${baseClass} bg-green-50 text-green-700 border border-green-200`;
    }
    // Inactive state
    return `${baseClass} text-gray-600 hover:bg-[#F4F6F8] hover:text-gray-800 border border-transparent`;
  };

  return (
    <aside className="w-64 bg-white border-r border-[#E0E4E8] flex-col hidden md:flex shrink-0 z-10">
      {/* KHU VỰC LOGO */}
      <div className="h-[72px] flex items-center px-6 border-b border-[#E0E4E8]">
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-1">
          <div className="flex">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-10 w-auto object-contain"
            />
          </div>
          <span className="text-green-600">Expense</span>
          <span className="text-yellow-500">Tracker</span>
        </h1>
      </div>

      {/* MENU KIỀU CHO TÁC VỤ */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <Link to="/dashboard" className={getMenuClass("/dashboard")}>
          <LayoutDashboard size={20} />
          Tổng quan
        </Link>
        <Link to="/transactions" className={getMenuClass("/transactions")}>
          <Receipt size={20} />
          Giao dịch
        </Link>
        <Link to="/wallets" className={getMenuClass("/wallets")}>
          <Wallet size={20} />
          Ví của tôi
        </Link>
        <Link to="/budgets" className={getMenuClass("/budgets")}>
          <PieChart size={20} />
          Ngân sách
        </Link>
        <Link to="/categories" className={getMenuClass("/categories")}>
          <Tags size={20} />
          Danh mục
        </Link>
      </nav>

      {/* FOOTER CỦA SIDEBAR (LOGOUT) */}
      <div className="p-4 border-t border-[#E0E4E8]">
        <button
          onClick={logoutCtx}
          className="w-full text-left p-3 text-red-600 hover:bg-red-50 rounded-[12px] font-medium transition-colors border border-transparent hover:border-red-200 flex items-center gap-3"
        >
          <LogOut size={20} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
