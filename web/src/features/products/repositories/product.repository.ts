import type { ApiResponse } from "../../../core/api/apiResponse";
import type { FilterState } from "../../../pages/marketplace/components/filter/filter.type";
import type { ProductItem } from "../models/product.model";
import type { ProductDetail } from "../models/productDetail.model";

export interface ProductRepository {
    getAllProducts(page: number, pageSize: number, filters?: FilterState, search?: string): Promise<ApiResponse<ProductItem[]>>;
    getProductById(id: string): Promise<ApiResponse<ProductDetail>>;
    toggleFavorite(productId: string): Promise<ApiResponse<null>>;
}