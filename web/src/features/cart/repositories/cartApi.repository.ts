import { apiClient } from "../../../core/api/apiClient";
import type { ApiResponse } from "../../../core/api/apiResponse";
import type { CartItem } from "../models/cart-item.model";
import type { CartRepository } from "./cart.repository";

export class CartApiRepository implements CartRepository {
    /**
     * GET /cart/count
     * @returns totalCartItems
     */
    async getCartCount(): Promise<ApiResponse<{ totalCartItems: number }>> {
        return apiClient.get<ApiResponse<{ totalCartItems: number }>>("/cart/count");
    }

    /**
     * POST /cart/items
     * @body productId 
     * @body quantity 
     * @returns totalCartItems
     */
    async addToCart(productId: string, quantity: number): Promise<ApiResponse<{ totalCartItems: number }>> {
        return apiClient.post<ApiResponse<{ totalCartItems: number }>>("/cart/items", { productId, quantity });
    }

    /**
     * GET /cart/items
     * @returns CartItem[]
     */
    async getCartItems(): Promise<ApiResponse<CartItem[]>> {
        return apiClient.get<ApiResponse<CartItem[]>>("/cart/items");
    }

    /**
     * PUT /cart/items/{productId}
     * @body quantity 
     * @returns totalCartItems
     */
    async updateQuantity(productId: string, quantity: number): Promise<ApiResponse<{ totalCartItems: number }>> {
        return apiClient.put<ApiResponse<{ totalCartItems: number }>>(`/cart/items/${productId}`, { quantity });
    }

    /**
     * DELETE /cart/items/{productId}
     * @returns totalCartItems
     */
    async removeFromCart(productId: string): Promise<ApiResponse<{ totalCartItems: number }>> {
        return apiClient.delete<ApiResponse<{ totalCartItems: number }>>(`/cart/items/${productId}`);
    }
}