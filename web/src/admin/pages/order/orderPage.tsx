import { useOrderController } from './order.controller';
import { OrderSearchBar } from './components/OrderSearchBar';
import { OrderFilterTabs } from './components/OrderFilterTabs';
import { OrderList } from './components/OrderList';

export const OrderPage = () => {
    const controller = useOrderController();

    return (
        <div className="w-full max-w-650 mx-auto pb-88 -mt-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div>
                    <h1 className="font-headline text-[36px] font-semibold text-text-ink tracking-tight">
                        Quản lý đơn hàng
                    </h1>
                    <p className="font-body text-[16px] text-[#57534E] mt-2">
                        Hiển thị {controller.filteredOrders.length} đơn hàng trong hệ thống.
                    </p>
                </div>
                <OrderSearchBar value={controller.searchQuery} onChange={controller.setSearchQuery} />
            </div>

            <OrderFilterTabs
                activeTab={controller.activeTab}
                onTabChange={controller.handleTabChange}
                orderStatusCount={controller.ordersCount ?? { all: 0, pending: 0, preparing: 0, shipping: 0, success: 0, cancelled: 0 }}
            />

            <OrderList
                orders={controller.filteredOrders}
                loading={controller.loading}
                error={controller.error}
            />
        </div>
    );
};

export default OrderPage;