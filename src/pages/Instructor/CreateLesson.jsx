import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { lessonsAPI, coursesAPI } from '../../services/api'
import { getCurrentUser } from '../../utils/auth'

const CreateLesson = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    type: 'video',
    content: '',
    duration: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const user = getCurrentUser()

  useEffect(() => {
    fetchCourse()
  }, [courseId])

  const fetchCourse = async () => {
    try {
      const courseRes = await coursesAPI.getById(courseId)
      const course = courseRes.data
      
      if (course.instructorId !== user.id && user.role !== 'admin') {
        toast.error('You do not have permission to add lessons to this course')
        navigate('/instructor/courses')
        return
      }

      setCourse(course)
    } catch (error) {
      console.error('Error fetching course:', error)
      toast.error('Failed to load course')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const lessonsRes = await lessonsAPI.getByCourse(courseId)
      const existingLessons = lessonsRes.data
      const nextOrder = existingLessons.length > 0 
        ? Math.max(...existingLessons.map(l => l.order), 0) + 1 
        : 1

      const allLessons = await lessonsAPI.getAll()
      const nextId = Math.max(...allLessons.data.map(l => l.id), 0) + 1

      const newLesson = {
        id: nextId,
        courseId: parseInt(courseId),
        title: formData.title,
        type: formData.type,
        content: formData.content,
        order: nextOrder,
        duration: formData.duration || 'N/A',
      }

      await lessonsAPI.create(newLesson)
      toast.success('Lesson created successfully!')
      navigate(`/instructor/courses/edit/${courseId}`)
    } catch (error) {
      console.error('Error creating lesson:', error)
      toast.error('Failed to create lesson')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="container loading" style={{ paddingTop: '2rem' }}>Loading...</div>
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem', maxWidth: '800px' }}>
      <h2>Add Lesson to: {course?.title}</h2>
      
      <form onSubmit={handleSubmit} className="card" style={{ marginTop: '2rem' }}>
        <div className="input-group">
          <label htmlFor="title">Lesson Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter lesson title"
          />
        </div>

        <div className="input-group">
          <label htmlFor="type">Lesson Type *</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="video">Video (YouTube URL)</option>
            <option value="text">Text Content</option>
            <option value="pdf">PDF Link</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="content">
            {formData.type === 'video' ? 'YouTube URL *' : 
             formData.type === 'pdf' ? 'PDF URL *' : 
             'Content *'}
          </label>
          {formData.type === 'text' ? (
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="Enter lesson content"
              rows={10}
            />
          ) : (
            <input
              type="url"
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder={formData.type === 'video' ? 'https://www.youtube.com/watch?v=...' : 'https://example.com/document.pdf'}
            />
          )}
        </div>

        <div className="input-group">
          <label htmlFor="duration">Duration</label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g., 15 minutes"
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Creating...' : 'Create Lesson'}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate(`/instructor/courses/edit/${courseId}`)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateLesson






