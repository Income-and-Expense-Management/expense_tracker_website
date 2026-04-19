import { useContext } from 'react';
import { WalletContext } from '../context/WalletContext';

export const useWallets = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallets must be used within a WalletProvider');
  }
  return context;
};
