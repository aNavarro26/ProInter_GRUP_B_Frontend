import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import CategoryPreview from './CategoryPreview'
import '../index.css'

export default function Navbar() {
    const loc = useLocation()
    const [hoverCat, setHoverCat] = useState(null)
    const [userLogged, setUserLogged] = useState(getUserIdCookie());

    const categories = [
        { key: 'phone', label: 'Phone' },
        { key: 'audio', label: 'Audio' },
        { key: 'tablet', label: 'Tablet' },
        { key: 'wearables', label: 'Wearables' },
    ]

    function getUserIdCookie() {
      // Obtenemos todas las cookies y las dividimos en pares nombre=valor
      const cookies = document.cookie.split('; ');
      for (let pair of cookies) {
        const [name, val] = pair.split('=');
        if (name === 'user_id') {
          return true;
        }
      }
      return false;
    }

    return (
      <nav className="navbar" onMouseLeave={() => setHoverCat(null)}>
        <div className="logo">
          <Link to="/">Axion</Link>
        </div>
        <ul>
          {categories.map((cat) => (
            <li
              key={cat.key}
              className={
                loc.pathname === `/category/${cat.key}` ? "active" : ""
              }
              onMouseEnter={() => setHoverCat(cat.key)}
            >
              <Link to={`/category/${cat.key}`}>{cat.label}</Link>
            </li>
          ))}
          <li className={loc.pathname === "/about" ? "active" : ""}>
            <Link to="/about">About</Link>
          </li>
        </ul>

        {/*
    The preview is mounted here, as a direct son of <nav>,
        so that the absolute position is calculated with respect to the Navbar.
      */}
        <CategoryPreview category={hoverCat} visible={!!hoverCat} />

        <div className="nav-icons">
          {userLogged && <Link to="/cart">🛒</Link>}
          {userLogged && <Link to="/profile">👤</Link>}
          {!userLogged && <Link to="/login">Login</Link>}
          {/* TODO: add sign up link here */}
          {/* <Link to="/signup">SignUp</Link> */}
        </div>
      </nav>
    );
}
