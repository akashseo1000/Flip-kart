import { Link, useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()

  const token = localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <header className="header">

      <Link to="/" className="logo">
        <span>Flipkart</span>
        <small>Explore Plus ✨</small>
      </Link>

      <div className="search">
        <input
          type="text"
          placeholder="Search for Products, Brands and More"
        />
      </div>

      {token ? (
        <>
          <Link to="/profile" className="login-btn">
            Profile
          </Link>

          <button onClick={handleLogout} className="login-btn">
            Logout
          </button>
        </>
      ) : (
        <Link to="/login" className="login-btn">
          Login
        </Link>
      )}

      <div className="seller">
        Become a Seller
      </div>

      <div className="more">
        More ▾
      </div>

      <Link to="/cart" className="cart">
        🛒 Cart
      </Link>

    </header>
  )
}

export default Header