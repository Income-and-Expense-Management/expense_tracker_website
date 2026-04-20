import { useState, useEffect, useMemo } from 'react';
import { useTransactions } from './hooks/useTransactions';
import { useWallets } from '../../hooks/useWallets';
import { Modal, Spin, Segmented, InputNumber, DatePicker, Select, Input } from 'antd';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { categoryService } from '../../services/categoryService';

dayjs.locale('vi');

// Component for creating/updating a transaction
const TransactionModal = ({ visible, onClose, onSave, categories, initialWalletId, editData }) => {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('EXPENSE');
  const [formData, setFormData] = useState({
    wallet_id: initialWalletId,
    category_id: null,
    amount: '',
    note: '',
    transaction_date: dayjs()
  });

  useEffect(() => {
    if (visible) {
      if (editData) {
        const catType = editData.type || editData.category?.type || 'EXPENSE';
        setType(catType);
        setFormData({
          wallet_id: editData.wallet_id,
          category_id: editData.category_id,
          amount: editData.amount,
          note: editData.note || '',
          transaction_date: dayjs(editData.transaction_date)
        });
      } else {
        setType('EXPENSE');
        setFormData({
          wallet_id: initialWalletId,
          category_id: null,
          amount: '',
          note: '',
          transaction_date: dayjs()
        });
      }
    }
  }, [visible, editData, initialWalletId]);

  const handleSubmit = async () => {
    if (!formData.amount || !formData.category_id || !formData.wallet_id) return;
    console.log('Submitting transaction with data:', formData);
    setLoading(true);
    const payload = {
      ...formData,
      amount: String(formData.amount),
      transaction_date: formData.transaction_date.toISOString()
    };
    
    await onSave(payload, editData ? editData.id : null);
    setLoading(false);
    onClose();
  };

  const filteredCategories = categories.filter(c => c.type === type);
  console.log("category: ", categories);
  return (
    <Modal
      title={editData ? 'Sửa giao dịch' : 'Thêm giao dịch'}
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="LƯU"
      cancelText="HỦY"
      confirmLoading={loading}
      okButtonProps={{ className: 'bg-green-600 hover:bg-green-700' }}
    >
      <div className="flex flex-col gap-4 mt-4">
        <Segmented
          block
          options={[
            { label: 'Khoản chi', value: 'EXPENSE' },
            { label: 'Khoản thu', value: 'INCOME' }
          ]}
          value={type}
          onChange={(val) => {
            setType(val);
            setFormData(prev => ({ ...prev, category_id: null }));
          }}
        />

        <div className="">
          <label className={`text-xs font-bold uppercase mb-1 block ${type === 'EXPENSE' ? 'text-red-500' : 'text-green-600'}`}>
            Số tiền (VND)
          </label>
          <InputNumber
            className={`w-full! text-lg font-bold  ${type === 'EXPENSE' ? 'text-red-500!' : 'text-green-600!'}`}
            value={formData.amount}
            onChange={(val) => setFormData({ ...formData, amount: val })}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(\.*)/g, '').replace(/,/g, '')}
            placeholder="0"
            size="large"
            min={0}
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Nhóm danh mục</label>
          <Select
            className="w-full"
            placeholder="Chọn nhóm"
            value={formData.category_id}
            onChange={(val) => setFormData({ ...formData, category_id: val })}
            options={filteredCategories.map(c => ({
              label: (
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold overflow-hidden ${type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {c.icon_name ? (
                      <img src={`/src/assets/icons/${c.icon_name}.svg`} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      (c.icon_name || c.name.substring(0, 2).toUpperCase())
                    )}
                  </div>
                  <span>{c.name}</span>
                </div>
              ),
              value: c.id,
              name: c.name // for filtering
            }))}
            size="large"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Ghi chú</label>
          <Input.TextArea
            placeholder="Thêm ghi chú"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Ngày giao dịch</label>
          <DatePicker
            className="w-full"
            value={formData.transaction_date}
            onChange={(val) => setFormData({ ...formData, transaction_date: val || dayjs() })}
            format="DD/MM/YYYY"
            size="large"
            allowClear={false}
          />
        </div>
      </div>
    </Modal>
  );
};

