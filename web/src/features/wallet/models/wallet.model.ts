export type WalletStatus = 'ACTIVE' | 'LOCKED';
export type WalletTransactionType = 'TOPUP' | 'PAYMENT' | 'REFUND' | 'WITHDRAWAL' | 'WITHDRAWAL_REFUND';
export type WalletWithdrawalStatus = 'PENDING' | 'COMPLETED' | 'REJECTED';

export interface WalletInfo {
  id: string;
  balance: number;
  status: WalletStatus;
  isUsable: boolean;
}

export interface WalletTransaction {
  id: string;
  orderId?: string | null;
  amount: number;
  type: WalletTransactionType;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}

export interface WalletTransactionListResponse {
  items: WalletTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface WalletWithdrawal {
  id: string;
  walletId: string;
  userId: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  status: WalletWithdrawalStatus;
  billProofUrl?: string | null;
  adminNote?: string | null;
  processedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  wallet?: {
    balance: number;
  };
}

export interface CreateWithdrawalRequest {
  amount: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface AdminWithdrawalsResponse {
  items: WalletWithdrawal[];
  total: number;
  totalPendingAmount: number;
  page: number;
  limit: number;
  totalPages: number;
}
