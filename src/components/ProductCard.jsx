import { Link } from 'react-router-dom'

function ProductCard({ id, name, price, image }) {
  return (
    <Link
      to={`/product/${id}`}
      className="product-card-link"
    >
      <div className="product-card">

        <div className="product-image">
          <img
            src={
              image ||
              'https://placehold.co/250x250?text=Product'
            }
            alt={name}
          />
        </div>

        <h3>{name}</h3>

        <p className="product-price">₹{price}</p>

        <p className="product-offer">Special Offer</p>

      </div>
    </Link>
  )
}

export default ProductCard