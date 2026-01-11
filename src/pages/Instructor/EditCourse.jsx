import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { coursesAPI, lessonsAPI } from '../../services/api'
import { getCurrentUser } from '../../utils/auth'
import { Link } from 'react-router-dom'
import './CreateCourse.css'

const EditCourse = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration: '',
    thumbnail: '',
    status: 'active',
  })
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const user = getCurrentUser()

  const categories = [
    'Programming',
    'Design',
    'Business',
    'Marketing',
    'Data Science',
    'Personal Development'
  ]

  useEffect(() => {
    fetchCourse()
  }, [id])

  const fetchCourse = async () => {
    try {
      const [courseRes, lessonsRes] = await Promise.all([
        coursesAPI.getById(id),
        lessonsAPI.getByCourse(id)
      ])

      const course = courseRes.data
      if (course.instructorId !== user.id && user.role !== 'admin') {
        toast.error('You do not have permission to edit this course')
        navigate('/instructor/courses')
        return
      }

      setFormData({
        title: course.title,
        description: course.description,
        category: course.category,
        duration: course.duration,
        thumbnail: course.thumbnail,
        status: course.status,
      })
      
      // Set preview if thumbnail exists and is not base64
      if (course.thumbnail && !course.thumbnail.startsWith('data:')) {
        setThumbnailPreview(course.thumbnail)
      } else if (course.thumbnail) {
        setThumbnailPreview(course.thumbnail)
      }

      const sortedLessons = lessonsRes.data.sort((a, b) => a.order - b.order)
      setLessons(sortedLessons)
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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result
        setFormData({
          ...formData,
          thumbnail: base64String,
        })
        setThumbnailPreview(base64String)
      }
      reader.onerror = () => {
        toast.error('Error reading file')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveThumbnail = () => {
    setFormData({
      ...formData,
      thumbnail: '',
    })
    setThumbnailPreview('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const courseRes = await coursesAPI.getById(id)
      const existingCourse = courseRes.data

      await coursesAPI.update(id, {
        ...existingCourse,
        ...formData,
      })

      toast.success('Course updated successfully!')
      navigate('/instructor/courses')
    } catch (error) {
      console.error('Error updating course:', error)
      toast.error('Failed to update course')
    } finally {
      setSaving(false)
    }
  }

  const handleAddLesson = () => {
    navigate(`/instructor/courses/${id}/lessons/create`)
  }

  if (loading) {
    return <div className="container loading" style={{ paddingTop: '2rem' }}>Loading course...</div>
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem', maxWidth: '800px' }}>
      <h2>Edit Course</h2>
      
      <form onSubmit={handleSubmit} className="card" style={{ marginTop: '2rem' }}>
        <div className="input-group">
          <label htmlFor="title">Course Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
          />
        </div>

        <div className="input-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="duration">Duration *</label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="thumbnail">Course Thumbnail</label>
          <div className="thumbnail-upload-container">
            <div className="thumbnail-upload-options">
              <div className="upload-option">
                <label htmlFor="thumbnail-upload-edit" className="upload-label">
                  <span className="upload-icon">📷</span>
                  Upload Image
                </label>
                <input
                  type="file"
                  id="thumbnail-upload-edit"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
              <span className="upload-or">OR</span>
              <div className="url-option">
                <input
                  type="url"
                  id="thumbnail"
                  name="thumbnail"
                  value={formData.thumbnail.startsWith('data:') ? '' : formData.thumbnail}
                  onChange={handleChange}
                  placeholder="Enter image URL"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            {(thumbnailPreview || (formData.thumbnail && !formData.thumbnail.startsWith('data:'))) && (
              <div className="thumbnail-preview-container">
                <img
                  src={thumbnailPreview || formData.thumbnail}
                  alt="Thumbnail preview"
                  className="thumbnail-preview"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveThumbnail}
                  className="remove-thumbnail-btn"
                >
                  ✕ Remove
                </button>
              </div>
            )}
          </div>
          <p className="input-hint">
            Recommended size: 400x250px. Max file size: 5MB. Formats: JPG, PNG, GIF
          </p>
        </div>

        <div className="input-group">
          <label htmlFor="status">Status *</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/instructor/courses')}
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="card" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>Lessons ({lessons.length})</h3>
          <button onClick={handleAddLesson} className="btn btn-primary btn-sm">
            + Add Lesson
          </button>
        </div>

        {lessons.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No lessons yet. Add your first lesson!</p>
        ) : (
          <div className="lessons-list">
            {lessons.map((lesson, index) => (
              <div key={lesson.id} className="lesson-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '0.5rem', marginBottom: '0.5rem' }}>
                <div>
                  <strong>{index + 1}. {lesson.title}</strong>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Type: {lesson.type} | Duration: {lesson.duration}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EditCourse




