import { memo } from 'react';
import { useWallets } from '../../../hooks/useWallets';

const WalletOverview = memo(({ wallets, formatMon }) => {
  const { selectedWalletId, setSelectedWalletId } = useWallets();

  return (
    <div className="bg-white border border-[#E0E4E8] rounded-[12px] p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
         <h3 className="font-semibold text-gray-800 text-base">Danh sách Ví</h3>
         <button className="text-sm font-medium text-green-600 hover:text-green-700">+ Thêm</button>
      </div>
      
      {/* Danh sách List Box UI */}
      <div className="space-y-4 flex-1 overflow-y-auto">
        {wallets.length === 0 ? (
          <p className="text-gray-400 text-sm italic">Ví trống</p>
        ) : (
          wallets.map((w) => {
            const isSelected = w.id === selectedWalletId;
            return (
              <div 
                key={w.id} 
                onClick={() => setSelectedWalletId(w.id)}
                className={`border rounded-[12px] p-4 transition-colors cursor-pointer ${
                  isSelected 
                    ? 'border-green-500 bg-green-50 shadow-sm ring-1 ring-green-500' 
                    : 'border-[#E0E4E8] bg-[#F4F6F8] hover:border-green-400'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border ${
                    w.current_balance < 0 
                      ? 'bg-yellow-100 text-yellow-600 border-yellow-200' 
                      : (isSelected ? 'bg-green-500 text-white border-green-600' : 'bg-green-100 text-green-600 border-green-200')
                  }`}>
                    {w.icon || w.name.substring(0, 2).toUpperCase()}
                  </div>
                  <h4 className={`font-medium ${isSelected ? 'text-green-800' : 'text-gray-700'}`}>
                    {w.name} {isSelected && <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">Đang chọn</span>}
                  </h4>
                </div>
                <p className={`text-2xl font-bold ml-11 ${isSelected ? 'text-green-900' : 'text-gray-800'}`}>
                  {formatMon(w.current_balance)} ₫
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});

WalletOverview.displayName = 'WalletOverview';
export default WalletOverview;
