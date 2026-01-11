// Authentication utilities using localStorage

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('currentUser')
  return userStr ? JSON.parse(userStr) : null
}

export const setCurrentUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user))
}

export const removeCurrentUser = () => {
  localStorage.removeItem('currentUser')
}

export const isAuthenticated = () => {
  return getCurrentUser() !== null
}

export const getUserRole = () => {
  const user = getCurrentUser()
  return user ? user.role : null
}

export const isStudent = () => {
  return getUserRole() === 'student'
}

export const isInstructor = () => {
  return getUserRole() === 'instructor'
}

export const isAdmin = () => {
  return getUserRole() === 'admin'
}

export const hasRole = (roles) => {
  const userRole = getUserRole()
  return roles.includes(userRole)
}






