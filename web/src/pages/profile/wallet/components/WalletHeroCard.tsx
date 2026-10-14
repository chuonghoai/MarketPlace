import React from 'react';
import type { WalletInfo } from '../../../../features/wallet/models/wallet.model';
import { tWallet } from '../../../../features/wallet/constants/walletL10n';

interface WalletHeroCardProps {
  wallet: WalletInfo | null;
  onOpenTopup: () => void;
  onOpenWithdraw: () => void;
  isLoading?: boolean;
}

export const WalletHeroCard: React.FC<WalletHeroCardProps> = ({
  wallet,
  onOpenTopup,
  onOpenWithdraw,
  isLoading = false,
}) => {
  const isLocked = wallet?.status === 'LOCKED';
  const balance = wallet ? Number(wallet.balance) : 0;

  return (
    <div className="bg-surface-card border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        {/* Left: Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              {tWallet('balanceLabel')}
            </span>
            {wallet && (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  isLocked
                    ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900'
                    : 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 border border-green-200 dark:border-green-900'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isLocked ? 'bg-red-500' : 'bg-green-500'
                  }`}
                />
                {isLocked ? tWallet('statusLocked') : tWallet('statusActive')}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-['Lora',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-text-ink tracking-tight">
              {isLoading ? (
                <span className="inline-block w-40 h-10 bg-surface-container rounded-lg animate-pulse" />
              ) : (
                `${balance.toLocaleString('vi-VN')} ₫`
              )}
            </span>
          </div>

          {isLocked && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900 text-xs">
              <span className="material-symbols-outlined text-base">lock</span>
              <span>{tWallet('lockedWarning')}</span>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="shrink-0 flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenWithdraw}
            disabled={isLocked || isLoading}
            className="py-3 px-5 rounded-xl font-semibold text-sm flex items-center gap-2 border border-border-medium bg-surface-card hover:bg-surface-container text-text-ink transition-colors shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-lg text-emerald-600 dark:text-emerald-400">payments</span>
            <span>{tWallet('withdrawBtn')}</span>
          </button>
          <button
            type="button"
            onClick={onOpenTopup}
            disabled={isLocked || isLoading}
            className="btn-primary py-3 px-6 rounded-xl font-semibold text-sm flex items-center gap-2.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span>{tWallet('topupBtn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
