import { memo } from 'react';

const BudgetProgress = memo(({ budgets, formatMon }) => (
  <div className="bg-white border border-[#E0E4E8] rounded-[12px] p-6 h-full">
    <div className="flex justify-between items-center mb-6">
       <h3 className="font-semibold text-gray-800 text-base">Tiến độ Ngân sách</h3>
       <button className="text-sm font-medium text-green-600 hover:text-green-700">Tất cả</button>
    </div>
    
    <div className="space-y-6">
      {budgets.length === 0 ? (
         <p className="text-gray-400 text-sm italic">Không có ngân sách</p>
      ) : (
        budgets.map((b) => {
          const safeTarget = Number(b.target_amount) || 1;
          const ratio = (Number(b.total_spent) / safeTarget) * 100;
          const pct = Math.min(ratio, 100);
          
          return (
            <div key={b.id}>
              <div className="flex justify-between items-end mb-1">
                <span className="font-medium text-gray-800">{b.name}</span>
                <span className={`text-sm font-semibold ${ratio >= 100 ? 'text-red-500' : 'text-gray-700'}`}>
                  {formatMon(b.total_spent)} 
                  <span className="text-gray-400 font-normal"> / {formatMon(safeTarget)}</span>
                </span>
              </div>
              <div className="text-xs font-medium text-gray-400 mb-2">Đạo hạn: {b.end_date || 'N/A'}</div>
              <div className="w-full h-3 bg-[#F4F6F8] border border-[#E0E4E8] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-r-full ${ratio > 90 ? (ratio >= 100 ? 'bg-red-500' : 'bg-yellow-400') : 'bg-green-500'}`} 
                  style={{ width: `${pct}%` }}
                ></div>
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
));

BudgetProgress.displayName = 'BudgetProgress';
export default BudgetProgress;
