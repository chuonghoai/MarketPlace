import { EOrderStatus } from '../../../../features/order/enums/orderStatus.enum';
import type { OrderStatusCount } from '../../../features/order/model/orderStatusCount.model';
import type { TabValue } from '../order.controller';

export const OrderFilterTabs = ({
    activeTab,
    onTabChange,
    orderStatusCount
}: {
    activeTab: TabValue;
    onTabChange: (tab: TabValue) => void;
    orderStatusCount: OrderStatusCount;
}) => {
    const TABS = [
        { label: 'Tất cả', value: 'ALL', count: orderStatusCount.all, showCount: true },
        { label: 'Chờ xác nhận', value: EOrderStatus.PENDING, count: orderStatusCount.pending, showCount: true },
        { label: 'Đang chuẩn bị', value: EOrderStatus.PREPARING, count: orderStatusCount.preparing, showCount: true },
        { label: 'Đang giao', value: EOrderStatus.SHIPPING, count: orderStatusCount.shipping, showCount: true },
        { label: 'Đã hoàn thành', value: EOrderStatus.SUCCESS, count: orderStatusCount.success, showCount: false },
        { label: 'Bị hủy', value: EOrderStatus.CANCELLED, count: orderStatusCount.cancelled, showCount: false },
    ];

    return (
        <div 
            className="flex flex-nowrap md:flex-wrap overflow-x-auto overflow-y-hidden whitespace-nowrap gap-2 mb-6 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            {TABS.map((tab) => {
                const isActive = activeTab === tab.value;
                return (
                    <button
                        key={tab.value}
                        onClick={() => onTabChange(tab.value as TabValue)}
                        className={`cursor-pointer shrink-0 flex items-center gap-1.5 h-8 px-3.5 rounded-sm font-body text-[14px] transition-colors ${
                            isActive
                                ? 'bg-market-primary text-[#FFFFFF] border border-market-primary'
                                : 'bg-transparent text-[#57534E] border border-border-medium hover:bg-[#FDF6EC]'
                        }`}
                    >
                        {tab.label}
                        {tab.showCount && (
                            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                                isActive ? 'bg-white/20 text-white' : 'bg-border-subtle text-text-muted'
                            }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};