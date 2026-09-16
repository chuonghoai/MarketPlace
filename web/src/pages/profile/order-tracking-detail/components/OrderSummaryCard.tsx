import React from "react";
import { Link } from "react-router-dom";
import type { OrderTrackingDetail } from "../../../../features/order/tracking/model/orderDetail.model";
import { EOrderStatus } from "../../../../features/order/enums/orderStatus.enum";

interface OrderSummaryCardProps {
    order: OrderTrackingDetail;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ order }) => {
    
    const getStatusConfig = (status: EOrderStatus) => {
        switch (status) {
            case EOrderStatus.PENDING:
                return { label: "Chờ xác nhận", color: "text-amber-600 bg-amber-50 border-amber-200" };
            case EOrderStatus.PREPARING:
                return { label: "Đang chuẩn bị", color: "text-blue-600 bg-blue-50 border-blue-200" };
            case EOrderStatus.SHIPPING:
                return { label: "Đang giao hàng", color: "text-indigo-600 bg-indigo-50 border-indigo-200" };
            case EOrderStatus.DELIVERED:
                return { label: "Đã giao hàng", color: "text-market-primary bg-market-primary/10 border-market-primary/20" };
            case EOrderStatus.SUCCESS:
                return { label: "Hoàn thành", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
            case EOrderStatus.CANCELLED:
                return { label: "Đã hủy", color: "text-red-600 bg-red-50 border-red-200" };
            case EOrderStatus.RETURNED:
                return { label: "Trả hàng/Hoàn tiền", color: "text-rose-600 bg-rose-50 border-rose-200" };
            default:
                return { label: "Chưa rõ", color: "text-stone-600 bg-stone-50 border-stone-200" };
        }
    };

    const statusConfig = getStatusConfig(order.orderStatus);

    return (
        <div className="bg-white border border-border-subtle rounded-2xl shadow-sm overflow-hidden p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                <div className="flex items-center gap-4">
                    <Link
                        to="/profile/order/tracking"
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors shrink-0"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div>
                        <h2 className="font-['Lora',serif] text-xl font-bold text-stone-900 flex items-center gap-2">
                            Mã đơn: <span className="text-market-primary uppercase">{order.id.split('-')[0]}</span>
                        </h2>
                        <p className="text-stone-500 text-sm mt-1">
                            Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                                hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric"
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-2">
                    <div className={`px-4 py-1.5 rounded-full border text-sm font-semibold uppercase tracking-wider ${statusConfig.color}`}>
                        {statusConfig.label}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-stone-500">Tổng tiền:</span>
                        <span className="font-bold text-lg text-market-primary">{order.totalAmount.toLocaleString("vi-VN")}đ</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
