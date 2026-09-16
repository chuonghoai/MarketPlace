import { useState } from "react";
import type { Review } from "../../../../features/review/models/review.model";
import { reviewService } from "../../../../features/review/services/review.service";

export const useReviewStore = () => {
    const [reviewData, setReviewData] = useState<Review | null>(null);

    const loadReviews = async (productId: string) => {
        try {
            const response = await reviewService.getReviewsByProductId(productId);
            if (response.success && response.data) {
                setReviewData(response.data);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Lỗi khi tải đánh giá:", error);
            return false;
        }
    };

    return {
        reviewData,
        loadReviews,
    };
};