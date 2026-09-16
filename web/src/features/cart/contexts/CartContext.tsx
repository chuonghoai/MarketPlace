import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import type { CartItem } from "../models/cart-item.model";
import { cartService, calcTotal } from "../services/cart.service";
import { userStorageService } from "../../user/services/userStorage.service";
import { cartDebouncer } from "../services/cart.debouncer";

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
        
        setItems(prev => prev.map(item => 
            item.product.id === productId ? { ...item, quantity } : item
        ));

        cartDebouncer.debounce(`update_${productId}`, async () => {
            try {
                await cartService.updateQuantity(productId, quantity);
            } catch (error) {
                console.error("Failed to update cart quantity:", error);
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
            } catch (error) {
                console.error("Failed to add to cart:", error);
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
