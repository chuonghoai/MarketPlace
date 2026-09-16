import React from "react";
import { useNavigate } from "react-router-dom";
import type { OrderTrackingDetail } from "../../../../features/order/tracking/model/orderDetail.model";
import { EOrderStatus } from "../../../../features/order/enums/orderStatus.enum";

interface OrderItemsSectionProps {
    order: OrderTrackingDetail;
}

export const OrderItemsSection: React.FC<OrderItemsSectionProps> = ({ order }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white border border-border-subtle rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-stone-800 mb-4 font-['Lora',serif] border-b border-stone-100 pb-4">
                Danh sách sản phẩm
            </h3>
            <div className="flex flex-col gap-4">
                {order.items.map((item) => (
                    <div key={item.orderItemId} className="flex flex-col sm:flex-row items-start gap-4 pb-4 border-b border-stone-50 last:border-0 last:pb-0">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-stone-100 bg-stone-50 shrink-0">
                            <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col items-start w-full">
                            <h4 className="text-stone-800 font-medium text-base mb-1">{item.productName}</h4>
                            <div className="flex items-center gap-3 text-sm mb-2">
                                <span className="text-stone-500">Số lượng: x{item.quantity}</span>
                            </div>
                        </div>
                        <div className="text-right shrink-0 w-full sm:w-auto mt-2 sm:mt-0 flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end">
                            <div>
                                <div className="text-market-primary font-semibold text-base sm:mb-1">
                                    {item.price.toLocaleString("vi-VN")}đ
                                </div>
                                {item.originalPrice > item.price && (
                                    <div className="text-stone-400 text-xs line-through">
                                        {item.originalPrice.toLocaleString("vi-VN")}đ
                                    </div>
                                )}
                            </div>

                            {order.orderStatus === EOrderStatus.SUCCESS && (
                                <div className="sm:mt-auto sm:pt-5">
                                    <button
                                        onClick={() => {
                                            navigate(`/profile/order/tracking/${order.id}/evaluate`, {
                                                state: { order: order, focusItemId: item.orderItemId }
                                            });
                                        }}
                                        className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors border ${item.isReviewed
                                            ? "text-stone-600 bg-white border-stone-200 hover:bg-stone-50"
                                            : "text-market-primary bg-market-primary/10 border-transparent hover:bg-market-primary/20"
                                            }`}
                                    >
                                        {item.isReviewed ? "Xem đánh giá" : "Đánh giá"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
