import { useState, useEffect } from 'react';
import { useBudgets } from '../../hooks/useBudgets.js';
import { useCategories } from '../../hooks/useCategories.js';
import { useAppMessage } from '../../hooks/useAppMessage';
import { useWallets } from '../../hooks/useWallets';
import { Select } from 'antd';
import CreateBudgetForm from './components/CreateBudgetForm';
import BudgetDetailModal from './components/BudgetDetailModal';

const Budgets = () => {
  const { budgets, loading, addBudget, updateBudget, deleteBudget } = useBudgets();
  const { categories, fetchCategories } = useCategories();
  const { contextHolder } = useAppMessage();
  const { wallets, selectedWalletId, setSelectedWalletId } = useWallets();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    // Tải danh mục để map tên mảng budget ra
    fetchCategories('expense');
  }, [fetchCategories]);

  const handleCreateBudget = async (payload) => {
    const success = await addBudget(payload);
    if (success) {
      setIsModalVisible(false);
    }
    return success;
  };

  const handleCreateOrUpdate = async (payload, id) => {
    if (id) {
      const success = await updateBudget(id, payload);
      if (success) {
        setIsModalVisible(false);
        setEditData(null);
      }
      return success;
    }

    return handleCreateBudget(payload);
  };

  const openDetail = (budget) => {
    setSelectedBudget(budget);
    setIsDetailVisible(true);
  };

  const closeDetail = () => {
    setSelectedBudget(null);
    setIsDetailVisible(false);
  };

  const handleEdit = (budget) => {
    setEditData(budget);
    setIsModalVisible(true);
    setIsDetailVisible(false);
  };

  const handleDelete = async (id) => {
    const success = await deleteBudget(id);
    if (success) {
      closeDetail();
    }
  };

  const calculateProgress = (spent, target) => {
    if (!target) return 0;
    const progress = (Number(spent) / Number(target)) * 100;
    return progress > 100 ? 100 : progress;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount || 0);
  };

  // Lọc theo ví đang chọn (nếu có)
  const activeWalletId = selectedWalletId || null;
  const filteredBudgets = activeWalletId
    ? budgets.filter(b => String(b.wallet_id) === String(activeWalletId))
    : budgets;

  // Tính tổng (dựa trên filteredBudgets)
  const totalTarget = filteredBudgets.reduce((acc, curr) => acc + Number(curr.target_amount || 0), 0);
  const totalSpent = filteredBudgets.reduce((acc, curr) => acc + Number(curr.total_spent || 0), 0);
  const totalRemaining = totalTarget - totalSpent;

  const overallProgress = totalTarget > 0 ? Math.min(100, (totalSpent / totalTarget) * 100) : 0;
  const radius = 80;
  const circumference = Math.PI * radius;
  const dashoffset = circumference - (overallProgress / 100) * circumference;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {contextHolder}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Ngân sách</h1>
          <div className="inline-flex items-center bg-gray-100 rounded-full px-2 py-1">
            <Select
              value={selectedWalletId || undefined}
              onChange={(val) => setSelectedWalletId(val === '' ? null : val)}
              size="small"
              bordered={false}
              dropdownMatchSelectWidth={false}
              options={[
                ...(wallets || []).map(w => ({
                  value: w.id,
                  label: (
                    <div className="flex items-center gap-2">
                      <img src={`/src/assets/icons/${w.icon_id}.svg`} alt={w.name} className="w-4 h-4" onError={(e) => { e.target.style.display = 'none'; }} />
                      <span>{w.name}</span>
                    </div>
                  )
                }))
              ]}
              style={{ minWidth: 140 }}
            />
          </div>
        </div>

        <button 
          onClick={() => setIsModalVisible(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-medium shadow-sm active:scale-95 transition-all"
        >
          Tạo ngân sách
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 relative overflow-hidden flex flex-col items-center">
        <div className="relative w-full max-w-[280px] h-44 flex items-end justify-center mb-2">
          <svg className="absolute top-0 left-0 w-full h-full drop-shadow-sm" viewBox="0 0 200 120">
            {/* Background Arc */}
            <path 
              d="M 20 100 A 80 80 0 0 1 180 100" 
              fill="none" 
              stroke="#F3F4F6" 
              strokeWidth="16" 
              strokeLinecap="round" 
            />
            {/* Progress Arc */}
            <path 
              d="M 20 100 A 80 80 0 0 1 180 100" 
              fill="none" 
              stroke={totalRemaining < 0 ? "#EF4444" : "#10B981"} 
              strokeWidth="16" 
              strokeLinecap="round" 
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="text-center w-full absolute bottom-4 left-0">
            <p className="text-gray-500 text-sm mb-1 font-medium">Số tiền còn lại có thể chi</p>
            <p className={`text-4xl font-bold px-2 truncate ${totalRemaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
               {totalRemaining > 0 ? '+' : ''} {formatCurrency(totalRemaining)}
            </p>
          </div>
        </div>

        <div className="flex justify-between w-full border-t border-gray-50 pt-5 relative z-10">
          <div className="text-center flex-1 border-r border-gray-100">
            <p className="text-gray-400 text-xs mb-1 font-medium uppercase tracking-wider">Tổng ngân sách</p>
            <p className="font-semibold text-lg text-gray-800">{formatCurrency(totalTarget)}</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-gray-400 text-xs mb-1 font-medium uppercase tracking-wider">Tổng đã chi</p>
            <p className="font-semibold text-lg text-gray-800">{formatCurrency(totalSpent)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredBudgets.length === 0 && !loading ? (
          <div className="text-center py-10 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
               </svg>
            </div>
            <p className="text-gray-500 font-medium">Chưa có ngân sách nào</p>
            <p className="text-gray-400 text-sm mt-1">Hãy tạo một ngân sách để quản lý chi tiêu tốt hơn.</p>
          </div>
        ) : (
          filteredBudgets.map(budget => {
            // Map danh mục từ category_id
            const category = categories?.find(c => c.id === budget.category_id);
            const spent = Number(budget.total_spent || 0); // TODO: Backend chưa trả field này
            const target = Number(budget.target_amount);
            const progress = calculateProgress(spent, target);
            const isOverBudget = progress >= 100;

            return (
              <div key={budget.id} onClick={() => openDetail(budget)} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md hover:border-green-100 transition-all group">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center p-2 border border-gray-100 flex-shrink-0">
                       <img 
                          src={`/src/assets/icons/${category?.icon_name || 'ic_other'}.svg`} 
                          alt={category?.name || 'Ngân sách'} 
                          className="w-full h-full object-contain"
                          onError={(e) => { e.target.src = '/src/assets/icons/ic_other.svg'; }}
                       />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg group-hover:text-green-600 transition-colors">{category?.name || 'Ngân sách'}</h3>
                      <p className="text-sm font-medium text-gray-500">Còn {formatCurrency(target - spent)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${isOverBudget ? 'text-red-500' : 'text-gray-800'}`}>
                      {formatCurrency(spent)}
                    </p>
                    <p className="text-xs text-gray-400 font-medium">/ {formatCurrency(target)}</p>
                  </div>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`} 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      <CreateBudgetForm 
        visible={isModalVisible} 
        editData={editData}
        defaultWalletId={selectedWalletId}
        onClose={() => { setIsModalVisible(false); setEditData(null); }} 
        onSubmit={handleCreateOrUpdate} 
        loading={loading} 
      />

      <BudgetDetailModal 
        visible={isDetailVisible}
        onClose={closeDetail}
        budget={selectedBudget}
        category={categories?.find(c => c.id === selectedBudget?.category_id)}
        wallet={wallets?.find(w => w.id === selectedBudget?.wallet_id)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Budgets;
