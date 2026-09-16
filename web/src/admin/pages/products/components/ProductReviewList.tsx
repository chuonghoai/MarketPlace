import React from 'react';
import type { ReviewItem } from '../../../../features/review/models/review.model';

interface ProductReviewListProps {
    reviews: ReviewItem[];
    loading: boolean;
    error: string | null;
}

const formatDate = (dateString: Date | string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const ProductReviewList: React.FC<ProductReviewListProps> = ({ reviews, loading, error }) => {
    if (loading) {
        return (
            <div className="bg-surface-card border border-border-subtle rounded-xl p-6 shadow-sm">
                <h3 className="font-headline text-lg font-semibold text-text-ink mb-4">Đánh giá từ khách hàng</h3>
                <div className="flex justify-center items-center py-8 text-text-muted">Đang tải đánh giá...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-surface-card border border-border-subtle rounded-xl p-6 shadow-sm">
                <h3 className="font-headline text-lg font-semibold text-text-ink mb-4">Đánh giá từ khách hàng</h3>
                <div className="flex justify-center items-center py-8 text-error">{error}</div>
            </div>
        );
    }

    return (
        <div className="bg-surface-card border border-border-subtle rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="font-headline text-lg font-semibold text-text-ink">
                Đánh giá từ khách hàng ({reviews.length})
            </h3>
            
            {reviews.length === 0 ? (
                <div className="text-center py-8 text-text-muted">
                    Sản phẩm này chưa có đánh giá nào.
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.reviewId} className="border-b border-border-subtle pb-4 last:border-0 last:pb-0">
                            <div className="flex items-start gap-3">
                                <img
                                    src={review.userAvatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(review.userName) + '&background=random'}
                                    alt={review.userName}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-body font-semibold text-text-ink text-sm">
                                                {review.userName}
                                            </p>
                                            <div className="flex items-center gap-1 mt-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <span
                                                        key={i}
                                                        className={`material-symbols-outlined text-[14px] ${i < review.rating ? 'text-[#eab308]' : 'text-border-subtle'}`}
                                                    >
                                                        star
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-xs text-text-muted">{formatDate(review.createdAt)}</span>
                                    </div>
                                    <p className="mt-2 text-sm text-text-ink">{review.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
