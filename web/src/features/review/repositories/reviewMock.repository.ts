import type { ApiResponse } from "../../../core/api/apiResponse";
import type { Review, OrderReviewList } from "../models/review.model";
import type { ReviewRepository } from "./review.repository";
import type { CreateReviewRequest, SubmitReviewResponse } from "../dto/createReview.request";

export class ReviewMockRepository implements ReviewRepository {
    private MockReviews: Review = {
        totalReview: 2,
        averageRating: 4.5,
        reviews: [
            {
                reviewId: "1",
                userId: "1",
                userName: "Alice",
                userAvatar: "https://i.pravatar.cc/150?u=1",
                rating: 5,
                content: "Sản phẩm rất tốt",
                createdAt: new Date(),
            },
            {
                reviewId: "2",
                userId: "2",
                userName: "Bob",
                userAvatar: "https://i.pravatar.cc/150?u=2",
                rating: 4,
                content: "Sản phẩm tốt",
                createdAt: new Date(),
            },
            {
                reviewId: "3",
                userId: "2",
                userName: "Bob",
                userAvatar: "https://i.pravatar.cc/150?u=2",
                rating: 5,
                content: "Sản phẩm tốt",
                createdAt: new Date(),
            },
            {
                reviewId: "4",
                userId: "2",
                userName: "Bob",
                userAvatar: "https://i.pravatar.cc/150?u=2",
                rating: 4,
                content: "Sản phẩm tốt",
                createdAt: new Date(),
            },
            {
                reviewId: "5",
                userId: "2",
                userName: "Bob",
                userAvatar: "https://i.pravatar.cc/150?u=2",
                rating: 5,
                content: "Sản phẩm tốt",
                createdAt: new Date(),
            },
        ],
    }

    async getReviewsByProductId(productId: string): Promise<ApiResponse<Review>> {
        return {
            success: true,
            message: `Get review of ${productId} success`,
            data: this.MockReviews,
        };
    }

    async getOrderReviews(orderId: string): Promise<ApiResponse<OrderReviewList>> {
        return {
            success: true,
            message: `Get order reviews success`,
            data: {
                orderId,
                reviews: [
                    {
                        orderItemId: "2",
                        productId: "1",
                        rating: 5,
                        content: "Rất tốt (từ Mock)",
                        createdAt: new Date(),
                    }
                ]
            },
        };
    }

    async createReviews(request: CreateReviewRequest): Promise<ApiResponse<SubmitReviewResponse>> {
        return {
            success: true,
            message: "Submit review success",
            data: { submittedCount: request.reviews.length },
        };
    }
}