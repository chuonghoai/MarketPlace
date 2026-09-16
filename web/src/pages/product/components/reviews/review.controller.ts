import { useState, useEffect } from "react";
import { useReviewStore } from "./reviews.store";

export const useReviewController = (productId: string) => {
    const store = useReviewStore();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!productId) return;

        setIsLoading(true);
        store.loadReviews(productId)
            .finally(() => {
                setTimeout(() => setIsLoading(false), 500);
            });
    }, [productId]);

    return {
        reviewData: store.reviewData,
        isLoading,
    };
};