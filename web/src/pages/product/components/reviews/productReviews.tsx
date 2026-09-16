import { useEffect } from "react";
import { useReviewController } from "./review.controller";

interface ProductReviewsProps {
    productId: string;
    onReviewsLoaded?: (averageRating: number, totalReview: number) => void;
}

export const ProductReviews = ({ productId, onReviewsLoaded }: ProductReviewsProps) => {
    const { reviewData, isLoading } = useReviewController(productId);

    useEffect(() => {
        if (reviewData && onReviewsLoaded) {
            onReviewsLoaded(reviewData.averageRating, reviewData.totalReview);
        }
    }, [reviewData, onReviewsLoaded]);

    // Loading skeleton
    if (isLoading) {
        return (
            <section className="border-t border-[#E7E5E4] pt-16 pb-16 animate-pulse">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <div className="h-8 bg-[#F5F5F4] rounded w-48 mb-2" />
                        <div className="h-4 bg-[#F5F5F4] rounded w-64" />
                    </div>
                    <div className="h-[80px] bg-[#F5F5F4] rounded w-48" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="border border-[#E7E5E4] bg-white p-6 flex flex-col h-[220px] gap-4">
                            <div className="flex gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((s) => <div key={s} className="w-4 h-4 bg-[#F5F5F4] rounded-sm" />)}
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-[#F5F5F4] rounded w-full" />
                                <div className="h-4 bg-[#F5F5F4] rounded w-5/6" />
                                <div className="h-4 bg-[#F5F5F4] rounded w-4/6" />
                            </div>
                            <div className="flex items-center gap-2 mt-auto">
                                <div className="w-8 h-8 rounded-full bg-[#F5F5F4]" />
                                <div className="h-3 bg-[#F5F5F4] rounded w-28" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    // Empty state
    if (!reviewData || reviewData.reviews.length === 0) {
        return (
            <section className="border-t border-[#E7E5E4] pt-16 pb-16">
                <h2 className="font-['Lora',serif] text-[32px] font-semibold text-[#1e1b17] mb-4">
                    Từ cộng đồng
                </h2>
                <p className="text-[16px] text-[#59413a] mb-8">Chia sẻ trải nghiệm của bạn với sản phẩm này.</p>
                <div className="border border-[#E7E5E4] bg-white p-10 text-center text-[#78716C] text-[15px]">
                    Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ!
                </div>
            </section>
        );
    }

    // Star renderer
    const StarRow = ({ rating, size = 18 }: { rating: number; size?: number }) => (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`text-[#9b2f00] ${star <= rating ? 'fill-current' : 'text-[#E7E5E4] fill-current'}`}
                    width={size}
                    height={size}
                    viewBox="0 0 24 24"
                >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            ))}
        </div>
    );

    // Partial fill stars for average
    const AvgStarRow = ({ avg }: { avg: number }) => (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => {
                const fill = Math.max(0, Math.min(100, (avg - (star - 1)) * 100));
                return (
                    <div key={star} className="relative w-5 h-5">
                        <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full text-[#E7E5E4] fill-current">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }}>
                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#D97706] fill-current">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <section className="border-t border-[#E7E5E4] pt-16 pb-16 font-['Open_Sans',sans-serif]">

            {/* ── Section header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div>
                    <h2 className="font-['Lora',serif] text-[32px] font-semibold text-[#1e1b17] mb-1">
                        Từ cộng đồng
                    </h2>
                    <p className="text-[15px] text-[#59413a]">
                        Trải nghiệm thực tế từ {reviewData.totalReview} khách hàng đã mua.
                    </p>
                </div>

                {/* Average rating box */}
                <div className="flex items-center gap-4 border border-[#E7E5E4] bg-white px-6 py-4 shrink-0">
                    <span className="font-['Lora',serif] text-[40px] font-bold text-[#1e1b17] leading-none">
                        {reviewData.averageRating.toFixed(1)}
                    </span>
                    <div className="flex flex-col gap-1">
                        <AvgStarRow avg={reviewData.averageRating} />
                        <span className="text-[12px] font-bold uppercase tracking-[0.09em] text-[#78716C]">
                            {reviewData.totalReview} đánh giá
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Review cards grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {reviewData.reviews.map((review) => {
                    const initials = review.userName
                        .split(' ')
                        .map((w) => w[0])
                        .slice(-2)
                        .join('')
                        .toUpperCase();

                    return (
                        <div
                            key={review.reviewId}
                            className="border border-[#E7E5E4] bg-white p-6 flex flex-col h-full transition-all duration-300 hover:border-[#D6D3D1] hover:shadow-sm"
                        >
                            {/* Stars */}
                            <div className="mb-4">
                                <StarRow rating={review.rating} size={18} />
                            </div>

                            {/* Content */}
                            <p className="text-[15px] text-[#1e1b17] leading-[1.7] flex-grow mb-6 whitespace-pre-line">
                                "{review.content}"
                            </p>

                            {/* Reviewer info */}
                            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[#E7E5E4]">
                                {review.userAvatar ? (
                                    <img
                                        src={review.userAvatar}
                                        alt={review.userName}
                                        className="w-8 h-8 rounded-full object-cover border border-[#E7E5E4] shrink-0"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-[#F4EDE6] flex items-center justify-center text-[#9b2f00] font-bold text-[12px] shrink-0 border border-[#E7E5E4]">
                                        {initials}
                                    </div>
                                )}
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[13px] font-semibold text-[#1e1b17] truncate">{review.userName}</span>
                                    <span className="text-[12px] text-[#78716C]">
                                        {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};