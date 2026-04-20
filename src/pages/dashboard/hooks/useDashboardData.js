import { useState, useEffect, useMemo } from 'react';
import { transactionService } from '../../../services/transactionService';
import { budgetService } from '../../../services/budgetService';
import { MOCK_DASHBOARD_DATA } from './mockData';

export const useDashboardData = (selectedWalletId = null) => {
    const [rawItems, setRawItems] = useState({ transactions: [], budgets: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
       let isMounted = true;
       const fetchData = async () => {
            setLoading(true);
            try {
                // Lấy transaction cho ví cụ thể (nếu có) và toàn bộ budgets (sau đó filter local theo wallet)
                const [transRes, budgetsRes] = await Promise.allSettled([
                   transactionService.getTransactions(selectedWalletId),
                   budgetService.getBudgets()
                ]);

                if (!isMounted) return;

                const transactions = transRes.status === 'fulfilled' && transRes.value?.success
                   ? transRes.value.data : MOCK_DASHBOARD_DATA.transactions;

                const budgetsAll = budgetsRes.status === 'fulfilled' && budgetsRes.value?.success
                   ? budgetsRes.value.data : MOCK_DASHBOARD_DATA.budgets;

                const budgets = selectedWalletId
                   ? budgetsAll.filter(b => String(b.wallet_id) === String(selectedWalletId))
                   : budgetsAll;

                setRawItems({ transactions, budgets });
            } catch(e) {
                console.error("Dashboard data fetch error", e);
                if (isMounted) {
                   setRawItems({
                      transactions: MOCK_DASHBOARD_DATA.transactions,
                      budgets: MOCK_DASHBOARD_DATA.budgets
                   });
                }
            } finally {
                if(isMounted) setLoading(false);
            }
       };
       fetchData();
       return () => { isMounted = false; };
    }, [selectedWalletId]);

   // ==============================================
   // useMemo để tính toán số liệu (Data Aggregation) -> Chống re-render/re-calculate
   // ==============================================
   const processedData = useMemo(() => {
      const { transactions, budgets } = rawItems;
      
      let totalIncome = 0;
      let totalExpense = 0;
      const catMap = {};

      const dailyDataMap = { 
        0: { day: 'Sun', in: 0, out: 0 }, 1: { day: 'Mon', in: 0, out: 0 }, 
        2: { day: 'Tue', in: 0, out: 0 }, 3: { day: 'Wed', in: 0, out: 0 }, 
        4: { day: 'Thu', in: 0, out: 0 }, 5: { day: 'Fri', in: 0, out: 0 }, 
        6: { day: 'Sat', in: 0, out: 0 }
      };

      transactions.forEach(t => {
         const amt = Number(t.amount);
         const date = new Date(t.transaction_date);
         let dayIdx = date.getDay(); // 0 is Sunday
         if (isNaN(dayIdx)) dayIdx = 1;

         const type = t.type || t.category?.type;
         if (type === 'INCOME') {
            totalIncome += amt;
            dailyDataMap[dayIdx].in += amt;
         } else {
            totalExpense += amt;
            dailyDataMap[dayIdx].out += amt;
            const catName = t.category?.name || 'Khác';
            catMap[catName] = (catMap[catName] || 0) + amt;
         }
      });

      // Sắp xếp lại biểu đồ BarChart từ Thứ 2 -> CN thay vì CN -> Thứ 7
      const barChartData = [
         dailyDataMap[1], dailyDataMap[2], dailyDataMap[3], 
         dailyDataMap[4], dailyDataMap[5], dailyDataMap[6], dailyDataMap[0]
      ];

      // Tính phần trăm & Xếp hạng Top Category Expense
      const sortedCats = Object.entries(catMap)
        .sort((a,b) => b[1] - a[1])
        .slice(0, 4)
        .map(([name, amount]) => ({
           name,
           amount,
           percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0
        }));

      // PieChart đòi mảng số liệu, nếu trống 100% thì gán rỗng để khỏi render sai
      const pieData = totalExpense > 0 || totalIncome > 0 
        ? [ { name: 'Thu', value: totalIncome }, { name: 'Chi', value: totalExpense } ] 
        : [ { name: 'Trống', value: 1 } ];

      // Helper fomat số tiền (Ví dụ: 15,000,000)
      const formatMon = (num) => new Intl.NumberFormat('vi-VN').format(num || 0);

      return {
         transactions,
         budgets, 
         totalIncome,
         totalExpense,
         pieData,
         topCategories: sortedCats,
         barChartData,
         formatMon,
         isEmpty: transactions.length === 0
      };

   }, [rawItems]);

   return { ...processedData, loading };
};
