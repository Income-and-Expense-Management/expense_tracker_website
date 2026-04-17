import { memo } from 'react';

const TopCategoryExpense = memo(({ topCategories }) => (
  <div className="bg-white border border-[#E0E4E8] rounded-[12px] p-6 h-full">
    <h3 className="font-semibold text-gray-800 mb-6 text-base">Chi tiêu theo danh mục</h3>
    <div className="space-y-5">
      {topCategories.length === 0 ? (
        <p className="text-gray-400 text-sm italic">Chưa có giao dịch chi</p>
      ) : (
        topCategories.map((cat, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">{cat.name}</span>
              <span className="text-gray-500 font-medium">{cat.percentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#F4F6F8] rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-400 rounded-full" 
                style={{ width: `${cat.percentage}%` }}
              ></div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
));

TopCategoryExpense.displayName = 'TopCategoryExpense';
export default TopCategoryExpense;
