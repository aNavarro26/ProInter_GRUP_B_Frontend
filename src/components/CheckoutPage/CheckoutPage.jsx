import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { getUserIdFromCookie } from '../../helpers/utils';
import './CheckoutPage.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function CheckoutPage() {
    const { cartItems, cartId, setCartItems } = useCart();
    const location = useLocation();
    const navigate = useNavigate();
    const userId = getUserIdFromCookie();

    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        const form = e.target;
        const rawCard = form.card.value.trim();
        const cardNumber = rawCard.replace(/\s+/g, '');

        const payment = {
            method: form.method.value,
            card_number: cardNumber,
            cvv: form.cvv.value.trim(),
            expiry: form.expiry.value,
        };

        const shipping = {
            name: `${form.firstName.value.trim()} ${form.lastName.value.trim()}`,
            address: `${form.street.value.trim()} ${form.houseNumber.value.trim()}${form.apartment.value.trim() ? ', ' + form.apartment.value.trim() : ''}`,
            postal_code: form.postalCode.value.trim(),
            city: form.city.value.trim(),
            state: form.state.value,
            notes: form.notes.value.trim(),
        };

        if (
            !userId ||
            !payment.method ||
            cardNumber.length < 12 ||
            payment.cvv.length < 3 ||
            !payment.expiry ||
            !shipping.name ||
            !shipping.address ||
            !shipping.postal_code ||
            !shipping.city ||
            !shipping.state
        ) {
            setError('Por favor, completa todos los campos requeridos correctamente.');
            setSubmitting(false);
            return;
        }

        try {
            const res = await fetch(
                `${API_URL}/orders/${location.state.orderId}/status/`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        customer: Number(userId),
                        status: 'Completed',
                        payment,
                        shipping
                    })
                }
            );
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || 'Error actualizando el pedido');
            }

            if (cartId) {
                const delRes = await fetch(
                    `${API_URL}/cart/${cartId}/?user_id=${userId}`,
                    { method: 'DELETE' }
                )
                if (!delRes.ok) {
                    console.warn('No se pudo eliminar el carrito en backend');
                }
            }

            setCartItems([]);

            navigate('/order-success', { state: { orderId: location.state.orderId } });
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="checkout-page">
            <h2>Checkout Summary</h2>
            <p><strong>Total:</strong> €{total.toFixed(2)}</p>
            <p><strong>Number of Items:</strong> {itemCount}</p>
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <h3>Payment Details</h3>
                <div>
                    <label>Payment Method*:</label>
                    <select name="method" required disabled={submitting}>
                        <option value="">--Select--</option>
                        <option value="visa">Visa</option>
                        <option value="mastercard">MasterCard</option>
                        <option value="paypal">PayPal</option>
                    </select>
                </div>

                <div>
                    <label>Credit Card Number*:</label>
                    <input type="text" name="card" required disabled={submitting} />
                </div>

                <div>
                    <label>CVV*:</label>
                    <input type="text" name="cvv" required minLength={3} maxLength={4} disabled={submitting} />
                </div>

                <div>
                    <label>Expiry Date*:</label>
                    <input type="month" name="expiry" required disabled={submitting} />
                </div>

                <h3>Delivery Information</h3>
                <div className="delivery-address">
                    <div className="form-row">
                        <input type="text" name="firstName" placeholder="First Name *" required disabled={submitting} />
                        <input type="text" name="lastName" placeholder="Last Name *" required disabled={submitting} />
                    </div>
                    <div className="form-row">
                        <input type="text" name="street" placeholder="Street *" required disabled={submitting} />
                        <input type="text" name="houseNumber" placeholder="House Number *" required disabled={submitting} />
                    </div>
                    <div className="form-row">
                        <input type="text" name="apartment" placeholder="Apt/Suite (opt)" disabled={submitting} />
                    </div>
                    <div className="form-row">
                        <input type="text" name="postalCode" placeholder="Postal Code *" required disabled={submitting} />
                        <input type="text" name="city" placeholder="City *" required disabled={submitting} />
                        <select name="state" required disabled={submitting}>
                            <option value="">State/Province *</option>
                            <option value="A Coruña">A Coruña</option>
                            <option value="Barcelona">Barcelona</option>
                            <option value="Madrid">Madrid</option>
                            <option value="Tarragona">Tarragona</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label>Delivery Notes:</label>
                    <textarea name="notes" placeholder="Optional notes..." rows="4" disabled={submitting} />
                </div>
                <button type="submit" disabled={submitting}>
                    {submitting ? 'Processing…' : 'Confirm Purchase'}
                </button>
            </form>
        </div>
    );
}
