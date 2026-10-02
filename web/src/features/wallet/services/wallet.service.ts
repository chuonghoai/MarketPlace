import { apiClient } from "../../../core/api/apiClient";
import type { ApiResponse } from "../../../core/api/apiResponse";
import type { WalletInfo, WalletTransaction, WalletTransactionListResponse } from "../models/wallet.model";

export class WalletService {
  async getMyWallet(): Promise<ApiResponse<WalletInfo>> {
    return apiClient.get<ApiResponse<WalletInfo>>("/wallets/me");
  }

  async topup(amount: number): Promise<ApiResponse<{ success: boolean; balance: number; transaction: WalletTransaction }>> {
    return apiClient.post<ApiResponse<{ success: boolean; balance: number; transaction: WalletTransaction }>>("/wallets/topup", { amount });
  }

  async getTransactions(page = 1, limit = 20): Promise<ApiResponse<WalletTransactionListResponse>> {
    return apiClient.get<ApiResponse<WalletTransactionListResponse>>(`/wallets/transactions?page=${page}&limit=${limit}`);
  }
}

export const walletService = new WalletService();
