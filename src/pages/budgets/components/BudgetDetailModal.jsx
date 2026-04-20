import React from 'react';
import { Modal, Button } from 'antd';
import dayjs from 'dayjs';

const BudgetDetailModal = ({ visible, onClose, budget, category, wallet, onEdit, onDelete }) => {
  if (!budget) return null;

  const spent = Number(budget.total_spent || 0);
  const target = Number(budget.target_amount || 0);
  const remaining = target - spent;
  const progress = target ? Math.min(100, Math.round((spent / target) * 100)) : 0;
  const daysLeft = Math.max(0, dayjs(budget.end_date).startOf('day').diff(dayjs().startOf('day'), 'day'));

  const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

  const handleDelete = () => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa ngân sách này? Hành động không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        if (onDelete) await onDelete(budget.id);
        onClose();
      }
    });
  };

  return (
    <Modal open={visible} onCancel={onClose} footer={null} title={<h3 className="text-lg font-semibold">Chi tiết ngân sách</h3>}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
            <img src={`/src/assets/icons/${category?.icon_name || 'other'}.svg`} alt={category?.name || 'Danh mục'} className="w-8 h-8" onError={(e)=> e.target.style.display='none'} />
          </div>
          <div>
            <p className="font-bold text-gray-800">{category?.name || 'Ngân sách'}</p>
            <p className="text-sm text-gray-500">{wallet?.name || 'Tất cả ví'}</p>
          </div>
        </div>

        <div className="flex justify-between items-center border rounded-lg p-4 bg-gray-50">
          <div>
            <p className="text-xs text-gray-400">Tổng ngân sách</p>
            <p className="font-semibold text-lg">{formatCurrency(target)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Đã chi</p>
            <p className="font-semibold text-lg">{formatCurrency(spent)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Còn lại</p>
            <p className={`font-semibold text-lg ${remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>{formatCurrency(remaining)}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500">Kỳ hạn</p>
          <p className="font-medium">{dayjs(budget.start_date).format('DD/MM/YYYY')} - {dayjs(budget.end_date).format('DD/MM/YYYY')}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Tiến độ</p>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden mt-2">
            <div className={`h-2.5 rounded-full ${progress >= 100 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${progress}%`}} />
          </div>
          <p className="text-xs text-gray-400 mt-2">{progress}% đã sử dụng</p>
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <Button onClick={() => { onEdit && onEdit(budget); }} type="default">Chỉnh sửa</Button>
          <Button onClick={handleDelete} danger> Xóa </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BudgetDetailModal;
