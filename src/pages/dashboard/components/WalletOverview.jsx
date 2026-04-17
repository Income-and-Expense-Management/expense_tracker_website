import { memo } from 'react';

const WalletOverview = memo(({ wallets, formatMon }) => (
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
        wallets.map((w) => (
          <div key={w.id} className="border border-[#E0E4E8] rounded-[12px] p-4 bg-[#F4F6F8] hover:border-green-400 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border ${w.current_balance < 0 ? 'bg-yellow-100 text-yellow-600 border-yellow-200' : 'bg-green-100 text-green-600 border-green-200'}`}>
                {w.icon || w.name.substring(0, 2).toUpperCase()}
              </div>
              <h4 className="font-medium text-gray-700">{w.name}</h4>
            </div>
            <p className="text-2xl font-bold text-gray-800 ml-11">{formatMon(w.current_balance)} ₫</p>
          </div>
        ))
      )}
    </div>
  </div>
));

WalletOverview.displayName = 'WalletOverview';
export default WalletOverview;
