import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { usersAPI } from '../../services/api'
import { setCurrentUser } from '../../utils/auth'
import './Auth.css'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
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

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    // Prevent admin registration
    if (formData.role === 'admin') {
      toast.error('Admin registration is not allowed')
      setLoading(false)
      return
    }

    try {
      const emailCheck = await usersAPI.findByEmail(formData.email)
      if (emailCheck.data.length > 0) {
        toast.error('Email already registered')
        setLoading(false)
        return
      }

      const allUsers = await usersAPI.getAll()
      const nextId = Math.max(...allUsers.data.map(u => u.id), 0) + 1

      const newUser = {
        id: nextId,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        status: 'active',
        createdAt: new Date().toISOString(),
      }

      await usersAPI.create(newUser)

      const { password, ...userWithoutPassword } = newUser
      setCurrentUser(userWithoutPassword)

      // Dispatch custom event to update navbar
      window.dispatchEvent(new Event('userLogin'))

      toast.success('Registration successful!')
      
      // Small delay to ensure state updates
      setTimeout(() => {
        if (newUser.role === 'instructor') {
          navigate('/instructor/courses')
        } else {
          navigate('/my-courses')
        }
      }, 100)
    } catch (error) {
      toast.error('Registration failed. Please try again.')
      console.error('Registration error:', error)
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
            <h1 className="auth-left-title">Start Your Learning Journey Today</h1>
            <p className="auth-left-description">
              Join thousands of learners and instructors on our comprehensive learning platform.
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

            <h2 className="auth-form-title">Create your account</h2>
            <p className="auth-form-subtitle">
              Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
            </p>

            <form onSubmit={handleSubmit}>
              <div className="role-selection">
                <label className="role-label">I am a</label>
                <div className="role-buttons">
                  <button
                    type="button"
                    className={`role-btn ${formData.role === 'student' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, role: 'student' })}
                  >
                    <span className="role-icon">🎓</span>
                    Student
                  </button>
                  <button
                    type="button"
                    className={`role-btn ${formData.role === 'instructor' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, role: 'instructor' })}
                  >
                    <span className="role-icon">👨‍🏫</span>
                    Instructor
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="name">Full name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>

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

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="********"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register




