import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getProductById } from '../services/productService'
import { addToCart } from '../services/cartService'
import Navbar from '../components/Navbar'
import '../index.css'
import { getUserIdFromCookie } from '../helpers/utils'
import { useCart } from '../contexts/CartContext';

export default function ProductDetail() {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [current, setCurrent] = useState(0)
    const [message, setMessage] = useState('')
    const { fetchCart } = useCart()

    useEffect(() => {
        getProductById(id)
            .then(data => {
                setProduct(data)
                setCurrent(0)
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <div className="spinner" />
    if (!product) return <p style={{ textAlign: 'center' }}>Product not found</p>

    const images = product.image_url.split(',')
    const [briefDesc, fullDesc] = (product.description || '')
        .split(';')
        .map(s => s.trim())

    const prev = () => setCurrent(i => (i === 0 ? images.length - 1 : i - 1))
    const next = () => setCurrent(i => (i === images.length - 1 ? 0 : i + 1))

    const handleAddToCart = async () => {
        try {
            const userId = getUserIdFromCookie();
            if (!userId) {
                setMessage('You must be logged in to add items to cart');
                return;
            }
            console.log("product before sending:", product)
            const result = await addToCart(product);
            await fetchCart();
            setMessage('Product added to cart!');
            console.log('Added to cart:', result);
        } catch (error) {
            setMessage('Failed to add to cart');
            console.error('Error adding to cart:', error.message);
        }
    };

    return (
        <>
            <Navbar />
            <div className="fade-page product-detail-container">
                <div className="slider">
                    {images.map((src, i) => (
                        <img
                            key={i}
                            src={`${import.meta.env.BASE_URL}${src}`}
                            alt={product.name}
                            className={i === current ? 'slide active' : 'slide'}
                        />
                    ))}
                    <button className="arrow left" onClick={prev}>&lsaquo;</button>
                    <button className="arrow right" onClick={next}>&rsaquo;</button>
                    <div className="dots">
                        {images.map((_, i) => (
                            <span
                                key={i}
                                className={i === current ? 'dot active' : 'dot'}
                                onClick={() => setCurrent(i)}
                            />
                        ))}
                    </div>
                </div>

                <div className="product-detail-info">
                    <h1>{product.name}</h1>
                    <p className="price-detail">€{product.price.toFixed(2)}</p>
                    <p className="description">{briefDesc}</p>
                    <div className="rating">
                        {[...Array(5)].map((_, i) => (
                            <span
                                key={i}
                                className={`star${i < Math.round(product.rating) ? ' filled' : ''}`}
                            >★</span>
                        ))}
                    </div>
                    <button className="add-to-cart-button" onClick={handleAddToCart}>
                        Add to cart
                    </button>
                    {message && <p className="message">{message}</p>}
                    <div className="full-desc">{fullDesc}</div>
                </div >
            </div >
        </>
    )

}
