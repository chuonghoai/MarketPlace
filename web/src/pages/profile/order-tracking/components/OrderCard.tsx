import React from "react";
import { Link } from "react-router-dom";
import { OrderStatusBadge } from "./OrderStatusBadge";
import type { OrderItemTracking } from "../../../../features/order/tracking/model/orderItem.model";
import { EOrderStatus } from "../../../../features/order/enums/orderStatus.enum";
import { EPaymentStatus } from "../../../../features/order/enums/paymentStatus.enum";
import { EPaymentMethod } from "../../../../features/order/enums/paymentMethod.enum";

interface OrderCardProps {
    order: OrderItemTracking;
    onCancel?: (orderId: string) => void;
    onReturn?: (orderId: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onCancel, onReturn }) => {
    const handleCancel = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onCancel) {
            onCancel(order.id);
        } else {
            console.log("Hủy đơn hàng:", order.id);
        }
    };

    const hasReturnHistory =
        order.orderStatus === EOrderStatus.RETURNED ||
        (Array.isArray(order.statusHistory) &&
            order.statusHistory.some(
                (h: any) =>
                    h.status === EOrderStatus.RETURNED ||
                    (h.note &&
                        (h.note.includes("yêu cầu Trả hàng") ||
                            h.note.includes("yêu cầu Đổi món") ||
                            h.note.includes("yêu cầu đổi trả")))
            ));

    const isWithin7Days = (() => {
        if (order.orderStatus !== EOrderStatus.SUCCESS || hasReturnHistory) return false;
        const successHistory = Array.isArray(order.statusHistory)
            ? order.statusHistory.slice().reverse().find((h: any) => h.status === EOrderStatus.SUCCESS)
            : undefined;
        const deliveredDate = successHistory ? new Date(successHistory.timestamp) : new Date(order.createdAt);
        const diffDays = (Date.now() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
    })();

    const handleReturn = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onReturn) {
            onReturn(order.id);
        } else {
            console.log("Yêu cầu trả hàng:", order.id);
        }
    };

    const isReturnRejected =
        (order as any).returnStatus === 'REJECTED' ||
        (Array.isArray(order.statusHistory) &&
            order.statusHistory.some(
                (h: any) => h.note && (h.note.includes('Từ chối') || h.note.includes('từ chối'))
            ));

    const isReturnFinished =
        !isReturnRejected &&
        ((order as any).returnStatus === 'COMPLETED' ||
            (Array.isArray(order.statusHistory) &&
                order.statusHistory.some(
                    (h: any) =>
                        h.note &&
                        (h.note.includes('Hoàn tiền') ||
                            h.note.includes('đổi hàng mới') ||
                            h.note.includes('Đã hoàn tất'))
                )));

    return (
        <div className="bg-white border border-border-subtle rounded-xl shadow-sm overflow-hidden flex flex-col hover:border-market-primary/30 transition-colors">
            {/* Header */}
            <div className="px-5 py-3 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                <div className="flex items-center gap-3">
                    <span className="font-semibold text-stone-800 text-sm">{order.id}</span>
                    <span className="text-stone-400 text-xs hidden sm:inline">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                </div>
                <OrderStatusBadge
                    status={order.orderStatus}
                    isReturnFinished={isReturnFinished}
                    isReturnRejected={isReturnRejected}
                />
            </div>

            {/* Body */}
            <div className="p-4 md:p-5 flex flex-col md:flex-row items-start gap-3 md:gap-4">
                {/* Product Info Section */}
                <div className="flex gap-3 md:gap-4 w-full md:w-auto md:flex-1">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-stone-100 bg-stone-50 shrink-0">
                        <img
                            src={order.firstProductImageUrl}
                            alt={order.firstProductName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center md:h-20">
                        <h3 className="text-stone-800 font-medium text-sm md:text-base line-clamp-2 md:line-clamp-1">
                            {order.firstProductName}
                        </h3>
                        {order.totalProductQuantity > 1 && (
                            <p className="text-sm text-stone-500 mt-1">
                                + {order.totalProductQuantity - 1} sản phẩm khác
                            </p>
                        )}
                        {/* Mobile Price */}
                        <div className="md:hidden mt-1.5">
                            <p className="text-market-primary font-bold text-[15px]">
                                {order.totalAmount.toLocaleString("vi-VN")}đ
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mobile Payment */}
                <div className="w-full md:hidden pt-3 border-t border-stone-100/60 mt-1">
                    <p className="text-xs text-stone-500">
                        {order.paymentMethod === EPaymentMethod.COD && order.paymentStatus === EPaymentStatus.PENDING ? "Thanh toán khi nhận hàng"
                            : order.paymentStatus === EPaymentStatus.PAID ? `Đã thanh toán qua ${order.paymentMethod}`
                                : order.paymentStatus === EPaymentStatus.FAILED ? "Thanh toán thất bại" : ""}
                    </p>
                </div>

                {/* Desktop Price & Payment */}
                <div className="hidden md:flex text-right shrink-0 flex-col justify-center h-20">
                    <p className="text-xs text-stone-500 mb-1">Tổng tiền</p>
                    <p className="text-market-primary font-bold text-lg">
                        {order.totalAmount.toLocaleString("vi-VN")}đ
                    </p>
                    <p className="text-xs text-stone-500 mt-4">
                        {order.paymentMethod === EPaymentMethod.COD && order.paymentStatus === EPaymentStatus.PENDING ? "Thanh toán khi nhận hàng"
                            : order.paymentStatus === EPaymentStatus.PAID ? `Đã thanh toán qua ${order.paymentMethod}`
                                : order.paymentStatus === EPaymentStatus.FAILED ? "Thanh toán thất bại" : ""}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="px-4 py-3 md:px-5 md:py-4 border-t border-stone-100 flex items-center justify-end gap-3 bg-stone-50/30">
                {(order.orderStatus === EOrderStatus.PENDING || order.orderStatus === EOrderStatus.PREPARING) && (
                    <button
                        onClick={handleCancel}
                        className="hidden md:block px-4 py-2 text-sm font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 hover:text-red-600 transition-colors"
                    >
                        Hủy đơn
                    </button>
                )}

                {order.orderStatus === EOrderStatus.SUCCESS && isWithin7Days && (
                    <button
                        data-testid="order-return-btn"
                        onClick={handleReturn}
                        className="hidden md:block px-4 py-2 text-sm font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 hover:text-red-600 transition-colors"
                    >
                        Yêu cầu trả hàng
                    </button>
                )}

                {(order.orderStatus === EOrderStatus.SUCCESS || order.orderStatus === EOrderStatus.DELIVERED) && (
                    <Link
                        to={`/profile/order/tracking/${order.id}/evaluate`}
                        className="flex-1 md:flex-initial px-4 py-2 text-sm font-medium text-market-primary bg-market-primary/10 border border-market-primary/20 rounded-lg hover:bg-market-primary/20 transition-colors text-center"
                    >
                        Đánh giá
                    </Link>
                )}

                <Link
                    to={`/profile/order/tracking/${order.id}`}
                    className={`${order.orderStatus === EOrderStatus.SUCCESS || order.orderStatus === EOrderStatus.DELIVERED ? "flex-1 md:flex-initial" : "w-full md:w-auto"} px-4 py-2 text-sm font-medium text-white bg-market-primary rounded-lg hover:bg-market-primary/90 transition-colors shadow-sm text-center`}
                >
                    Xem chi tiết
                </Link>
            </div>
        </div>
    );
};
