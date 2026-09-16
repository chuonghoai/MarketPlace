import { useCheckoutController } from './checkout.controller';
import { OrderItemsList } from './components/OrderItemsList';
import { OrderSummary } from './components/OrderSummary';
import { VoucherModal } from './Modal/VoucherModal';
import { PaymentMethodModal } from './Modal/PaymentMethodModal';
import { AddressModal } from './Modal/AddressModal';
import { AddNewAddressModal } from './Modal/AddNewAddress/AddNewAddressModal';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import type { PrepareCheckoutRequest } from '../../features/order/checkout/dto/prepareCheckout.dto';
import { ShippingForm } from './components/ShippingForm/ShippingForm';

function CheckoutPage() {
    const location = useLocation();
    const routerNavigate = useNavigate();
    const checkoutItems = location.state?.checkoutItems as PrepareCheckoutRequest[] | undefined;

    const searchParams = new URLSearchParams(location.search);
    const tempId = searchParams.get('temp');

    const {
        data,
        loading,
        error,

        isCheckingOut,

        isVoucherModalOpen,
        setIsVoucherModalOpen,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        isAddressModalOpen,
        setIsAddressModalOpen,
        isAddNewAddressModalOpen,
        setIsAddNewAddressModalOpen,
        selectedPaymentMethod,
        setSelectedPaymentMethod,

        voucherCodes,
        handleApplyVouchers,
        handleSelectAddress,
        handleRemoveItem,
        handleRetry,
        handleOrderSubmit
    } = useCheckoutController({ initialRequest: checkoutItems, tempId });

    if ((!checkoutItems || checkoutItems.length === 0) && !tempId) {
        return <Navigate to="/cart" replace />;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <p className="font-body text-text-muted animate-pulse">Đang tải thông tin đơn hàng...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
                <p className="font-body text-error font-semibold text-lg">{error}</p>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleRetry}
                        className="px-6 py-2 bg-primary text-white rounded-lg font-body hover:bg-primary-dark transition-colors"
                    >
                        Thử lại
                    </button>
                    <button
                        onClick={() => routerNavigate('/cart')}
                        className="px-6 py-2 border border-border-medium rounded-lg font-body text-text-ink hover:bg-surface transition-colors"
                    >
                        Quay về giỏ hàng
                    </button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-[#FFFBF5] font-['Open_Sans',sans-serif] flex flex-col">
            <header className="w-full bg-white border-b border-border-subtle h-18 items-center px-4 md:px-8 hidden md:block">
                <div className="max-w-7xl w-full mx-auto flex justify-between items-center">
                    <div className="font-['Lora',serif] text-[20px] sm:text-[24px] font-bold text-text-ink flex items-center gap-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-market-secondary flex items-center justify-center text-white text-[12px] sm:text-[14px] italic shadow-none">MN</div>
                        <span className="hidden sm:inline">MarketNest</span>
                        <span className="text-[#A8A29E] font-normal text-[18px] sm:text-[20px] ml-2">| Thanh toán an toàn</span>
                    </div>
                    <div className="text-[14px] text-[#57534E] flex items-center gap-2 font-medium">
                        <svg className="w-5 h-5 text-market-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="hidden sm:inline">Giao dịch được mã hóa</span>
                    </div>
                </div>
            </header>

            <main className="grow w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="w-full">
                    <div className="flex flex-col lg:flex-row gap-8">

                        <div className="w-full lg:w-2/3 space-y-8">
                            {/* Component: Shipping info */}
                            <ShippingForm
                                address={data.address}
                                onOpenAddressModal={() => setIsAddressModalOpen(true)}
                                onOpenAddNewAddressModal={() => setIsAddNewAddressModalOpen(true)}
                            />

                            {/* Component: Order item list */}
                            <OrderItemsList
                                items={data.items}
                                invalidItems={data.invalidItems}
                                onRemove={handleRemoveItem}
                            />
                        </div>

                        {/* Component: Order summary */}
                        <OrderSummary
                            subTotal={data.subTotal}
                            shippingFee={data.shippingFee}
                            discountAmount={data.discountAmount}
                            shippingDiscountAmount={data.shippingDiscountAmount}
                            appliedVouchers={data.appliedVouchers}
                            totalAmount={data.totalAmount}
                            selectedPaymentMethod={selectedPaymentMethod}
                            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
                            onOpenVoucherModal={() => setIsVoucherModalOpen(true)}
                            onOrderSubmit={handleOrderSubmit}
                            isCheckingOut={isCheckingOut}
                            onRemoveVoucher={(code) => handleApplyVouchers(voucherCodes.filter(c => c !== code))}
                        />
                    </div>
                </div>
            </main>

            <footer className="w-full border-t border-[#E7E5E4] py-8 px-6 mt-auto text-center bg-market-background">
                <p className="text-[14px] text-[#A8A29E] font-medium">© 2026 MarketNest. Tôn vinh nghệ thuật thủ công.</p>
            </footer>

            {/* Modal: Choosing voucher */}
            <VoucherModal
                isOpen={isVoucherModalOpen}
                onClose={() => setIsVoucherModalOpen(false)}
                subTotal={data.subTotal}
                selectedVouchers={voucherCodes}
                onApplyVouchers={(codes) => {
                    handleApplyVouchers(codes);
                    setIsVoucherModalOpen(false);
                }}
            />

            {/* Modal: Payment method */}
            <PaymentMethodModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                selectedPayment={selectedPaymentMethod}
                onSelectPayment={setSelectedPaymentMethod}
            />

            {/* Modal: Choosing address */}
            <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                selectedAddressId={data.address?.id}
                onSelectAddress={handleSelectAddress}
                onOpenAddNewAddress={() => {
                    setIsAddressModalOpen(false);
                    setIsAddNewAddressModalOpen(true);
                }}
            />

            {/* Modal: Add new address */}
            <AddNewAddressModal
                isOpen={isAddNewAddressModalOpen}
                onClose={() => setIsAddNewAddressModalOpen(false)}
                onBack={() => {
                    setIsAddNewAddressModalOpen(false);
                    setIsAddressModalOpen(true);
                }}
                onSuccess={(newAddress) => {
                    handleSelectAddress(newAddress);
                    setIsAddNewAddressModalOpen(false);
                }}
            />
        </div>
    );
}

export default CheckoutPage;