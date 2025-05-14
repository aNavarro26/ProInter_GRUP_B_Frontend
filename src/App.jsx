import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SplashScreen from './components/SplashScreen/SplashScreen'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home'
import CategoryPage from './components/CategoryPage/CategoryPage'
import ProductDetail from './components/ProductDetail/ProductDetail'
import About from './pages/About'
import Cart from './components/Cart/Cart'
import Login from './components/Login/Login'
import CartPage from './components/CartPage/CartPage'
import OrderSuccess from './components/OrderSuccess/OrderSuccess'
import SignUp from './components/SignUp/SignUp'
import CheckoutPage from './components/CheckoutPage/CheckoutPage'
import Profile from './components/Profile/Profile'
import AdminProductList from './components/admin/AdminProductList'
import ProductForm from './components/admin/ProductForm'
import { getProducts } from './services/productService'
import { ProductsContext } from './contexts/ProductsContext'
import { CartProvider } from './contexts/CartContext'
import './index.css'

export default function App() {
  const [products, setProducts] = useState(null)
  const [showSplash, setShowSplash] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [hoverCat, setHoverCat] = useState(false)
  const [hoverSearch, setHoverSearch] = useState(false)
  const [hoverCart, setHoverCart] = useState(false)
  const [hoverProfile, setHoverProfile] = useState(false)

  // fetch products once
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

  // hide splash after timeout
  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 4000)
    return () => clearTimeout(t)
  }, [])

  if (products === null) {
    return <div className="app-spinner spinner" />
  }

  const shouldBlur =
    showSplash || hoverCat || hoverSearch || hoverCart || hoverProfile

  return (
    <CartProvider>
      <ProductsContext.Provider value={products}>
        <BrowserRouter>
          <Navbar
            onCategoryHover={setHoverCat}
            onSearchHover={setHoverSearch}
            onCartHover={setHoverCart}
            onProfileHover={setHoverProfile}
          />

          <div className={shouldBlur ? 'app-content blurred' : 'app-content'}>
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
        {(!dataLoaded || showSplash) && (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        )}
      </ProductsContext.Provider>
    </CartProvider>
  );
}
