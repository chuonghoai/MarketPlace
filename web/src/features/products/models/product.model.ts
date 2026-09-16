export interface ProductItem {
    id: string;
    name: string;
    imageUrl: string;

    /**
     * If original price == price: product is not currently on sale
     * If original price > price && discountPercentage == 0: product is currently on sale, we will display price with strikethrough
     * If original price > price && discountPercentage > 0: product is currently on sale, we will display price with strikethrough and discount percentage
     * 
     * In code, we alway use price to all calculate
     */
    price: number;
    originalPrice?: number;
    discountPercentage?: number;

    rating?: number;
    categoryId?: string;
    createdAt?: string;
    soldCount?: number;
}