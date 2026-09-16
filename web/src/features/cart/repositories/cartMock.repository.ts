import type { ApiResponse } from "../../../core/api/apiResponse";
import type { CartItem } from "../models/cart-item.model";
import type { CartRepository } from "./cart.repository";
import { productService } from "../../products/services/product.service";

export class CartMockRepository implements CartRepository {
    private mockTotalItems = 0;
    private mockItems: CartItem[] = [];

    async getCartCount(): Promise<ApiResponse<{ totalCartItems: number; }>> {
        return { success: true, message: "OK", data: { totalCartItems: this.mockTotalItems } };
    }

    async addToCart(productId: string, quantity: number): Promise<ApiResponse<{ totalCartItems: number }>> {
        const existing = this.mockItems.find(i => i.product.id === productId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            const productRes = await productService.getProductById(productId);
            const pData = productRes.data;

            this.mockItems.push({
                product: {
                    id: productId,
                    name: pData?.name || `Sản phẩm thủ công #${productId.substring(0, 4)}`,
                    imageUrl: pData?.imageUrl || `https://picsum.photos/seed/${productId}/300/400`,
                    price: pData?.price || Math.floor(Math.random() * 3 + 1) * 150000,
                    seller: {
                        id: "1bc",
                        avatarUrl: "https://example.jpg",
                        name: "John Doe",
                        averageRating: 4.5
                    },
                    description: ""
                },
                quantity
            });
        }
        this.mockTotalItems += quantity;
        return { success: true, message: "Thêm thành công", data: { totalCartItems: this.mockTotalItems } };
    }

    async getCartItems(): Promise<ApiResponse<CartItem[]>> {
        return { success: true, message: "OK", data: [...this.mockItems] };
    }

    async updateQuantity(productId: string, quantity: number): Promise<ApiResponse<{ totalCartItems: number }>> {
        const item = this.mockItems.find(i => i.product.id === productId);
        if (item) {
            this.mockTotalItems += (quantity - item.quantity);
            item.quantity = quantity;
        }
        return { success: true, message: "Cập nhật thành công", data: { totalCartItems: this.mockTotalItems } };
    }

    async removeFromCart(productId: string): Promise<ApiResponse<{ totalCartItems: number }>> {
        const itemIndex = this.mockItems.findIndex(i => i.product.id === productId);
        if (itemIndex > -1) {
            this.mockTotalItems -= this.mockItems[itemIndex].quantity;
            this.mockItems.splice(itemIndex, 1);
        }
        return { success: true, message: "Xóa thành công", data: { totalCartItems: this.mockTotalItems } };
    }
}