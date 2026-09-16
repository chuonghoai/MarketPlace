export interface CreateReviewRequest {
    orderId: string;
    reviews: CreateReviewItem[];
}

export interface CreateReviewItem {
    orderItemId: string;
    rating: number;
    comment: string;
}

export interface SubmitReviewResponse {
    submittedCount: number; // Tổng số review đã submit
}
