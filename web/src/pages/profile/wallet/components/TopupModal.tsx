import React, { useState } from 'react';
import { tWallet } from '../../../../features/wallet/constants/walletL10n';

interface TopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => Promise<void>;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveAmount >= 1000) {
      onConfirm(effectiveAmount);
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
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
                className="input-field w-full py-2.5 px-3 pr-10 text-sm font-mono text-text-ink placeholder:text-text-muted/60"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted">
                ₫
              </span>
            </div>
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
              disabled={isLoading || effectiveAmount < 1000}
              className="flex-1 btn-primary py-2.5 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>{tWallet('topupLoading')}</span>
              ) : (
                <span>{tWallet('topupConfirm')}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
