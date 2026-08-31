import API_BASE_URL from '../config/api'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Cart.css'

function Cart() {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const totalAmount = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  )

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        setLoading(false)
        setError('LOGIN_REQUIRED')
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.message || 'Failed to load cart')
          setLoading(false)
          return
        }

        setCart(data.cart)
        setLoading(false)
      } catch (error) {
        console.error(error)
        setError('Something went wrong')
        setLoading(false)
      }
    }

    fetchCart()
  }, [])

  // Remove product from cart
  const handleRemoveFromCart = async (cartId) => {
    const token = localStorage.getItem('token')

    if (!token) {
      alert('Please login first')
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${cartId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Failed to remove product')
        return
      }

      setCart((currentCart) =>
        currentCart.filter((item) => item.id !== cartId)
      )
    } catch (error) {
      console.error(error)
      alert('Something went wrong')
    }
  }

  // Update product quantity
  const handleQuantityChange = async (cartId, newQuantity) => {
    const token = localStorage.getItem('token')

    if (!token) {
      alert('Please login first')
      return
    }

    if (newQuantity < 1) {
      return
    }

    try {
      
      const response = await fetch(
      `${API_BASE_URL}/cart/${cartId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            quantity: newQuantity
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Failed to update quantity')
        return
      }

      setCart((currentCart) =>
        currentCart.map((item) =>
          item.id === cartId
            ? { ...item, quantity: newQuantity }
            : item
        )
      )
    } catch (error) {
      console.error(error)
      alert('Something went wrong')
    }
  }

  if (loading) {
    return <p>Loading cart...</p>
  }

  if (error === 'LOGIN_REQUIRED') {
    return (
      <div className="cart-page">

        <div className="cart-login-container">

          <div className="cart-login-icon">
            🛒
          </div>

          <h1>Your Cart is Waiting</h1>

          <p>
            Login to view your cart and add products
            to your shopping bag.
          </p>

          <Link to="/login" className="cart-login-button">
            Login
          </Link>

          <p className="cart-register-text">
            Don't have an account?
          </p>

          <Link
            to="/register"
            className="cart-register-link"
          >
            Create an account
          </Link>

        </div>

      </div>
    )
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="cart-page">

      <div className="cart-container">

        <div className="cart-left">

          <div className="cart-header">
            <h1>My Cart</h1>
            <span>{cart.length} Item(s)</span>
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <h2>Your cart is empty</h2>
              <p>Add products to your cart and they will appear here.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>

                <div className="cart-item-image">
                  <img
                    src={
                      item.image ||
                      'https://placehold.co/150x150?text=Product'
                    }
                    alt={item.name}
                  />
                </div>

                <div className="cart-item-details">

                  <h2>{item.name}</h2>

                  <p className="cart-price">
                    ₹{item.price}
                  </p>

                  <div className="quantity-box">

                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          item.quantity - 1
                        )
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  <button
                    className="remove-button"
                    onClick={() =>
                      handleRemoveFromCart(item.id)
                    }
                  >
                    REMOVE
                  </button>

                </div>

              </div>
            ))
          )}

        </div>

        <div className="cart-right">

          <div className="price-box">

            <h2>PRICE DETAILS</h2>

            <div className="price-row">
              <span>Price</span>
              <span>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="price-row">
              <span>Delivery</span>
              <span>FREE</span>
            </div>

            <hr />

            <div className="total-row">
              <span>Total Amount</span>
              <span>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <button className="place-order-button">
              PLACE ORDER
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Cart