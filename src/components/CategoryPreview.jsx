import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../contexts/ProductsContext'
import '../index.css'

export default function CategoryPreview({ category, visible }) {
    const products = useProducts()
    const base = import.meta.env.BASE_URL

    // Save the selection of 8 random products by category
    const items = useMemo(() => {
        if (!category) return []
        return products
            .filter(p => p.category.name.toLowerCase() === category)
            .sort(() => Math.random() - 0.5)
            .slice(0, 8)
    }, [products, category])

    if (!visible || !items.length) return null

    return (
        <div className={`category-preview visible`}>
            <div className="preview-grid">
                {items.map(p => {
                    const [first] = p.image_url.split(',')
                    return (
                        <Link
                            key={p.product_id}
                            to={`/product/${p.product_id}`}
                            className="preview-card"
                        >
                            <div className="preview-thumb">
                                <img
                                    src={`${base}${first}`}
                                    alt={p.name}
                                    draggable={false}
                                />
                            </div>
                            <p className="preview-name">{p.name}</p>
                        </Link>
                    )
                })}
                <Link to={`/category/${category}`} className="explore-link">
                    Explore more →
                </Link>
            </div>
        </div>
    )
}
