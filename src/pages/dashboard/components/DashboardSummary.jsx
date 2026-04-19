import { memo, useState } from 'react';

const DashboardSummary = memo(({ currentWallet, totalIncome, totalExpense, formatMon }) => {
  const [showBalance, setShowBalance] = useState(true);

  if (!currentWallet) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Thẻ 1: Số dư hiện tại (Nổi bật, không chói) */}
      <div className="bg-[#008149] rounded-[16px] p-6 flex flex-col justify-between text-white relative overflow-hidden">
        {/* Họa tiết background cho bớt đơn điệu */}
        <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute -left-6 -bottom-6 w-24 h-24 rounded-full bg-black/10 blur-xl"></div>
        
        <div className="relative z-10 flex justify-between items-start mb-6">
          <div>
            <p className="text-green-100/90 text-sm font-medium mb-1">Số dư hiện tại</p>
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold tracking-tight">
                {showBalance ? `${formatMon(currentWallet.current_balance)} ₫` : '•••••••• ₫'}
              </h2>
              <button 
                onClick={() => setShowBalance(!showBalance)} 
                className="p-1 text-green-100 hover:text-white transition-colors hover:bg-white/10 rounded-full"
                title={showBalance ? "Ẩn số dư" : "Hiện số dư"}
              >
                {showBalance ? (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 mt-auto">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm overflow-hidden ring-1 ring-white/30">
              {currentWallet.icon_id ? (
                <img 
                  src={`/src/assets/icons/${currentWallet.icon_id}.svg`} 
                  alt="icon" 
                  className="w-4 h-4 object-contain" 
                  style={{filter: 'brightness(0) invert(1)'}}
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'block'; }} 
                />
              ) : null}
              <span className="text-[10px] font-bold" style={{ display: currentWallet.icon_id ? 'none' : 'block' }}>
                {currentWallet.name.substring(0, 2).toUpperCase()}
              </span>
          </div>
          <span className="font-medium text-green-50 text-sm opacity-90">{currentWallet.name}</span>
        </div>
      </div>

      {/* Thẻ 2: Tổng thu */}
      <div className="bg-white border border-[#E0E4E8] rounded-[16px] p-6 flex flex-col justify-center">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 ring-4 ring-green-50/50">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p className="text-gray-500 font-semibold text-sm uppercase tracking-wide">Tổng thu tháng này</p>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-800 ml-1">
          <span className="text-green-500 mr-1.5">+</span>
          {showBalance ? `${formatMon(totalIncome)} ₫` : '•••••••• ₫'}
        </h2>
      </div>

      {/* Thẻ 3: Tổng chi */}
      <div className="bg-white border border-[#E0E4E8] rounded-[16px] p-6 flex flex-col justify-center">
        <div className="flex items-center gap-4 mb-4">
           <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 ring-4 ring-red-50/50">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
            </svg>
           </div>
           <p className="text-gray-500 font-semibold text-sm uppercase tracking-wide">Tổng chi tháng này</p>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-800 ml-1">
          <span className="text-red-500 mr-1.5">-</span>
          {showBalance ? `${formatMon(totalExpense)} ₫` : '•••••••• ₫'}
        </h2>
      </div>

    </div>
  );
});

DashboardSummary.displayName = 'DashboardSummary';
export default DashboardSummary;