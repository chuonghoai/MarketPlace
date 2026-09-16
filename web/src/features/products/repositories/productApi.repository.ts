import { apiClient } from "../../../core/api/apiClient";
import type { ApiResponse } from "../../../core/api/apiResponse";
import type { FilterState } from "../../../pages/marketplace/components/filter/filter.type";
import type { ProductItem } from "../models/product.model";
import type { ProductDetail } from "../models/productDetail.model";
import type { ProductRepository } from "./product.repository";

export class ProductApiRepository implements ProductRepository {
    /**
     * GET /products
     * @param page - Trang hiện tại
     * @param pageSize - Số lượng item mỗi trang
     * @param filters - Các điều kiện lọc (có thể null)
     * @returns - List ProductItem[]
     */
    getAllProducts(
        page: number,
        pageSize: number,
        filters?: FilterState,
        search?: string
    ): Promise<ApiResponse<ProductItem[]>> {
        return apiClient.get<ApiResponse<ProductItem[]>>("/products", {
            params: {
                page,
                pageSize,
                filters,
                search
            }
        });
    }

    /**
     * GET /products/:id
     * @param id 
     * @returns - ProductDetail
     */
    getProductById(id: string): Promise<ApiResponse<ProductDetail>> {
        return apiClient.get<ApiResponse<ProductDetail>>(`/products/${id}`);
    }

    /**
     * POST /products/:id/favorite
     * @param productId 
     * @returns null
     */
    toggleFavorite(productId: string): Promise<ApiResponse<null>> {
        return apiClient.post<ApiResponse<null>>(`/products/${productId}/favorite`);
    }
}