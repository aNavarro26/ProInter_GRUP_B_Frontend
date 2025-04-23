import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../index.css'

export default function ProductCard({ product }) {
    const [hovered, setHovered] = useState(false)
    const [first, second] = product.image_url.split(',')

    return (
        <Link
            to={`/product/${product.product_id}`}
            className="product-card"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="card-image">
                <img
                    src={`${import.meta.env.BASE_URL}${hovered ? second : first}`}
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