const Transactions = () => {
  const { selectedWalletId, fetchWallets, wallets } = useWallets();
  const selectedWallet = wallets?.find(w => w.id === selectedWalletId);
  const actualWalletBalance = selectedWallet ? Number(selectedWallet.current_balance ?? selectedWallet.initial_balance ?? 0) : 0;
  const { transactions, loading, fetchTransactions, addTransaction, editTransaction, removeTransaction, msgContextHolder } = useTransactions();
  const [categories, setCategories] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  const [filterType, setFilterType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
         const res = await categoryService.getCategories(null);
         if(res.success) setCategories(res.data);
      } catch(e) {
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedWalletId) {
      fetchTransactions(selectedWalletId, currentMonth);
    }
  }, [selectedWalletId, currentMonth, fetchTransactions]);

  const groupedData = useMemo(() => {
    const groups = {};
    let totalIn = 0;
    let totalOut = 0;

    transactions.forEach(t => {
       const type = t.type || t.category?.type;
       
       if (type === 'INCOME') totalIn += Number(t.amount);
       else totalOut += Number(t.amount);

       // Apply filters
       if (filterType !== 'ALL' && type !== filterType) return;
       if (searchTerm) {
         const searchLower = searchTerm.toLowerCase();
         const catName = t.category?.name?.toLowerCase() || '';
         const note = t.note?.toLowerCase() || '';
         if (!catName.includes(searchLower) && !note.includes(searchLower)) return;
       }

       const dateStr = dayjs(t.transaction_date).format('YYYY-MM-DD');
       if (!groups[dateStr]) groups[dateStr] = [];
       groups[dateStr].push(t);
    });

    const sortedDates = Object.keys(groups).sort((a,b) => new Date(b) - new Date(a));

    return {
      groups,
      sortedDates,
      totalIn,
      totalOut,
      balance: totalIn - totalOut
    };
  }, [transactions, filterType, searchTerm]);

  const handleSaveTransaction = async (data, id) => {
    let res;
    if (id) {
       res = await editTransaction(id, data);
    } else {
       res = await addTransaction(data);
    }
    if (res.success) {
      fetchTransactions(selectedWalletId, currentMonth);
      fetchWallets();
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Xoá giao dịch',
      content: 'Bạn có chắc chắn muốn xoá giao dịch này không?',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
         const res = await removeTransaction(id);
         if (res.success) {
            fetchTransactions(selectedWalletId, currentMonth);
            fetchWallets();
         }
      }
    });
  };

  const formatMon = (num) => new Intl.NumberFormat('vi-VN').format(num || 0);

  if (!selectedWalletId) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-gray-200">
         <span className="text-gray-500 font-medium">Vui lòng chọn ví trên header để xem giao dịch.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {msgContextHolder}
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        {/* Header section */}
        <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
              Đang chọn ví: <strong className="text-green-600">{selectedWallet?.name}</strong>
            </p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl text-gray-800">
              Giao dịch
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button 
              className="flex items-center gap-2 bg-green-600 text-white px-4 h-9 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              onClick={() => {
                setEditingTx(null);
                setModalVisible(true);
              }}
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Thêm giao dịch</span>
            </button>

            <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
              <button 
                className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-gray-500 hover:bg-gray-100 transition-colors"
                onClick={() => setCurrentMonth(prev => prev.subtract(1, 'month'))}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <div className="min-w-[88px] flex justify-center">
                <DatePicker 
                  picker="month" 
                  value={currentMonth} 
                  onChange={(val) => setCurrentMonth(val || dayjs())} 
                  format="MM/YYYY" 
                  allowClear={false}
                  variant="borderless"
                  className="font-medium text-sm tabular-nums text-gray-800 p-0 m-0 !text-center [&>div>input]:text-center cursor-pointer hover:bg-gray-50 rounded"
                  suffixIcon={null}
                />
              </div>

              <button 
                className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-gray-500 hover:bg-gray-100 transition-colors"
                onClick={() => setCurrentMonth(prev => prev.add(1, 'month'))}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Balance Box */}
        <section className="mb-10">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
            Số dư ví
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-semibold tracking-tight tabular-nums md:text-6xl text-gray-800">
              {actualWalletBalance >= 0 ? "" : "−"}
              {formatMon(Math.abs(actualWalletBalance))}
            </span>
            <span className="text-2xl font-medium text-gray-500">đ</span>
          </div>
        </section>

        {/* Cân đối tháng */}
        <section className="mb-10 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4">
          <p className="text-sm font-medium text-gray-600">Thay đổi trong tháng {currentMonth.format('MM/YYYY')}</p>
          <div className="flex items-baseline gap-1">
            <span className={`text-xl font-bold tabular-nums ${groupedData.balance > 0 ? "text-green-600" : groupedData.balance < 0 ? "text-red-500" : "text-gray-800"}`}>
              {groupedData.balance > 0 ? "+" : groupedData.balance < 0 ? "−" : ""}
              {formatMon(Math.abs(groupedData.balance))}
            </span>
            <span className="text-sm font-medium text-gray-500">đ</span>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200">
          <div className="bg-white p-5">
             <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-gray-500">
               <span className="flex h-5 w-5 items-center justify-center rounded text-green-600">
                 <ArrowUpRight className="h-4 w-4" strokeWidth={3} />
               </span>
               Tiền vào
             </div>
             <div className="mt-3 flex items-baseline gap-1">
               <span className="text-2xl font-semibold tabular-nums text-green-600">{formatMon(groupedData.totalIn)}</span>
               <span className="text-sm font-medium text-gray-500">đ</span>
             </div>
          </div>
          <div className="bg-white p-5">
             <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-gray-500">
               <span className="flex h-5 w-5 items-center justify-center rounded text-red-500">
                 <ArrowDownRight className="h-4 w-4" strokeWidth={3} />
               </span>
               Tiền ra
             </div>
             <div className="mt-3 flex items-baseline gap-1">
               <span className="text-2xl font-semibold tabular-nums text-red-500">{formatMon(groupedData.totalOut)}</span>
               <span className="text-sm font-medium text-gray-500">đ</span>
             </div>
          </div>
        </section>

        {/* Filters and search */}
        <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5">
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'EXPENSE', label: 'Chi' },
              { id: 'INCOME', label: 'Thu' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`relative rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  filterType === f.id ? "bg-green-600 text-white" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm giao dịch…"
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition hover:border-gray-300 focus:border-green-500 sm:w-72"
            />
          </div>
        </section>

        {/* Transaction List */}
        <section>
          {loading ? (
             <div className="text-center py-20"><Spin size="large" /></div>
          ) : groupedData.sortedDates.length === 0 ? (
             <div className="rounded-xl border border-dashed border-gray-300 py-20 text-center bg-white/50">
               <p className="text-sm font-medium text-gray-800">Chưa có giao dịch nào</p>
               <p className="mt-1 text-xs text-gray-500">
                 Thêm giao dịch đầu tiên cho tháng này.
               </p>
             </div>
          ) : (
            <div className="space-y-4">
            {groupedData.sortedDates.map(dateStr => {
               const dayTxs = groupedData.groups[dateStr];
               const dayTotal = dayTxs.reduce((sum, t) => {
                  const type = t.type || t.category?.type;
                  return type === 'INCOME' ? sum + Number(t.amount) : sum - Number(t.amount);
               }, 0);
               
               return (
                 <div key={dateStr} className="overflow-hidden rounded-xl border border-gray-200 bg-white mb-4">
                   <div className="bg-green-50/70 px-5 py-3 flex justify-between items-center border-b border-green-100">
                      <div className="flex items-baseline gap-2">
                         <span className="text-sm font-semibold text-green-800 capitalize">{dayjs(dateStr).format('dddd')}</span>
                         <span className="text-xs text-gray-500 font-medium tabular-nums">{dayjs(dateStr).format('DD/MM/YYYY')}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-800 tabular-nums">
                        {dayTotal > 0 ? "+" : ""}{formatMon(dayTotal)} <span className="underline underline-offset-2">đ</span>
                      </span>
                   </div>
                   
                   <div className="divide-y divide-gray-100">
                     {dayTxs.map((t) => {
                        const type = t.type || t.category?.type;
                        const isIncome = type === 'INCOME';
                        return (
                          <div
                            key={t.id}
                            className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors group cursor-pointer relative"
                            onClick={() => {
                              setEditingTx(t);
                              setModalVisible(true);
                            }}
                          >
                             <div className="flex items-center gap-4 flex-1">
                                <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-lg font-bold overflow-hidden border border-gray-100 shadow-sm ${isIncome ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                  {t.category?.icon_name ? (
                                    <img src={`/src/assets/icons/${t.category.icon_name}.svg`} alt={t.category?.name} className="w-full h-full object-cover" />
                                  ) : (
                                    (t.category?.name?.substring(0, 2).toUpperCase() || (isIncome ? '+' : '-'))
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <h5 className="text-gray-800 font-bold text-sm truncate">{t.category?.name || 'Không có danh mục'}</h5>
                                  {t.note && (
                                    <p className="text-xs text-gray-400 mt-0.5 truncate">{t.note}</p>
                                  )}
                                </div>
                             </div>
                             
                             <div className="flex items-center">
                                <p className={`font-bold transition-transform duration-200 ease-out group-hover:-translate-x-20 pr-2 whitespace-nowrap text-sm tabular-nums ${isIncome ? 'text-green-600' : 'text-gray-800'}`}>
                                  {isIncome ? "+" : "−"}{formatMon(Math.abs(t.amount))} <span className="font-medium underline underline-offset-2 text-gray-500 text-xs">đ</span>
                                </p>
                                
                                <div className="absolute right-4 flex gap-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                                   <button 
                                      onClick={(e) => { e.stopPropagation(); setEditingTx(t); setModalVisible(true); }} 
                                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-100 hover:text-green-600"
                                      aria-label="Sửa"
                                   >
                                      <Pencil className="h-4 w-4" />
                                   </button>
                                   <button 
                                      onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }} 
                                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-red-500 transition hover:bg-red-50 hover:text-red-600"
                                      aria-label="Xoá"
                                   >
                                      <Trash2 className="h-4 w-4" />
                                   </button>
                                </div>
                             </div>
                          </div>
                        );
                     })}
                   </div>
                 </div>
               );
            })}
            </div>
          )}
        </section>

      </div>

      <TransactionModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveTransaction}
        categories={categories}
        initialWalletId={selectedWalletId}
        editData={editingTx}
      />
    </div>
  );
};

export default Transactions;
