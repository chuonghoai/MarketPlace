import { apiClient } from "../../../core/api/apiClient";
import type { ApiResponse } from "../../../core/api/apiResponse";
import type { Review, OrderReviewList } from "../models/review.model";
import type { ReviewRepository } from "./review.repository";
import type { CreateReviewRequest, SubmitReviewResponse } from "../dto/createReview.request";

export class ReviewApiRepository implements ReviewRepository {
    /**
     * GET /products/{productId}/reviews
     * @param productId 
     * @returns Review
     */
    async getReviewsByProductId(productId: string): Promise<ApiResponse<Review>> {
        return apiClient.get<ApiResponse<Review>>(`/products/${productId}/reviews`);
    }

    /**
     * GET /orders/{orderId}/reviews
     * @param orderId 
     * @returns OrderReviewList
     * 
     * Mô tả:
     *  - Lấy các đánh giá (nếu có) của user với từng item trong đơn hàng này
     *  - Cần query: Order -> order item -> product -> review
     */
    async getOrderReviews(orderId: string): Promise<ApiResponse<OrderReviewList>> {
        return apiClient.get<ApiResponse<OrderReviewList>>(`/orders/${orderId}/reviews`);
    }

    /**
     * POST /reviews
     * @param request: CreateReviewRequest
     * @returns SubmitReviewResponse
     * 
     * Mô tả:
     *  - Tạo đánh giá cho các orderItem trong list reviews[].
     *  - Nghiệp vụ: Người dùng có thể đánh giá riêng lẻ
     *      + Ví dụ: Đơn hàng có tổng 10 sản phẩm khác nhau, nhưng user chỉ đánh giá 5 sản phẩm -> chấp nhận 
     */
    async createReviews(request: CreateReviewRequest): Promise<ApiResponse<SubmitReviewResponse>> {
        return apiClient.post<ApiResponse<SubmitReviewResponse>>(`/reviews`, request);
    }
}