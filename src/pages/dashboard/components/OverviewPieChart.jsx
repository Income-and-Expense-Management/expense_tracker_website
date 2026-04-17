import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { memo } from 'react';

const COLORS = ['#22c55e', '#facc15', '#e5e7eb']; // green-500 (Thu), yellow-400 (Chi), gray cho empty

const OverviewPieChart = memo(({ data, totalExpense, formatMon }) => {
  const isTrống = data.length === 1 && data[0].name === 'Trống';

  return (
    <div className="bg-white border border-[#E0E4E8] rounded-[12px] p-6 flex flex-col justify-between h-full">
      <h3 className="font-semibold text-gray-800 mb-4 text-base">Tổng quan Thu/Chi</h3>
      
      <div className="flex flex-col items-center justify-center py-2 h-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius="75%"
                outerRadius="100%"
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={isTrống ? COLORS[2] : COLORS[index % 2]} />
                ))}
              </Pie>
              {!isTrống && <Tooltip formatter={(value) => formatMon(value) + ' ₫'} />}
            </PieChart>
          </ResponsiveContainer>
          
          {/* Label Tổng Chi ở giữa (Inner Label) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-sm font-medium text-gray-500 mt-2">Đã chi</span>
             <span className="text-xl font-bold text-gray-800">{formatMon(totalExpense)} ₫</span>
          </div>
      </div>
      
      {/* Chú thích màu (Legend phẳng) */}
      <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-[#E0E4E8]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          <span className="text-sm font-medium text-gray-600">Thu</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
          <span className="text-sm font-medium text-gray-600">Chi</span>
        </div>
      </div>
    </div>
  );
});

OverviewPieChart.displayName = 'OverviewPieChart';
export default OverviewPieChart;
