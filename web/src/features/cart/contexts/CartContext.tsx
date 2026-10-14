import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import type { CartItem } from "../models/cart-item.model";
import { cartService, calcTotal } from "../services/cart.service";
import { userStorageService } from "../../user/services/userStorage.service";
import { cartDebouncer } from "../services/cart.debouncer";
import { useToast } from "../../../components/toast/toast";

interface ICartContextProps {
    items: CartItem[];
    totalPrice: number;
    isLoading: boolean;
    loadCart: () => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    addToCart: (productId: string, quantity: number) => Promise<void>;
}

const CartContext = createContext<ICartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const pendingAdditions = useRef<Record<string, number>>({});
    const { toast } = useToast();

    const loadCart = useCallback(async () => {
        if (!userStorageService.getUser()) {
            setItems([]);
            return;
        }
        
        setIsLoading(true);
        const res = await cartService.getCartItems();
        if (res.success && res.data) {
            setItems(res.data);
        }
        setIsLoading(false);
    }, []);

    const updateQuantity = async (productId: string, quantity: number) => {
        if (quantity < 1) return;
        
        const currentItem = items.find(item => item.product.id === productId);
        if (currentItem && typeof currentItem.product.stock === 'number' && quantity > currentItem.product.stock) {
            toast(`Đã đạt số lượng tồn kho tối đa (${currentItem.product.stock})`, "warning");
            return;
        }

        setItems(prev => prev.map(item => 
            item.product.id === productId ? { ...item, quantity } : item
        ));

        cartDebouncer.debounce(`update_${productId}`, async () => {
            try {
                await cartService.updateQuantity(productId, quantity);
            } catch (error: any) {
                console.error("Failed to update cart quantity:", error);
                const msg = error?.response?.data?.message || "Không thể cập nhật số lượng";
                toast(msg, "error");
            } finally {
                await loadCart();
            }
        });
    };

    const removeItem = async (productId: string) => {
        setItems(prev => prev.filter(item => item.product.id !== productId));

        try {
            await cartService.removeFromCart(productId);
        } catch (error) {
            console.error("Failed to remove item from cart:", error);
        } finally {
            await loadCart();
        }
    };

    const addToCart = async (productId: string, quantity: number) => {
        const currentItem = items.find(item => item.product.id === productId);
        const currentQty = currentItem ? currentItem.quantity : 0;
        const targetQty = currentQty + quantity;

        if (currentItem && typeof currentItem.product.stock === 'number' && targetQty > currentItem.product.stock) {
            toast(`Số lượng trong giỏ sẽ vượt quá tồn kho khả dụng (còn ${currentItem.product.stock})`, "warning");
            return;
        }

        setItems(prev => {
            const exists = prev.some(item => item.product.id === productId);
            if (exists) {
                return prev.map(item => 
                    item.product.id === productId ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return prev;
        });

        if (!pendingAdditions.current[productId]) {
            pendingAdditions.current[productId] = 0;
        }
        pendingAdditions.current[productId] += quantity;

        cartDebouncer.debounce(`add_${productId}`, async () => {
            const finalQty = pendingAdditions.current[productId];
            delete pendingAdditions.current[productId];

            try {
                await cartService.addToCart(productId, finalQty);
            } catch (error: any) {
                console.error("Failed to add to cart:", error);
                const msg = error?.response?.data?.message || "Không thể thêm vào giỏ hàng";
                toast(msg, "error");
            } finally {
                await loadCart();
            }
        });
    };

    useEffect(() => {
        loadCart();

        const handleAuthChange = () => {
            loadCart();
        };

        window.addEventListener("auth_changed", handleAuthChange);
        return () => window.removeEventListener("auth_changed", handleAuthChange);
    }, [loadCart]);

    const totalPrice = calcTotal(items);

    return (
        <CartContext.Provider value={{ items, totalPrice, isLoading, loadCart, updateQuantity, removeItem, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};
