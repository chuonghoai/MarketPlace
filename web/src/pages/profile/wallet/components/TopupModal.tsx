import React, { useState } from 'react';
import { tWallet } from '../../../../features/wallet/constants/walletL10n';

interface TopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number, method: 'DIRECT' | 'VNPAY' | 'MOMO' | 'PAYPAL') => Promise<void>;
  isLoading?: boolean;
}

const QUICK_AMOUNTS = [50000, 100000, 200000, 500000, 1000000];

export const TopupModal: React.FC<TopupModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'DIRECT' | 'VNPAY' | 'MOMO' | 'PAYPAL'>('MOMO');

  if (!isOpen) return null;

  const handleQuickSelect = (amt: number) => {
    setSelectedAmount(amt);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setCustomAmount(raw);
    if (raw) {
      setSelectedAmount(Number(raw));
    }
  };

  const effectiveAmount = customAmount ? Number(customAmount) : selectedAmount;
  const isCustomUnderMin = Boolean(customAmount && Number(customAmount) < 10000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveAmount >= 10000) {
      onConfirm(effectiveAmount, paymentMethod);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-text-ink/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal dialog */}
      <div className="relative bg-surface-card w-full max-w-md rounded-2xl shadow-xl border border-border-subtle p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary-container text-2xl">
              account_balance_wallet
            </span>
            <h3 className="font-subhead text-lg font-bold text-text-ink">
              {tWallet('topupModalTitle')}
            </h3>
          </div>
          <button
            type="button"
            className="text-text-muted hover:text-text-ink p-1 rounded-lg transition-colors"
            onClick={onClose}
            disabled={isLoading}
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              {tWallet('topupMethod')}
            </label>
            <div className="space-y-2.5">
              <label
                className={`flex items-center justify-between p-3 border-2 rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'MOMO'
                    ? 'border-primary-container bg-surface-container shadow-xs'
                    : 'border-border-subtle hover:border-primary-container/50 hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square-1024x1024.png"
                    alt="MoMo"
                    className="w-8 h-8 object-contain rounded-md shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-xs text-text-ink">{tWallet('topupMomo')}</p>
                    <p className="text-[11px] text-text-muted">{tWallet('topupMomoDesc')}</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="topupMethod"
                  value="MOMO"
                  checked={paymentMethod === 'MOMO'}
                  onChange={() => setPaymentMethod('MOMO')}
                  className="w-4 h-4 text-primary-container cursor-pointer"
                />
              </label>

              <label
                className={`flex items-center justify-between p-3 border-2 rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'VNPAY'
                    ? 'border-primary-container bg-surface-container shadow-xs'
                    : 'border-border-subtle hover:border-primary-container/50 hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png"
                    alt="VNPAY"
                    className="w-8 h-8 object-contain rounded-md shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-xs text-text-ink">{tWallet('topupVnpay')}</p>
                    <p className="text-[11px] text-text-muted">{tWallet('topupVnpayDesc')}</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="topupMethod"
                  value="VNPAY"
                  checked={paymentMethod === 'VNPAY'}
                  onChange={() => setPaymentMethod('VNPAY')}
                  className="w-4 h-4 text-primary-container cursor-pointer"
                />
              </label>

              <label
                className={`flex items-center justify-between p-3 border-2 rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'PAYPAL'
                    ? 'border-primary-container bg-surface-container shadow-xs'
                    : 'border-border-subtle hover:border-primary-container/50 hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png"
                    alt="PayPal"
                    className="w-8 h-8 object-contain rounded-md shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-xs text-text-ink">{tWallet('topupPaypal')}</p>
                    <p className="text-[11px] text-text-muted">{tWallet('topupPaypalDesc')}</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="topupMethod"
                  value="PAYPAL"
                  checked={paymentMethod === 'PAYPAL'}
                  onChange={() => setPaymentMethod('PAYPAL')}
                  className="w-4 h-4 text-primary-container cursor-pointer"
                />
              </label>

              <label
                className={`flex items-center justify-between p-3 border-2 rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'DIRECT'
                    ? 'border-primary-container bg-surface-container shadow-xs'
                    : 'border-border-subtle hover:border-primary-container/50 hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl">bolt</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-xs text-text-ink">{tWallet('topupDirect')}</p>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                        Test
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted">{tWallet('topupDirectDesc')}</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="topupMethod"
                  value="DIRECT"
                  checked={paymentMethod === 'DIRECT'}
                  onChange={() => setPaymentMethod('DIRECT')}
                  className="w-4 h-4 text-primary-container cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Quick Amounts */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2.5">
              {tWallet('topupQuickAmounts')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_AMOUNTS.map((amt) => {
                const isSelected = !customAmount && selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleQuickSelect(amt)}
                    className={`py-2 px-3 rounded-lg text-sm font-semibold border transition-all text-center ${
                      isSelected
                        ? 'border-primary-container bg-surface-container text-primary-container shadow-xs'
                        : 'border-border-subtle text-text-ink hover:border-primary-container/40 hover:bg-surface-container'
                    }`}
                  >
                    {amt.toLocaleString('vi-VN')} ₫
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              {tWallet('topupCustomAmount')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={customAmount ? Number(customAmount).toLocaleString('vi-VN') : ''}
                onChange={handleCustomChange}
                placeholder={tWallet('topupPlaceholder')}
                className={`input-field w-full py-2.5 px-3 pr-10 text-sm font-mono text-text-ink placeholder:text-text-muted/60 transition-colors ${
                  isCustomUnderMin ? 'border-amber-500 focus:ring-2 focus:ring-amber-400' : ''
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted">
                ₫
              </span>
            </div>
            {isCustomUnderMin && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5 flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-sm">info</span>
                <span>{tWallet('topupMinError')}</span>
              </p>
            )}
          </div>

          {/* Total Display */}
          <div className="bg-surface-container p-4 rounded-xl border border-border-subtle flex justify-between items-center">
            <span className="text-sm font-medium text-text-muted">Tổng tiền nạp:</span>
            <span className="text-lg font-bold text-primary-container font-mono">
              {effectiveAmount.toLocaleString('vi-VN')} ₫
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              className="flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm border border-border-medium text-text-ink hover:bg-surface-container transition-colors"
              onClick={onClose}
              disabled={isLoading}
            >
              {tWallet('topupCancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading || effectiveAmount < 10000}
              className="flex-1 btn-primary py-2.5 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span>{tWallet('topupLoading')}</span>
              ) : (
                <span>
                  {paymentMethod === 'MOMO' && 'Thanh toán qua MoMo'}
                  {paymentMethod === 'VNPAY' && 'Thanh toán qua VNPAY'}
                  {paymentMethod === 'PAYPAL' && 'Thanh toán qua PayPal'}
                  {paymentMethod === 'DIRECT' && 'Nạp tiền ngay (Thử nghiệm)'}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
