import { memo } from 'react';

const CategoryCard = ({ category, onEdit, onDelete, onToggleActive }) => {
  return (
    <div className={`bg-white p-5 rounded-2xl shadow-sm border ${category.is_active === false ? 'border-gray-200 opacity-70' : 'border-gray-100'} flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden`}>
      {/* Indicator hệ thống */}
      {category.user_id === null && (
         <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
           Hệ thống
         </div>
      )}

      <div className="flex items-center gap-4 min-w-0 flex-1 mr-2">
        {/* Render Icon của danh mục */}
        <div className={`w-12 h-12 rounded-xl flex shrink-0 items-center justify-center p-2 border border-gray-100 ${category.is_active === false ? 'bg-gray-50 text-gray-400 grayscale filter opacity-50' : category.type?.toLowerCase() === 'expense' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
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
          <h3 className={`font-bold text-lg leading-tight mb-1 truncate ${category.is_active === false ? 'text-gray-400 line-through' : 'text-gray-800'}`} title={category.name}>
            {category.name}
          </h3>
          <p className="text-sm font-medium text-gray-500">
            {category.type?.toLowerCase() === 'expense' ? 'Chi tiêu' : 'Thu nhập'}
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-col sm:flex-row items-end sm:items-center shrink-0 ml-2 border-l border-gray-100 pl-4 py-1">
        {category.user_id !== null ? (
          <div className="flex gap-2">
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
          </div>
        ) : null}
        {/* Toggle Switch */}
        <div className="mr-2 flex flex-col items-center">
          <button 
            type="button"
            role="switch"
            aria-checked={category.is_active !== false}
            onClick={() => onToggleActive && onToggleActive(category.id, category.is_active !== false)}
            className={`
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
              transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
              ${category.is_active !== false ? 'bg-green-500' : 'bg-gray-200'}
            `}
          >
            <span
              aria-hidden="true"
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                transition duration-200 ease-in-out mt-[0.5px]
                ${category.is_active !== false ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
        </div>

        
      </div>
    </div>
  );
};

export default memo(CategoryCard);
