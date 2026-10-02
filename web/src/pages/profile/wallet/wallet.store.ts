import { useState, useCallback } from 'react';
import type { WalletInfo, WalletTransaction } from '../../../features/wallet/models/wallet.model';
import { walletService } from '../../../features/wallet/services/wallet.service';

export const useWalletStore = () => {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [topupLoading, setTopupLoading] = useState<boolean>(false);
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

  const topup = useCallback(async (amount: number) => {
    setTopupLoading(true);
    try {
      const res = await walletService.topup(amount);
      if (res.success && res.data) {
        setWallet((prev) => prev ? { ...prev, balance: res.data.balance } : null);
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

  return {
    wallet,
    transactions,
    total,
    page,
    loading,
    topupLoading,
    error,
    fetchWallet,
    fetchTransactions,
    topup,
  };
};
