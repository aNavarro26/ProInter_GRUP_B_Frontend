import { useState, useEffect } from 'react';
import { getCartItems, removeFromCart, updateCartQuantity } from '../services/cartService';
import Navbar from '../components/Navbar';
import './CartPage.css';

export default function CartPage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    const cartItems = Array.isArray(cart?.items) ? cart.items : [];
    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const data = await getCartItems();
            setCart(data);
        } catch (err) {
            console.error('Failed to load cart:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = async (id, qty) => {
        if (qty < 1) return;
        try {
            await updateCartQuantity(id, qty);
            fetchCart();
        } catch (err) {
            console.error('Error updating quantity:', err);
        }
    };

    const handleRemove = async (id) => {
        try {
            await removeFromCart(id);
            fetchCart();
        } catch (err) {
            console.error('Error removing item:', err);
        }
    };

    if (loading) return <div className="cart-page"><div className="cart-container"><p>Loading...</p></div></div>;

    return (
        <>
            <Navbar />
            <div className="cart-page">
                <div className="cart-container">
                    <h1>🛒 Your Shopping Cart</h1>
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        <>
                            {cartItems.map((item) => {
                                const { product } = item;
                                const firstImage = product.image_url?.split(',')[0];

                                return (
                                    <div key={item.cart_item_id} className="cart-item">
                                        <img
                                            src={`${import.meta.env.BASE_URL}${firstImage}`}
                                            alt={product.name}
                                            className="cart-item-image"
                                        />
                                        <div className="cart-item-details">
                                            <h2 className="cart-item-title">{product.name}</h2>
                                            <p className="cart-item-description">
                                                {product.description.split(';')[0]}
                                            </p>
                                            <p className="cart-item-price">€{item.price.toFixed(2)}</p>

                                            <div className="cart-item-controls">
                                                <button
                                                    className="quantity-button"
                                                    onClick={() => handleQuantityChange(item.cart_item_id, item.quantity - 1)}
                                                >−</button>
                                                <span className="quantity-display">{item.quantity}</span>
                                                <button
                                                    className="quantity-button"
                                                    onClick={() => handleQuantityChange(item.cart_item_id, item.quantity + 1)}
                                                >+</button>
                                            </div>
                                        </div>

                                        <div className="cart-item-actions">
                                            <p className="cart-item-subtotal">€{(item.price * item.quantity).toFixed(2)}</p>
                                            <button
                                                onClick={() => handleRemove(item.cart_item_id)}
                                                className="remove-button"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="cart-summary">
                                <h3>Total: €{total.toFixed(2)}</h3>
                                <button className="checkout-button">Proceed to Checkout</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
