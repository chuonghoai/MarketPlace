import React from 'react';
import { EPaymentMethod } from '../../../features/order/enums/paymentMethod.enum';

interface OrderSummaryProps {
    subTotal: number;
    shippingFee: number;
    totalAmount: number;
    discountAmount?: number;
    shippingDiscountAmount?: number;
    appliedVouchers?: any[];
    selectedPaymentMethod: EPaymentMethod; // Đổi type sang enum
    onOpenPaymentModal: () => void;
    onOpenVoucherModal: () => void;
    onOrderSubmit: () => void;
    isCheckingOut?: boolean;
    onRemoveVoucher?: (code: string) => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
    subTotal,
    shippingFee,
    discountAmount,
    shippingDiscountAmount,
    appliedVouchers,
    totalAmount,
    selectedPaymentMethod,
    onOpenPaymentModal,
    onOpenVoucherModal,
    onOrderSubmit,
    isCheckingOut,
    onRemoveVoucher
}) => {
    const getPaymentMethodInfo = (method: EPaymentMethod) => {
        switch (method) {
            case EPaymentMethod.COD:
                return {
                    icon: <span className="material-symbols-outlined text-primary-container shrink-0 text-xl">local_shipping</span>,
                    text: "Thanh toán khi nhận hàng (COD)"
                };
            case EPaymentMethod.MOMO:
                return {
                    icon: <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square-1024x1024.png" alt="MoMo" className="w-5 h-5 object-contain rounded-sm shrink-0" />,
                    text: "Ví điện tử MoMo"
                };
            case EPaymentMethod.VNPAY:
                return {
                    icon: <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png" alt="VNPAY" className="w-5 h-5 object-contain rounded-sm shrink-0" />,
                    text: "Cổng thanh toán VNPAY"
                };
            case EPaymentMethod.PAYPAL:
                return {
                    icon: <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png" alt="PayPal" className="w-5 h-5 object-contain rounded-sm shrink-0" />,
                    text: "Ví điện tử PayPal"
                };
            default:
                return {
                    icon: <span className="material-symbols-outlined text-primary-container shrink-0 text-xl">payment</span>,
                    text: "Chưa chọn phương thức"
                };
        }
    };

    const paymentInfo = getPaymentMethodInfo(selectedPaymentMethod);

    return (
        <aside className="w-full lg:w-[380px] shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
                <h2 className="font-['Lora',serif] text-[24px] font-semibold text-[#1C1917] border-b border-[#E7E5E4] pb-3 hidden lg:block">Tóm tắt đơn hàng</h2>
                <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 shadow-sm space-y-5">
                    <div className="space-y-3 text-[15px] border-b border-[#E7E5E4] pb-5">
                        <div className="flex justify-between items-center text-[#57534E]">
                            <span>Tạm tính</span>
                            <span className="font-medium text-[#1C1917]">{subTotal.toLocaleString('vi-VN')} ₫</span>
                        </div>
                        <div className="flex justify-between items-center text-[#57534E]">
                            <span>Phí vận chuyển</span>
                            <span className="font-medium text-[#1C1917]">{shippingFee.toLocaleString('vi-VN')} ₫</span>
                        </div>
                        {(discountAmount ?? 0) > 0 && (
                            <div className="flex justify-between items-center text-[#16A34A]">
                                <span>Giảm giá sản phẩm</span>
                                <span className="font-medium">-{discountAmount!.toLocaleString('vi-VN')} ₫</span>
                            </div>
                        )}
                        {(shippingDiscountAmount ?? 0) > 0 && (
                            <div className="flex justify-between items-center text-[#16A34A]">
                                <span>Giảm phí vận chuyển</span>
                                <span className="font-medium">-{shippingDiscountAmount!.toLocaleString('vi-VN')} ₫</span>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-end pt-1">
                        <span className="text-[16px] font-semibold text-[#1C1917]">Tổng cộng</span>
                        <div className="text-right">
                            <span className="font-['Lora',serif] text-[24px] sm:text-[28px] text-market-primary font-bold leading-none">{totalAmount.toLocaleString('vi-VN')} ₫</span>
                            <p className="text-[13px] text-[#A8A29E] mt-1 font-medium italic">(Đã bao gồm VAT)</p>
                        </div>
                    </div>

                    {/* Voucher button: open modal choosing voucher */}
                    <div className="pt-2">
                        {appliedVouchers && appliedVouchers.length > 0 && (
                            <div className="mb-4 space-y-2">
                                <div className="font-caption text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Voucher đã áp dụng</div>
                                {appliedVouchers.map((v, i) => (
                                    <div key={i} className="flex flex-col bg-[#FFFBF5] border border-[#E7E5E4] rounded-lg p-3 relative">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[#C2410C] text-sm">local_activity</span>
                                                <span className="font-subhead text-sm text-[#C2410C] font-semibold">{v.voucherCode}</span>
                                            </div>
                                            {onRemoveVoucher && (
                                                <button 
                                                    type="button"
                                                    className="text-text-muted hover:text-[#DC2626] transition-colors"
                                                    onClick={() => onRemoveVoucher(v.voucherCode)}
                                                    title="Bỏ chọn voucher này"
                                                >
                                                    <span className="material-symbols-outlined text-sm">close</span>
                                                </button>
                                            )}
                                        </div>
                                        <div className="font-body-sm text-on-surface-variant flex justify-between">
                                            <span>{String(v.voucherType).includes('FREESHIP') ? 'Giảm phí vận chuyển' : 'Giảm giá sản phẩm'}</span>
                                            <span className="font-semibold text-[#DC2626]">-{v.discountValue.toLocaleString('vi-VN')}₫</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button
                            type="button"
                            className="w-full text-[14px] font-semibold text-market-primary border-[1.5px] border-market-primary bg-white hover:bg-market-background transition-colors py-2.5 rounded-[4px] flex justify-center items-center gap-2"
                            onClick={onOpenVoucherModal}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                            {appliedVouchers && appliedVouchers.length > 0 ? 'Thay đổi voucher' : 'Áp dụng voucher'}
                        </button>
                    </div>

                    {/* Payment method button: open modal choosing payment method */}
                    <div className="bg-[#FDF6EC] p-4 rounded-[8px] border border-[#FDBA74] flex justify-between items-center gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            {paymentInfo.icon}
                            <span className="text-[14px] font-medium text-[#1C1917] truncate" title={paymentInfo.text}>
                                {paymentInfo.text}
                            </span>
                        </div>
                        <button
                            type="button"
                            className="text-[13px] font-semibold text-market-primary hover:text-[#9A3412] hover:underline shrink-0 ml-1 whitespace-nowrap transition-colors"
                            onClick={onOpenPaymentModal}
                        >
                            Thay đổi
                        </button>
                    </div>

                    <div className="pt-4">
                        <button
                            disabled={isCheckingOut}
                            className="w-full bg-market-primary text-white py-3.5 rounded-[4px] font-semibold text-[16px] tracking-wide flex justify-center items-center gap-2 hover:bg-[#9A3412] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            onClick={onOrderSubmit}
                        >
                            {isCheckingOut ? (
                                <span className="animate-pulse">Đang xử lý...</span>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Đặt hàng
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-[13px] text-[#57534E] mt-4 font-medium">
                    <svg className="w-4 h-4 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Giao dịch an toàn & Đổi trả trong 30 ngày</span>
                </div>
            </div>
        </aside>
    );
};