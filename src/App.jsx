import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SplashScreen from './components/SplashScreen'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Cart from './components/Cart'
import Login from "./pages/Login"
import CartPage from "./pages/CartPage"
import OrderSuccess from './pages/OrderSuccess'
import { getProducts } from './services/productService'
import { ProductsContext } from './contexts/ProductsContext'
import { CartProvider } from './contexts/CartContext'
import SignUp from './pages/SignUp'
import CheckoutPage from './pages/CheckoutPage'
import Profile from './pages/Profile'
import AdminProductList from './pages/admin/AdminProductList'
import ProductForm from './pages/admin/ProductForm'
import './index.css'

export default function App() {
  const [products, setProducts] = useState(null)
  const [showSplash, setShowSplash] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [hoverCat, setHoverCat] = useState(null)

  // load in background
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch {
        setProducts([])
      } finally {
        setDataLoaded(true)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 3000)
    return () => clearTimeout(t)
  }, [])

  if (products === null) {
    return <div className="app-spinner spinner" />
  }

  return (
    <CartProvider>
      <ProductsContext.Provider value={products}>
        <BrowserRouter>
          {/* Navbar always visible */}
          <Navbar onCategoryHover={setHoverCat} />

          <div className={(showSplash || hoverCat) ? 'app-content blurred' : 'app-content'}>
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
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/admin/products" element={<AdminProductList />} />
              <Route path="/admin/products/new" element={<ProductForm />} />
              <Route path="/admin/products/:id/edit" element={<ProductForm />} />
            </Routes>
          </div>
        </BrowserRouter>

        {/* SplashOverlay */}
        {(!dataLoaded || showSplash) && <SplashScreen onFinish={() => setShowSplash(false)} />}
      </ProductsContext.Provider>
    </CartProvider>
  );
}
