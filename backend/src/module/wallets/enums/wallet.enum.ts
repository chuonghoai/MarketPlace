export enum EWalletStatus {
  ACTIVE = 'ACTIVE',
  LOCKED = 'LOCKED',
}

export enum EWalletTransactionType {
  TOPUP = 'TOPUP',
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
  WITHDRAWAL = 'WITHDRAWAL',
  WITHDRAWAL_REFUND = 'WITHDRAWAL_REFUND',
}

export enum EWalletWithdrawalStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}
