import { useEffect, useReducer, useCallback, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { reviewService } from "../../../features/review/services/review.service";
import { orderService } from "../../../features/order/tracking/services/order.service";
import { useToast } from "../../../components/toast/toast";
import type { OrderTrackingDetail } from "../../../features/order/tracking/model/orderDetail.model";
import type { OrderReviewItem } from "../../../features/review/models/review.model";

interface ReviewStateItem {
    orderItemId: string;
    rating: number;
    comment: string;
}

type ReviewAction =
    | { type: "INIT"; items: ReviewStateItem[] }
    | { type: "SET_RATING"; orderItemId: string; rating: number }
    | { type: "SET_COMMENT"; orderItemId: string; comment: string };

const reviewReducer = (state: ReviewStateItem[], action: ReviewAction): ReviewStateItem[] => {
    switch (action.type) {
        case "INIT":
            return action.items;
        case "SET_RATING":
            return state.map((item) =>
                item.orderItemId === action.orderItemId ? { ...item, rating: action.rating } : item
            );
        case "SET_COMMENT":
            return state.map((item) =>
                item.orderItemId === action.orderItemId ? { ...item, comment: action.comment } : item
            );
        default:
            return state;
    }
};

export const useOrderEvaluateController = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();

    const initialOrder = location.state?.order as OrderTrackingDetail | undefined;
    const focusItemId = location.state?.focusItemId as string | undefined;

    const [order, setOrder] = useState<OrderTrackingDetail | undefined>(initialOrder);
    const [reviews, dispatch] = useReducer(reviewReducer, []);
    const [readOnlyReviews, setReadOnlyReviews] = useState<OrderReviewItem[]>([]);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);

    // Init state with fallback fetch when order is not provided in location.state
    useEffect(() => {
        if (!orderId) {
            navigate("/profile/order/tracking", { replace: true });
            return;
        }

        let isMounted = true;

        const initData = async () => {
            let currentOrder = initialOrder;

            if (!currentOrder) {
                try {
                    const response = await orderService.getOrderDetailById(orderId);
                    if (response.success && response.data) {
                        currentOrder = response.data;
                        if (isMounted) setOrder(response.data);
                    } else {
                        navigate(`/profile/order/tracking/${orderId}`, { replace: true });
                        return;
                    }
                } catch {
                    navigate(`/profile/order/tracking/${orderId}`, { replace: true });
                    return;
                }
            }

            try {
                const response = await reviewService.getOrderReviews(orderId);
                if (response.success && response.data && isMounted) {
                    setReadOnlyReviews(response.data.reviews);
                }
            } catch {
                //
            } finally {
                if (isMounted) setIsLoadingInitial(false);
            }

            if (currentOrder && isMounted) {
                const initialItems: ReviewStateItem[] = currentOrder.items
                    .filter((item) => !item.isReviewed)
                    .map((item) => ({
                        orderItemId: item.orderItemId,
                        rating: 0,
                        comment: "",
                    }));

                dispatch({ type: "INIT", items: initialItems });

                if (focusItemId) {
                    setSelectedItemId(focusItemId);
                } else if (currentOrder.items.length > 0) {
                    setSelectedItemId(currentOrder.items[0].orderItemId);
                }
            }
        };

        initData();

        return () => {
            isMounted = false;
        };
    }, [orderId, navigate, focusItemId]);

    const setRating = useCallback((orderItemId: string, rating: number) => {
        dispatch({ type: "SET_RATING", orderItemId, rating });
    }, []);

    const setComment = useCallback((orderItemId: string, comment: string) => {
        dispatch({ type: "SET_COMMENT", orderItemId, comment });
    }, []);

    // Chỉ gửi đánh giá có rating > 0
    const validReviewsToSubmit = reviews.filter((r) => r.rating > 0);
    const canSubmit = validReviewsToSubmit.length > 0;

    const handleSubmit = async () => {
        if (!orderId || !canSubmit) return;

        const tooLong = validReviewsToSubmit.find((r) => r.comment.length > 500);
        if (tooLong) {
            toast("Đánh giá không được vượt quá 500 ký tự", "warning");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await reviewService.createReviews({
                orderId,
                reviews: validReviewsToSubmit.map((r) => ({
                    orderItemId: r.orderItemId,
                    rating: r.rating,
                    comment: r.comment.trim(),
                })),
            });

            if (response.success) {
                toast("Đánh giá sản phẩm thành công", "success");

                // Sync state: isReviewed=true cho các item vừa submit để sync với trang chi tiết đơn hàng
                if (order) {
                    const submittedItemIds = validReviewsToSubmit.map(r => r.orderItemId);
                    const updatedOrder = {
                        ...order,
                        items: order.items.map(item =>
                            submittedItemIds.includes(item.orderItemId)
                                ? { ...item, isReviewed: true }
                                : item
                        )
                    };
                    navigate(`/profile/order/tracking/${orderId}`, { replace: true, state: { updatedOrder } });
                } else {
                    navigate(`/profile/order/tracking/${orderId}`, { replace: true });
                }
            } else {
                toast(response.message || "Có lỗi xảy ra khi gửi đánh giá", "error");
            }
        } catch {
            toast("Có lỗi xảy ra khi gửi đánh giá", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        order,
        reviews,
        readOnlyReviews,
        selectedItemId,
        setSelectedItemId,
        setRating,
        setComment,
        isSubmitting,
        isLoadingInitial,
        canSubmit,
        handleSubmit,
    };
};
