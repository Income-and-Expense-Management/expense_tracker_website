// Fake data sử dụng nếu backend chưa dựng xong logic / gãy do CORS.
// Giúp Frontend Developer dựng trước Chart an toàn.

const now = new Date();
const getDayStr = (offset) => {
  const d = new Date(now);
  d.setDate(d.getDate() - offset);
  return d.toISOString();
};

export const MOCK_DASHBOARD_DATA = {
  wallets: [
    { id: '1', name: 'Tiền mặt', current_balance: 5500000, icon: 'TM' },
    { id: '2', name: 'Thẻ tín dụng', current_balance: -2000000, icon: 'CR' },
  ],
  transactions: [
    { id: 't1', type: 'income', amount: 20000000, transaction_date: getDayStr(1) },
    { id: 't2', type: 'expense', amount: 4500000, category: { name: 'Ăn uống' }, transaction_date: getDayStr(0) },
    { id: 't3', type: 'expense', amount: 2500000, category: { name: 'Mua sắm' }, transaction_date: getDayStr(2) },
    { id: 't4', type: 'expense', amount: 2000000, category: { name: 'Di chuyển' }, transaction_date: getDayStr(3) },
    { id: 't5', type: 'expense', amount: 1000000, category: { name: 'Khác' }, transaction_date: getDayStr(4) },
    { id: 't6', type: 'expense', amount: 2500000, category: { name: 'Ăn uống' }, transaction_date: getDayStr(1) },
  ],
  budgets: [
    { id: 'b1', name: 'Ăn uống gia đình', target_amount: 10000000, total_spent: 8000000, start_date: '2026-04-01', end_date: '2026-04-30' },
    { id: 'b2', name: 'Trang phục', target_amount: 2000000, total_spent: 2000000, start_date: '2026-04-01', end_date: '2026-04-30' },
    { id: 'b3', name: 'Giải trí cuối tuần', target_amount: 3000000, total_spent: 1000000, start_date: '2026-04-01', end_date: '2026-04-30' },
  ]
};
