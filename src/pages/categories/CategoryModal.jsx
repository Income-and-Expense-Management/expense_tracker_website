import { useState, useEffect } from 'react';

const ICON_LIST = [
  'ic_bills', 'ic_education', 'ic_entertainment', 'ic_food', 
  'ic_health', 'ic_other', 'ic_shopping', 'ic_transport', 
  'ic_bonus', 'ic_gift', 'ic_investment', 'ic_salary'
];

const CategoryModal = ({ category, onSubmitData, onClose }) => {
    const isEdit = !!category;
    const [formData, setFormData] = useState({
        name: '',
        type: 'expense',
        icon_name: 'ic_other'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit) {
            setFormData({
                name: category.name || '',
                type: category.type || 'expense',
                icon_name: category.icon_name || 'ic_other'
            });
        }
    }, [category, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmitData(formData);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all border border-gray-100">
                {/* Header Modal */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-800">
                        {isEdit ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                Tên danh mục <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                required 
                                placeholder="VD: Ăn uống, Tiền lương..."
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium placeholder:text-gray-400 placeholder:font-normal" 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                Loại danh mục
                            </label>
                            <select 
                                name="type" 
                                value={formData.type} 
                                onChange={handleChange} 
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium appearance-none"
                            >
                                <option value="expense">Chi tiêu</option>
                                <option value="income">Thu nhập</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                                Chọn biểu tượng (Icon)
                            </label>
                            <div className="grid grid-cols-5 sm:grid-cols-7 gap-3">
                                {ICON_LIST.map(iconId => (
                                    <button
                                        key={iconId}
                                        type="button"
                                        title={iconId}
                                        onClick={() => setFormData(prev => ({ ...prev, icon_name: iconId }))}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center p-1.5 transition-all
                                        ${formData.icon_name === iconId ? 'ring-2 ring-green-500 bg-green-50 scale-110 shadow-sm' : 'border border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}`}
                                    >
                                        <img 
                                            src={`/src/assets/icons/${iconId}.svg`} 
                                            alt={iconId} 
                                            className={`w-full h-full object-contain ${formData.icon_name === iconId ? 'opacity-100' : 'opacity-60'}`} 
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Footer (Buttons) */}
                        <div className="pt-2 flex justify-end gap-3">
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors focus:ring-4 focus:ring-gray-100"
                                disabled={loading}
                            >
                                Hủy bỏ
                            </button>
                            <button 
                                type="submit" 
                                className="bg-[#008149] hover:bg-[#006f3d] text-white font-bold py-2.5 px-6 rounded-xl shadow-sm transition-all focus:ring-4 focus:ring-green-100 flex items-center justify-center min-w-[120px]"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    "Lưu lại"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CategoryModal;
