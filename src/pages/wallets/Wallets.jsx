import { useState } from 'react';
import { useWallets } from '../../hooks/useWallets';
import WalletCard from './components/WalletCard';
import CreateWalletForm from './components/CreateWalletForm';
import { useAppMessage } from '../../hooks/useAppMessage';

const Wallets = () => {
  const { wallets, loading, addWallet } = useWallets();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { contextHolder } = useAppMessage();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="max-w-6xl mx-auto pb-10">
      {contextHolder}
      
      {/* Header khu vực */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý ví</h1>
          <p className="text-gray-500 font-medium text-sm mt-1">Tổng cộng {wallets.length} ví hoạt động.</p>
        </div>
        
        <button 
          onClick={handleOpenModal}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-5 rounded-xl shadow-sm transition-all focus:ring-4 focus:ring-green-100 flex items-center justify-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Thêm ví mới
        </button>
      </div>

      {/* Grid danh sách ví */}
      {loading && wallets.length === 0 ? (
        <div className="flex justify-center items-center h-48 opacity-60">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      ) : wallets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map((wallet) => (
            <WalletCard key={wallet.id} wallet={wallet} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 text-gray-400">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinelinejoin="round">
              <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
              <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
              <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Chưa có ví nào</h3>
          <p className="text-gray-500 font-medium mb-6">Bạn chưa có ví nào trong tài khoản. Hãy tạo một ví mới để bắt đầu quản lý chi tiêu.</p>
          <button 
            onClick={handleOpenModal}
            className="text-green-600 hover:text-green-700 font-bold hover:underline"
          >
            Tạo ví đầu tiên
          </button>
        </div>
      )}

      {/* Modal / Form Thêm ví */}
      {isModalOpen && (
        <CreateWalletForm 
          onAddWallet={addWallet} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default Wallets;