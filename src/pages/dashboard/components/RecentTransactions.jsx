import { memo } from 'react';
import dayjs from 'dayjs';

const RecentTransactions = memo(({ transactions, formatMon }) => {
  // Get the 5 most recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))
    .slice(0, 5);

  return (
    <div className="bg-white border border-[#E0E4E8] rounded-[12px] p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-800 text-base">Giao dịch gần đây</h3>
        <button className="text-sm font-medium text-green-600 hover:text-green-700">Xem tất cả</button>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto">
        {recentTransactions.length === 0 ? (
          <p className="text-gray-400 text-sm italic">Chưa có giao dịch nào</p>
        ) : (
          recentTransactions.map((t) => (
            <div key={t.id} className="flex justify-between items-center border-b border-[#E0E4E8] pb-3 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${(t.type || t.category?.type) === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  <img 
                    src={`/src/assets/icons/${t.category?.icon_name || 'other'}.svg`} 
                    alt={t.category?.name || 'Danh mục'}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.textContent = (t.category?.name || 'Khác').charAt(0).toUpperCase();
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">{t.note || t.category?.name || 'Chưa phân loại'}</h4>
                  <p className="text-xs text-gray-500">{dayjs(t.transaction_date).format('DD/MM/YYYY')}</p>
                </div>
              </div>
              <div className={`font-bold ${(t.type || t.category?.type) === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                {(t.type || t.category?.type) === 'INCOME' ? '+' : '-'}{formatMon(t.amount)} ₫
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

RecentTransactions.displayName = 'RecentTransactions';
export default RecentTransactions;