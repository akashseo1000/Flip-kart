import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'

function ProductSection() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        return response.json()
      })
      .then((data) => {
        setProducts(data.products)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setError('Unable to load products')
        setLoading(false)
      })
  }, [])

  return (
    <section className="product-section">

      <div className="section-heading">
        <h2>Deals of the Day</h2>

        <button>VIEW ALL</button>
      </div>

      {loading && <p>Loading products...</p>}

      {error && <p>{error}</p>}

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
          />
        ))}
      </div>

    </section>
  )
}

export default ProductSection