export type WalletStatus = 'ACTIVE' | 'LOCKED';
export type WalletTransactionType = 'TOPUP' | 'PAYMENT' | 'REFUND';

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
