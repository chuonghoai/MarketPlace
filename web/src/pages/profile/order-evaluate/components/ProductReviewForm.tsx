import React from "react";
import { Star } from "lucide-react";
import type { OrderDetailTrackingItem } from "../../../../features/order/tracking/model/orderDetail.model";
import type { OrderReviewItem } from "../../../../features/review/models/review.model";

interface ProductReviewFormProps {
    item: OrderDetailTrackingItem;
    rating: number;
    comment: string;
    readOnlyReview?: OrderReviewItem;
    onRatingChange: (rating: number) => void;
    onCommentChange: (comment: string) => void;
}

export const ProductReviewForm: React.FC<ProductReviewFormProps> = ({
    item,
    rating,
    comment,
    readOnlyReview,
    onRatingChange,
    onCommentChange,
}) => {
    const currentRating = item.isReviewed && readOnlyReview ? readOnlyReview.rating : rating;
    const currentComment = item.isReviewed && readOnlyReview ? readOnlyReview.content : comment;

    return (
        <div className="bg-white border border-border-subtle rounded-xl shadow-sm p-6 h-full flex flex-col">
            <h3 className="font-semibold text-stone-800 mb-6 font-['Lora',serif] border-b border-stone-100 pb-3">
                {item.isReviewed ? "Chi tiết đánh giá" : "Viết đánh giá"}
            </h3>

            {/* Product header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-stone-100 bg-stone-50 shrink-0">
                    <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-cover" />
                </div>
                <div>
                    <h4 className="text-stone-800 font-medium text-base mb-1">{item.productName}</h4>
                    {item.isReviewed && readOnlyReview && (
                        <p className="text-stone-400 text-sm">
                            Đã đánh giá vào {new Date(readOnlyReview.createdAt).toLocaleDateString("vi-VN")}
                        </p>
                    )}
                </div>
            </div>

            {/* Rating stars */}
            <div className="mb-6 flex flex-col items-center">
                <p className="text-stone-600 mb-3 text-sm font-medium">
                    {item.isReviewed ? "Số sao bạn đã đánh giá" : "Vui lòng chọn số sao"}
                </p>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            disabled={item.isReviewed}
                            onClick={() => !item.isReviewed && onRatingChange(star)}
                            className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${
                                item.isReviewed ? "cursor-default" : "cursor-pointer hover:bg-stone-50 hover:scale-110"
                            }`}
                        >
                            <Star
                                size={32}
                                className={
                                    star <= currentRating
                                        ? "fill-amber-400 text-amber-400"
                                        : "fill-transparent text-stone-300"
                                }
                            />
                        </button>
                    ))}
                </div>
                {item.isReviewed && readOnlyReview && (
                     <div className="mt-4 px-4 py-2 bg-stone-50 rounded-lg text-stone-600 border border-stone-100 text-sm italic w-full text-center">
                        Sản phẩm này đã được đánh giá. Bạn không thể thay đổi thông tin.
                     </div>
                )}
            </div>

            {/* Comment */}
            <div className="flex-1 flex flex-col">
                <label className="text-stone-800 font-medium mb-2 text-sm">
                    {item.isReviewed ? "Nội dung nhận xét" : "Chia sẻ thêm về sản phẩm (Tuỳ chọn)"}
                </label>
                {item.isReviewed ? (
                    <div className="bg-stone-50 rounded-xl p-4 text-stone-700 min-h-30 border border-stone-100 whitespace-pre-wrap">
                        {currentComment || <span className="text-stone-400 italic">Không có bình luận</span>}
                    </div>
                ) : (
                    <div className="relative flex-1 min-h-30">
                        <textarea
                            value={currentComment}
                            onChange={(e) => onCommentChange(e.target.value)}
                            placeholder="Chất lượng sản phẩm tuyệt vời..."
                            className="w-full h-full p-4 rounded-xl border border-border-medium bg-white focus:outline-none focus:ring-2 focus:ring-market-primary focus:border-transparent resize-none text-stone-800"
                            maxLength={500}
                        />
                        <span className="absolute bottom-3 right-3 text-xs text-stone-400">
                            {currentComment.length}/500
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
