const API_URL = import.meta.env.VITE_API_URL;

export async function getProducts() {
    const res = await fetch(`${API_URL}/products/`);
    if (!res.ok) {
        throw new Error('Failed to fetch products');
    }
    return await res.json();
}

export async function getProductById(id) {
    const res = await fetch(`${API_URL}/products/${id}/`);
    if (!res.ok) {
        throw new Error('Failed to fetch product');
    }
    return await res.json();
}
