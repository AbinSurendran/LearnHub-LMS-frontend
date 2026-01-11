import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { coursesAPI } from '../../services/api'
import { getCurrentUser } from '../../utils/auth'
import './CreateCourse.css'

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration: '',
    thumbnail: '',
  })
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const user = getCurrentUser()

  const categories = [
    'Programming',
    'Design',
    'Business',
    'Marketing',
    'Data Science',
    'Personal Development'
  ]

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
    setLoading(true)

    try {
      const allCourses = await coursesAPI.getAll()
      const nextId = Math.max(...allCourses.data.map(c => c.id), 0) + 1

      const newCourse = {
        id: nextId,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        instructorId: user.id,
        instructorName: user.name,
        duration: formData.duration,
        thumbnail: formData.thumbnail || 'https://via.placeholder.com/400x250?text=Course+Thumbnail',
        status: 'active',
        createdAt: new Date().toISOString(),
      }

      await coursesAPI.create(newCourse)
      toast.success('Course created successfully!')
      navigate('/instructor/courses')
    } catch (error) {
      console.error('Error creating course:', error)
      toast.error('Failed to create course')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem', maxWidth: '800px' }}>
      <h2>Create New Course</h2>
      
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
            placeholder="Enter course title"
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
            placeholder="Enter course description"
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
            <option value="">Select a category</option>
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
            placeholder="e.g., 8 weeks, 40 hours"
          />
        </div>

        <div className="input-group">
          <label htmlFor="thumbnail">Course Thumbnail</label>
          <div className="thumbnail-upload-container">
            <div className="thumbnail-upload-options">
              <div className="upload-option">
                <label htmlFor="thumbnail-upload" className="upload-label">
                  <span className="upload-icon">📷</span>
                  Upload Image
                </label>
                <input
                  type="file"
                  id="thumbnail-upload"
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

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Course'}
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
    </div>
  )
}

export default CreateCourse




