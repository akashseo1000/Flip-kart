import API_BASE_URL from '../config/api'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(
        `${API_BASE_URL}/users/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      localStorage.setItem('token', data.token)

      setMessage('Login successful!')

      navigate('/')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">

      <div className="login-container">

        <div className="login-brand">
          <div className="login-logo">
            Flipkart
          </div>

          <h2>Welcome Back!</h2>

          <p>
            Login to continue shopping,
            discover great deals and more.
          </p>

          <div className="login-benefits">
            <div>
              <span>✓</span>
              Easy & secure shopping
            </div>

            <div>
              <span>✓</span>
              Track your orders
            </div>

            <div>
              <span>✓</span>
              Save products to your cart
            </div>
          </div>
        </div>

        <div className="login-box">

          <h1>Login</h1>

          <p className="login-subtitle">
            Enter your details to access your account
          </p>

          <form onSubmit={handleLogin}>

            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

          </form>

          {message && (
            <p className="login-message">
              {message}
            </p>
          )}

          <div className="login-divider">
            <span>OR</span>
          </div>

          <p className="register-text">
            New to Flipkart?
          </p>

          <Link
            to="/register"
            className="create-account"
          >
            Create an account
          </Link>

        </div>

      </div>

    </div>
  )
}

export default Login