import React from "react";
import type { OrderTrackingDetail } from "../../../../features/order/tracking/model/orderDetail.model";
import { EOrderStatus } from "../../../../features/order/enums/orderStatus.enum";

interface ShippingInfoCardProps {
    order: OrderTrackingDetail;
    onCancelClick: () => void;
    onReturnClick: () => void;
}

export const ShippingInfoCard: React.FC<ShippingInfoCardProps> = ({ order, onCancelClick, onReturnClick }) => {
    const canCancel = order.orderStatus === EOrderStatus.PENDING;
    const canReturn = order.orderStatus === EOrderStatus.SUCCESS;

    return (
        <div className="flex flex-col gap-6">
            {/* Address block */}
            <div className="bg-white border border-border-subtle rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-stone-800 mb-4 font-['Lora',serif] border-b border-stone-100 pb-4">
                    Địa chỉ nhận hàng
                </h3>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-stone-800">{order.buyerName}</span>
                        <span className="text-stone-300">|</span>
                        <span className="text-stone-600">{order.buyerPhone}</span>
                    </div>
                    <p className="text-stone-500 text-sm leading-relaxed">
                        {order.buyerAddress}
                    </p>
                </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white border border-border-subtle rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-stone-800 mb-4 font-['Lora',serif] border-b border-stone-100 pb-4">
                    Thông tin thanh toán
                </h3>

                <div className="flex flex-col gap-3 text-sm text-stone-600 mb-4 border-b border-stone-100 pb-4">
                    <div className="flex justify-between">
                        <span>Phương thức:</span>
                        <span className="font-medium text-stone-800">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Trạng thái:</span>
                        <span className={`font-medium ${order.paymentStatus === 'PAID' ? 'text-market-success' : 'text-market-warning'}`}>
                            {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-3 text-sm">
                    <div className="flex justify-between text-stone-500">
                        <span>Tạm tính</span>
                        <span>{order.subTotal.toLocaleString("vi-VN")}đ</span>
                    </div>
                    <div className="flex justify-between text-stone-500">
                        <span>Phí vận chuyển</span>
                        <span>{order.shippingFee.toLocaleString("vi-VN")}đ</span>
                    </div>
                    {order.vouchers && order.vouchers.length > 0 ? (
                        <div className="flex flex-col gap-2 pt-2 pb-2 border-y border-stone-100 my-1">
                            <span className="font-semibold text-stone-700 mb-1">Voucher đã áp dụng:</span>
                            {order.vouchers.map((v, i) => {
                                const isFreeship = String(v.voucherSnapshot?.voucher_type || '').includes('FREESHIP');
                                const typeText = isFreeship ? 'Giảm phí vận chuyển' : 'Giảm giá sản phẩm';
                                return (
                                    <div key={i} className="flex flex-col bg-market-primary/5 rounded-lg p-2.5">
                                        <div className="flex justify-between items-center text-market-success text-sm">
                                            <div className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-sm">local_activity</span>
                                                <span className="font-semibold uppercase">{v.voucherCode}</span>
                                            </div>
                                            <span className="font-semibold">-{v.discountAmount.toLocaleString("vi-VN")}đ</span>
                                        </div>
                                        <div className="text-xs text-stone-500 pl-5 mt-0.5">
                                            {v.voucherSnapshot?.title || typeText}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <>
                            {order.discountAmount && order.discountAmount > 0 ? (
                                <div className="flex justify-between text-market-success">
                                    <span>Giảm giá</span>
                                    <span>-{order.discountAmount.toLocaleString("vi-VN")}đ</span>
                                </div>
                            ) : null}
                            {order.shippingDiscountAmount && order.shippingDiscountAmount > 0 ? (
                                <div className="flex justify-between text-market-success">
                                    <span>Giảm phí vận chuyển</span>
                                    <span>-{order.shippingDiscountAmount.toLocaleString("vi-VN")}đ</span>
                                </div>
                            ) : null}
                        </>
                    )}
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-stone-100">
                        <span className="font-semibold text-stone-800">Tổng cộng</span>
                        <span className="font-bold text-market-primary text-xl">
                            {order.totalAmount.toLocaleString("vi-VN")}đ
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                {(canCancel || canReturn) && (
                    <div className="mt-6 flex flex-col gap-3">
                        {canCancel && (
                            <button
                                onClick={onCancelClick}
                                className="w-full min-h-11 flex items-center justify-center font-medium text-white bg-market-error hover:bg-red-700 rounded-xl transition-colors shadow-sm"
                            >
                                Hủy đơn
                            </button>
                        )}
                        {canReturn && (
                            <button
                                onClick={onReturnClick}
                                className="w-full min-h-11 flex items-center justify-center font-medium text-white bg-market-warning hover:bg-amber-600 rounded-xl transition-colors shadow-sm"
                            >
                                Yêu cầu trả hàng
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
