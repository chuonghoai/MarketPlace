import { Link } from 'react-router-dom';
import { MapPin, Phone, Calendar, Package, ChevronRight } from 'lucide-react';
import type { OrderItem } from '../../../features/order/model/orderItem.model';
import { STATUS_CONFIG } from '../types/statusConfig';
import { PAYMENT_CONFIG } from '../types/paymentConfig';
import { PAYMENT_METHOD_LABEL } from '../types/paymentMethodLabel';
import { formatCurrency, formatDate } from '../utils/formatters';

export const OrderCard = ({ order }: { order: OrderItem }) => {
    return (
        <Link
            to={`/admin/orders/${order.id}`}
            className="group cursor-pointer bg-[#FFFFFF] border border-border-subtle rounded-lg p-4 md:p-5 hover:border-border-medium hover:-translate-y-1 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out flex flex-col md:flex-row gap-4 md:gap-6"
        >
            <div className="flex flex-row gap-3 md:gap-6 flex-1 min-w-0">
                <div className="w-18 h-18 md:w-24 md:h-24 shrink-0 rounded-sm border border-border-subtle overflow-hidden bg-[#FFFBF5]">
                    <img src={order.firstProductImageUrl} alt="Sản phẩm" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                        <div className="flex items-start justify-between gap-2 mb-1 md:mb-2">
                            <span className="cursor-text font-mono text-[14px] text-text-ink font-semibold truncate min-w-0" onClick={(e) => e.stopPropagation()}>
                                {order.id}
                            </span>
                            <span
                                className={`shrink-0 px-2.5 py-0.5 rounded-sm font-body text-[11px] font-bold uppercase tracking-wider ${STATUS_CONFIG[order.orderStatus].color}`}
                            >
                                {STATUS_CONFIG[order.orderStatus].label}
                            </span>
                        </div>
                        <h3 className="cursor-text font-headline text-[16px] md:text-[20px] font-semibold text-text-ink leading-tight mb-2 md:mb-3 truncate">
                            {order.buyerName}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1.5 md:gap-y-2 gap-x-4">
                            <div className="flex items-center gap-2 text-[#57534E]">
                                <Phone size={14} className="shrink-0" />
                                <span className="cursor-text font-body text-[14px]">{order.buyerPhone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#57534E]">
                                <MapPin size={14} className="shrink-0" />
                                <span className="cursor-text font-body text-[14px] truncate" title={order.buyerAddress}>
                                    {order.buyerAddress}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-[#57534E]">
                                <Package size={14} className="shrink-0" />
                                <span className="cursor-text font-body text-[14px]">{order.totalProductQuantity} sản phẩm</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#57534E]">
                                <Calendar size={14} className="shrink-0" />
                                <span className="cursor-text font-body text-[14px]">{formatDate(order.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="md:w-55 shrink-0 flex flex-col items-start md:items-end justify-between border-t md:border-t-0 md:border-l border-border-subtle pt-4 md:pt-0 md:pl-6">
                <div className="flex flex-col items-start md:items-end gap-1 mb-4 md:mb-0 w-full">
                    <span className="cursor-text font-body text-[12px] text-[#A8A29E] uppercase tracking-wider font-semibold">
                        Tổng tiền
                    </span>
                    <span className="cursor-text font-headline text-[24px] font-bold text-market-primary">
                        {formatCurrency(order.totalAmount)}
                    </span>
                    <span
                        className={`mt-1 px-2.5 py-0.5 rounded-sm font-body text-[11px] font-bold uppercase tracking-wider ${PAYMENT_CONFIG[order.paymentStatus].color}`}
                    >
                        {PAYMENT_CONFIG[order.paymentStatus].label}
                    </span>
                    <span className="cursor-text font-body text-[12px] text-[#57534E] mt-1 text-left md:text-right">
                        {PAYMENT_METHOD_LABEL[order.paymentMethod]}
                    </span>
                </div>

                <div className="w-full md:w-auto flex items-center justify-center md:justify-end gap-1 text-market-primary font-body text-[14px] font-semibold mt-auto group-hover:underline transition-all">
                    Chi tiết <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </Link>
    );
};