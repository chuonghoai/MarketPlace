import { useState, useEffect, useCallback } from 'react';
import { useWalletStore } from './wallet.store';
import { useToast } from '../../../components/toast/toast';
import { tWallet } from '../../../features/wallet/constants/walletL10n';

export const useWalletController = () => {
  const store = useWalletStore();
  const { toast } = useToast();
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);

  useEffect(() => {
    store.fetchWallet();
    store.fetchTransactions(1);
  }, [store.fetchWallet, store.fetchTransactions]);

  const handleOpenTopup = useCallback(() => {
    if (store.wallet?.status === 'LOCKED') {
      toast(tWallet('lockedWarning'), 'warning');
      return;
    }
    setIsTopupModalOpen(true);
  }, [store.wallet?.status, toast]);

  const handleCloseTopup = useCallback(() => {
    setIsTopupModalOpen(false);
  }, []);

  const handleConfirmTopup = useCallback(async (amount: number) => {
    if (amount < 1000) {
      toast(tWallet('topupMinError'), 'warning');
      return;
    }

    const res = await store.topup(amount);
    if (res.success) {
      toast(tWallet('topupSuccess'), 'success');
      setIsTopupModalOpen(false);
    } else {
      toast(res.message || 'Lỗi khi nạp tiền', 'error');
    }
  }, [store, toast]);

  return {
    wallet: store.wallet,
    transactions: store.transactions,
    total: store.total,
    page: store.page,
    loading: store.loading,
    topupLoading: store.topupLoading,
    error: store.error,
    isTopupModalOpen,
    handleOpenTopup,
    handleCloseTopup,
    handleConfirmTopup,
    refreshWallet: store.fetchWallet,
    changePage: store.fetchTransactions,
  };
};
