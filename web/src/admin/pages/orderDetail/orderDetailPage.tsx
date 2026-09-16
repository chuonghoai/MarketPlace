import React from 'react';
import { useOrderDetailController } from './orderDetail.controller';
import { EOrderStatus } from '../../../features/order/enums/orderStatus.enum';
import { formatCurrency, formatDate, getStatusColor } from './utils/helpers';
import { OrderActions } from './components/OrderActions';

const OrderDetailPage: React.FC = () => {
    const { store, handleBack } = useOrderDetailController();

    if (store.loading) {
        return (
            <div className="flex justify-center items-center h-full p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (store.error) {
        return (
            <div className="p-8 text-center text-red-500">
                <p>{store.error}</p>
                <button
                    onClick={handleBack}
                    className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                    Quay lại
                </button>
            </div>
        );
    }

    if (!store.orderDetail) {
        return null;
    }

    return (
        <div className="max-w-500 space-y-5 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleBack}
                        className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
                        title="Quay lại danh sách"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-gray-900 leading-tight">Đơn hàng #{store.orderDetail.id.toUpperCase()}</h1>
                        <span className={`px-2.5 py-0.5 rounded-sm text-xs font-bold uppercase tracking-wider ${getStatusColor(store.orderDetail.orderStatus)}`}>
                            {store.orderDetail.orderStatus}
                        </span>
                    </div>
                </div>

                {/* Primary Actions */}
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        In hóa đơn
                    </button>
                    <OrderActions order={store.orderDetail} onUpdateSuccess={store.setOrderDetail} />
                </div>
            </div>

            {/* Main Content Grid: 1-2-1 */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

                {/* LEFT COLUMN (25%) */}
                <div className="lg:col-span-1 space-y-5">
                    {/* Customer Information */}
                    <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
                        <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Khách hàng & Giao hàng</h2>
                        </div>
                        <div className="p-4 space-y-3 text-sm">
                            <div className="flex justify-between items-start">
                                <span className="text-gray-500 font-medium">Người nhận</span>
                                <span className="font-semibold text-gray-900 text-right">{store.orderDetail.buyerName}</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="text-gray-500 font-medium">Điện thoại</span>
                                <span className="font-semibold text-gray-900 text-right">{store.orderDetail.buyerPhone}</span>
                            </div>
                            <div className="flex flex-col gap-1 pt-1 border-t border-gray-100 mt-1">
                                <span className="text-gray-500 font-medium">Địa chỉ</span>
                                <span className="font-semibold text-gray-900 leading-snug">{store.orderDetail.buyerAddress}</span>
                            </div>
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
                        <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Lịch sử đơn hàng</h2>
                        </div>
                        <div className="p-4 pl-3">
                            <div className="relative border-l border-gray-200 ml-2 space-y-4">
                                {store.orderDetail?.statusHistory?.map((history, index) => {
                                    const isLast = index === (store.orderDetail?.statusHistory?.length || 1) - 1;
                                    let colorClass = 'bg-gray-400';
                                    let textClass = isLast ? 'text-gray-900 font-bold' : 'text-gray-600 font-medium';

                                    switch (history.status) {
                                        case EOrderStatus.PENDING:
                                        case EOrderStatus.PREPARING:
                                        case EOrderStatus.SHIPPING:
                                            colorClass = 'bg-blue-500';
                                            break;
                                        case EOrderStatus.DELIVERED:
                                        case EOrderStatus.SUCCESS:
                                            colorClass = 'bg-green-500';
                                            break;
                                        case EOrderStatus.CANCELLED:
                                            colorClass = 'bg-red-500';
                                            if (isLast) textClass = 'text-red-700 font-bold';
                                            break;
                                        case EOrderStatus.RETURNED:
                                            colorClass = 'bg-orange-500';
                                            if (isLast) textClass = 'text-orange-700 font-bold';
                                            break;
                                    }

                                    return (
                                        <div key={index} className="relative pl-4">
                                            <div className={`absolute w-2 h-2 ${colorClass} rounded-full left-[-4.5px] top-1.5 ring-2 ring-white`}></div>
                                            <div>
                                                <h3 className={`text-xs ${textClass}`}>{history.note || history.status}</h3>
                                                <p className="text-[10px] text-gray-500 font-mono mt-0.5">{formatDate(history.timestamp)}</p>
                                                {isLast && store.orderDetail?.cancelReason && (history.status === EOrderStatus.CANCELLED || history.status === EOrderStatus.RETURNED) && (
                                                    <p className="text-xs text-gray-700 mt-1.5 bg-gray-50 p-2 rounded-sm border border-gray-200">
                                                        <span className="font-semibold text-gray-900">Lý do: </span>{store.orderDetail?.cancelReason}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CENTER COLUMN (50%) */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-sm shadow-sm h-full flex flex-col">
                        <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Danh sách sản phẩm</h2>
                        </div>
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 text-gray-500">
                                        <th className="py-2.5 px-4 font-medium w-14">Hình</th>
                                        <th className="py-2.5 px-4 font-medium">Sản phẩm</th>
                                        <th className="py-2.5 px-4 font-medium text-right w-24">Đơn giá</th>
                                        <th className="py-2.5 px-3 font-medium text-center w-12">SL</th>
                                        <th className="py-2.5 px-4 font-medium text-right w-28">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {store.orderDetail.items.map(item => (
                                        <tr key={item.productId} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="py-2.5 px-4">
                                                <div className="w-10 h-10 rounded-sm border border-gray-100 overflow-hidden bg-white shrink-0">
                                                    <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-cover" />
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-4">
                                                <p className="font-medium text-gray-900 line-clamp-2 leading-tight">{item.productName}</p>
                                                <p className="text-[10px] text-gray-500 mt-1 font-mono">ID: {item.productId}</p>
                                            </td>
                                            <td className="py-2.5 px-4 text-right">
                                                {item.originalPrice > item.price && (
                                                    <div className="flex flex-col items-end mb-0.5">
                                                        <span className="text-[10px] text-gray-400 line-through leading-none">
                                                            {formatCurrency(item.originalPrice)}
                                                        </span>
                                                        {item.discountPercentage > 0 && (
                                                            <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1 py-0.5 rounded-sm leading-none mt-0.5">
                                                                -{item.discountPercentage}%
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                <p className="text-gray-900 font-semibold">{formatCurrency(item.price)}</p>
                                            </td>
                                            <td className="py-2.5 px-3 text-center font-bold text-gray-700">{item.quantity}</td>
                                            <td className="py-2.5 px-4 text-right font-bold text-gray-900">
                                                {formatCurrency(item.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN (25%) */}
                <div className="lg:col-span-1 space-y-5">

                    {/* Order Information Card */}
                    <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
                        <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Thông tin đơn hàng</h2>
                        </div>
                        <div className="p-4 space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 font-medium">Mã ĐH</span>
                                <span className="font-mono font-bold text-gray-900">{store.orderDetail.id.toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 font-medium">Ngày tạo</span>
                                <span className="font-mono text-gray-900 text-[11px]">{formatDate(store.orderDetail.createdAt)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 font-medium">Trạng thái</span>
                                <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${getStatusColor(store.orderDetail.orderStatus)}`}>
                                    {store.orderDetail.orderStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
                        <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Thanh toán</h2>
                        </div>
                        <div className="p-4 space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 font-medium">Phương thức</span>
                                <span className="font-bold text-gray-900 px-2 py-0.5 bg-gray-100 rounded-sm text-[10px] uppercase tracking-wider">{store.orderDetail.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 font-medium">Trạng thái</span>
                                <span className={`font-bold text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wider ${store.orderDetail.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                                    store.orderDetail.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {store.orderDetail.paymentStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Vouchers Information */}
                    {store.orderDetail.vouchers && store.orderDetail.vouchers.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
                            <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Voucher đã áp dụng</h2>
                            </div>
                            <div className="p-4 space-y-3 text-sm">
                                {store.orderDetail.vouchers.map((v, idx) => {
                                    const isFreeship = String(v.voucherSnapshot?.voucher_type || '').includes('FREESHIP');
                                    const typeText = isFreeship ? 'Giảm phí vận chuyển' : 'Giảm giá sản phẩm';
                                    return (
                                        <div key={idx} className="flex flex-col gap-1 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-blue-600 uppercase">{v.voucherCode}</span>
                                                <span className="font-semibold text-red-600">-{formatCurrency(v.discountAmount)}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 line-clamp-1">
                                                {v.voucherSnapshot?.title || typeText}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Order Summary */}
                    <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
                        <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Tổng kết</h2>
                        </div>
                        <div className="p-4 text-sm">
                            <div className="space-y-2.5 mb-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">Tạm tính</span>
                                    <span className="font-semibold text-gray-900">{formatCurrency(store.orderDetail.subTotal)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">Phí vận chuyển</span>
                                    <span className="font-semibold text-gray-900">{formatCurrency(store.orderDetail.shippingFee)}</span>
                                </div>
                                {(store.orderDetail.discountAmount ?? 0) > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium">Giảm giá sản phẩm</span>
                                        <span className="font-semibold text-red-600">-{formatCurrency(store.orderDetail.discountAmount!)}</span>
                                    </div>
                                )}
                                {(store.orderDetail.shippingDiscountAmount ?? 0) > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium">Giảm giá vận chuyển</span>
                                        <span className="font-semibold text-red-600">-{formatCurrency(store.orderDetail.shippingDiscountAmount!)}</span>
                                    </div>
                                )}
                            </div>
                            <div className="pt-3 border-t border-gray-200 flex flex-col items-end gap-1">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tổng cộng</span>
                                <span className="text-xl font-bold text-blue-700 leading-none">{formatCurrency(store.orderDetail.totalAmount)}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
