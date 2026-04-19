import { memo } from 'react';

const WalletCard = ({ wallet }) => {
  const balance = Number(wallet.current_balance || wallet.initial_balance || 0);

  // Định dạng lại chuỗi giá trị số thành dạng tiền tệ VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: wallet.currency || 'VND',
    }).format(amount);
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        {/* Render Icon của ví từ public/assets/icons */}
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center p-2 border border-gray-100">
          <img 
            src={`/src/assets/icons/${wallet.icon_id}.svg`} 
            alt={wallet.name} 
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback nếu ảnh không tồn tại
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<span class="text-gray-400 font-bold">W</span>';
            }}
          />
        </div>
        
        <div>
          <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{wallet.name}</h3>
          <p className="text-sm font-medium text-gray-500">Ví cá nhân</p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-sm font-medium text-gray-500 mb-1">Số dư hiện tại</p>
        <p className="font-bold text-xl text-green-600">{formatCurrency(balance)}</p>
      </div>
    </div>
  );
};

export default memo(WalletCard);