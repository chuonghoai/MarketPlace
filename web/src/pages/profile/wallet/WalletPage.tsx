import React from 'react';
import { useWalletController } from './wallet.controller';
import { WalletHeroCard } from './components/WalletHeroCard';
import { WalletTransactionHistory } from './components/WalletTransactionHistory';
import { TopupModal } from './components/TopupModal';
import { tWallet } from '../../../features/wallet/constants/walletL10n';

export const WalletPage: React.FC = () => {
  const {
    wallet,
    transactions,
    total,
    page,
    loading,
    topupLoading,
    isTopupModalOpen,
    handleOpenTopup,
    handleCloseTopup,
    handleConfirmTopup,
    changePage,
  } = useWalletController();

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="font-['Lora',serif] text-2xl font-bold text-text-ink">
          {tWallet('title')}
        </h1>
        <p className="text-sm text-text-muted mt-1">
          {tWallet('subtitle')}
        </p>
      </div>

      {/* Hero Card */}
      <WalletHeroCard
        wallet={wallet}
        onOpenTopup={handleOpenTopup}
        isLoading={loading}
      />

      {/* Transactions History */}
      <WalletTransactionHistory
        transactions={transactions}
        total={total}
        page={page}
        onPageChange={changePage}
      />

      {/* Topup Modal */}
      <TopupModal
        isOpen={isTopupModalOpen}
        onClose={handleCloseTopup}
        onConfirm={handleConfirmTopup}
        isLoading={topupLoading}
      />
    </div>
  );
};

export default WalletPage;
