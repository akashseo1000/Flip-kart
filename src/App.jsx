import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './components/Header'
import CategoryNav from './components/CategoryNav'
import HeroBanner from './components/HeroBanner'
import ProductSection from './components/ProductSection'
import Footer from './components/Footer'
import ProductDetails from './pages/ProductDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Profile from './components/Profile'

import './App.css'

function Home() {
  return (
    <>
      <CategoryNav />
      <HeroBanner />
      <ProductSection />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>

      <Header />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

      </Routes>

      <Footer />

    </BrowserRouter>
  )
}

export default App