export interface Product {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    originalPrice: number | null;
    discountPercentage: number;
    rating: number;
    images: string[];
    description?: string;
    materials: string[];
    categoryName?: string;
    categoryId?: string;
    sellerInfo?: {
        id: string;
        name: string;
        avatarUrl: string;
        totalProducts: number;
        averageRating: number;
    };
    stock: number;
    soldCount: number;
    dimensions?: number[];
    weight?: number;
    careInstructions?: string;
}

export const EFilterState = {
    NEWEST: 'newest',
    PRICE_LOW_TO_HIGH: 'price_asc',
    PRICE_HIGH_TO_LOW: 'price_desc',
    RATING_HIGH_TO_LOW: 'rating',
    POPULARITY: 'popular',
} as const;

export type EFilterState = typeof EFilterState[keyof typeof EFilterState];

export interface ProductFilters {
    sortBy?: EFilterState;
    categories?: string[];
    minPrice?: string;
    maxPrice?: string;
}

export interface GetProductsQuery {
    page?: number;
    pageSize?: number;
    filters?: ProductFilters;
}

export interface PaginatedResponse<T> {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    data: T[];
}



export interface CreateProductRequest {
    name: string;
    price: number;
    originalPrice: number;
    discountPercentage: number;
    imageUrl: string;
    images: string[];
    mediaPublicIds?: string[];
    description?: string;
    materials?: string[];
    stock: number;
    categoryId: string;
    dimensions?: number[];
    weight?: number;
    careInstructions?: string;
}

export type UpdateProductRequest = Partial<CreateProductRequest>;

export interface ProductFormData {
    name: string;
    price: number;
    originalPrice: number;
    discountPercentage: number;
    stock: number;
    categoryId: string;
    description: string;
    materials: string[];
    dimensions?: { length: number; width: number; height: number; };
    weight?: number;
    careInstructions?: string;
    avatarFile?: File | null;
    detailImageFiles?: File[];
    imageUrl?: string;
    images?: string[];
}