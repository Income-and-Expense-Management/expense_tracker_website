import { useState, useEffect, useMemo } from 'react';
import { useTransactions } from './hooks/useTransactions';
import { useWallets } from '../../hooks/useWallets';
import { Modal, Spin, Segmented, InputNumber, DatePicker, Select, Input, FloatButton } from 'antd';
import { PlusOutlined, EditFilled, DeleteFilled } from '@ant-design/icons';
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
          disabled={!!editData}
        />

        <div>
          <label className={`text-xs font-bold uppercase mb-1 block ${type === 'EXPENSE' ? 'text-red-500' : 'text-green-600'}`}>
            Số tiền (VND)
          </label>
          <InputNumber
            className="w-full text-lg font-bold"
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
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {c.icon_name || c.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span>{c.name}</span>
                </div>
              ),
              value: c.id,
              name: c.name // for filtering
            }))}
            size="large"
            showSearch
            optionFilterProp="name"
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
  const { selectedWalletId, fetchWallets } = useWallets();
  const { transactions, loading, fetchTransactions, addTransaction, editTransaction, removeTransaction } = useTransactions();
  const [categories, setCategories] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
         const res = await categoryService.getCategories(null);
         console.log('Categories loaded:', res);
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
       const dateStr = dayjs(t.transaction_date).format('YYYY-MM-DD');
       if (!groups[dateStr]) groups[dateStr] = [];
       groups[dateStr].push(t);

       const type = t.type || t.category?.type;
       if (type === 'INCOME') totalIn += Number(t.amount);
       else totalOut += Number(t.amount);
    });

    const sortedDates = Object.keys(groups).sort((a,b) => new Date(b) - new Date(a));

    return {
      groups,
      sortedDates,
      totalIn,
      totalOut,
      balance: totalIn - totalOut
    };
  }, [transactions]);

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
      <div className="flex items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-100">
         <span className="text-gray-500 font-medium">Vui lòng chọn ví trên header để xem giao dịch.</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-24 relative min-h-screen">
      {/* Month Navigation */}
      <div className="flex bg-white rounded-xl p-1 mb-6 text-gray-600 shadow-sm border border-gray-100 max-w-sm mx-auto">
         <button 
           className="flex-1 py-1.5 text-center text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
           onClick={() => setCurrentMonth(prev => prev.subtract(1, 'month'))}
         >
           Tháng trước
         </button>
         <button className="flex-1 py-1.5 text-center text-sm font-bold bg-green-50 text-green-700 rounded-lg">
           {currentMonth.format('MM/YYYY')}
         </button>
         <button 
           className="flex-1 py-1.5 text-center text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
           onClick={() => setCurrentMonth(prev => prev.add(1, 'month'))}
         >
           Tháng sau
         </button>
      </div>

      {/* Summary Box */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center col-span-2">
           <p className="text-gray-500 text-sm font-medium mb-1">Cân bằng thu chi tháng</p>
           <h2 className={`text-3xl font-bold ${groupedData.balance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
             {groupedData.balance > 0 ? '+' : ''}{formatMon(groupedData.balance)} ₫
           </h2>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 border-l-4 border-l-red-500">
           <p className="text-gray-500 text-xs font-bold uppercase mb-1">Tiền ra</p>
           <p className="text-gray-800 font-bold text-lg">{formatMon(groupedData.totalOut)} ₫</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 border-l-4 border-l-green-500">
           <p className="text-gray-500 text-xs font-bold uppercase mb-1">Tiền vào</p>
           <p className="text-gray-800 font-bold text-lg">{formatMon(groupedData.totalIn)} ₫</p>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-6">
        {loading && transactions.length === 0 ? (
           <div className="text-center py-10"><Spin size="large" /></div>
        ) : groupedData.sortedDates.length === 0 ? (
           <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 shadow-sm">
             <p className="text-gray-500 font-medium">Tháng này chưa có giao dịch nào.</p>
           </div>
        ) : (
          groupedData.sortedDates.map(dateStr => {
             const dayTxs = groupedData.groups[dateStr];
             const dayTotal = dayTxs.reduce((sum, t) => {
                const type = t.type || t.category?.type;
                return type === 'INCOME' ? sum + Number(t.amount) : sum - Number(t.amount);
             }, 0);
             
             return (
               <div key={dateStr} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                 <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b border-gray-100">
                    <div>
                       <h4 className="text-gray-800 font-bold capitalize">{dayjs(dateStr).format('dddd')}</h4>
                       <p className="text-xs text-gray-500 font-medium">{dayjs(dateStr).format('DD/MM/YYYY')}</p>
                    </div>
                    <span className={`font-bold ${dayTotal > 0 ? 'text-green-600' : 'text-gray-800'}`}>
                      {dayTotal > 0 ? '+' : ''}{formatMon(dayTotal)} ₫
                    </span>
                 </div>
                 
                 <div className="divide-y divide-gray-100">
                   {dayTxs.map(t => {
                      const type = t.type || t.category?.type;
                      return (
                        <div key={t.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => {
                          setEditingTx(t);
                          setModalVisible(true);
                        }}>
                           <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                                 {t.category?.icon_name || (type === 'INCOME' ? '+' : '-')}
                              </div>
                              <div>
                                <h5 className="text-gray-800 font-bold">{t.category?.name || 'Không có danh mục'}</h5>
                                {t.note && <p className="text-xs text-gray-500 line-clamp-1 max-w-[12rem] mt-0.5">{t.note}</p>}
                              </div>
                           </div>
                           <div className="text-right">
                              <p className={`font-bold ${type === 'INCOME' ? 'text-green-600' : 'text-gray-800'}`}>
                                {type === 'INCOME' ? '+' : '-'}{formatMon(t.amount)}
                              </p>
                              
                              <div className="hidden group-hover:flex justify-end gap-2 mt-1">
                                 <div 
                                    onClick={(e) => { e.stopPropagation(); setEditingTx(t); setModalVisible(true); }} 
                                    className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition-colors"
                                 >
                                    <EditFilled className="text-xs" />
                                 </div>
                                 <div 
                                    onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }} 
                                    className="w-6 h-6 rounded bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
                                 >
                                    <DeleteFilled className="text-xs" />
                                 </div>
                              </div>
                           </div>
                        </div>
                      );
                   })}
                 </div>
               </div>
             );
          })
        )}
      </div>

      <FloatButton
        icon={<PlusOutlined />}
        type="primary"
        style={{ right: 24, bottom: 24, width: 56, height: 56 }}
        onClick={() => {
          setEditingTx(null);
          setModalVisible(true);
        }}
      />

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
