import { createContext, useContext, useEffect, useState } from "react";
import type { CartItem } from "../types/CartItem";

const CART_STORAGE_KEY = "cart";

function loadCartFromStorage(): CartItem[] {
    try {
        const raw = sessionStorage.getItem(CART_STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as CartItem[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (bookId: number, title: string, price: number, quantity: number) => void;
    removeFromCart: (bookId: number) => void;
    clearCart: () => void;
    getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>(loadCartFromStorage);

    useEffect(() => {
        sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }, [cart]);

    const addToCart = (bookId: number, title: string, price: number, quantity: number) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((c) => c.bookId === bookId);
            if (existingItem) {
                return prevCart.map((c) =>
                    c.bookId === bookId ? { ...c, quantity: c.quantity + quantity } : c
                );
            }
            return [...prevCart, { bookId, title, price, quantity }];
        });
    };

    const removeFromCart = (bookId: number) => {
        setCart((prevCart) => prevCart.filter((c) => c.bookId !== bookId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const getTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
