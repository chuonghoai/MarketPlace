import { EOrderStatus } from '../../../../features/order/enums/orderStatus.enum';

export const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    [EOrderStatus.PENDING]: { label: 'Chờ xác nhận', color: 'bg-[#FEF3C7] text-[#92400E]' },
    [EOrderStatus.PREPARING]: { label: 'Đang chuẩn bị', color: 'bg-[#DBEAFE] text-[#1E40AF]' },
    [EOrderStatus.SHIPPING]: { label: 'Đang giao', color: 'bg-[#F3E8FF] text-[#6B21A8]' },
    [EOrderStatus.SUCCESS]: { label: 'Đã hoàn thành', color: 'bg-[#DCFCE7] text-[#166534]' },
    [EOrderStatus.CANCELLED]: { label: 'Bị hủy', color: 'bg-[#FEE2E2] text-[#991B1B]' },
};
