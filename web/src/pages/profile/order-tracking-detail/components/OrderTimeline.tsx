import React from "react";
import type { OrderTrackingStatusHistory } from "../../../../features/order/tracking/model/orderDetail.model";
import { EOrderStatus } from "../../../../features/order/enums/orderStatus.enum";

interface OrderTimelineProps {
    history: OrderTrackingStatusHistory[];
}

const getStatusLabel = (status: EOrderStatus): string => {
    switch (status) {
        case EOrderStatus.PENDING: return "Đặt hàng thành công";
        case EOrderStatus.PREPARING: return "Shop đang chuẩn bị hàng";
        case EOrderStatus.SHIPPING: return "Đang giao hàng";
        case EOrderStatus.DELIVERED: return "Đã giao hàng";
        case EOrderStatus.SUCCESS: return "Hoàn tất đơn hàng";
        case EOrderStatus.CANCELLED: return "Đã hủy đơn";
        case EOrderStatus.RETURNED: return "Yêu cầu hoàn trả";
        default: return "Cập nhật";
    }
};

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ history }) => {
    if (!history || history.length === 0) return null;
    const sortedHistory = [...history].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div className="bg-white border border-border-subtle rounded-xl shadow-sm p-6 mb-6">
            <h3 className="font-semibold text-stone-800 mb-6 font-['Lora',serif]">
                Lịch sử trạng thái
            </h3>
            <div className="relative pl-3 sm:pl-4">
                {sortedHistory.map((item, index) => {
                    const isLatest = index === 0;
                    const isLast = index === sortedHistory.length - 1;

                    return (
                        <div key={index} className={`relative flex gap-4 ${isLast ? "" : "pb-8"}`}>
                            {!isLast && (
                                <div className="absolute left-1.5 sm:left-2 top-6 bottom-0 w-0.5 -translate-x-1/2 bg-stone-100" />
                            )}

                            <div className="relative shrink-0 flex items-center justify-center mt-1 z-10">
                                <div
                                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 bg-white ${
                                        isLatest
                                            ? "border-market-primary scale-125 shadow-[0_0_0_4px_rgba(194,65,12,0.1)]"
                                            : "border-stone-300"
                                    }`}
                                />
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                                    <h4
                                        className={`font-medium ${
                                            isLatest ? "text-market-primary text-base" : "text-stone-600 text-sm"
                                        }`}
                                    >
                                        {getStatusLabel(item.status)}
                                    </h4>
                                    <span className={`text-xs ${isLatest ? "text-stone-500" : "text-stone-400"}`}>
                                        {new Date(item.timestamp).toLocaleString("vi-VN", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric"
                                        })}
                                    </span>
                                </div>
                                {item.note && (
                                    <p className={`mt-1.5 text-sm ${isLatest ? "text-stone-600" : "text-stone-500"}`}>
                                        {item.note}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
