import { useState, useEffect } from 'react';
import { useCategories } from '../../hooks/useCategories';
import CategoryCard from './components/CategoryCard';
import CategoryModal from './CategoryModal';
import { useAppMessage } from '../../hooks/useAppMessage';

const Categories = () => {
  const { categories, loading, fetchCategories, addCategory, editCategory, removeCategory } = useCategories();
  const [filterType, setFilterType] = useState('EXPENSE'); //  'INCOME' | 'EXPENSE'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const { contextHolder } = useAppMessage();

  useEffect(() => {
    fetchCategories(filterType);
  }, [filterType, fetchCategories]);

  const handleOpenModal = (category = null) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSubmit = async (formData) => {
    let result;
    if (selectedCategory) {
      result = await editCategory(selectedCategory.id, formData);
    } else {
      result = await addCategory(formData);
    }
    
    if (result.success) {
      handleCloseModal();
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      {contextHolder}
      
      {/* Header khu vực */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý danh mục</h1>
          <p className="text-gray-500 font-medium text-sm mt-1">Tổng cộng {categories.length} danh mục.</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Bộ lọc đã loại bỏ nút Tất cả, Mặc định là EXPENSE  */}
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-200 p-2.5 rounded-sm focus:outline-none focus:border-green-500 text-sm font-bold text-gray-700 bg-white"
          >
            <option value="EXPENSE">Chi tiêu</option>
            <option value="INCOME">Thu nhập</option>
          </select>

          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#008149] hover:bg-[#006f3d] text-white font-bold py-2.5 px-5 rounded-sm shadow-sm transition-all focus:ring-4 focus:ring-green-100 flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Thêm danh mục
          </button>
        </div>
      </div>

      {/* Grid danh sách danh mục */}
      {loading && categories.length === 0 ? (
        <div className="flex justify-center items-center h-48 opacity-60">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              onEdit={handleOpenModal}
              onDelete={removeCategory}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 text-gray-400">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Chưa có danh mục nào</h3>
          <p className="text-gray-500 font-medium mb-6">Bạn chưa có danh mục nào hoặc không khớp với bộ lọc. Hãy tạo một danh mục mới.</p>
          <button 
            onClick={() => handleOpenModal()}
            className="text-green-600 hover:text-green-700 font-bold hover:underline"
          >
            Tạo danh mục đầu tiên
          </button>
        </div>
      )}

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <CategoryModal 
          category={selectedCategory} 
          onSubmitData={handleSubmit}
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default Categories;