import { useEffect, useState } from 'react';
import { Modal, Form, InputNumber, Select, DatePicker } from 'antd';
import { useWallets } from '../../../hooks/useWallets';
import { useCategories } from '../../../hooks/useCategories';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const CreateBudgetForm = ({ visible, onClose, onSubmit, loading, editData = null, defaultWalletId = null }) => {
  const [form] = Form.useForm();
  const { wallets } = useWallets();
  const { categories, fetchCategories } = useCategories();

  useEffect(() => {
    if (visible) {
      fetchCategories('expense');

      if (editData) {
        // Prefill form in edit mode
        form.setFieldsValue({
          category_id: editData.category_id,
          wallet_id: editData.wallet_id,
          target_amount: Number(editData.target_amount || 0),
          date_range: [dayjs(editData.start_date), dayjs(editData.end_date)],
        });
      } else {
        form.setFieldsValue({
          date_range: [dayjs().startOf('month'), dayjs().endOf('month')]
        });
        // Prefill wallet when creating new budget if a default is provided
        if (defaultWalletId) {
          form.setFieldsValue({ wallet_id: defaultWalletId });
        }
      }
    } else {
      // reset when modal closed to avoid stale values
      form.resetFields();
    }
  }, [visible, fetchCategories, form, editData, defaultWalletId]);

  // Lọc an toàn trường hợp API trả về thẳng expense hoặc mảng lẫn lộn
  const expenseCategories = categories.filter(c => 
    c.type === 'expense' || c.type === 'EXPENSE'
  );

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const payload = {
        category_id: values.category_id,
        wallet_id: values.wallet_id,
        target_amount: values.target_amount.toString(),
        // Gửi kèm offset thời gian (ví dụ +07:00) để backend lưu đúng ngày địa phương
        start_date: values.date_range[0].format('YYYY-MM-DDTHH:mm:ssZ'),
        end_date: values.date_range[1].format('YYYY-MM-DDTHH:mm:ssZ'),
      };
      
      // onSubmit can accept (payload, id) — parent decides create vs update
      const success = await onSubmit(payload, editData?.id);
      if (success) {
        form.resetFields();
        onClose();
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={<h3 className="text-xl font-bold text-gray-800">{editData ? 'Chỉnh sửa ngân sách' : 'Thêm ngân sách'}</h3>}
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={loading}
      okText="Lưu"
      cancelText="Hủy"
      className="rounded-2xl"
      okButtonProps={{ className: "bg-green-500 hover:bg-green-600 border-none rounded-xl" }}
      cancelButtonProps={{ className: "rounded-xl" }}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="category_id"
          label="Chọn nhóm (Danh mục)"
          rules={[{ required: true, message: 'Vui lòng chọn danh mục chi tiêu' }]}
        >
          <Select 
            placeholder="Chọn nhóm" 
            size="large"
            className="rounded-xl"
            options={expenseCategories.map(cat => ({
              value: cat.id,
              label: (
                <div className="flex items-center gap-2">
                  <img src={`/src/assets/icons/${cat.icon_name}.svg`} alt={cat.name} className="w-5 h-5" onError={(e) => { e.target.style.display = 'none'; }} />
                  <span>{cat.name}</span>
                </div>
              )
            }))}
          />
        </Form.Item>

        <Form.Item
          name="target_amount"
          label="Số tiền"
          rules={[{ required: true, message: 'Vui lòng nhập số tiền mục tiêu' }]}
        >
          <InputNumber 
            className="w-full! rounded-xl" 
            size="large"
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            min={0}
            addonAfter="VND"
          />
        </Form.Item>

        <Form.Item
          name="date_range"
          label="Kỳ hạn (Từ ngày - Đến ngày)"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian áp dụng' }]}
        >
          <RangePicker 
            className="w-full rounded-xl" 
            size="large" 
            format="DD/MM/YYYY"
          />
        </Form.Item>

        <Form.Item
          name="wallet_id"
          label="Áp dụng cho ví"
          rules={[{ required: true, message: 'Vui lòng chọn ví áp dụng' }]}
        >
          <Select 
            placeholder="Chọn ví" 
            size="large"
            className="rounded-xl"
            options={wallets.map(wallet => ({
              value: wallet.id,
              label: (
                <div className="flex items-center gap-2">
                  <img src={`/src/assets/icons/${wallet.icon_id}.svg`} alt={wallet.name} className="w-5 h-5" onError={(e) => { e.target.style.display = 'none'; }} />
                  <span>{wallet.name}</span>
                </div>
              )
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateBudgetForm;