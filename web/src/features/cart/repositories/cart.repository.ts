import type { ApiResponse } from "../../../core/api/apiResponse";
import type { CartItem } from "../models/cart-item.model";

export interface CartRepository {
    getCartCount(): Promise<ApiResponse<{ totalCartItems: number }>>;
    addToCart(productId: string, quantity: number): Promise<ApiResponse<{ totalCartItems: number }>>;
    getCartItems(): Promise<ApiResponse<CartItem[]>>;
    updateQuantity(productId: string, quantity: number): Promise<ApiResponse<{ totalCartItems: number }>>;
    removeFromCart(productId: string): Promise<ApiResponse<{ totalCartItems: number }>>;
}