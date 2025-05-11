import { getUserIdFromCookie } from '../helpers/utils';
const API_URL = import.meta.env.VITE_API_URL;

export async function createOrder(cartItems) {
    const userId = getUserIdFromCookie();
    if (!userId) throw new Error("User not logged in");
    if (!cartItems.length) throw new Error("Cart is empty");

    const payload = {
        customer: Number(userId),
        status: "Pending",
        order_date: new Date()
            .toISOString()
            .slice(0, 10),
        items_data: cartItems.map(item => ({
            product: item.product.product_id,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal
        }))
    };

    const res = await fetch(`${API_URL}/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Error details:", errData);
        throw new Error("Error creating order");
    }
    return res.json();
}
