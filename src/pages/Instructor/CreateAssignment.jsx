import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { assignmentsAPI, coursesAPI } from '../../services/api'
import { getCurrentUser } from '../../utils/auth'

const CreateAssignment = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    dueDate: '',
  })
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const user = getCurrentUser()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getByInstructor(user.id)
      setCourses(response.data.filter(c => c.status === 'active'))
    } catch (error) {
      console.error('Error fetching courses:', error)
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
    setLoading(true)

    try {
      const allAssignments = await assignmentsAPI.getAll()
      const nextId = Math.max(...allAssignments.data.map(a => a.id), 0) + 1

      const newAssignment = {
        id: nextId,
        title: formData.title,
        description: formData.description,
        courseId: parseInt(formData.courseId),
        dueDate: new Date(formData.dueDate).toISOString(),
        createdAt: new Date().toISOString(),
      }

      await assignmentsAPI.create(newAssignment)
      toast.success('Assignment created successfully!')
      navigate('/instructor/assignments')
    } catch (error) {
      console.error('Error creating assignment:', error)
      toast.error('Failed to create assignment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem', maxWidth: '800px' }}>
      <h2>Create New Assignment</h2>
      
      <form onSubmit={handleSubmit} className="card" style={{ marginTop: '2rem' }}>
        <div className="input-group">
          <label htmlFor="courseId">Course *</label>
          <select
            id="courseId"
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            required
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="title">Assignment Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter assignment title"
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
            placeholder="Enter assignment description and requirements"
            rows={6}
          />
        </div>

        <div className="input-group">
          <label htmlFor="dueDate">Due Date *</label>
          <input
            type="datetime-local"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Assignment'}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/instructor/assignments')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateAssignment






