import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../../contexts/ProductsContext'
import './searchStyles.css'

export default function SearchPreview({ visible, query, onChangeQuery }) {
    const products = useProducts()

    const results = useMemo(() => {
        if (!query) return []
        const q = query.toLowerCase()
        return products
            .filter(p => p.name.toLowerCase().includes(q))
            .slice(0, 8)
    }, [query, products])

    if (!visible) return null

    return (
        <div className="search-preview">
            <input
                type="text"
                className="search-input"
                placeholder="Search products..."
                value={query}
                onChange={e => onChangeQuery(e.target.value)}
                autoFocus
            />
            <ul className="search-results">
                {results.length > 0 ? results.map(p => (
                    <li key={p.product_id}>
                        <Link to={`/product/${p.product_id}`}>
                            <img src={p.image_url?.[0]} alt={p.name} className="sr-thumb" />
                            <div className="sr-info">
                                <span className="sr-name">{p.name}</span>
                                <span className="sr-price">€{p.price.toFixed(2)}</span>
                            </div>
                        </Link>
                    </li>
                )) : (
                    <li className="no-results">No matches</li>
                )}
            </ul>
        </div>
    )
}
