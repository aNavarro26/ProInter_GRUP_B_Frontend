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
  const [cartItems, setCartItems] = useState([]);
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
  }, [userId])

  useEffect(() => {
    if (!userId) return;

    const fetchCart = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/cart/my/?user_id=${userId}`);
        if (!res.ok) {
          setHasCart(false);
          return;
        }

        const data = await res.json();

        if (Array.isArray(data.items) && data.items.length > 0) {
          setCartItems(data.items);
          setHasCart(true);
        } else {
          setCartItems([]);
          setHasCart(false);
        }
      } catch (err) {
        console.error('Error loading cart:', err);
        setHasCart(false);
      }
    };

    fetchCart();
  }, [userId]);

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
              <Link to={hasCart ? "/cartpage" : "/cart"}>🛒</Link>

              {cartHover && hasCart && cartItems.length > 0 && (
                <div className="cart-hover-preview">
                  {cartItems.slice(0, 3).map((item) => {
                    const firstImage = item.product.image_url?.split(',')[0] || 'default.jpg';
                    return (
                      <div key={item.cart_item_id} className="cart-hover-item">
                        <img
                          src={`${import.meta.env.BASE_URL}${firstImage}`}
                          alt={item.product.name}
                          className="cart-hover-img"
                        />
                        <div className="cart-hover-details">
                          <span className="name">{item.product.name}</span>
                          <span className="qty-price">
                            x{item.quantity} – €{item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {cartItems.length > 3 && (
                    <div className="cart-hover-more">
                      <Link to="/cartpage">...and {cartItems.length - 3} more</Link>
                    </div>
                  )}
                  <div className="cart-hover-total">
                    Total: €{cartItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}
                  </div>
                </div>
              )}
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
