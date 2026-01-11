import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { coursesAPI, usersAPI, enrollmentsAPI } from '../services/api'
import './Home.css'

const Home = () => {
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    instructors: 0,
    satisfaction: 95
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [usersRes, coursesRes, enrollmentsRes] = await Promise.all([
        usersAPI.getAll(),
        coursesAPI.getAll(),
        enrollmentsAPI.getAll()
      ])

      const students = usersRes.data.filter(u => u.role === 'student' && u.status === 'active').length
      const instructors = usersRes.data.filter(u => u.role === 'instructor' && u.status === 'active').length
      const courses = coursesRes.data.filter(c => c.status === 'active').length

      setStats({
        students: students || 10000,
        courses: courses || 500,
        instructors: instructors || 100,
        satisfaction: 95
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <button className="hero-badge">
            <span className="badge-icon">⭐</span>
            Start Learning Today
          </button>
          <h1 className="hero-title">
            Unlock Your Potential with <span className="hero-title-accent">LearnHub</span>
          </h1>
          <p className="hero-description">
            A comprehensive learning management system designed to help students, instructors, and administrators achieve their educational goals with ease.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-accent">
              Get Started Free →
            </Link>
            <Link to="/courses" className="btn btn-secondary">
              <span className="btn-icon">▶</span>
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{stats.students.toLocaleString()}+</div>
              <div className="stat-label">Active Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.courses}+</div>
              <div className="stat-label">Courses</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.instructors}+</div>
              <div className="stat-label">Expert Instructors</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.satisfaction}%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Everything You Need to Learn</h2>
          <p className="section-subtitle">
            Our platform provides all the tools and features you need for an exceptional learning experience.
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon primary">📚</div>
              <h3 className="feature-title">Rich Course Library</h3>
              <p className="feature-description">
                Access hundreds of courses across multiple categories, from programming to design.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon accent">👨‍🏫</div>
              <h3 className="feature-title">Expert Instructors</h3>
              <p className="feature-description">
                Learn from industry professionals with real-world experience and expertise.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon primary">📊</div>
              <h3 className="feature-title">Track Progress</h3>
              <p className="feature-description">
                Monitor your learning journey with detailed progress tracking and analytics.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon primary">🎓</div>
              <h3 className="feature-title">Earn Certificates</h3>
              <p className="feature-description">
                Complete courses and earn certificates to showcase your achievements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Built for Everyone Section */}
      <section className="roles-section">
        <div className="container">
          <h2 className="section-title">Built for Everyone</h2>
          <p className="section-subtitle">
            Whether you're a student, instructor, or administrator, our platform has the right tools for you.
          </p>
          <div className="roles-grid">
            <div className="role-card">
              <div className="role-icon primary">🎓</div>
              <h3 className="role-title">For Students</h3>
              <ul className="role-features">
                <li>Browse and enroll in courses</li>
                <li>Access video lessons and materials</li>
                <li>Track your learning progress</li>
                <li>Submit assignments and get feedback</li>
              </ul>
            </div>
            <div className="role-card">
              <div className="role-icon accent">⚙️</div>
              <h3 className="role-title">For Instructors</h3>
              <ul className="role-features">
                <li>Create and manage courses</li>
                <li>Add lessons with video, PDF, or text</li>
                <li>Create assignments for students</li>
                <li>Review and grade submissions</li>
              </ul>
            </div>
            <div className="role-card">
              <div className="role-icon primary">📊</div>
              <h3 className="role-title">For Administrators</h3>
              <ul className="role-features">
                <li>Manage all users and roles</li>
                <li>Approve and manage courses</li>
                <li>View platform analytics</li>
                <li>Configure system settings</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to Start Learning?</h2>
          <p className="cta-description">
            Join thousands of learners who are already advancing their skills with LearnHub.
          </p>
          <Link to="/register" className="btn btn-accent btn-large">
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="8" fill="#14b8a6"/>
                  <path d="M16 10L10 13V20L16 23L22 20V13L16 10Z" fill="white"/>
                  <path d="M16 10V23" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <span className="logo-text">LearnHub</span>
            </div>
            <p className="footer-copyright">© 2025 LearnHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home






