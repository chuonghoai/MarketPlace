import React from 'react';
import { Link } from 'react-router-dom';
import { useCheckoutResultController } from './checkoutResult.controller';
import { EPaymentMethod } from '../../features/order/enums/paymentMethod.enum';
import { EPaymentStatus } from '../../features/order/enums/paymentStatus.enum';

const CheckoutResultPage: React.FC = () => {
    const { result, isLoading, error } = useCheckoutResultController();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
                    <p className="font-body text-text-muted animate-pulse">Đang tải thông tin đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (error || !result) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="max-w-md w-full bg-surface-card card-border rounded-xl p-8 text-center shadow-lg">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-red-500 text-4xl">error</span>
                    </div>
                    <h1 className="font-headline text-2xl text-text-ink mb-2">Đã xảy ra lỗi!</h1>
                    <p className="font-body text-text-muted">{error}</p>
                    <Link to="/" className="mt-6 w-full block btn-primary py-2.5 font-body font-semibold">
                        Quay về trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    let title = "Đơn hàng đang xử lý";
    let message = "Cảm ơn đã đặt hàng.";
    let subMessage = "Đơn hàng của bạn đang được hệ thống ghi nhận";
    let iconName = "hourglass_empty";
    let iconColorClass = "text-yellow-600";
    let bgIconClass = "bg-yellow-100";
    let animationClass = "animate-pulse";

    if (result.status.paymentStatus === EPaymentStatus.PAID) {
        title = "Thanh toán thành công!";
        message = "Giao dịch thanh toán đã hoàn tất.";
        subMessage = "Đơn hàng của bạn sẽ sớm được xử lý và giao đến bạn.";
        iconName = "check_circle";
        iconColorClass = "text-green-500";
        bgIconClass = "bg-green-100";
        animationClass = "animate-[pulse_1.5s_ease-in-out_infinite]";
    } else if (result.status.paymentMethod === EPaymentMethod.COD && result.status.paymentStatus === EPaymentStatus.PENDING) {
        title = "Đặt hàng thành công!";
        message = "Đơn hàng đã được đặt.";
        subMessage = "Bạn sẽ thanh toán bằng tiền mặt khi nhận được hàng.";
        iconName = "local_shipping";
        iconColorClass = "text-blue-500";
        bgIconClass = "bg-blue-100";
        animationClass = "animate-bounce";
    } else if (result.status.paymentStatus === EPaymentStatus.FAILED) {
        title = "Thanh toán thất bại";
        message = "Đã có lỗi xảy ra hoặc giao dịch bị từ chối.";
        subMessage = "Vui lòng kiểm tra lại phương thức thanh toán hoặc thử lại sau.";
        iconName = "error";
        iconColorClass = "text-red-500";
        bgIconClass = "bg-red-100";
        animationClass = "";
    }

    return (
        <>
            <style>
                {`
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(40px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .animate-fade-in-up {
                        animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    }
                `}
            </style>

            <div className="flex-1 min-h-[45vh] py-12 flex items-center justify-center">
                <div className="max-w-md w-full bg-surface-card card-border rounded-xl p-8 text-center shadow-lg space-y-6 hover:shadow-xl transition-shadow duration-300 animate-fade-in-up">

                    <div className={`w-24 h-24 mx-auto rounded-full ${bgIconClass} flex items-center justify-center shadow-inner transition-transform duration-300 hover:scale-110`}>
                        <span
                            className={`material-symbols-outlined ${iconColorClass} ${animationClass}`}
                            style={{ fontSize: '48px' }}
                        >
                            {iconName}
                        </span>
                    </div>

                    <div>
                        <h1 className="font-headline text-2xl text-text-ink mb-2">{title}</h1>
                        <p>
                            <span className="font-body text-text-muted leading-relaxed">
                                {message}
                            </span> <br />
                            <span className="font-body text-text-muted leading-relaxed">
                                {subMessage}
                            </span>
                        </p>
                    </div>

                    <div className="pt-4 space-y-3">
                        <Link
                            to="/"
                            className="w-full block btn-primary py-2.5 font-body font-semibold transition-transform hover:-translate-y-0.5"
                        >
                            Quay về trang chủ
                        </Link>
                        <Link
                            to="/profile/order/tracking"
                            className="w-full block btn-secondary py-2.5 font-body transition-transform hover:-translate-y-0.5 bg-surface-container-low hover:bg-surface-container"
                        >
                            Đơn hàng đã mua
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CheckoutResultPage;