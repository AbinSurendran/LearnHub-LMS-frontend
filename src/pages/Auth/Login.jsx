import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { usersAPI } from '../../services/api'
import { setCurrentUser } from '../../utils/auth'
import './Auth.css'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await usersAPI.findByEmail(formData.email)
      const users = response.data

      if (users.length === 0) {
        toast.error('User not found')
        setLoading(false)
        return
      }

      const user = users[0]

      if (user.password !== formData.password) {
        toast.error('Invalid password')
        setLoading(false)
        return
      }

      if (user.status !== 'active') {
        toast.error('Your account is inactive. Please contact admin.')
        setLoading(false)
        return
      }

      const { password, ...userWithoutPassword } = user
      setCurrentUser(userWithoutPassword)

      // Dispatch custom event to update navbar
      window.dispatchEvent(new Event('userLogin'))

      toast.success(`Welcome back, ${user.name}!`)
      
      // Small delay to ensure state updates
      setTimeout(() => {
        if (user.role === 'admin') {
          navigate('/admin/dashboard')
        } else if (user.role === 'instructor') {
          navigate('/instructor/courses')
        } else {
          navigate('/my-courses')
        }
      }, 100)
    } catch (error) {
      toast.error('Login failed. Please try again.')
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-split">
        {/* Left Side - Teal Background */}
        <div className="auth-left">
          <div className="auth-left-content">
            <h1 className="auth-left-title">Welcome Back to LearnHub</h1>
            <p className="auth-left-description">
              Continue your learning journey and unlock your potential.
            </p>
          </div>
        </div>

        {/* Right Side - White Form */}
        <div className="auth-right">
          <div className="auth-form-container">
            <Link to="/" className="back-link">← Back to home</Link>
            
            <div className="auth-logo">
              <div className="logo-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="8" fill="#14b8a6"/>
                  <path d="M16 10L10 13V20L16 23L22 20V13L16 10Z" fill="white"/>
                  <path d="M16 10V23" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <span className="logo-text">LearnHub</span>
            </div>

            <h2 className="auth-form-title">Sign in to your account</h2>
            <p className="auth-form-subtitle">
              Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
            </p>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="********"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="auth-demo">
              <p><strong>Demo Accounts:</strong></p>
              <p>Student: student@learnhub.com / student123</p>
              <p>Instructor: instructor@learnhub.com / instructor123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login




