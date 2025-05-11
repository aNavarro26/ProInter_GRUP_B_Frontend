import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { getUserIdFromCookie } from '../helpers/utils';
import './CheckoutPage.css';

export default function CheckoutPage() {
    const { cartItems, cartId } = useCart();
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
        const form = e.target;

        // Payment
        const method = form.method.value;
        const cardNumber = form.card.value.trim();
        const cvv = form.cvv.value.trim();
        const expiry = form.expiry.value;

        // Shipping
        const shipping = {
            firstName: form.firstName.value.trim(),
            lastName: form.lastName.value.trim(),
            street: form.street.value.trim(),
            houseNumber: form.houseNumber.value.trim(),
            apartment: form.apartment.value.trim(),
            postalCode: form.postalCode.value.trim(),
            city: form.city.value.trim(),
            state: form.state.value,
            notes: form.notes.value.trim(),
        };

        // Validates
        if (
            !userId ||
            !method ||
            cardNumber.length < 12 ||
            cvv.length < 3 ||
            !expiry ||
            !shipping.firstName ||
            !shipping.lastName ||
            !shipping.street ||
            !shipping.houseNumber ||
            !shipping.postalCode ||
            !shipping.city ||
            !shipping.state
        ) {
            setError('Por favor, completa todos los campos requeridos correctamente.');
            return;
        }

        // Body
        const payload = {
            customer: Number(userId),
            total,
            items: cartItems.map(it => ({
                product: it.product.product_id,
                quantity: it.quantity,
                price: it.price,
                subtotal: it.subtotal
            })),
            shipping: {
                name: `${shipping.firstName} ${shipping.lastName}`,
                address: `${shipping.street} ${shipping.houseNumber}${shipping.apartment ? ', ' + shipping.apartment : ''}`,
                postal_code: shipping.postalCode,
                city: shipping.city,
                state: shipping.state,
                notes: shipping.notes
            },
            payment: {
                method,
                card_number: cardNumber,
                expiry,
                cvv
            }
        };

        setSubmitting(true);
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/orders/${location.state.orderId}/status/`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        status: 'Completed',
                        customer: Number(userId)
                    })
                }
            );
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || 'Error actualizando el pedido');
            }
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
