import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useCart } from '../../contexts/CartContext'
import CategoryPreview from '../CategoryPreview/CategoryPreview'
import CartPreview from '../CartPreview/CartPreview'
import ProfilePreview from '../ProfilePreview/ProfilePreview'
import SearchPreview from '../SearchPreview/SearchPreview'
import '../../index.css'
import './Navbar.css'
import '../CartPage/CartPage.css'
import { getUserIdFromCookie } from '../../helpers/utils'
import logo from '../../assets/logo.png'
import logoName from '../../assets/logo-name.png'

export default function Navbar({
  onCategoryHover = () => { },
  onSearchHover = () => { },
  onCartHover = () => { },
  onProfileHover = () => { }
}) {
  const loc = useLocation()
  const { cartItems, cartTotal } = useCart()
  const userId = getUserIdFromCookie()
  const userLogged = !!userId

  const [hoverCat, setHoverCat] = useState(false)
  const [searchHover, setSearchHover] = useState(false)
  const [searchActive, setSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cartHover, setCartHover] = useState(false)
  const [profileHover, setProfileHover] = useState(false)
  const searchRef = useRef()

  useEffect(() => { onCategoryHover(!!hoverCat) }, [hoverCat, onCategoryHover])
  useEffect(() => { onSearchHover(searchHover || searchActive) }, [searchHover, searchActive, onSearchHover])
  useEffect(() => { onCartHover(!!cartHover) }, [cartHover, onCartHover])
  useEffect(() => { onProfileHover(!!profileHover) }, [profileHover, onProfileHover])

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchActive(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const categories = [
    { key: 'phone', label: 'Phone' },
    { key: 'audio', label: 'Audio' },
    { key: 'tablet', label: 'Tablet' },
    { key: 'wearables', label: 'Wearables' }
  ]
  const showSearch = searchHover || searchActive
  const hasItems = cartItems.length > 0

  return (
    <nav className="navbar" onMouseLeave={() => setHoverCat(false)}>
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Axion logo" className="logo-icon" />
          <img src={logoName} alt="Axion name" className="logo-name" />
        </Link>
      </div>

      <ul className="nav-links">
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

      <CategoryPreview category={hoverCat} visible={!!hoverCat} />

      <div className="nav-icons">

        {/* Search */}
        <div
          ref={searchRef}
          className="nav-icon search-icon"
          onMouseEnter={() => setSearchHover(true)}
          onMouseLeave={() => setSearchHover(false)}
          onClick={() => setSearchActive(a => !a)}
        >
          🔍
          <SearchPreview
            visible={showSearch}
            query={searchQuery}
            onChangeQuery={setSearchQuery}
          />
        </div>

        {/* Cart */}
        <div
          className="nav-icon cart-icon"
          onMouseEnter={() => setCartHover(true)}
          onMouseLeave={() => setCartHover(false)}
        >
          <Link to={hasItems ? '/cartpage' : '/cart'}>🛒</Link>

          {cartHover && hasItems && (
            <div className="cart-hover-preview">
              {cartItems.slice(0, 3).map(item => (
                <div key={item.cart_item_id} className="cart-hover-item">
                  <img
                    src={item.product.image_url?.[0] || '/default.jpg'}
                    alt={item.product.name}
                    className="cart-hover-img"
                    onError={e => { e.target.src = '/default.jpg' }}
                  />
                  <div className="cart-hover-details">
                    <span className="name">{item.product.name}</span>
                    <span className="qty-price">
                      x{item.quantity} – €{item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
              {cartItems.length > 3 && (
                <div className="cart-hover-more">
                  <Link to="/cartpage">...and {cartItems.length - 3} more</Link>
                </div>
              )}
              <div className="cart-hover-total">
                Total: €{cartTotal.toFixed(2)}
              </div>
            </div>
          )}

          {cartHover && !hasItems && (
            <CartPreview visible={true} />
          )}
        </div>

        {/* Profile/Login */}
        {userLogged ? (
          <div
            className="nav-icon"
            onMouseEnter={() => setProfileHover(true)}
            onMouseLeave={() => setProfileHover(false)}
          >
            <Link to="/profile">👤</Link>
            {profileHover && (
              <div
                onMouseEnter={() => setProfileHover(true)}
                onMouseLeave={() => setProfileHover(false)}
              >
                <ProfilePreview visible={true} />
              </div>
            )}
          </div>
        ) : (
          <>
            <Link className="nav-icon" to="/login">Login</Link>
            <Link className="nav-icon" to="/signup">SignUp</Link>
          </>
        )}
      </div>
    </nav>
  )
}
