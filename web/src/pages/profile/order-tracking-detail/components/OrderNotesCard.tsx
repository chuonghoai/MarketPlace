import React from "react";
import type { OrderTrackingDetail } from "../../../../features/order/tracking/model/orderDetail.model";
import { EOrderStatus } from "../../../../features/order/enums/orderStatus.enum";

interface OrderNotesCardProps {
    order: OrderTrackingDetail;
}

export const OrderNotesCard: React.FC<OrderNotesCardProps> = ({ order }) => {
    const showCancelReason = (order.orderStatus === EOrderStatus.CANCELLED || order.orderStatus === EOrderStatus.RETURNED) && order.cancelReason;

    if (!showCancelReason) {
        return null;
    }

    return (
        <div className="bg-red-50 border border-red-100 rounded-xl p-5 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
                <h4 className="font-semibold text-red-800 mb-1">
                    Lý do {order.orderStatus === EOrderStatus.RETURNED ? "hoàn trả" : "hủy đơn"}
                </h4>
                <p className="text-red-600 text-sm">{order.cancelReason}</p>
            </div>
        </div>
    );
};
