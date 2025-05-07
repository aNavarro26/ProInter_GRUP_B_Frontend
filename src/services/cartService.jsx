import { getUserIdFromCookie } from "../helpers/utils";

const API_URL = import.meta.env.VITE_API_URL;
export async function getCartItems(userId) {
    const response = await fetch(`${API_URL}/cart/${userId}/items/`);

    if (!response.ok) {
        throw new Error('Failed to fetch cart items');
    }
    return await response.json();
}

export async function addToCart(product) {
    const userId = getUserIdFromCookie();
    console.log('product object:', product);

    const response = await fetch(`${API_URL}/cart/my/items/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: userId,
            product: product.product_id,
            quantity: 1,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error('Failed to add item to cart: ' + errorText);
    }

    return await response.json();
}



export async function removeFromCart(userId, productId) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/${userId}/items/${productId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to remove item from cart');
    }
    return await response.json();
}

export async function updateCartQuantity(userId, productId, newQuantity) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/${userId}/items/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            quantity: newQuantity,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to update item quantity');
    }

    return await response.json();
}
