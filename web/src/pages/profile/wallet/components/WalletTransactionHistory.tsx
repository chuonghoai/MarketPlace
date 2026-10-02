import React from 'react';
import type { WalletTransaction } from '../../../../features/wallet/models/wallet.model';
import { tWallet } from '../../../../features/wallet/constants/walletL10n';

interface WalletTransactionHistoryProps {
  transactions: WalletTransaction[];
  total: number;
  page: number;
  onPageChange: (page: number) => void;
}

export const WalletTransactionHistory: React.FC<WalletTransactionHistoryProps> = ({
  transactions,
  total,
  page,
  onPageChange,
}) => {
  const getBadge = (type: string) => {
    switch (type) {
      case 'TOPUP':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="material-symbols-outlined text-sm">arrow_downward</span>
            {tWallet('typeTopup')}
          </span>
        );
      case 'REFUND':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <span className="material-symbols-outlined text-sm">replay</span>
            {tWallet('typeRefund')}
          </span>
        );
      case 'PAYMENT':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
            <span className="material-symbols-outlined text-sm">arrow_upward</span>
            {tWallet('typePayment')}
          </span>
        );
    }
  };

  const totalPages = Math.ceil(total / 20) || 1;

  return (
    <div className="bg-surface-card border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-text-muted text-xl">receipt_long</span>
          <h3 className="font-subhead text-base font-bold text-text-ink">
            {tWallet('historyTitle')}
          </h3>
        </div>
        <span className="text-xs text-text-muted font-medium">
          {total} giao dịch
        </span>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12 space-y-2">
          <span className="material-symbols-outlined text-text-muted/40 text-5xl">
            wallet
          </span>
          <p className="text-sm text-text-muted">{tWallet('historyEmpty')}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-text-muted text-xs uppercase tracking-wider font-semibold">
                <th className="py-3 px-3">{tWallet('colType')}</th>
                <th className="py-3 px-3">{tWallet('colAmount')}</th>
                <th className="py-3 px-3">{tWallet('colBalanceAfter')}</th>
                <th className="py-3 px-3">{tWallet('colDescription')}</th>
                <th className="py-3 px-3">{tWallet('colTime')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle font-normal">
              {transactions.map((tx) => {
                const isPositive = Number(tx.amount) > 0;
                return (
                  <tr key={tx.id} className="hover:bg-surface-container/40 transition-colors">
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {getBadge(tx.type)}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap font-mono font-semibold">
                      <span className={isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}>
                        {isPositive ? '+' : ''}
                        {Number(tx.amount).toLocaleString('vi-VN')} ₫
                      </span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap font-mono text-text-ink">
                      {Number(tx.balanceAfter).toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="py-3.5 px-3 text-text-ink max-w-[260px] truncate" title={tx.description}>
                      {tx.description || '-'}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap text-xs text-text-muted">
                      {new Date(tx.createdAt).toLocaleString('vi-VN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="p-1.5 rounded-lg border border-border-medium text-text-ink hover:bg-surface-container disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-base">chevron_left</span>
          </button>
          <span className="px-3 py-1.5 text-xs text-text-muted font-medium flex items-center">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="p-1.5 rounded-lg border border-border-medium text-text-ink hover:bg-surface-container disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
};
