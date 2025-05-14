import { useCart } from '../../contexts/CartContext';
import { removeFromCart, updateCartQuantity } from '../../services/cartService';
import { createOrder } from '../../services/orderService';
import './CartPage.css';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
    const { cartItems, cartId, loading, fetchCart } = useCart();
    const navigate = useNavigate();

    const handleQuantityChange = async (itemId, qty) => {
        if (qty < 1 || !cartId) return;
        try {
            await updateCartQuantity(cartId, itemId, qty);
            await fetchCart();
        } catch (err) {
            console.error('Error updating quantity:', err);
        }
    };

    const handleRemove = async (itemId) => {
        if (!cartId) return;
        try {
            await removeFromCart(cartId, itemId);
            await fetchCart();
        } catch (err) {
            console.error('Error removing item:', err);
        }
    };

    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    if (loading) {
        return (
            <div className="cart-page">
                <div className="cart-container">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="cart-page">
                <div className="cart-container">
                    <h1>🛒 Your Shopping Cart</h1>
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        <>
                            {cartItems.map((item) => {
                                const { product } = item;
                                const firstImage = product.image_url?.[0] || '/default.jpg';

                                return (
                                    <div key={item.cart_item_id} className="cart-item">
                                        <img
                                            src={firstImage}
                                            alt={product.name}
                                            className="cart-item-image"
                                            onError={(e) => {
                                                e.target.src = '/default.jpg';
                                            }}
                                        />
                                        <div className="cart-item-details">
                                            <h2 className="cart-item-title">{product.name}</h2>
                                            <p className="cart-item-description">
                                                {product.description?.split(';')[0] || 'No description available'}
                                            </p>
                                            <p className="cart-item-price">€{item.price.toFixed(2)}</p>
                                            <div className="cart-item-controls">
                                                <button
                                                    className="quantity-button"
                                                    onClick={() =>
                                                        handleQuantityChange(item.cart_item_id, item.quantity - 1)
                                                    }
                                                >
                                                    −
                                                </button>
                                                <span className="quantity-display">{item.quantity}</span>
                                                <button
                                                    className="quantity-button"
                                                    onClick={() =>
                                                        handleQuantityChange(item.cart_item_id, item.quantity + 1)
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div className="cart-item-actions">
                                            <p className="cart-item-subtotal">
                                                €{(item.price * item.quantity).toFixed(2)}
                                            </p>
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
                                <button
                                    className="checkout-button"
                                    onClick={async () => {
                                        try {
                                            const order = await createOrder(cartItems);
                                            navigate('/checkout', {
                                                state: {
                                                    orderId: order.order_id,
                                                    total,
                                                    itemCount
                                                }
                                            });
                                        } catch (err) {
                                            console.error('Error creating order:', err);
                                            alert('Could not create order. Please try again.');
                                        }
                                    }}
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
