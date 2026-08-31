import API_BASE_URL from '../config/api'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './ProductDetails.css'

function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cartMessage, setCartMessage] = useState('')

  useEffect(() => {
    fetch(`${API_BASE_URL}/products/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch product')
        }

        return response.json()
      })
      .then((data) => {
        setProduct(data.product)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setError('Unable to load product')
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="product-details-page">
        <div className="product-details-loading">
          Loading product...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="product-details-page">
        <div className="product-details-error">
          {error}
        </div>
      </div>
    )
  }

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      alert('Please login first')
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1
        })
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Failed to add product to cart')
        return
      }

      setCartMessage('Product added to cart')

      setTimeout(() => {
        setCartMessage('')
      }, 2500)

    } catch (error) {
      console.error(error)
      alert('Something went wrong')
    }
  }

  return (
    <div className="product-details-page">

      {cartMessage && (
        <div className="cart-toast">
          <span className="cart-toast-icon">✓</span>
          <span>{cartMessage}</span>
        </div>
      )}

      <div className="product-details-card">

        {/* LEFT - PRODUCT IMAGE */}

        <div className="product-details-image-section">

          <div className="product-details-image">
            <img
              src={
                product.image ||
                'https://placehold.co/500x500?text=Product'
              }
              alt={product.name}
            />
          </div>

          <div className="product-details-actions">

            <button
              className="product-add-cart-button"
              onClick={handleAddToCart}
            >
              ADD TO CART
            </button>

            <button className="product-buy-button">
              BUY NOW
            </button>

          </div>

        </div>

        {/* RIGHT - PRODUCT INFORMATION */}

        <div className="product-details-info">

          <h1>{product.name}</h1>

          <div className="product-rating">
            <span className="rating-box">
              4.5 ★
            </span>

            <span className="rating-text">
              Product Rating
            </span>
          </div>

          <p className="product-description">
            {product.description}
          </p>

          <div className="product-price-section">

            <span className="product-current-price">
              ₹{product.price}
            </span>

            {product.original_price && (
              <span className="product-original-price">
                ₹{product.original_price}
              </span>
            )}

            {product.discount > 0 && (
              <span className="product-discount">
                {product.discount}% off
              </span>
            )}

          </div>

          <div className="product-offer">
            <strong>Special Price</strong>
            <span> Get extra benefits on this product</span>
          </div>

          <div className="product-information">

            <div className="product-info-row">
              <span className="product-info-label">
                Brand
              </span>

              <span className="product-info-value">
                {product.brand || 'N/A'}
              </span>
            </div>

            <div className="product-info-row">
              <span className="product-info-label">
                Category
              </span>

              <span className="product-info-value">
                {product.category || 'N/A'}
              </span>
            </div>

            <div className="product-info-row">
              <span className="product-info-label">
                Availability
              </span>

              <span
                className={
                  product.stock > 0
                    ? 'product-stock available'
                    : 'product-stock unavailable'
                }
              >
                {product.stock > 0
                  ? `In Stock (${product.stock})`
                  : 'Out of Stock'}
              </span>
            </div>

          </div>

          <div className="product-delivery-info">

            <h3>Delivery</h3>

            <div className="delivery-row">
              <span>🚚</span>
              <span>Free delivery available</span>
            </div>

            <div className="delivery-row">
              <span>↩</span>
              <span>Easy returns available</span>
            </div>

            <div className="delivery-row">
              <span>🛡</span>
              <span>Secure payment</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default ProductDetails