import { Navigate } from 'react-router-dom'
import { isAuthenticated, hasRole } from '../utils/auth'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const authenticated = isAuthenticated()
  
  if (!authenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute






