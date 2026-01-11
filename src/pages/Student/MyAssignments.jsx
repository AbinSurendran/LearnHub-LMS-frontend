import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { assignmentsAPI, submissionsAPI, coursesAPI, enrollmentsAPI } from '../../services/api'
import { getCurrentUser } from '../../utils/auth'
import './MyAssignments.css'

const MyAssignments = () => {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [submissionText, setSubmissionText] = useState({})
  const [submitting, setSubmitting] = useState({})
  const user = getCurrentUser()

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      const enrollmentsRes = await enrollmentsAPI.getByStudent(user.id)
      const courseIds = enrollmentsRes.data.map(e => e.courseId)
      
      const allAssignments = []
      for (const courseId of courseIds) {
        const assignmentsRes = await assignmentsAPI.getByCourse(courseId)
        allAssignments.push(...assignmentsRes.data)
      }

      const assignmentsWithDetails = await Promise.all(
        allAssignments.map(async (assignment) => {
          const courseRes = await coursesAPI.getById(assignment.courseId)
          const submissionsRes = await submissionsAPI.getByStudent(user.id)
          const submission = submissionsRes.data.find(s => s.assignmentId === assignment.id)
          
          return {
            ...assignment,
            course: courseRes.data,
            submission
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

  const handleSubmit = async (assignmentId) => {
    if (!submissionText[assignmentId] || submissionText[assignmentId].trim() === '') {
      toast.error('Please enter your submission')
      return
    }

    setSubmitting({ ...submitting, [assignmentId]: true })

    try {
      const assignment = assignments.find(a => a.id === assignmentId)
      
      if (assignment.submission) {
        await submissionsAPI.update(assignment.submission.id, {
          ...assignment.submission,
          response: submissionText[assignmentId],
          submittedAt: new Date().toISOString(),
          status: 'submitted'
        })
        toast.success('Submission updated successfully!')
      } else {
        const allSubmissions = await submissionsAPI.getAll()
        const nextId = Math.max(...allSubmissions.data.map(s => s.id), 0) + 1

        await submissionsAPI.create({
          id: nextId,
          assignmentId,
          studentId: user.id,
          response: submissionText[assignmentId],
          status: 'submitted',
          submittedAt: new Date().toISOString(),
          grade: null,
          feedback: null
        })
        toast.success('Assignment submitted successfully!')
      }

      fetchAssignments()
      setSubmissionText({ ...submissionText, [assignmentId]: '' })
    } catch (error) {
      console.error('Error submitting assignment:', error)
      toast.error('Failed to submit assignment')
    } finally {
      setSubmitting({ ...submitting, [assignmentId]: false })
    }
  }

  if (loading) {
    return <div className="container loading" style={{ paddingTop: '2rem' }}>Loading assignments...</div>
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <h2>My Assignments</h2>
      
      {assignments.length === 0 ? (
        <div className="no-assignments">
          <p>You don't have any assignments yet.</p>
          <Link to="/courses" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Browse Courses
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
                <span className={`status-badge ${assignment.submission?.status || 'pending'}`}>
                  {assignment.submission?.status === 'submitted' ? 'Submitted' : 
                   assignment.submission?.status === 'reviewed' ? 'Reviewed' : 'Pending'}
                </span>
              </div>
              
              <p className="assignment-description">{assignment.description}</p>
              
              <div className="assignment-meta">
                <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                {assignment.submission && (
                  <span>Submitted: {new Date(assignment.submission.submittedAt).toLocaleDateString()}</span>
                )}
              </div>

              {assignment.submission && (
                <div className="submission-info">
                  <h4>Your Submission:</h4>
                  <p className="submission-text">{assignment.submission.response}</p>
                  {assignment.submission.grade !== null && (
                    <div className="grade-info">
                      <strong>Grade: {assignment.submission.grade}</strong>
                      {assignment.submission.feedback && (
                        <p>Feedback: {assignment.submission.feedback}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {(!assignment.submission || assignment.submission.status === 'pending') && (
                <div className="submission-form">
                  <textarea
                    placeholder="Enter your submission here..."
                    value={submissionText[assignment.id] || assignment.submission?.response || ''}
                    onChange={(e) => setSubmissionText({ ...submissionText, [assignment.id]: e.target.value })}
                    rows={6}
                  />
                  <button
                    onClick={() => handleSubmit(assignment.id)}
                    className="btn btn-primary"
                    disabled={submitting[assignment.id]}
                  >
                    {submitting[assignment.id] ? 'Submitting...' : 
                     assignment.submission ? 'Update Submission' : 'Submit Assignment'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyAssignments






