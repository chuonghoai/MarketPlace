import { useState, useEffect, useCallback } from 'react';
import { useWalletStore } from './wallet.store';
import { useToast } from '../../../components/toast/toast';
import { tWallet } from '../../../features/wallet/constants/walletL10n';
import { walletService } from '../../../features/wallet/services/wallet.service';
import type { CreateWithdrawalRequest } from '../../../features/wallet/models/wallet.model';

export const useWalletController = () => {
  const store = useWalletStore();
  const { toast } = useToast();
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  useEffect(() => {
    store.fetchWallet();
    store.fetchTransactions(1);
    store.fetchWithdrawals();

    // Check if returning from VNPay Topup
    if (window.location.search.includes('vnp_ResponseCode')) {
      walletService.verifyVnpayTopup(window.location.search.slice(1)).then((res) => {
        if (res.success) {
          toast(res.message || tWallet('topupSuccess'), 'success');
          store.fetchWallet();
          store.fetchTransactions(1);
        } else {
          toast(res.message || 'Giao dịch VNPay thất bại', 'error');
        }
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      });
    }
  }, [store.fetchWallet, store.fetchTransactions, store.fetchWithdrawals, toast]);

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

  const handleConfirmTopup = useCallback(async (amount: number, method: 'DIRECT' | 'VNPAY' = 'DIRECT') => {
    if (amount < 1000) {
      toast(tWallet('topupMinError'), 'warning');
      return;
    }

    const res = await store.topup(amount, method);
    if (res.success) {
      if (method === 'DIRECT') {
        toast(tWallet('topupSuccess'), 'success');
        setIsTopupModalOpen(false);
      }
    } else {
      toast(res.message || 'Lỗi khi nạp tiền', 'error');
    }
  }, [store, toast]);

  const handleOpenWithdraw = useCallback(() => {
    if (store.wallet?.status === 'LOCKED') {
      toast(tWallet('lockedWarning'), 'warning');
      return;
    }
    setIsWithdrawModalOpen(true);
  }, [store.wallet?.status, toast]);

  const handleCloseWithdraw = useCallback(() => {
    setIsWithdrawModalOpen(false);
  }, []);

  const handleConfirmWithdraw = useCallback(async (data: CreateWithdrawalRequest) => {
    const res = await store.requestWithdraw(data);
    if (res.success) {
      toast(tWallet('withdrawSuccess'), 'success');
      setIsWithdrawModalOpen(false);
    } else {
      toast(res.message || 'Lỗi khi gửi yêu cầu rút tiền', 'error');
      throw new Error(res.message);
    }
  }, [store, toast]);

  return {
    wallet: store.wallet,
    transactions: store.transactions,
    withdrawals: store.withdrawals,
    total: store.total,
    page: store.page,
    loading: store.loading,
    topupLoading: store.topupLoading,
    withdrawLoading: store.withdrawLoading,
    error: store.error,
    isTopupModalOpen,
    isWithdrawModalOpen,
    handleOpenTopup,
    handleCloseTopup,
    handleConfirmTopup,
    handleOpenWithdraw,
    handleCloseWithdraw,
    handleConfirmWithdraw,
    refreshWallet: store.fetchWallet,
    changePage: store.fetchTransactions,
  };
};
