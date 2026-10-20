import React from "react";
import { EOrderStatus } from "../../../../features/order/enums/orderStatus.enum";

interface OrderStatusBadgeProps {
    status: EOrderStatus;
    isReturnFinished?: boolean;
    isReturnRejected?: boolean;
    className?: string;
}

const statusConfig: Record<EOrderStatus, { label: string; colorClass: string }> = {
    [EOrderStatus.PENDING]: { label: "Chờ xác nhận", colorClass: "bg-market-warning/10 text-market-warning border-market-warning/20" },
    [EOrderStatus.PREPARING]: { label: "Đang chuẩn bị", colorClass: "bg-market-info/10 text-market-info border-market-info/20" },
    [EOrderStatus.SHIPPING]: { label: "Đang giao", colorClass: "bg-market-primary/10 text-market-primary border-market-primary/20" },
    [EOrderStatus.DELIVERED]: { label: "Đã giao", colorClass: "bg-market-success/10 text-market-success border-market-success/20" },
    [EOrderStatus.SUCCESS]: { label: "Thành công", colorClass: "bg-market-success/10 text-market-success border-market-success/20" },
    [EOrderStatus.CANCELLED]: { label: "Đã hủy", colorClass: "bg-red-500/10 text-red-600 border-red-500/20" },
    [EOrderStatus.RETURNED]: { label: "Đang đổi trả", colorClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20" },
};

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
    status,
    isReturnFinished,
    isReturnRejected,
    className = "",
}) => {
    let config = statusConfig[status];

    if (!config) return null;

    if (status === EOrderStatus.RETURNED) {
        if (isReturnRejected) {
            config = {
                label: "Từ chối đổi trả",
                colorClass: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
            };
        } else if (isReturnFinished) {
            config = {
                label: "Đổi trả thành công",
                colorClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
            };
        }
    }

    return (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${config.colorClass} ${className}`}>
            {config.label}
        </span>
    );
};
