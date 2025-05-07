// src/App.jsx
import { useState, useEffect, use } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Cart from './components/Cart'
import Login from "./pages/Login";
import { getProducts } from './services/productService'
import { ProductsContext } from './contexts/ProductsContext'
import './index.css'
import SignUp from './pages/SignUp'

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
        </Routes>
      </BrowserRouter>
    </ProductsContext.Provider>
  );
}
