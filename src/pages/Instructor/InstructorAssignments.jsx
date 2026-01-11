import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { assignmentsAPI, coursesAPI, submissionsAPI } from '../../services/api'
import { getCurrentUser } from '../../utils/auth'
import '../Student/MyAssignments.css'

const InstructorAssignments = () => {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const user = getCurrentUser()

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      const coursesRes = await coursesAPI.getByInstructor(user.id)
      const courseIds = coursesRes.data.map(c => c.id)

      const allAssignments = []
      for (const courseId of courseIds) {
        const assignmentsRes = await assignmentsAPI.getByCourse(courseId)
        allAssignments.push(...assignmentsRes.data)
      }

      const assignmentsWithDetails = await Promise.all(
        allAssignments.map(async (assignment) => {
          const courseRes = await coursesAPI.getById(assignment.courseId)
          const submissionsRes = await submissionsAPI.getByAssignment(assignment.id)
          
          return {
            ...assignment,
            course: courseRes.data,
            submissionCount: submissionsRes.data.length
          }
        })
      )

      setAssignments(assignmentsWithDetails)
    } catch (error) {
      console.error('Error fetching assignments:', error)
      toast.error('Failed to load assignments')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) {
      return
    }

    try {
      await assignmentsAPI.delete(assignmentId)
      toast.success('Assignment deleted successfully')
      fetchAssignments()
    } catch (error) {
      console.error('Error deleting assignment:', error)
      toast.error('Failed to delete assignment')
    }
  }

  if (loading) {
    return <div className="container loading" style={{ paddingTop: '2rem' }}>Loading assignments...</div>
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>My Assignments</h2>
        <Link to="/instructor/assignments/create" className="btn btn-primary">
          + Create Assignment
        </Link>
      </div>

      {assignments.length === 0 ? (
        <div className="no-assignments">
          <p>You haven't created any assignments yet.</p>
          <Link to="/instructor/assignments/create" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Create Your First Assignment
          </Link>
        </div>
      ) : (
        <div className="assignments-list">
          {assignments.map(assignment => (
            <div key={assignment.id} className="assignment-card">
              <div className="assignment-header">
                <div>
                  <h3>{assignment.title}</h3>
                  <p className="assignment-course">Course: {assignment.course.title}</p>
                </div>
                <span className="status-badge submitted">
                  {assignment.submissionCount} Submission{assignment.submissionCount !== 1 ? 's' : ''}
                </span>
              </div>
              
              <p className="assignment-description">{assignment.description}</p>
              
              <div className="assignment-meta">
                <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                <span>Created: {new Date(assignment.createdAt).toLocaleDateString()}</span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <Link
                  to={`/instructor/assignments/${assignment.id}/submissions`}
                  className="btn btn-primary btn-sm"
                >
                  View Submissions ({assignment.submissionCount})
                </Link>
                <button
                  onClick={() => handleDelete(assignment.id)}
                  className="btn btn-secondary btn-sm"
                  style={{ backgroundColor: '#ef4444', color: 'white' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default InstructorAssignments






