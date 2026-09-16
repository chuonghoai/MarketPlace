import React from "react";
import type { OrderTrackingDetail } from "../../../../features/order/tracking/model/orderDetail.model";

interface OrderReviewSummaryProps {
    order: OrderTrackingDetail;
    canSubmit: boolean;
    isSubmitting: boolean;
    onSubmit: () => void;
}

export const OrderReviewSummary: React.FC<OrderReviewSummaryProps> = ({
    order,
    canSubmit,
    isSubmitting,
    onSubmit,
}) => {
    const totalItems = order.items.length;
    const totalAmount = order.items.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="bg-white border border-border-subtle rounded-xl shadow-sm p-6 sticky top-6">
            <h3 className="font-semibold text-stone-800 mb-4 font-['Lora',serif] border-b border-stone-100 pb-4">
                Thông tin đơn hàng
            </h3>

            <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-stone-500">Mã đơn:</span>
                    <span className="font-medium text-stone-800">{order.id}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-stone-500">Số sản phẩm:</span>
                    <span className="font-medium text-stone-800">{totalItems}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-stone-500">Tổng tiền:</span>
                    <span className="font-semibold text-market-primary">{totalAmount.toLocaleString("vi-VN")}đ</span>
                </div>
            </div>

            <button
                onClick={onSubmit}
                disabled={!canSubmit || isSubmitting}
                className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    canSubmit && !isSubmitting
                        ? "bg-market-primary text-white hover:bg-market-primary/90 shadow-sm hover:shadow"
                        : "bg-stone-100 text-stone-400 cursor-not-allowed"
                }`}
            >
                {isSubmitting ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Đang xử lý...</span>
                    </>
                ) : (
                    "Hoàn tất đánh giá"
                )}
            </button>

            {!canSubmit && (
                <p className="text-xs text-stone-400 text-center mt-3">
                    Vui lòng đánh giá ít nhất 1 sản phẩm
                </p>
            )}
        </div>
    );
};
