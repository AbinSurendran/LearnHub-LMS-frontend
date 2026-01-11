import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { lessonsAPI, coursesAPI, progressAPI } from '../../services/api'
import { getCurrentUser } from '../../utils/auth'
import VideoModal from '../../components/VideoModal'
import './LessonView.css'

const LessonView = () => {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [currentVideoUrl, setCurrentVideoUrl] = useState('')
  const user = getCurrentUser()

  useEffect(() => {
    fetchLessonData()
  }, [courseId, lessonId])

  const fetchLessonData = async () => {
    try {
      const [lessonRes, courseRes, lessonsRes] = await Promise.all([
        lessonsAPI.getById(lessonId),
        coursesAPI.getById(courseId),
        lessonsAPI.getByCourse(courseId)
      ])

      setLesson(lessonRes.data)
      setCourse(courseRes.data)
      const sortedLessons = lessonsRes.data.sort((a, b) => a.order - b.order)
      setLessons(sortedLessons)
      
      const index = sortedLessons.findIndex(l => l.id === parseInt(lessonId))
      setCurrentIndex(index >= 0 ? index : 0)

      const progressRes = await progressAPI.getByStudentAndCourse(user.id, parseInt(courseId))
      if (progressRes.data.length > 0) {
        setProgress(progressRes.data[0])
      }
    } catch (error) {
      console.error('Error fetching lesson data:', error)
      toast.error('Failed to load lesson')
    } finally {
      setLoading(false)
    }
  }

  const markAsCompleted = async () => {
    try {
      if (!progress) {
        const allProgress = await progressAPI.getAll()
        const nextId = Math.max(...allProgress.data.map(p => p.id), 0) + 1

        await progressAPI.create({
          id: nextId,
          studentId: user.id,
          courseId: parseInt(courseId),
          completedLessons: [parseInt(lessonId)],
          totalLessons: lessons.length,
          progressPercentage: (1 / lessons.length) * 100,
          lastAccessed: new Date().toISOString()
        })
      } else {
        const completedLessons = progress.completedLessons || []
        if (!completedLessons.includes(parseInt(lessonId))) {
          const updatedCompleted = [...completedLessons, parseInt(lessonId)]
          const newPercentage = (updatedCompleted.length / lessons.length) * 100

          await progressAPI.update(progress.id, {
            ...progress,
            completedLessons: updatedCompleted,
            progressPercentage: newPercentage,
            lastAccessed: new Date().toISOString()
          })
        }
      }

      toast.success('Lesson marked as completed!')
      fetchLessonData()
    } catch (error) {
      console.error('Error marking lesson as completed:', error)
      toast.error('Failed to update progress')
    }
  }

  const isCompleted = progress?.completedLessons?.includes(parseInt(lessonId))

  const goToNext = () => {
    if (currentIndex < lessons.length - 1) {
      navigate(`/courses/${courseId}/lessons/${lessons[currentIndex + 1].id}`)
    }
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      navigate(`/courses/${courseId}/lessons/${lessons[currentIndex - 1].id}`)
    }
  }

  if (loading) {
    return <div className="container loading" style={{ paddingTop: '2rem' }}>Loading lesson...</div>
  }

  if (!lesson || !course) {
    return <div className="container" style={{ paddingTop: '2rem' }}>Lesson not found</div>
  }

  return (
    <div className="lesson-view-container">
      <div className="lesson-header">
        <div className="container">
          <Link to={`/courses/${courseId}`} className="back-link">← Back to Course</Link>
          <h1>{lesson.title}</h1>
          <p className="lesson-course-name">Course: {course.title}</p>
        </div>
      </div>

      <div className="container lesson-content-wrapper">
        <div className="lesson-main">
          <div className="lesson-content-card">
            {lesson.type === 'video' && (
              <div className="video-container">
                <div className="video-placeholder">
                  <div className="video-placeholder-content">
                    <button 
                      className="play-video-btn"
                      onClick={() => {
                        setCurrentVideoUrl(lesson.content)
                        setIsVideoModalOpen(true)
                      }}
                    >
                      <span className="play-icon">▶</span>
                    </button>
                    <p className="video-placeholder-text">Click to watch video</p>
                    <p className="video-placeholder-title">{lesson.title}</p>
                  </div>
                </div>
              </div>
            )}

            {lesson.type === 'text' && (
              <div className="text-content">
                <pre className="text-content-pre">{lesson.content}</pre>
              </div>
            )}

            {lesson.type === 'pdf' && (
              <div className="pdf-container">
                <iframe
                  src={lesson.content}
                  title={lesson.title}
                  className="lesson-pdf"
                ></iframe>
              </div>
            )}

            <div className="lesson-actions">
              {!isCompleted && (
                <button onClick={markAsCompleted} className="btn btn-primary">
                  Mark as Completed
                </button>
              )}
              {isCompleted && (
                <span className="completed-indicator">✓ Lesson Completed</span>
              )}
            </div>
          </div>

          <div className="lesson-navigation">
            <button
              onClick={goToPrevious}
              className="btn btn-outline"
              disabled={currentIndex === 0}
            >
              ← Previous Lesson
            </button>
            <button
              onClick={goToNext}
              className="btn btn-primary"
              disabled={currentIndex === lessons.length - 1}
            >
              Next Lesson →
            </button>
          </div>
        </div>

        <div className="lesson-sidebar">
          <h3>Course Lessons</h3>
          <div className="lessons-sidebar-list">
            {lessons.map((l, index) => (
              <Link
                key={l.id}
                to={`/courses/${courseId}/lessons/${l.id}`}
                className={`lesson-sidebar-item ${l.id === parseInt(lessonId) ? 'active' : ''} ${
                  progress?.completedLessons?.includes(l.id) ? 'completed' : ''
                }`}
              >
                <span className="lesson-sidebar-number">{index + 1}</span>
                <div className="lesson-sidebar-content">
                  <span className="lesson-sidebar-title">{l.title}</span>
                  <span className="lesson-sidebar-type">{l.type}</span>
                </div>
                {progress?.completedLessons?.includes(l.id) && (
                  <span className="lesson-sidebar-check">✓</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={currentVideoUrl}
        title={lesson?.title || 'Video Lesson'}
      />
    </div>
  )
}

export default LessonView




