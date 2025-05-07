import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import CategoryPreview from './CategoryPreview'
import CartPreview from './CartPreview'
import '../index.css'
import { getUserIdFromCookie } from '../helpers/utils'

export default function Navbar() {
  const loc = useLocation()
  const [hoverCat, setHoverCat] = useState(null)
  const [cartHover, setCartHover] = useState(false)
  const [hasCart, setHasCart] = useState(false)
  const userId = getUserIdFromCookie()
  const userLogged = !!userId

  const categories = [
    { key: 'phone', label: 'Phone' },
    { key: 'audio', label: 'Audio' },
    { key: 'tablet', label: 'Tablet' },
    { key: 'wearables', label: 'Wearables' },
  ]

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:8000/api/cart/my/?user_id=${userId}`)
      .then(res => setHasCart(res.status === 200))
      .catch(() => setHasCart(false))
  }, [])

  return (
    <nav
      className="navbar"
      onMouseLeave={() => {
        setHoverCat(null)
        setCartHover(false)
      }}
    >
      <div className="logo">
        <Link to="/">Axion</Link>
      </div>

      <ul>
        {categories.map((cat) => (
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

      <CategoryPreview category={hoverCat} visible={!!hoverCat} />

      <div className="nav-icons">
        {userLogged ? (
          <>
            <div
              onMouseEnter={() => setCartHover(true)}
              onMouseLeave={() => setCartHover(false)}
              style={{ position: 'relative', display: 'inline-block' }}
            >
              <Link to={hasCart ? "/cart" : "/cartpage"}>🛒</Link>
              <CartPreview visible={cartHover} />
            </div>
            <Link to="/profile">👤</Link>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">SignUp</Link>
          </>
        )}
      </div>
    </nav>
  )
}
