import React from 'react';
import type { OrderDetail } from '../../../features/order/model/orderDetail.model';
import { useOrderActionsController } from '../cpnControllers/order-actions.controller';
import { CancelOrderModal } from './CancelOrderModal';
import { EOrderStatus } from '../../../../features/order/enums/orderStatus.enum';

interface OrderActionsProps {
    order: OrderDetail;
    onUpdateSuccess: (updatedDetail: OrderDetail) => void;
}

export const OrderActions: React.FC<OrderActionsProps> = ({ order, onUpdateSuccess }) => {
    const orderActionController = useOrderActionsController(order, onUpdateSuccess);

    const renderSpinner = () => (
        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );

    let actions = null;

    /**
     * Nếu đơn hàng = pending
     * Hiện 2 nút "Hủy đơn hàng" và "Xác nhận đơn hàng"
     */
    if (order.orderStatus === EOrderStatus.PENDING) {
        actions = (
            <div className="flex items-center gap-2">
                <button
                    onClick={orderActionController.handleOpenCancelModal}
                    disabled={orderActionController.isLoading}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-sm hover:bg-red-50 transition-colors shadow-sm disabled:opacity-50"
                >
                    Hủy Đơn Hàng
                </button>
                <button
                    onClick={orderActionController.handleConfirmOrder}
                    disabled={orderActionController.isLoading}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-sm hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                    {orderActionController.isLoading && renderSpinner()}
                    Xác Nhận Đơn
                </button>
            </div>
        );
        /**
         * Nếu đơn hàng = preparing
         * Hiện nút "Giao cho ĐVVC"
         */
    } else if (order.orderStatus === EOrderStatus.PREPARING) {
        actions = (
            <button
                onClick={orderActionController.handleHandOver}
                disabled={orderActionController.isLoading}
                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-sm hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
                {orderActionController.isLoading && renderSpinner()}
                Giao Cho ĐVVC
            </button>
        );
        /**
         * Nếu đơn hàng = shipping
         * Hiện 2 nút "Mở điều hướng" và "Hoàn tất đơn hàng"
         */
    } else if (order.orderStatus === EOrderStatus.SHIPPING) {
        actions = (
            <div className="flex items-center gap-2">
                <button
                    onClick={orderActionController.handleOpenGoogleMaps}
                    disabled={orderActionController.isLoading}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Mở điều hướng
                </button>
                <button
                    onClick={orderActionController.handleComplete}
                    disabled={orderActionController.isLoading}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-sm hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                    {orderActionController.isLoading && renderSpinner()}
                    Hoàn Tất Đơn Hàng
                </button>
            </div>
        );
        /**
         * Nếu đơn hàng = returned
         * Hiện nút "Xử lý hoàn trả"
         */
    } else if (order.orderStatus === EOrderStatus.RETURNED) {
        actions = (
            <button
                onClick={orderActionController.handleProcessReturn}
                disabled={orderActionController.isLoading}
                className="px-3 py-1.5 text-sm font-medium text-white bg-orange-600 border border-orange-600 rounded-sm hover:bg-orange-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
                {orderActionController.isLoading && renderSpinner()}
                Xử Lý Hoàn Trả
            </button>
        );
    }

    return (
        <>
            {actions}
            <CancelOrderModal
                isOpen={orderActionController.isCancelModalOpen}
                onClose={orderActionController.handleCloseCancelModal}
                onConfirm={orderActionController.handleConfirmCancel}
                isLoading={orderActionController.isLoading}
            />
        </>
    );
};
