import { createContext, useContext, useState, useEffect } from 'react';
import { getCartItems } from '../services/cartService';
import { getUserIdFromCookie } from '../helpers/utils';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [cartId, setCartId] = useState(null);
    const userId = getUserIdFromCookie();
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        if (!userId) return;
        try {
            const data = await getCartItems();
            setCartItems(data.items || []);
            setCartId(data.cart_id || null);
        } catch (err) {
            console.error('Failed to load cart:', err);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [userId]);

    const cartTotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            cartId,
            cartTotal,
            loading,
            fetchCart,
            setCartItems
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);