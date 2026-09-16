import { XCircle } from 'lucide-react';
import type { OrderItem } from '../../../features/order/model/orderItem.model';
import { OrderCard } from './OrderCard';
import { OrderSkeleton } from './OrderSkeleton';

export const OrderList = ({
    orders,
    loading,
    error,
}: {
    orders: OrderItem[];
    loading: boolean;
    error: string | null;
}) => {
    if (error) {
        return (
            <div className="bg-[#FEE2E2] border border-market-error text-[#991B1B] rounded-lg p-4 font-body text-[14px]">
                {error}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="space-y-4">
                <OrderSkeleton />
                <OrderSkeleton />
                <OrderSkeleton />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-[#FFFFFF] border border-border-subtle rounded-lg">
                <XCircle size={48} className="text-border-medium mb-4" />
                <h3 className="font-headline text-[20px] font-semibold text-text-ink mb-2">
                    Không tìm thấy đơn hàng
                </h3>
                <p className="font-body text-[#57534E]">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
            ))}
        </div>
    );
};
