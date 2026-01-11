import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { assignmentsAPI, submissionsAPI, usersAPI } from '../../services/api'
import '../Student/MyAssignments.css'

const ViewSubmissions = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [assignment, setAssignment] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [grading, setGrading] = useState({})
  const [grades, setGrades] = useState({})
  const [feedbacks, setFeedbacks] = useState({})

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const [assignmentRes, submissionsRes] = await Promise.all([
        assignmentsAPI.getById(id),
        submissionsAPI.getByAssignment(id)
      ])

      setAssignment(assignmentRes.data)

      const submissionsWithUsers = await Promise.all(
        submissionsRes.data.map(async (submission) => {
          const userRes = await usersAPI.getById(submission.studentId)
          return {
            ...submission,
            student: userRes.data
          }
        })
      )

      setSubmissions(submissionsWithUsers)

      const initialGrades = {}
      const initialFeedbacks = {}
      submissionsWithUsers.forEach(sub => {
        if (sub.grade !== null) {
          initialGrades[sub.id] = sub.grade
        }
        if (sub.feedback) {
          initialFeedbacks[sub.id] = sub.feedback
        }
      })
      setGrades(initialGrades)
      setFeedbacks(initialFeedbacks)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load submissions')
    } finally {
      setLoading(false)
    }
  }

  const handleGrade = async (submissionId) => {
    const grade = grades[submissionId]
    const feedback = feedbacks[submissionId] || ''

    if (!grade || grade.trim() === '') {
      toast.error('Please enter a grade')
      return
    }

    setGrading({ ...grading, [submissionId]: true })

    try {
      const submission = submissions.find(s => s.id === submissionId)
      await submissionsAPI.update(submissionId, {
        ...submission,
        grade,
        feedback,
        status: 'reviewed'
      })

      toast.success('Grade submitted successfully!')
      fetchData()
    } catch (error) {
      console.error('Error grading submission:', error)
      toast.error('Failed to submit grade')
    } finally {
      setGrading({ ...grading, [submissionId]: false })
    }
  }

  if (loading) {
    return <div className="container loading" style={{ paddingTop: '2rem' }}>Loading submissions...</div>
  }

  if (!assignment) {
    return <div className="container" style={{ paddingTop: '2rem' }}>Assignment not found</div>
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <button onClick={() => navigate('/instructor/assignments')} className="btn btn-outline" style={{ marginBottom: '2rem' }}>
        ← Back to Assignments
      </button>

      <div className="assignment-card" style={{ marginBottom: '2rem' }}>
        <h2>{assignment.title}</h2>
        <p className="assignment-description">{assignment.description}</p>
        <div className="assignment-meta">
          <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
        </div>
      </div>

      <h3>Submissions ({submissions.length})</h3>

      {submissions.length === 0 ? (
        <div className="no-assignments">
          <p>No submissions yet.</p>
        </div>
      ) : (
        <div className="assignments-list">
          {submissions.map(submission => (
            <div key={submission.id} className="assignment-card">
              <div className="assignment-header">
                <div>
                  <h3>{submission.student.name}</h3>
                  <p className="assignment-course">Email: {submission.student.email}</p>
                </div>
                <span className={`status-badge ${submission.status}`}>
                  {submission.status}
                </span>
              </div>

              <div className="submission-info">
                <h4>Submission:</h4>
                <p className="submission-text">{submission.response}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  Submitted: {new Date(submission.submittedAt).toLocaleString()}
                </p>
              </div>

              {submission.grade !== null && (
                <div className="grade-info">
                  <strong>Current Grade: {submission.grade}</strong>
                  {submission.feedback && (
                    <p>Feedback: {submission.feedback}</p>
                  )}
                </div>
              )}

              <div className="grading-form" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                <div className="input-group">
                  <label htmlFor={`grade-${submission.id}`}>Grade</label>
                  <input
                    type="text"
                    id={`grade-${submission.id}`}
                    value={grades[submission.id] || submission.grade || ''}
                    onChange={(e) => setGrades({ ...grades, [submission.id]: e.target.value })}
                    placeholder="Enter grade (e.g., A, 95, Pass)"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor={`feedback-${submission.id}`}>Feedback</label>
                  <textarea
                    id={`feedback-${submission.id}`}
                    value={feedbacks[submission.id] || submission.feedback || ''}
                    onChange={(e) => setFeedbacks({ ...feedbacks, [submission.id]: e.target.value })}
                    placeholder="Enter feedback (optional)"
                    rows={4}
                  />
                </div>
                <button
                  onClick={() => handleGrade(submission.id)}
                  className="btn btn-primary"
                  disabled={grading[submission.id]}
                >
                  {grading[submission.id] ? 'Grading...' : submission.grade !== null ? 'Update Grade' : 'Submit Grade'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ViewSubmissions






