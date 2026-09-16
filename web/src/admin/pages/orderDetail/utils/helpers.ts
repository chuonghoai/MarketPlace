import { EOrderStatus } from '../../../../features/order/enums/orderStatus.enum';

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const formatDate = (date: Date | string | number) => {
    return new Date(date).toLocaleString('vi-VN');
};

export const getStatusColor = (status: EOrderStatus) => {
    switch (status) {
        case EOrderStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
        case EOrderStatus.PREPARING: return 'bg-blue-100 text-blue-800';
        case EOrderStatus.SHIPPING: return 'bg-indigo-100 text-indigo-800';
        case EOrderStatus.DELIVERED: return 'bg-purple-100 text-purple-800';
        case EOrderStatus.SUCCESS: return 'bg-green-100 text-green-800';
        case EOrderStatus.CANCELLED: return 'bg-red-100 text-red-800';
        case EOrderStatus.RETURNED: return 'bg-orange-100 text-orange-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};
