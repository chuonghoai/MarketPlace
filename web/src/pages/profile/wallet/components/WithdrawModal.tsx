import React, { useState } from 'react';
import { tWallet } from '../../../../features/wallet/constants/walletL10n';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onSubmit: (data: { amount: number; bankName: string; accountNumber: string; accountHolder: string }) => Promise<void>;
  isLoading: boolean;
}

const COMMON_BANKS = [
  'Vietcombank',
  'Techcombank',
  'MB Bank',
  'BIDV',
  'VietinBank',
  'ACB',
  'VPBank',
  'TPBank',
  'HDBank',
  'Sacombank',
];

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  availableBalance,
  onSubmit,
  isLoading,
}) => {
  const [bankName, setBankName] = useState('Vietcombank');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickPercent = (percent: number) => {
    const calc = Math.floor((availableBalance * percent) / 100);
    setAmount(calc);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);

    if (!bankName.trim()) {
      setError('Vui lòng chọn hoặc nhập tên ngân hàng');
      return;
    }
    if (!accountNumber.trim()) {
      setError('Vui lòng nhập số tài khoản ngân hàng');
      return;
    }
    if (!accountHolder.trim()) {
      setError('Vui lòng nhập tên chủ tài khoản');
      return;
    }
    if (!numAmount || numAmount < 10000) {
      setError(tWallet('withdrawMinError'));
      return;
    }
    if (numAmount > availableBalance) {
      setError(tWallet('withdrawMaxError'));
      return;
    }

    setError(null);
    try {
      await onSubmit({
        amount: numAmount,
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        accountHolder: accountHolder.trim().toUpperCase(),
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Không thể gửi yêu cầu rút tiền');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 border border-border-subtle dark:border-stone-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-market-primary text-2xl">account_balance</span>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {tWallet('withdrawModalTitle')}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Balance info banner */}
          <div className="bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded-xl border border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between text-sm">
            <span className="text-stone-600 dark:text-stone-400">{tWallet('balanceLabel')}</span>
            <span className="font-bold text-market-primary text-base">
              {availableBalance.toLocaleString('vi-VN')} ₫
            </span>
          </div>

          {/* Bank name */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              {tWallet('withdrawBankName')}
            </label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-market-primary"
            >
              {COMMON_BANKS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Account Number & Account Holder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                {tWallet('withdrawAccNumber')}
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder={tWallet('withdrawAccNumberPlaceholder')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-market-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                {tWallet('withdrawAccHolder')}
              </label>
              <input
                type="text"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                placeholder={tWallet('withdrawAccHolderPlaceholder')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-market-primary"
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                {tWallet('withdrawAmount')}
              </label>
              <div className="flex gap-1.5">
                {[25, 50, 100].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleQuickPercent(p)}
                    className="text-xs px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 transition-colors"
                  >
                    {p === 100 ? 'Tất cả' : `${p}%`}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <input
                type="number"
                min={10000}
                max={availableBalance}
                step={10000}
                value={amount}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : '';
                  setAmount(val);
                  setError(null);
                }}
                placeholder={tWallet('withdrawAmountPlaceholder')}
                className="w-full pl-3.5 pr-12 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-market-primary"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400">
                ₫
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-200 dark:border-red-900">
              {error}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
            >
              {tWallet('withdrawCancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading || !amount || Number(amount) < 10000}
              className="px-5 py-2 text-sm font-medium text-white bg-market-primary hover:bg-market-primary/90 disabled:opacity-50 rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              {isLoading && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
              {tWallet('withdrawConfirm')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
