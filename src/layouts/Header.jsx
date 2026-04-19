import { useAuth } from "../hooks/useAuth";
import { useWallets } from "../hooks/useWallets";
import { Select } from "antd";

const Header = () => {
  const { user } = useAuth();
  const { wallets, selectedWalletId, setSelectedWalletId } = useWallets();

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
          <Select
            value={selectedWalletId || undefined}
            onChange={(value) => setSelectedWalletId(value)}
            className="min-w-[160px]"
            options={wallets?.map((wallet) => ({
              value: wallet.id,
              label: (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 flex-shrink-0 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-bold ring-1 ring-green-200 overflow-hidden">
                    {wallet.icon_id ? (
                      <img 
                        src={`/src/assets/icons/${wallet.icon_id}.svg`} 
                        alt={wallet.name}
                        className="w-3.5 h-3.5 object-contain" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <span style={{ display: wallet.icon_id ? 'none' : 'block' }}>
                      {wallet.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-gray-800 truncate">{wallet.name}</span>
                </div>
              ),
            }))}
            placeholder="Chọn ví"
          />
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
