import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './adminStyles.css';

const API_URL = import.meta.env.VITE_API_URL;
const SERIES_OPTIONS = ['Flagship', 'Mid-range', 'Budget'];
const CATEGORY_OPTIONS = [
    { category_id: 1, name: 'Phone' },
    { category_id: 2, name: 'Audio' },
    { category_id: 3, name: 'Tablet' },
    { category_id: 4, name: 'Wearables' }
];

export default function ProductForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        series: '',
        category_id: '',
        rating: ''
    });
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [originalImageUrl, setOriginalImageUrl] = useState('');

    // Load existing product if editing
    useEffect(() => {
        if (!isEdit) return;
        fetch(`${API_URL}/products/${id}/`)
            .then(r => r.json())
            .then(data => {
                setForm({
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    stock: data.stock,
                    series: data.series,
                    category_id: data.category.category_id,
                    rating: data.rating
                });
                setPreviews(data.image_url);
                setOriginalImageUrl(
                    // We reconvert absolute urls to the internal chain
                    data.image_url
                        .map(url => url.split('/').pop())          // ex "38-1.jpg"
                        .map(name => `products/${name}`)           // "products/38-1.jpg"
                        .join(',')
                );
            })
            .catch(console.error);
    }, [id, isEdit]);

    // Show previews for selected files
    useEffect(() => {
        if (!files.length) return;
        setPreviews(files.map(f => URL.createObjectURL(f)));
    }, [files]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const onDragOver = e => e.preventDefault();
    const onDrop = e => {
        e.preventDefault();
        const dropped = Array.from(e.dataTransfer.files).filter(f =>
            f.type.startsWith('image/')
        );
        if (dropped.length !== 2) {
            return alert('Please upload exactly two images.');
        }
        setFiles(dropped);
    };
    const handleFileInput = e => {
        const selected = Array.from(e.target.files).filter(f =>
            f.type.startsWith('image/')
        );
        if (selected.length !== 2) {
            return alert('Please select exactly two images.');
        }
        setFiles(selected);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!isEdit && files.length !== 2) {
            return alert('Please upload two images before submitting.');
        }

        let initImageUrl = originalImageUrl; // If we edit and there are no files, we reuse it
        if (files.length) {
            const initNames = files.map(f => f.name);
            initImageUrl = initNames.map(n => `products/${n}`).join(',');
        }

        const payload = { ...form, image_url: initImageUrl };
        const method = isEdit ? 'PUT' : 'POST';
        const url = isEdit
            ? `${API_URL}/products/${id}/`
            : `${API_URL}/products/`;

        const resJson = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!resJson.ok) {
            console.error('Error saving product JSON:', await resJson.text());
            return alert('Error saving product details.');
        }
        const saved = await resJson.json();
        const prodId = saved.product_id;

        const fd = new FormData();
        let finalImageUrl = originalImageUrl;
        if (files.length) {
            // rename files
            const renamed = files.map((f, idx) => {
                const ext = f.name.split('.').pop();
                return new File([f], `${prodId}-${idx + 1}.${ext}`, { type: f.type });
            });
            finalImageUrl = renamed.map(f => `products/${f.name}`).join(',');
            renamed.forEach(file => fd.append('images', file));
        }
        // Append all text fields + rating + final image_url
        for (const [key, val] of Object.entries({ ...form, image_url: finalImageUrl })) {
            fd.append(key, val);
        }

        const uploadRes = await fetch(`${API_URL}/products/${prodId}/`, {
            method: 'PUT',
            body: fd
        });
        if (!uploadRes.ok) {
            console.error('Error uploading files:', await uploadRes.text());
            return alert('Error uploading images.');
        }

        navigate('/admin/products');
    };

    return (
        <form className="product-form" onSubmit={handleSubmit}>
            <button
                type="button"
                className="back-icon"
                onClick={() => navigate(-1)}
                aria-label="Go Back"
            >
                ‹
            </button>

            <h1>{isEdit ? 'Edit Product' : 'New Product'}</h1>
            <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                required
            />
            <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Product Description"
                required
            />
            <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                required
            />
            <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock"
                required
            />
            <input
                type="number"
                step="0.1"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                placeholder="Rating (e.g., 4.5)"
                required
            />
            <select
                name="series"
                value={form.series}
                onChange={handleChange}
                required
            >
                <option value="">Select Series</option>
                {SERIES_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
            <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                required
            >
                <option value="">Select Category</option>
                {CATEGORY_OPTIONS.map(c => (
                    <option key={c.category_id} value={c.category_id}>
                        {c.name}
                    </option>
                ))}
            </select>

            <div className="drop-zone" onDragOver={onDragOver} onDrop={onDrop}>
                {previews.length === 2 ? (
                    previews.map((src, i) => (
                        <img key={i} src={src} alt={`Preview ${i + 1}`} />
                    ))
                ) : (
                    <p>Drag and drop two images, or click to select</p>
                )}
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileInput}
                />
            </div>

            <button type="submit">{isEdit ? 'Save' : 'Create'}</button>
        </form>
    );
}
