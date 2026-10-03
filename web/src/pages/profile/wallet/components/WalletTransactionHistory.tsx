import React, { useState } from 'react';
import type { WalletTransaction, WalletWithdrawal } from '../../../../features/wallet/models/wallet.model';
import { tWallet } from '../../../../features/wallet/constants/walletL10n';

interface WalletTransactionHistoryProps {
  transactions: WalletTransaction[];
  withdrawals?: WalletWithdrawal[];
  total: number;
  page: number;
  onPageChange: (page: number) => void;
}

export const WalletTransactionHistory: React.FC<WalletTransactionHistoryProps> = ({
  transactions,
  withdrawals = [],
  total,
  page,
  onPageChange,
}) => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'withdrawals'>('transactions');
  const [withdrawalPage, setWithdrawalPage] = useState<number>(1);

  const txTotalPages = Math.ceil(total / 20) || 1;
  const WITHDRAWAL_PAGE_SIZE = 10;
  const withdrawalTotalPages = Math.ceil(withdrawals.length / WITHDRAWAL_PAGE_SIZE) || 1;
  const currentWithdrawals = withdrawals.slice(
    (withdrawalPage - 1) * WITHDRAWAL_PAGE_SIZE,
    withdrawalPage * WITHDRAWAL_PAGE_SIZE,
  );

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
      case 'WITHDRAWAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
            <span className="material-symbols-outlined text-sm">payments</span>
            {tWallet('typeWithdrawal')}
          </span>
        );
      case 'WITHDRAWAL_REFUND':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <span className="material-symbols-outlined text-sm">replay</span>
            {tWallet('typeWithdrawalRefund')}
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

  const getWithdrawalBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            {tWallet('statusCompleted')}
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800">
            <span className="material-symbols-outlined text-sm">cancel</span>
            {tWallet('statusRejected')}
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <span className="material-symbols-outlined text-sm">hourglass_top</span>
            {tWallet('statusPending')}
          </span>
        );
    }
  };

  return (
    <div className="bg-surface-card border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4">
      {/* Header with Tabs and Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border-subtle gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'transactions'
                ? 'bg-market-primary text-white shadow-xs'
                : 'text-text-muted hover:text-text-ink hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-base">receipt_long</span>
            <span>{tWallet('historyTitle')}</span>
            <span className="text-xs px-1.5 py-0.2 rounded-full bg-white/20 font-mono">
              {total}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('withdrawals')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'withdrawals'
                ? 'bg-market-primary text-white shadow-xs'
                : 'text-text-muted hover:text-text-ink hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-base">payments</span>
            <span>{tWallet('withdrawTab')}</span>
            <span className="text-xs px-1.5 py-0.2 rounded-full bg-white/20 font-mono">
              {withdrawals.length}
            </span>
          </button>
        </div>
      </div>

      {/* Tab Content: Transactions */}
      {activeTab === 'transactions' && (
        <>
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

          {/* Transactions Pagination Navigation */}
          {total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border-subtle">
              <span className="text-xs text-text-muted">
                {tWallet('pageShowing')} {Math.min((page - 1) * 20 + 1, total)} - {Math.min(page * 20, total)} {tWallet('pageOf')} {total} {tWallet('pageTransactions')}
              </span>
              {txTotalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                    className="px-2.5 py-1.5 rounded-lg border border-border-medium text-text-ink hover:bg-surface-container disabled:opacity-40 disabled:hover:bg-transparent text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                    <span className="hidden sm:inline">{tWallet('pagePrev')}</span>
                  </button>
                  {generatePageNumbers(page, txTotalPages).map((item, idx) => {
                    if (item === '...') {
                      return (
                        <span key={`tx-dots-${idx}`} className="w-8 h-8 flex items-center justify-center text-xs text-text-muted">
                          ...
                        </span>
                      );
                    }
                    const pNum = item as number;
                    const isActive = pNum === page;
                    return (
                      <button
                        key={pNum}
                        type="button"
                        onClick={() => onPageChange(pNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center ${
                          isActive
                            ? 'bg-market-primary text-white shadow-xs'
                            : 'text-text-ink hover:bg-surface-container border border-border-subtle'
                        }`}
                      >
                        {pNum}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    disabled={page >= txTotalPages}
                    onClick={() => onPageChange(page + 1)}
                    className="px-2.5 py-1.5 rounded-lg border border-border-medium text-text-ink hover:bg-surface-container disabled:opacity-40 disabled:hover:bg-transparent text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <span className="hidden sm:inline">{tWallet('pageNext')}</span>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Tab Content: Withdrawals */}
      {activeTab === 'withdrawals' && (
        <>
          {withdrawals.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <span className="material-symbols-outlined text-text-muted/40 text-5xl">
                payments
              </span>
              <p className="text-sm text-text-muted">{tWallet('withdrawalsEmpty')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border-subtle text-text-muted text-xs uppercase tracking-wider font-semibold">
                    <th className="py-3 px-3">{tWallet('colBankAndAccount')}</th>
                    <th className="py-3 px-3">{tWallet('colAccountHolder')}</th>
                    <th className="py-3 px-3">{tWallet('colAmount')}</th>
                    <th className="py-3 px-3">{tWallet('colStatus')}</th>
                    <th className="py-3 px-3">{tWallet('colBillOrNote')}</th>
                    <th className="py-3 px-3">{tWallet('colTime')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle font-normal">
                  {currentWithdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-surface-container/40 transition-colors">
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="font-semibold text-text-ink">{w.bankName}</div>
                        <div className="text-xs text-text-muted font-mono">{w.accountNumber}</div>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap font-medium text-text-ink uppercase">
                        {w.accountHolder}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap font-mono font-bold text-purple-600 dark:text-purple-400">
                        {Number(w.amount).toLocaleString('vi-VN')} ₫
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {getWithdrawalBadge(w.status)}
                      </td>
                      <td className="py-3.5 px-3 text-xs">
                        {w.billProofUrl ? (
                          <a
                            href={w.billProofUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span className="material-symbols-outlined text-sm">receipt</span>
                            {tWallet('viewInvoice')}
                          </a>
                        ) : w.adminNote ? (
                          <span className="text-text-muted italic">{w.adminNote}</span>
                        ) : (
                          <span className="text-text-muted">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap text-xs text-text-muted">
                        {new Date(w.createdAt).toLocaleString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Withdrawals Pagination Navigation */}
          {withdrawals.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border-subtle">
              <span className="text-xs text-text-muted">
                {tWallet('pageShowing')} {Math.min((withdrawalPage - 1) * WITHDRAWAL_PAGE_SIZE + 1, withdrawals.length)} - {Math.min(withdrawalPage * WITHDRAWAL_PAGE_SIZE, withdrawals.length)} {tWallet('pageOf')} {withdrawals.length} {tWallet('pageWithdrawals')}
              </span>
              {withdrawalTotalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={withdrawalPage <= 1}
                    onClick={() => setWithdrawalPage((p) => Math.max(1, p - 1))}
                    className="px-2.5 py-1.5 rounded-lg border border-border-medium text-text-ink hover:bg-surface-container disabled:opacity-40 disabled:hover:bg-transparent text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                    <span className="hidden sm:inline">{tWallet('pagePrev')}</span>
                  </button>
                  {generatePageNumbers(withdrawalPage, withdrawalTotalPages).map((item, idx) => {
                    if (item === '...') {
                      return (
                        <span key={`wd-dots-${idx}`} className="w-8 h-8 flex items-center justify-center text-xs text-text-muted">
                          ...
                        </span>
                      );
                    }
                    const pNum = item as number;
                    const isActive = pNum === withdrawalPage;
                    return (
                      <button
                        key={pNum}
                        type="button"
                        onClick={() => setWithdrawalPage(pNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center ${
                          isActive
                            ? 'bg-market-primary text-white shadow-xs'
                            : 'text-text-ink hover:bg-surface-container border border-border-subtle'
                        }`}
                      >
                        {pNum}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    disabled={withdrawalPage >= withdrawalTotalPages}
                    onClick={() => setWithdrawalPage((p) => Math.min(withdrawalTotalPages, p + 1))}
                    className="px-2.5 py-1.5 rounded-lg border border-border-medium text-text-ink hover:bg-surface-container disabled:opacity-40 disabled:hover:bg-transparent text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <span className="hidden sm:inline">{tWallet('pageNext')}</span>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const generatePageNumbers = (currentPage: number, totalPages: number): (number | string)[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, '...', totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};
