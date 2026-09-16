import { EPaymentStatus } from '../../../../features/order/enums/paymentStatus.enum';

export const PAYMENT_CONFIG: Record<string, { label: string; color: string }> = {
    [EPaymentStatus.PAID]: { label: 'Đã thanh toán', color: 'bg-[#DCFCE7] text-[#166534]' },
    [EPaymentStatus.PENDING]: { label: 'Chưa thanh toán', color: 'bg-[#FEE2E2] text-[#991B1B]' },
    [EPaymentStatus.FAILED]: { label: 'Thanh toán thất bại', color: 'bg-[#FFEDD5] text-[#C2410C]' },
};
