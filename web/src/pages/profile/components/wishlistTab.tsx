import { Link } from "react-router-dom";
import type { WishlistItem } from "../../../features/user/models/wishlist.model";
import { buildProductUrl } from "../../../utils/slug";

interface WishlistTabProps {
    items: WishlistItem[];
    isLoading: boolean;
    pagination: { page: number; pageSize: number; totalItems: number; totalPages: number } | undefined;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

const WishlistSkeleton = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white border border-border-subtle rounded-xl overflow-hidden animate-pulse">
                <div className="h-45 bg-[#F5F5F4]" />
                <div className="p-3 space-y-2">
                    <div className="h-4 bg-[#F5F5F4] rounded w-3/4" />
                    <div className="h-4 bg-[#F5F5F4] rounded w-1/2" />
                </div>
            </div>
        ))}
    </div>
);

export const WishlistTab = ({
    items,
    isLoading,
    pagination,
    currentPage,
    onPageChange,
}: WishlistTabProps) => {
    if (isLoading) return <WishlistSkeleton />;

    if (!isLoading && items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <svg className="w-16 h-16 text-border-medium" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p className="text-[16px] font-semibold text-text-ink">Chưa có sản phẩm yêu thích</p>
                <p className="text-[14px] text-[#A8A29E] text-center max-w-75">
                    Khám phá marketplace và thêm những sản phẩm bạn thích vào đây.
                </p>
                <Link
                    to="/"
                    className="mt-2 h-10.5 px-6 bg-market-primary text-white text-[14px] font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center"
                >
                    Khám phá ngay
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {pagination && (
                <p className="text-[14px] text-[#57534E]">
                    <span className="font-semibold text-text-ink">{pagination.totalItems}</span> sản phẩm yêu thích
                </p>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {items.map((item) => {
                    const hasSale = item.discountPrice < item.price;
                    const discount = hasSale ? Math.round(((item.price - item.discountPrice) / item.price) * 100) : 0;
                    return (
                        <Link
                            key={item.id}
                            to={buildProductUrl(item)}
                            className="group bg-white border border-border-subtle rounded-xl overflow-hidden hover:border-market-primary hover:shadow-[0_6px_20px_rgba(28,25,23,0.1)] transition-all"
                        >
                            <div className="relative h-45 overflow-hidden bg-[#F5F5F4]">
                                <img
                                    src={item.thumbnail}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {discount > 0 && (
                                    <span className="absolute top-2 left-2 bg-market-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                                        -{discount}%
                                    </span>
                                )}
                                <div className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
                                    <svg className="w-3.5 h-3.5 text-market-primary" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="p-3">
                                <p className="text-[13px] font-semibold text-text-ink line-clamp-2 leading-snug mb-2">
                                    {item.name}
                                </p>
                                <div className="flex items-baseline gap-1.5 flex-wrap">
                                    <span className="text-[14px] font-bold text-market-primary">
                                        {formatPrice(item.discountPrice)}
                                    </span>
                                    {hasSale && (
                                        <span className="text-[11px] text-[#A8A29E] line-through">
                                            {formatPrice(item.price)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4 border-t border-border-subtle">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-9.5 px-4 border-[1.5px] border-border-medium rounded-lg text-[13px] font-semibold text-[#57534E] hover:bg-market-background hover:text-market-primary hover:border-market-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#57534E] disabled:hover:border-border-medium"
                    >
                        Trước
                    </button>

                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`w-9.5 h-9.5 rounded-lg text-[13px] font-semibold transition-colors ${
                                p === currentPage
                                    ? "bg-market-primary text-white border-[1.5px] border-market-primary"
                                    : "bg-white border-[1.5px] border-border-medium text-[#57534E] hover:bg-market-background hover:text-market-primary hover:border-market-primary"
                            }`}
                        >
                            {p}
                        </button>
                    ))}

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === pagination.totalPages}
                        className="h-9.5 px-4 border-[1.5px] border-border-medium rounded-lg text-[13px] font-semibold text-[#57534E] hover:bg-market-background hover:text-market-primary hover:border-market-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#57534E] disabled:hover:border-border-medium"
                    >
                        Sau
                    </button>
                </div>
            )}
        </div>
    );
};
