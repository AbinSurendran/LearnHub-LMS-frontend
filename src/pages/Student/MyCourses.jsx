import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { enrollmentsAPI, coursesAPI, progressAPI } from '../../services/api'
import { getCurrentUser } from '../../utils/auth'
import '../Courses/Courses.css'

const MyCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const user = getCurrentUser()

  useEffect(() => {
    fetchEnrolledCourses()
  }, [])

  const fetchEnrolledCourses = async () => {
    try {
      const enrollmentsRes = await enrollmentsAPI.getByStudent(user.id)
      const enrollments = enrollmentsRes.data.filter(e => e.status === 'active')
      
      const courseIds = enrollments.map(e => e.courseId)
      const coursesData = await Promise.all(
        courseIds.map(id => coursesAPI.getById(id))
      )
      
      const courses = coursesData.map(res => res.data)
      
      const coursesWithProgress = await Promise.all(
        courses.map(async (course) => {
          const progressRes = await progressAPI.getByStudentAndCourse(user.id, course.id)
          const progress = progressRes.data.length > 0 ? progressRes.data[0] : null
          return { ...course, progress }
        })
      )
      
      setEnrolledCourses(coursesWithProgress)
    } catch (error) {
      console.error('Error fetching enrolled courses:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container loading" style={{ paddingTop: '2rem' }}>Loading your courses...</div>
  }

  return (
    <div className="courses-page">
      <div className="container">
        <div className="courses-header">
          <h1 className="courses-title">My Enrolled Courses</h1>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="no-courses">
            <h3>No enrolled courses</h3>
            <p>You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="courses-grid">
            {enrolledCourses.map(course => (
              <Link key={course.id} to={`/courses/${course.id}`} className="course-card">
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
                  <span className="course-category">{course.category}</span>
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-description">{course.description}</p>
                  {course.progress && (
                    <div className="progress-bar-container">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${course.progress.progressPercentage}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">
                        {course.progress.progressPercentage.toFixed(0)}% Complete
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyCourses




