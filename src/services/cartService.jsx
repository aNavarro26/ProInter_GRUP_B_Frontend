import { getUserIdFromCookie } from "../helpers/utils";

const API_URL = import.meta.env.VITE_API_URL;
export async function getCartItems() {
    const userId = getUserIdFromCookie();
    const response = await fetch(`${API_URL}/cart/my/?user_id=${userId}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch cart items');
    }
    return await response.json();
}

export async function addToCart(product) {
    const userId = getUserIdFromCookie();
    const response = await fetch(`${API_URL}/cart/my/items/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: userId,
            product_id: product.product_id,
            quantity: 1,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error('Failed to add item to cart: ' + errorText);
    }

    return await response.json();
}

export async function removeFromCart(cartId, cartItemId) {
    const userId = getUserIdFromCookie();
    const response = await fetch(
        `${API_URL}/cart/${cartId}/items/${cartItemId}/?user_id=${userId}`,
        {
            method: 'DELETE',
        }
    );

    if (!response.ok) {
        throw new Error('Failed to remove item from cart');
    }
    return true;
}

export async function updateCartQuantity(cartId, cartItemId, newQuantity) {
    const userId = getUserIdFromCookie();
    const response = await fetch(
        `${API_URL}/cart/${cartId}/items/${cartItemId}/`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                quantity: newQuantity,
            }),
        }
    );

    if (!response.ok) {
        throw new Error('Failed to update item quantity');
    }

    return await response.json();
}