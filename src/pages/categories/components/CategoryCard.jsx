import { memo } from 'react';

const CategoryCard = ({ category, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden">
      {/* Indicator hệ thống */}
      {category.user_id === null && (
         <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
           Hệ thống
         </div>
      )}

      <div className="flex items-center gap-4 min-w-0 flex-1 mr-2">
        {/* Render Icon của danh mục */}
        <div className={`w-12 h-12 rounded-xl flex shrink-0 items-center justify-center p-2 border border-gray-100 ${category.type?.toLowerCase() === 'expense' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          <img 
            src={`/src/assets/icons/${category.icon_name || 'ic_other'}.svg`} 
            alt={category.name} 
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `<i class="fas ${category.icon_name || 'fa-tags'} text-xl"></i>`;
            }}
          />
        </div>
        
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1 truncate" title={category.name}>
            {category.name}
          </h3>
          <p className="text-sm font-medium text-gray-500">
            {category.type?.toLowerCase() === 'expense' ? 'Chi tiêu' : 'Thu nhập'}
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-col sm:flex-row items-end sm:items-center shrink-0 ml-2">
        {category.user_id !== null ? (
          <>
            <button 
              onClick={() => onEdit(category)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap"
            >
              Sửa
            </button>
            <button 
              onClick={() => {
                if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
                  onDelete(category.id);
                }
              }}
              className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap"
            >
              Xóa
            </button>
          </>
        ) : (
          <span className="text-[13px] font-medium text-gray-400 italic bg-gray-50 px-3 py-1.5 rounded-md whitespace-nowrap">
            Mặc định
          </span>
        )}
      </div>
    </div>
  );
};

export default memo(CategoryCard);
