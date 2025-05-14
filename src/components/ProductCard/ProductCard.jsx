import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../index.css'
import './ProductCard.css';

export default function ProductCard({ product }) {
    const [hovered, setHovered] = useState(false)
    const first = product.image_url?.[0] || ''
    const second = product.image_url?.[1] || first

    return (
        <Link
            to={`/product/${product.product_id}`}
            className="product-card"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="card-image">
                <img
                    src={hovered ? second : first}
                    alt={product.name}
                />
            </div>
            <div className="card-info">
                <h4>{product.name}</h4>
                <p className="price">€{product.price.toFixed(2)}</p>
            </div>
        </Link>
    )
}