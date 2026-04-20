import { memo } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Modal } from 'antd';

const WalletCard = ({ wallet, onEdit, onClick, onDelete }) => {
  const balance = Number(wallet.current_balance || wallet.initial_balance || 0);
  console.log('Rendering WalletCard:', wallet.name, 'Balance:', wallet.current_balance, 'Initial:', wallet.initial_balance);
  // Định dạng lại chuỗi giá trị số thành dạng tiền tệ VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: wallet.currency || 'VND',
    }).format(amount);
  };

  return (
    <div 
      onClick={onClick}
      className="group bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-400 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4 relative z-10 transition-transform group-hover:translate-x-1">
          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center p-2 border border-gray-100 transition-transform group-hover:scale-105">
            <img 
              src={`/src/assets/icons/${wallet.icon_id}.svg`} 
              alt={wallet.name} 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span class="text-gray-400 font-bold">W</span>';
              }}
            />
          </div>
          
          <div>
            <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{wallet.name}</h3>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block">Ví cá nhân</span>
          </div>
        </div>

        <div className="relative z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(wallet);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-green-100 hover:text-green-600 transition-all"
            title="Chỉnh sửa ví"
          >
            <Pencil size={15} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              Modal.confirm({
                title: 'Xác nhận xóa ví',
                content: 'Xóa ví sẽ ẩn ví này và có thể ảnh hưởng tới báo cáo. Bạn có chắc muốn xóa?',
                okText: 'Xóa',
                okType: 'danger',
                cancelText: 'Hủy',
                onOk: async () => {
                  if (onDelete) await onDelete(wallet.id);
                }
              });
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-all"
            title="Xóa ví"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-end relative z-10 transition-transform group-hover:-translate-x-1">
        <p className="text-sm font-medium text-gray-500">Số dư hiện tại</p>
        <p className="font-bold text-xl text-green-600">{formatCurrency(balance)}</p>
      </div>
    </div>
  );
};

export default memo(WalletCard);