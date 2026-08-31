import API_BASE_URL from '../config/api'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Register.css'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()

    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(
        `${API_BASE_URL}/users/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      setMessage('Registration successful!')

      setTimeout(() => {
        navigate('/login')
      }, 1000)

    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">

      <div className="register-container">

        <div className="register-brand">

          <div className="register-logo">
            Flipkart
          </div>

          <h2>Join Us!</h2>

          <p>
            Create your account and start
            exploring amazing products and deals.
          </p>

          <div className="register-benefits">

            <div>
              <span>✓</span>
              Fast and secure checkout
            </div>

            <div>
              <span>✓</span>
              Manage your orders easily
            </div>

            <div>
              <span>✓</span>
              Save products in your cart
            </div>

          </div>

        </div>

        <div className="register-box">

          <h1>Create Account</h1>

          <p className="register-subtitle">
            Create your account to start shopping
          </p>

          <form onSubmit={handleRegister}>

            <div className="input-group">
              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

          </form>

          {message && (
            <p className="register-message">
              {message}
            </p>
          )}

          <div className="register-divider">
            <span>OR</span>
          </div>

          <p className="login-text">
            Already have an account?
          </p>

          <Link
            to="/login"
            className="login-account"
          >
            Login to your account
          </Link>

        </div>

      </div>

    </div>
  )
}

export default Register