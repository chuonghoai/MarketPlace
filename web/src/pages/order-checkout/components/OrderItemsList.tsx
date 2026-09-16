import React from 'react';
import type { PrepareCheckoutModel } from '../../../features/order/checkout/models/checkout.model';

interface OrderItemsListProps {
    items: PrepareCheckoutModel['items'];
    invalidItems: PrepareCheckoutModel['invalidItems'];
    onRemove: (productId: string) => void;
}

export const OrderItemsList: React.FC<OrderItemsListProps> = ({
    items,
    invalidItems,
    onRemove
}) => {
    return (
        <section className="w-full space-y-6">
            <h2 className="font-['Lora',serif] text-[24px] font-semibold text-[#1C1917] border-b border-[#E7E5E4] pb-3">Giỏ hàng của bạn</h2>
            <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 shadow-sm space-y-6">
                {items.map((item, idx) => {
                    const invalidInfo = invalidItems?.find(invalid => invalid.productId === item.product.id);
                    const isInvalid = !!invalidInfo;

                    return (
                        <div
                            key={item.product.id}
                            className={`flex flex-row gap-4 sm:gap-5 pb-6 ${idx !== items.length - 1 ? 'border-b border-[#E7E5E4]' : ''}`}
                        >
                            {/* Product image */}
                            <div className={`w-[80px] sm:w-[120px] aspect-[4/5] shrink-0 bg-[#F5F5F4] rounded-[6px] overflow-hidden border border-[#E7E5E4] transition-opacity ${isInvalid ? 'opacity-50 grayscale' : ''}`}>
                                <img alt={item.product.name} className="w-full h-full object-cover" src={item.product.imageUrl} />
                            </div>

                            <div className="grow flex flex-col justify-between py-1">
                                <div>
                                    <h3 className={`font-['Lora',serif] text-[16px] sm:text-[18px] font-semibold leading-snug ${isInvalid ? 'line-through text-[#A8A29E]' : 'text-[#1C1917]'}`}>
                                        {item.product.name}
                                    </h3>

                                    {!isInvalid && (item.product.discountPercentage || 0) > 0 ? (
                                        <p className="text-[13px] font-medium text-market-primary mt-1">Giảm {item.product.discountPercentage}%</p>
                                    ) : !isInvalid && (item.product.discountPercentage || 0) === 0 && item.product.price < (item.product.originalPrice || 0) ? (
                                        <p className="text-[13px] font-medium text-market-primary mt-1">
                                            Giảm {((item.product.originalPrice || 0) - item.product.price).toLocaleString('vi-VN')} ₫
                                        </p>
                                    ) : null}
                                </div>

                                <div className="flex items-center justify-between sm:justify-end mt-3 sm:mt-0">
                                    <div className="text-left sm:text-right">
                                        {isInvalid ? (
                                            <p className="text-[13px] sm:text-[14px] font-semibold text-market-error">{invalidInfo.reason}</p>
                                        ) : (
                                            <>
                                                {(item.product.originalPrice || 0) > item.product.price && (
                                                    <p className="text-[12px] sm:text-[13px] text-[#A8A29E] line-through">{(item.product.originalPrice || 0).toLocaleString('vi-VN')} ₫</p>
                                                )}
                                                <p className="text-[14px] sm:text-[15px] font-semibold text-[#1C1917]">
                                                    {item.product.price.toLocaleString('vi-VN')} ₫ <span className="text-[#57534E] font-medium ml-1">x {item.quantity}</span>
                                                </p>
                                                <p className="text-[15px] sm:text-[16px] font-bold text-market-primary mt-0.5 sm:mt-1.5">
                                                    {(item.product.price * item.quantity).toLocaleString('vi-VN')} ₫
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Button remove items */}
                            {isInvalid && (
                                <div className="sm:shrink-0 flex items-start justify-end pt-2 sm:pt-0">
                                    <button
                                        type="button"
                                        aria-label="Remove item"
                                        className="transition-colors flex items-center gap-1 rounded-[4px] text-[13px] font-medium py-1.5 px-3 text-[#A8A29E] hover:text-market-error hover:bg-[#FEF2F2]"
                                        onClick={() => onRemove(item.product.id)}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span>Xóa</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};