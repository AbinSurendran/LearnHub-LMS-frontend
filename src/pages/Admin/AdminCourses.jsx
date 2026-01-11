import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { coursesAPI } from '../../services/api'
import '../Courses/Courses.css'

const AdminCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getAll()
      setCourses(response.data)
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast.error('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (course) => {
    try {
      await coursesAPI.update(course.id, {
        ...course,
        status: course.status === 'active' ? 'inactive' : 'active'
      })
      toast.success(`Course ${course.status === 'active' ? 'deactivated' : 'activated'}`)
      fetchCourses()
    } catch (error) {
      console.error('Error updating course status:', error)
      toast.error('Failed to update course status')
    }
  }

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return
    }

    try {
      await coursesAPI.delete(courseId)
      toast.success('Course deleted successfully')
      fetchCourses()
    } catch (error) {
      console.error('Error deleting course:', error)
      toast.error('Failed to delete course')
    }
  }

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true
    return course.status === filter
  })

  if (loading) {
    return <div className="container loading" style={{ paddingTop: '2rem' }}>Loading courses...</div>
  }

  return (
    <div className="courses-page">
      <div className="container">
        <div className="courses-header">
          <h1 className="courses-title">Course Management</h1>
          <select
            className="category-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}
          >
            <option value="all">All Courses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="no-courses">No courses found.</div>
        ) : (
          <div className="courses-grid">
            {filteredCourses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-thumbnail-wrapper">
                  <img 
                    src={course.thumbnail || 'https://via.placeholder.com/400x250?text=Course+Image'} 
                    alt={course.title} 
                    className="course-thumbnail"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x250?text=Course+Image'
                    }}
                  />
                </div>
                <div className="course-content">
                  <span className={`course-category ${course.status === 'active' ? '' : 'inactive'}`}>
                    {course.category} - {course.status}
                  </span>
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-description">{course.description}</p>
                  <div className="course-meta">
                    <span>👨‍🏫 {course.instructorName}</span>
                    <span>⏱️ {course.duration}</span>
                  </div>
                  <div className="course-actions" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                    <Link to={`/courses/${course.id}`} className="btn btn-outline btn-sm">
                      View
                    </Link>
                    <button
                      onClick={() => handleToggleStatus(course)}
                      className={`btn btn-sm ${course.status === 'active' ? 'btn-accent' : 'btn-secondary'}`}
                    >
                      {course.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="btn btn-sm"
                      style={{ backgroundColor: '#ef4444', color: 'white' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminCourses




