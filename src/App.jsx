import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Cart from './components/Cart'
import Login from "./pages/Login";
import CartPage from "./pages/CartPage"
import { getProducts } from './services/productService'
import { ProductsContext } from './contexts/ProductsContext'
import { CartProvider } from './contexts/CartContext';
import './index.css'
import SignUp from './pages/SignUp'
import CheckoutPage from './pages/CheckoutPage';
import Profile from './pages/Profile'

export default function App() {
  const [products, setProducts] = useState(null)

  useEffect(() => {
    getProducts()
      .then(data => setProducts(data))
      .catch(err => {
        console.error(err)
        setProducts([])
      })
  }, [])

  // while we don't have the full array, we load a spinner
  if (products === null) {
    return <div className="app-spinner spinner" />
  }

  return (
    <CartProvider>
      <ProductsContext.Provider value={products}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:name" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cartpage" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </BrowserRouter>
      </ProductsContext.Provider>
    </CartProvider>
  );
}
