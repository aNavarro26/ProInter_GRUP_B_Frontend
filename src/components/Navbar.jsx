import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import CategoryPreview from './CategoryPreview'
import '../index.css'

export default function Navbar() {
    const loc = useLocation()
    const [hoverCat, setHoverCat] = useState(null)

    const categories = [
        { key: 'phone', label: 'Phone' },
        { key: 'audio', label: 'Audio' },
        { key: 'tablet', label: 'Tablet' },
        { key: 'wearables', label: 'Wearables' },
    ]

    return (
        <nav
            className="navbar"
            onMouseLeave={() => setHoverCat(null)}
        >
            <div className="logo">
                <Link to="/">Axion</Link>
            </div>
            <ul>
                {categories.map(cat => (
                    <li
                        key={cat.key}
                        className={loc.pathname === `/category/${cat.key}` ? 'active' : ''}
                        onMouseEnter={() => setHoverCat(cat.key)}
                    >
                        <Link to={`/category/${cat.key}`}>{cat.label}</Link>
                    </li>
                ))}
                <li className={loc.pathname === '/about' ? 'active' : ''}>
                    <Link to="/about">About</Link>
                </li>
            </ul>

            {/*
    The preview is mounted here, as a direct son of <nav>,
        so that the absolute position is calculated with respect to the Navbar.
      */}
            <CategoryPreview
                category={hoverCat}
                visible={!!hoverCat}
            />

            <div className="nav-icons">
                <Link to="/cart">🛒</Link>
                <Link to="/profile">👤</Link>
            </div>
        </nav>
    )
}
