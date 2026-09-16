import { voucherRepository } from './voucher.repository';
import type { ClientVoucherResponseDto } from '../model/voucher.model';

export class VoucherService {
    async getValidVouchers(subTotal: number): Promise<ClientVoucherResponseDto[]> {
        try {
            const response = await voucherRepository.getValidVouchers(subTotal);
            if (response.success && response.data) {
                return response.data;
            }
            return [];
        } catch (error) {
            console.error('Lỗi lấy danh sách voucher hợp lệ:', error);
            return [];
        }
    }

    async lookupVoucher(code: string, subTotal: number): Promise<{ success: boolean; data?: ClientVoucherResponseDto; message?: string }> {
        try {
            const response = await voucherRepository.lookupVoucher(code, subTotal);
            if (response.success && response.data) {
                return { success: true, data: response.data };
            }
            return { success: false, message: response.message || 'Mã giảm giá không hợp lệ' };
        } catch (error: any) {
            console.error('Lỗi khi kiểm tra mã voucher:', error);
            return { success: false, message: error.response?.data?.message || 'Có lỗi xảy ra khi kiểm tra mã giảm giá' };
        }
    }
}

export const voucherService = new VoucherService();
