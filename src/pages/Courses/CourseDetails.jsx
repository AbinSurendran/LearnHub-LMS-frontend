import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { coursesAPI, lessonsAPI, enrollmentsAPI, progressAPI } from '../../services/api'
import { getCurrentUser, isStudent } from '../../utils/auth'
import './CourseDetails.css'

const CourseDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrolled, setEnrolled] = useState(false)
  const [progress, setProgress] = useState(null)
  const user = getCurrentUser()

  useEffect(() => {
    fetchCourseData()
  }, [id])

  useEffect(() => {
    if (user && isStudent() && course) {
      checkEnrollment()
    }
  }, [user, course])

  const fetchCourseData = async () => {
    try {
      const [courseRes, lessonsRes] = await Promise.all([
        coursesAPI.getById(id),
        lessonsAPI.getByCourse(id)
      ])
      
      setCourse(courseRes.data)
      const sortedLessons = lessonsRes.data.sort((a, b) => a.order - b.order)
      setLessons(sortedLessons)

      if (user && isStudent()) {
        const progressRes = await progressAPI.getByStudentAndCourse(user.id, parseInt(id))
        if (progressRes.data.length > 0) {
          setProgress(progressRes.data[0])
        }
      }
    } catch (error) {
      console.error('Error fetching course data:', error)
      toast.error('Failed to load course details')
    } finally {
      setLoading(false)
    }
  }

  const checkEnrollment = async () => {
    try {
      const response = await enrollmentsAPI.checkEnrollment(user.id, parseInt(id))
      setEnrolled(response.data.length > 0)
    } catch (error) {
      console.error('Error checking enrollment:', error)
    }
  }

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please login to enroll')
      navigate('/login')
      return
    }

    if (!isStudent()) {
      toast.error('Only students can enroll in courses')
      return
    }

    try {
      const allEnrollments = await enrollmentsAPI.getAll()
      const nextId = Math.max(...allEnrollments.data.map(e => e.id), 0) + 1

      await enrollmentsAPI.create({
        id: nextId,
        studentId: user.id,
        courseId: parseInt(id),
        enrolledAt: new Date().toISOString(),
        status: 'active'
      })

      const allProgress = await progressAPI.getAll()
      const nextProgressId = Math.max(...allProgress.data.map(p => p.id), 0) + 1

      await progressAPI.create({
        id: nextProgressId,
        studentId: user.id,
        courseId: parseInt(id),
        completedLessons: [],
        totalLessons: lessons.length,
        progressPercentage: 0,
        lastAccessed: new Date().toISOString()
      })

      setEnrolled(true)
      toast.success('Successfully enrolled in course!')
    } catch (error) {
      console.error('Error enrolling:', error)
      toast.error('Failed to enroll in course')
    }
  }

  if (loading) {
    return <div className="container loading" style={{ paddingTop: '2rem' }}>Loading course details...</div>
  }

  if (!course) {
    return <div className="container" style={{ paddingTop: '2rem' }}>Course not found</div>
  }

  return (
    <div className="course-details-container">
      <div className="course-header">
        <div className="course-header-image-wrapper">
          <img 
            src={course.thumbnail || 'https://via.placeholder.com/400x250?text=Course+Image'} 
            alt={course.title} 
            className="course-header-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x250?text=Course+Image'
            }}
          />
        </div>
        <div className="course-header-content">
          <span className="course-category">{course.category}</span>
          <h1>{course.title}</h1>
          <p className="course-description-full">{course.description}</p>
          <div className="course-info">
            <span>👨‍🏫 {course.instructorName}</span>
            <span>⏱️ {course.duration}</span>
            {progress && (
              <span>📊 {progress.progressPercentage.toFixed(0)}% Complete</span>
            )}
          </div>
          {user && isStudent() && (
            <div className="course-actions">
              {enrolled ? (
                <Link to={`/courses/${id}/lessons/${lessons[0]?.id || 1}`} className="btn btn-primary">
                  Continue Learning
                </Link>
              ) : (
                <button onClick={handleEnroll} className="btn btn-primary">
                  Enroll Now
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="container">
        <div className="lessons-section">
          <h2>Course Lessons ({lessons.length})</h2>
          {lessons.length === 0 ? (
            <p>No lessons available yet.</p>
          ) : (
            <div className="lessons-list">
              {lessons.map((lesson, index) => {
                const isCompleted = progress?.completedLessons?.includes(lesson.id)
                return (
                  <div key={lesson.id} className={`lesson-item ${isCompleted ? 'completed' : ''}`}>
                    <div className="lesson-number">{index + 1}</div>
                    <div className="lesson-content">
                      <h3>
                        {lesson.title}
                        {isCompleted && <span className="completed-badge">✓ Completed</span>}
                      </h3>
                      <p className="lesson-meta">
                        <span>Type: {lesson.type}</span>
                        <span>Duration: {lesson.duration}</span>
                      </p>
                    </div>
                    {enrolled && (
                      <Link
                        to={`/courses/${id}/lessons/${lesson.id}`}
                        className="btn btn-outline btn-sm"
                      >
                        View Lesson
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseDetails




