import React from 'react';
import { EPaymentMethod } from '../../../features/order/enums/paymentMethod.enum';

interface PaymentMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedPayment: EPaymentMethod;
    onSelectPayment: (paymentMethod: EPaymentMethod) => void;
}

export const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
    isOpen,
    onClose,
    selectedPayment,
    onSelectPayment: originalOnSelectPayment
}) => {

    const onSelectPayment = (method: EPaymentMethod) => {
        originalOnSelectPayment(method);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-text-ink/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-surface-card w-[90%] max-w-md rounded-lg shadow-xl card-border flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-4 border-b border-subtle">
                    <h3 className="font-subhead text-lg text-text-ink">Phương thức thanh toán</h3>
                    <button className="text-text-muted hover:text-text-ink transition-colors" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-4 space-y-3 overflow-y-auto">
                    <label className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-colors ${selectedPayment === EPaymentMethod.COD ? 'border-primary-container bg-surface-container-low' : 'border-border-medium hover:border-primary-container/50'}`}>
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-primary-container text-3xl">local_shipping</span>
                            <div>
                                <p className="font-body font-semibold text-text-ink">Thanh toán khi nhận hàng (COD)</p>
                                <p className="font-caption text-text-muted">Thanh toán bằng tiền mặt khi nhận hàng</p>
                            </div>
                        </div>
                        <input
                            type="radio"
                            name="payment"
                            checked={selectedPayment === EPaymentMethod.COD}
                            onChange={() => onSelectPayment(EPaymentMethod.COD)}
                            className="w-4 h-4 text-primary-container cursor-pointer"
                        />
                    </label>
                    <label className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-colors ${selectedPayment === EPaymentMethod.MOMO ? 'border-primary-container bg-surface-container-low' : 'border-border-medium hover:border-primary-container/50'}`}>
                        <div className="flex items-center gap-4">
                            <img
                                src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square-1024x1024.png"
                                alt="MoMo"
                                className="w-8 h-8 object-contain rounded-md"
                            />
                            <div>
                                <p className="font-body font-semibold text-text-ink">Ví điện tử MoMo</p>
                                <p className="font-caption text-text-muted">Quét mã QR qua ứng dụng MoMo</p>
                            </div>
                        </div>
                        <input
                            type="radio"
                            name="payment"
                            checked={selectedPayment === EPaymentMethod.MOMO}
                            onChange={() => onSelectPayment(EPaymentMethod.MOMO)}
                            className="w-4 h-4 text-primary-container cursor-pointer"
                        />
                    </label>
                    <label className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-colors ${selectedPayment === EPaymentMethod.VNPAY ? 'border-primary-container bg-surface-container-low' : 'border-border-medium hover:border-primary-container/50'}`}>
                        <div className="flex items-center gap-4">
                            <img
                                src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png"
                                alt="VNPAY"
                                className="w-8 h-8 object-contain rounded-md"
                            />
                            <div>
                                <p className="font-body font-semibold text-text-ink">Cổng thanh toán VNPAY</p>
                                <p className="font-caption text-text-muted">Thanh toán an toàn qua VNPAY</p>
                            </div>
                        </div>
                        <input
                            type="radio"
                            name="payment"
                            checked={selectedPayment === EPaymentMethod.VNPAY}
                            onChange={() => onSelectPayment(EPaymentMethod.VNPAY)}
                            className="w-4 h-4 text-primary-container cursor-pointer"
                        />
                    </label>
                    <label className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-colors ${selectedPayment === EPaymentMethod.PAYPAL ? 'border-primary-container bg-surface-container-low' : 'border-border-medium hover:border-primary-container/50'}`}>
                        <div className="flex items-center gap-4">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png"
                                alt="PayPal"
                                className="w-8 h-8 object-contain rounded-md"
                            />
                            <div>
                                <p className="font-body font-semibold text-text-ink">Ví điện tử PayPal</p>
                                <p className="font-caption text-text-muted">Thanh toán quốc tế qua PayPal</p>
                            </div>
                        </div>
                        <input
                            type="radio"
                            name="payment"
                            checked={selectedPayment === EPaymentMethod.PAYPAL}
                            onChange={() => onSelectPayment(EPaymentMethod.PAYPAL)}
                            className="w-4 h-4 text-primary-container cursor-pointer"
                        />
                    </label>
                </div>

                <div className="p-4 border-t border-subtle bg-surface-container flex justify-end gap-4">
                    <button className="w-full btn-primary py-2 font-body font-semibold" onClick={onClose}>Xác nhận</button>
                </div>
            </div>
        </div>
    );
};