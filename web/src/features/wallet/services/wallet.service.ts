import { apiClient } from "../../../core/api/apiClient";
import type { ApiResponse } from "../../../core/api/apiResponse";
import type {
  WalletInfo,
  WalletTransaction,
  WalletTransactionListResponse,
  WalletWithdrawal,
  CreateWithdrawalRequest,
  AdminWithdrawalsResponse,
} from "../models/wallet.model";

export class WalletService {
  async getMyWallet(): Promise<ApiResponse<WalletInfo>> {
    return apiClient.get<ApiResponse<WalletInfo>>("/wallets/me");
  }

  async topup(
    amount: number,
    paymentMethod: 'DIRECT' | 'VNPAY' | 'MOMO' | 'PAYPAL' = 'DIRECT',
  ): Promise<ApiResponse<{ success?: boolean; paymentRequired?: boolean; paymentUrl?: string; balance?: number; transaction?: WalletTransaction }>> {
    return apiClient.post("/wallets/topup", { amount, paymentMethod });
  }

  async verifyVnpayTopup(queryString: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/wallets/vnpay/verify${queryString ? `?${queryString}` : ''}`);
  }

  async verifyMomoTopup(queryString: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/wallets/momo/verify${queryString ? `?${queryString}` : ''}`);
  }

  async verifyPaypalTopup(queryString: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/wallets/paypal/verify${queryString ? `?${queryString}` : ''}`);
  }

  async getTransactions(page = 1, limit = 20): Promise<ApiResponse<WalletTransactionListResponse>> {
    return apiClient.get<ApiResponse<WalletTransactionListResponse>>(`/wallets/transactions?page=${page}&limit=${limit}`);
  }

  // Rút tiền (User)
  async createWithdrawal(data: CreateWithdrawalRequest): Promise<ApiResponse<any>> {
    return apiClient.post("/wallets/withdraw", data);
  }

  async getMyWithdrawals(): Promise<ApiResponse<WalletWithdrawal[]>> {
    return apiClient.get<ApiResponse<WalletWithdrawal[]>>("/wallets/withdrawals/me");
  }

  // Quản trị rút tiền
  async adminGetWithdrawals(page = 1, limit = 20, status?: string): Promise<ApiResponse<AdminWithdrawalsResponse>> {
    const query = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) query.append("status", status);
    return apiClient.get<ApiResponse<AdminWithdrawalsResponse>>(`/wallets/admin/withdrawals?${query.toString()}`);
  }

  async adminCompleteWithdrawal(id: string, billProofUrl: string, adminNote?: string): Promise<ApiResponse<WalletWithdrawal>> {
    return apiClient.patch<ApiResponse<WalletWithdrawal>>(`/wallets/admin/withdrawals/${id}/complete`, {
      billProofUrl,
      adminNote,
    });
  }

  async adminRejectWithdrawal(id: string, reason: string): Promise<ApiResponse<WalletWithdrawal>> {
    return apiClient.patch<ApiResponse<WalletWithdrawal>>(`/wallets/admin/withdrawals/${id}/reject`, { reason });
  }
}

export const walletService = new WalletService();
