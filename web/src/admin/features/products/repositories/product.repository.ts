import type { ApiResponse } from "../../../../core/api/apiResponse";
import type { Product, GetProductsQuery, CreateProductRequest, UpdateProductRequest } from "../models/product.model";

/**
 * Interface cho Product Repository.
 * Mọi implementation (API thật hoặc Mock) đều phải tuân theo contract này.
 */
export interface IProductRepository {
    getProducts(query: GetProductsQuery): Promise<ApiResponse<Product[]>>;
    getProductById(id: string): Promise<ApiResponse<Product>>;
    deleteProduct(id: string): Promise<ApiResponse<null>>;
    createProduct(data: CreateProductRequest): Promise<ApiResponse<Product>>;
    updateProduct(id: string, data: UpdateProductRequest): Promise<ApiResponse<Product>>;
}