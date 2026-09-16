import React from "react";
import { Link } from "react-router-dom";
import { useOrderEvaluateController } from "./orderEvaluate.controller";
import { ProductReviewList } from "./components/ProductReviewList";
import { ProductReviewForm } from "./components/ProductReviewForm";
import { OrderReviewSummary } from "./components/OrderReviewSummary";

export const OrderEvaluatePage: React.FC = () => {
    const controller = useOrderEvaluateController();

    if (!controller.order || controller.isLoadingInitial) {
        return (
            <div className="flex justify-center items-center h-full min-h-150 bg-white rounded-2xl border border-border-subtle shadow-sm">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-market-primary"></div>
            </div>
        );
    }

    const selectedItem = controller.order.items.find(
        (item) => item.orderItemId === controller.selectedItemId
    );

    const currentReviewState = controller.reviews.find(
        (r) => r.orderItemId === controller.selectedItemId
    );

    const currentReadOnlyReview = controller.readOnlyReviews.find(
        (r) => r.orderItemId === controller.selectedItemId
    );

    return (
        <div className="flex flex-col gap-6 h-full min-h-150">
            {/* Header */}
            <div className="bg-white border border-border-subtle rounded-2xl shadow-sm overflow-hidden p-6 flex items-center gap-4">
                <Link
                    to={`/profile/order/tracking/${controller.order.id}`}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors shrink-0"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <div>
                    <h2 className="font-['Lora',serif] text-xl font-bold text-stone-900 flex items-center gap-3">
                        Đánh giá đơn hàng
                    </h2>
                    <p className="text-stone-500 text-sm mt-1">
                        Đơn hàng <span className="font-medium text-stone-700">{controller.order.id}</span>
                    </p>
                </div>
            </div>

            {/* 3-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
                {/* Left Column: Product List */}
                <div className="lg:col-span-1">
                    <ProductReviewList
                        items={controller.order.items}
                        selectedItemId={controller.selectedItemId}
                        onSelectItem={controller.setSelectedItemId}
                    />
                </div>

                {/* Middle Column: Evaluation Form */}
                <div className="lg:col-span-2">
                    {selectedItem ? (
                        <ProductReviewForm
                            item={selectedItem}
                            rating={currentReviewState?.rating || 0}
                            comment={currentReviewState?.comment || ""}
                            readOnlyReview={currentReadOnlyReview}
                            onRatingChange={(rating) => controller.setRating(selectedItem.orderItemId, rating)}
                            onCommentChange={(comment) => controller.setComment(selectedItem.orderItemId, comment)}
                        />
                    ) : (
                        <div className="bg-white border border-border-subtle rounded-xl shadow-sm p-6 h-full flex flex-col items-center justify-center text-stone-400">
                            <p>Vui lòng chọn một sản phẩm để đánh giá</p>
                        </div>
                    )}
                </div>

                {/* Right Column: Order Summary & Submit */}
                <div className="lg:col-span-1">
                    <OrderReviewSummary
                        order={controller.order}
                        canSubmit={controller.canSubmit}
                        isSubmitting={controller.isSubmitting}
                        onSubmit={controller.handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderEvaluatePage;
