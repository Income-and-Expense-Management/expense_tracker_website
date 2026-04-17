import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { memo } from 'react';

const IncomeExpenseCompareChart = memo(({ data, formatMon }) => {
  // Custom tooltips (Flat style) chặn styles mặc định của Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-[#E0E4E8] p-3 rounded-[8px] text-sm shadow-none">
          <p className="font-bold text-gray-700 mb-1">{label}</p>
          {payload.map((item, id) => (
             <p key={id} style={{ color: item.fill }} className="font-medium">
                {item.name}: {formatMon(Math.abs(item.value))} ₫
             </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Convert schema for diverging positive/negative bars like standard finance apps
  const chartData = data.map(d => ({
     day: d.day,
     Thu: Number(d.in),         // Cột Dương
     Chi: -Number(d.out)        // Cột Âm (Đảo lật ngược 180 độ xuống đáy lưới)
  }));

  return (
    <div className="lg:col-span-2 bg-white border border-[#E0E4E8] rounded-[12px] p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-800 text-base">So sánh Thu / Chi</h3>
        <div className="text-sm font-medium text-gray-600 border border-[#E0E4E8] bg-[#F4F6F8] px-3 py-1.5 rounded-[12px]">Tuần này</div>
      </div>
      
      <div className="flex-1 min-h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={14} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E4E8" />
             <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
             <Tooltip cursor={{fill: '#F4F6F8'}} content={<CustomTooltip />} />
             <ReferenceLine y={0} stroke="#E0E4E8" />
             <Bar dataKey="Thu" fill="#22c55e" radius={[4, 4, 0, 0]} />
             {/* Bo tròn xuống dưới cho cột âm bằng [0, 0, 4, 4] */}
             <Bar dataKey="Chi" fill="#facc15" radius={[0, 0, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

IncomeExpenseCompareChart.displayName = 'IncomeExpenseCompareChart';
export default IncomeExpenseCompareChart;
