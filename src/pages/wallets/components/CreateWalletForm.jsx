import { useState } from 'react';
import { useAppMessage } from '../../../hooks/useAppMessage';

const ICON_LIST = [
  'ic_bills', 'ic_education', 'ic_entertainment', 'ic_food', 
  'ic_health', 'ic_other', 'ic_shopping', 'ic_transport', 
  'ic_bonus', 'ic_gift', 'ic_investment', 'ic_salary'
];

const CreateWalletForm = ({ onAddWallet, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    initial_balance: '',
    currency: 'VND', // Cố định payload
    icon_id: 'ic_other' // Mặc định
  });
  
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const { notifyError } = useAppMessage();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSelectIcon = (iconId) => {
    setFormData((prev) => ({ ...prev, icon_id: iconId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    // Validations cơ bản ở mặt client
    if (!formData.name || formData.name.trim().length === 0) {
      setFieldErrors({ name: 'Vui lòng nhập tên ví!' });
      setLoading(false);
      return;
    }
    
    if (formData.initial_balance === '') {
      setFieldErrors({ initial_balance: 'Vui lòng nhập số dư ban đầu!' });
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      initial_balance: Number(formData.initial_balance) // Ép kiểu số nguyên theo tài liệu FRONTEND-INTEGRATION-GUIDE
    };

    const response = await onAddWallet(payload);
    
    if (response.success) {
      onClose(); // Thành công thì đóng form
    } else {
      if (response.errors) {
        const errorsMap = {};
        response.errors.forEach(err => {
          errorsMap[err.field] = err.message;
        });
        setFieldErrors(errorsMap);
      } else {
         notifyError('Tao ví thất bại');
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">Thêm ví mới</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100">
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="walletForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Chọn Icon */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Chọn biểu tượng ví</label>
              <div className="grid grid-cols-5 sm:grid-cols-7 gap-3">
                {ICON_LIST.map(iconId => (
                  <button
                    key={iconId}
                    type="button"
                    title={iconId}
                    onClick={() => handleSelectIcon(iconId)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center p-1.5 transition-all
                      ${formData.icon_id === iconId ? 'ring-2 ring-green-500 bg-green-50 scale-110 shadow-sm' : 'border border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}`}
                  >
                    <img 
                      src={`/src/assets/icons/${iconId}.svg`} 
                      alt={iconId} 
                      className={`w-full h-full object-contain ${formData.icon_id === iconId ? 'opacity-100' : 'opacity-60'}`} 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Tên ví */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Tên ví</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${fieldErrors.name ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none focus:border-green-500 transition-colors bg-white font-medium`} 
                placeholder="VD: Ví tiền mặt, VCB Credit..." 
                disabled={loading}
              />
              {fieldErrors.name && <p className="text-red-500 text-xs font-medium mt-1.5">{fieldErrors.name}</p>}
            </div>

            {/* Số dư ban đầu */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Số dư ban đầu</label>
              <input 
                type="number" 
                name="initial_balance"
                value={formData.initial_balance}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${fieldErrors.initial_balance ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none focus:border-green-500 transition-colors bg-white font-medium`} 
                placeholder="0" 
                disabled={loading}
              />
              {fieldErrors.initial_balance && <p className="text-red-500 text-xs font-medium mt-1.5">{fieldErrors.initial_balance}</p>}
            </div>

            {/* Đơn vị tiền tệ (readonly) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Đơn vị tiền tệ</label>
              <input 
                type="text" 
                value="Việt Nam Đồng" 
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed font-medium select-none" 
              />
              <p className="text-xs text-gray-400 mt-1 font-medium">Bản dùng giới hạn hiện chỉ hỗ trợ tiền tệ cấu hình mặc định (VND).</p>
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex gap-3 justify-end">
          <button 
            type="button" 
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit" 
            form="walletForm"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'Đang tạo...' : 'Tạo ví mới'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWalletForm;