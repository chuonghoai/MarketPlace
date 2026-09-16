import { useState, useEffect } from "react";
import { useMarketplaceController } from "./marketplace.controller";
import { ProductCard } from "./components/ProductCard/productCard";
import { MarketplaceFilter } from "./components/filter/marketplaceFilter";
import { EmptyProductState } from "./components/EmptyProducts/emptyProductState";

function MarketplacePage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Close sidebar on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isSidebarOpen) {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSidebarOpen]);
    const {
        products,
        isLoading,
        error,
        pagination,
        handlePageChange,
        currentPage,
    } = useMarketplaceController();

    return (
        <div className="pb-12">
            {/* Header section */}
            <div className="mb-6 flex flex-col md:mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-['Lora',serif] text-[28px] md:text-[36px] font-semibold text-text-ink mb-2 leading-tight">
                            Khám phá Marketplace
                        </h1>
                        <p className="text-[#57534E] text-[14px] md:text-[15px] max-w-150 hidden md:block">
                            Nơi tập hợp những tác phẩm thủ công tinh xảo nhất từ cộng đồng nghệ nhân của chúng tôi.
                        </p>
                    </div>
                </div>

                {/* Mobile Filter Toggle */}
                <div className="mt-4 md:hidden flex items-center gap-5">
                    <button onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-2 text-[14px] font-medium text-text-ink border border-border-medium px-3 py-1.5 rounded bg-white">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        Bộ lọc
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <p className="text-[#57534E] text-[14px]">
                        <span className="font-semibold text-text-ink">{pagination?.totalItems || 0}</span> tác phẩm
                    </p>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Layout */}
            <div className="flex flex-col md:flex-row gap-8">

                {/* Filter sidebar */}
                <aside className={`fixed inset-y-0 left-0 z-50 w-[70%] max-w-[280px] bg-white shadow-xl transform transition-transform duration-300 md:relative md:transform-none md:w-[280px] md:shadow-none md:z-auto ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 overflow-y-auto`}>
                    <div className="p-4 md:p-0">
                        <div className="flex justify-between items-center mb-4 md:hidden">
                            <h2 className="font-semibold text-[18px]">Bộ lọc</h2>
                            <button onClick={() => setIsSidebarOpen(false)} className="text-[#57534E]">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <MarketplaceFilter />
                    </div>
                </aside>

                {/* Grid products */}
                <div className="flex-1 flex flex-col min-h-full">
                    {!isLoading && !error && pagination && (
                        <div className="mb-6 hidden md:flex justify-between items-center text-[14px] text-[#57534E]">
                            <p>
                                <span className="font-semibold text-[#1C1917]">{pagination.totalItems}</span> tác phẩm
                            </p>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6">
                            {[...Array(10)].map((_, index) => (
                                <div key={index} className="bg-white border border-[#E7E5E4] rounded-[8px] h-[360px] animate-pulse">
                                    <div className="bg-[#F5F5F4] h-[240px]"></div>
                                    <div className="p-4 space-y-3">
                                        <div className="h-4 bg-[#F5F5F4] rounded w-3/4"></div>
                                        <div className="h-4 bg-[#F5F5F4] rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="w-full bg-[#FEF2F2] border border-[#FCA5A5] rounded-[8px] py-24 px-6 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-[#FEE2E2] rounded-full flex items-center justify-center mb-6 border border-[#FCA5A5]">
                                <svg className="w-10 h-10 text-[#EF4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="font-['Lora',serif] text-[24px] font-semibold text-[#991B1B] mb-3">
                                {error}
                            </h3>
                            <p className="text-[15px] text-[#7F1D1D] max-w-[420px] mb-8 leading-relaxed font-['Open_Sans',sans-serif]">
                                Hệ thống đang gặp sự cố gián đoạn hoặc không thể kết nối đến máy chủ. Vui lòng thử lại sau ít phút.
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-market-error text-white h-[42px] px-6 rounded-[4px] font-semibold text-[14px] hover:bg-[#B91C1C] transition-colors"
                            >
                                Tải lại trang
                            </button>
                        </div>
                    ) : products.length === 0 ? (
                        <EmptyProductState />
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6">
                            {products.map((item) => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>
                    )}

                    {!isLoading && !error && pagination && pagination.totalPages > 1 && (
                        <div className="mt-12 pt-8 border-t border-[#E7E5E4] flex flex-wrap items-center justify-center gap-2">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={pagination.page === 1}
                                className="h-[42px] px-4 border-[1.5px] border-[#D6D3D1] rounded-[4px] text-[14px] font-semibold text-[#57534E] hover:bg-[#FDF6EC] hover:text-market-primary hover:border-market-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#57534E] disabled:hover:border-[#D6D3D1]"
                            >
                                Đầu
                            </button>

                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="h-[42px] px-4 border-[1.5px] border-[#D6D3D1] rounded-[4px] text-[14px] font-semibold text-[#57534E] hover:bg-[#FDF6EC] hover:text-market-primary hover:border-market-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#57534E] disabled:hover:border-[#D6D3D1]"
                            >
                                Trước
                            </button>

                            {generatePagination(currentPage, pagination.totalPages).map((item, index) => {
                                if (item === '...') {
                                    return (
                                        <span key={`ellipsis-${index}`} className="w-[42px] h-[42px] flex items-center justify-center text-[14px] font-semibold text-[#A8A29E]">
                                            ...
                                        </span>
                                    );
                                }

                                const pageNumber = item as number;
                                const isActive = pageNumber === currentPage;
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => handlePageChange(pageNumber)}
                                        className={`w-[42px] h-[42px] rounded-[4px] text-[14px] font-semibold transition-colors flex items-center justify-center ${isActive
                                            ? 'bg-market-primary text-white border-[1.5px] border-market-primary'
                                            : 'bg-white border-[1.5px] border-[#D6D3D1] text-[#57534E] hover:bg-[#FDF6EC] hover:text-market-primary hover:border-market-primary'
                                            }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.totalPages}
                                className="h-[42px] px-4 border-[1.5px] border-[#D6D3D1] rounded-[4px] text-[14px] font-semibold text-[#57534E] hover:bg-[#FDF6EC] hover:text-market-primary hover:border-market-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#57534E] disabled:hover:border-[#D6D3D1]"
                            >
                                Sau
                            </button>

                            <button
                                onClick={() => handlePageChange(pagination.totalPages)}
                                disabled={pagination.page === pagination.totalPages}
                                className="h-[42px] px-4 border-[1.5px] border-[#D6D3D1] rounded-[4px] text-[14px] font-semibold text-[#57534E] hover:bg-[#FDF6EC] hover:text-market-primary hover:border-market-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#57534E] disabled:hover:border-[#D6D3D1]"
                            >
                                Cuối
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

const generatePagination = (currentPage: number, totalPages: number) => {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
        return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage >= totalPages - 3) {
        return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};
export default MarketplacePage;