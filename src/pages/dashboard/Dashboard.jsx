import { useDashboardData } from './hooks/useDashboardData';
import { useWallets } from '../../hooks/useWallets';
import DashboardSummary from './components/DashboardSummary';
import OverviewPieChart from './components/OverviewPieChart';
import TopCategoryExpense from './components/TopCategoryExpense';
import RecentTransactions from './components/RecentTransactions';
import IncomeExpenseCompareChart from './components/IncomeExpenseCompareChart';
import BudgetProgress from './components/BudgetProgress';

const Dashboard = () => {
  const { 
    loading, 
    wallets, 
    transactions,
    budgets, 
    totalIncome,
    totalExpense, 
    pieData, 
    topCategories, 
    barChartData, 
    formatMon 
  } = useDashboardData();

  const { selectedWalletId } = useWallets();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
         <span className="text-gray-500 font-medium bg-[#F4F6F8] px-4 py-2 rounded-[12px] border border-[#E0E4E8]">
           Đang đồng bộ thuật toán phân tích...
         </span>
      </div>
    );
  }

  // Find selected wallet to display at the top
  const currentWallet = wallets.find(w => w.id === selectedWalletId) || wallets[0];

  // Cấu trúc Main Grid được chia phân cấp giống Layout đã yêu cầu
  return (
    <div className="flex flex-col gap-6">

      {/* DÒNG 1: TÓM TẮT SỐ DƯ & QUỸ (Thẻ ví nổi bật, Thu, Chi) */}
      <DashboardSummary 
        currentWallet={currentWallet} 
        totalIncome={totalIncome} 
        totalExpense={totalExpense} 
        formatMon={formatMon} 
      />
      
      {/* VÙNG 2: TỔNG QUAN / CATEGORIES / GIAO DỊCH GẦN ĐÂY (Chia 3 cột) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Props data được rải xuống từ hook (đã bọc useMemo chống rerender) */}
         <OverviewPieChart data={pieData} totalExpense={totalExpense} formatMon={formatMon} />
         <TopCategoryExpense topCategories={topCategories} />
         <RecentTransactions transactions={transactions} formatMon={formatMon} />
      </div>

      {/* VÙNG 2: BIỂU ĐỒ BARCHART / NGÂN SÁCH (Tỷ lệ 2:1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <IncomeExpenseCompareChart data={barChartData} formatMon={formatMon} />
         <BudgetProgress budgets={budgets} formatMon={formatMon} />
      </div>

    </div>
  );
};

export default Dashboard;
