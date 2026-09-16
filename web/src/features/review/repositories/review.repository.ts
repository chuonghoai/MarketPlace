import type { ApiResponse } from "../../../core/api/apiResponse";
import type { Review, OrderReviewList } from "../models/review.model";
import type { CreateReviewRequest, SubmitReviewResponse } from "../dto/createReview.request";

export interface ReviewRepository {
    getReviewsByProductId(productId: string): Promise<ApiResponse<Review>>;
    getOrderReviews(orderId: string): Promise<ApiResponse<OrderReviewList>>;
    createReviews(request: CreateReviewRequest): Promise<ApiResponse<SubmitReviewResponse>>;
}