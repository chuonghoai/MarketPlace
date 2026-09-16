import { apiClient } from "../../../../core/api/apiClient";
import type { ApiResponse } from "../../../../core/api/apiResponse";
import type { Product, GetProductsQuery, CreateProductRequest, UpdateProductRequest } from "../models/product.model";
import type { IProductRepository } from "./product.repository";

export class ProductApiRepository implements IProductRepository {
    /**
     * GET /products
     */
    async getProducts(query: GetProductsQuery): Promise<ApiResponse<Product[]>> {
        return apiClient.get<ApiResponse<Product[]>>('/products', { params: query });
    }

    /**
     * GET /products/:id
     */
    async getProductById(id: string): Promise<ApiResponse<Product>> {
        return apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    }

    /**
     * DELETE /products/:id
     */
    async deleteProduct(id: string): Promise<ApiResponse<null>> {
        return apiClient.delete<ApiResponse<null>>(`/products/${id}`);
    }

    /**
     * POST /products
     */
    async createProduct(data: CreateProductRequest): Promise<ApiResponse<Product>> {
        return apiClient.post<ApiResponse<Product>>('/products', data);
    }

    /**
     * PUT /products/:id
     */
    async updateProduct(id: string, data: UpdateProductRequest): Promise<ApiResponse<Product>> {
        return apiClient.put<ApiResponse<Product>>(`/products/${id}`, data);
    }
}