import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { coursesAPI } from '../../services/api'
import { getCurrentUser } from '../../utils/auth'
import '../Courses/Courses.css'

const InstructorCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const user = getCurrentUser()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getByInstructor(user.id)
      setCourses(response.data)
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast.error('Failed to load courses')
    } finally {
      setLoading(false)
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

  if (loading) {
    return <div className="container loading" style={{ paddingTop: '2rem' }}>Loading courses...</div>
  }

  return (
    <div className="courses-page">
      <div className="container">
        <div className="courses-header">
          <h1 className="courses-title">My Courses</h1>
          <Link to="/instructor/courses/create" className="btn btn-primary">
            + Create New Course
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="no-courses">
            <p>You haven't created any courses yet.</p>
            <Link to="/instructor/courses/create" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map(course => (
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
                    <span>⏱️ {course.duration}</span>
                  </div>
                  <div className="course-actions" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                    <Link to={`/courses/${course.id}`} className="btn btn-outline btn-sm">
                      View
                    </Link>
                    <Link to={`/instructor/courses/edit/${course.id}`} className="btn btn-primary btn-sm">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleToggleStatus(course)}
                      className={`btn btn-sm ${course.status === 'active' ? 'btn-accent' : 'btn-secondary'}`}
                    >
                      {course.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="btn btn-secondary btn-sm"
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

export default InstructorCourses




