import { useState, useCallback } from 'react';
import type {
  WalletInfo,
  WalletTransaction,
  WalletWithdrawal,
  CreateWithdrawalRequest,
} from '../../../features/wallet/models/wallet.model';
import { walletService } from '../../../features/wallet/services/wallet.service';

export const useWalletStore = () => {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<WalletWithdrawal[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [topupLoading, setTopupLoading] = useState<boolean>(false);
  const [withdrawLoading, setWithdrawLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await walletService.getMyWallet();
      if (res.success && res.data) {
        setWallet(res.data);
      } else {
        setError(res.message || 'Không thể tải thông tin ví');
      }
    } catch {
      setError('Lỗi khi tải thông tin ví');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async (currentPage = 1) => {
    try {
      const res = await walletService.getTransactions(currentPage);
      if (res.success && res.data) {
        setTransactions(res.data.items);
        setTotal(res.data.total);
        setPage(res.data.page);
      }
    } catch (e) {
      console.error('Lỗi khi tải lịch sử giao dịch ví:', e);
    }
  }, []);

  const fetchWithdrawals = useCallback(async () => {
    try {
      const res = await walletService.getMyWithdrawals();
      if (res.success && res.data) {
        setWithdrawals(res.data);
      }
    } catch (e) {
      console.error('Lỗi khi tải danh sách yêu cầu rút tiền:', e);
    }
  }, []);

  const topup = useCallback(async (amount: number, method: 'DIRECT' | 'VNPAY' = 'DIRECT') => {
    setTopupLoading(true);
    try {
      const res = await walletService.topup(amount, method);
      if (res.success && res.data) {
        if (res.data.paymentRequired && res.data.paymentUrl) {
          window.location.href = res.data.paymentUrl;
          return { success: true };
        }
        if (res.data.balance !== undefined) {
          setWallet((prev) => (prev ? { ...prev, balance: res.data.balance! } : null));
        }
        await fetchTransactions(1);
        return { success: true };
      }
      return { success: false, message: res.message || 'Nạp tiền thất bại' };
    } catch (e: any) {
      return { success: false, message: e.response?.data?.message || 'Lỗi hệ thống khi nạp tiền' };
    } finally {
      setTopupLoading(false);
    }
  }, [fetchTransactions]);

  const requestWithdraw = useCallback(async (data: CreateWithdrawalRequest) => {
    setWithdrawLoading(true);
    try {
      const res = await walletService.createWithdrawal(data);
      if (res.success) {
        await fetchWallet();
        await fetchTransactions(1);
        await fetchWithdrawals();
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message || 'Gửi yêu cầu rút tiền thất bại' };
    } catch (e: any) {
      return { success: false, message: e.response?.data?.message || 'Lỗi khi gửi yêu cầu rút tiền' };
    } finally {
      setWithdrawLoading(false);
    }
  }, [fetchWallet, fetchTransactions, fetchWithdrawals]);

  return {
    wallet,
    transactions,
    withdrawals,
    total,
    page,
    loading,
    topupLoading,
    withdrawLoading,
    error,
    fetchWallet,
    fetchTransactions,
    fetchWithdrawals,
    topup,
    requestWithdraw,
  };
};
