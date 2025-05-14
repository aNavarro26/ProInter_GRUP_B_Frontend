import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './adminStyles.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminProductList() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/products/`);
            if (!res.ok) throw new Error('Error fetching products');
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error('Error fetching products:', err);
            alert('Unable to load products.');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            const res = await fetch(`${API_URL}/products/${id}/`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Error deleting product');
            fetchProducts();
        } catch (err) {
            console.error('Error deleting product:', err);
            alert('Error deleting product.');
        }
    };

    return (
        <div className="admin-products">
            <button
                className="back-icon"
                onClick={() => navigate('/profile')}
                aria-label="Go back"
            >
                ‹
            </button>

            <h1>Product Management</h1>
            <Link to="/admin/products/new" className="btn">Add Product</Link>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <tr key={p.product_id}>
                            <td>{p.product_id}</td>
                            <td>{p.name}</td>
                            <td>${p.price.toFixed(2)}</td>
                            <td>
                                <Link to={`/admin/products/${p.product_id}/edit`} className="action-link">
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(p.product_id)}
                                    className="action-delete"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
