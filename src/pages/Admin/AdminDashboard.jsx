import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usersAPI, coursesAPI, enrollmentsAPI } from '../../services/api'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    activeUsers: 0,
    activeCourses: 0,
  })
  const [loading, setLoading] = useState(true)

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

      const users = usersRes.data
      const courses = coursesRes.data
      const enrollments = enrollmentsRes.data

      setStats({
        totalUsers: users.length,
        totalCourses: courses.length,
        totalEnrollments: enrollments.length,
        activeUsers: users.filter(u => u.status === 'active').length,
        activeCourses: courses.filter(c => c.status === 'active').length,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container loading" style={{ paddingTop: '2rem' }}>Loading dashboard...</div>
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
            <span className="stat-subtext">{stats.activeUsers} active</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{stats.totalCourses}</h3>
            <p>Total Courses</p>
            <span className="stat-subtext">{stats.activeCourses} active</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.totalEnrollments}</h3>
            <p>Total Enrollments</p>
            <span className="stat-subtext">All time</span>
          </div>
        </div>
      </div>

      <div className="admin-actions">
        <Link to="/admin/users" className="admin-action-card">
          <h3>Manage Users</h3>
          <p>View, activate, and deactivate user accounts</p>
        </Link>

        <Link to="/admin/courses" className="admin-action-card">
          <h3>Manage Courses</h3>
          <p>View and manage all courses on the platform</p>
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboard






