import React from "react";
import type { OrderDetailTrackingItem } from "../../../../features/order/tracking/model/orderDetail.model";

interface ProductReviewListProps {
    items: OrderDetailTrackingItem[];
    selectedItemId: string | null;
    onSelectItem: (orderItemId: string) => void;
}

export const ProductReviewList: React.FC<ProductReviewListProps> = ({
    items,
    selectedItemId,
    onSelectItem,
}) => {
    return (
        <div className="bg-white border border-border-subtle rounded-xl shadow-sm p-4 h-full">
            <h3 className="font-semibold text-stone-800 mb-4 font-['Lora',serif] border-b border-stone-100 pb-3">
                Sản phẩm
            </h3>
            <div className="flex flex-col gap-3">
                {items.map((item) => {
                    const isSelected = item.orderItemId === selectedItemId;
                    return (
                        <div
                            key={item.orderItemId}
                            onClick={() => onSelectItem(item.orderItemId)}
                            className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${
                                isSelected
                                    ? "bg-market-primary/5 border-market-primary"
                                    : "bg-transparent border-transparent hover:bg-stone-50"
                            }`}
                        >
                            <div className="w-16 h-16 rounded-md overflow-hidden border border-stone-100 bg-stone-50 shrink-0">
                                <img
                                    src={item.productImageUrl}
                                    alt={item.productName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-stone-800 font-medium text-sm line-clamp-2 leading-snug mb-1">
                                    {item.productName}
                                </h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-stone-500 text-xs">x{item.quantity}</span>
                                    {item.isReviewed && (
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                                            Đã đánh giá
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
