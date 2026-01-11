import axios from 'axios'

const API_URL = 'http://localhost:3001'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  findByEmail: (email) => api.get(`/users?email=${email}`),
}

// Courses API
export const coursesAPI = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  getByInstructor: (instructorId) => api.get(`/courses?instructorId=${instructorId}`),
  getByCategory: (category) => api.get(`/courses?category=${category}`),
  search: (query) => api.get(`/courses?q=${query}`),
}

// Lessons API
export const lessonsAPI = {
  getAll: () => api.get('/lessons'),
  getById: (id) => api.get(`/lessons/${id}`),
  getByCourse: (courseId) => api.get(`/lessons?courseId=${courseId}`),
  create: (data) => api.post('/lessons', data),
  update: (id, data) => api.put(`/lessons/${id}`, data),
  delete: (id) => api.delete(`/lessons/${id}`),
}

// Enrollments API
export const enrollmentsAPI = {
  getAll: () => api.get('/enrollments'),
  getById: (id) => api.get(`/enrollments/${id}`),
  getByStudent: (studentId) => api.get(`/enrollments?studentId=${studentId}`),
  getByCourse: (courseId) => api.get(`/enrollments?courseId=${courseId}`),
  create: (data) => api.post('/enrollments', data),
  update: (id, data) => api.put(`/enrollments/${id}`, data),
  delete: (id) => api.delete(`/enrollments/${id}`),
  checkEnrollment: (studentId, courseId) => 
    api.get(`/enrollments?studentId=${studentId}&courseId=${courseId}`),
}

// Assignments API
export const assignmentsAPI = {
  getAll: () => api.get('/assignments'),
  getById: (id) => api.get(`/assignments/${id}`),
  getByCourse: (courseId) => api.get(`/assignments?courseId=${courseId}`),
  create: (data) => api.post('/assignments', data),
  update: (id, data) => api.put(`/assignments/${id}`, data),
  delete: (id) => api.delete(`/assignments/${id}`),
}

// Submissions API
export const submissionsAPI = {
  getAll: () => api.get('/submissions'),
  getById: (id) => api.get(`/submissions/${id}`),
  getByAssignment: (assignmentId) => api.get(`/submissions?assignmentId=${assignmentId}`),
  getByStudent: (studentId) => api.get(`/submissions?studentId=${studentId}`),
  create: (data) => api.post('/submissions', data),
  update: (id, data) => api.put(`/submissions/${id}`, data),
  delete: (id) => api.delete(`/submissions/${id}`),
}

// Progress API
export const progressAPI = {
  getAll: () => api.get('/progress'),
  getById: (id) => api.get(`/progress/${id}`),
  getByStudent: (studentId) => api.get(`/progress?studentId=${studentId}`),
  getByCourse: (courseId) => api.get(`/progress?courseId=${courseId}`),
  getByStudentAndCourse: (studentId, courseId) =>
    api.get(`/progress?studentId=${studentId}&courseId=${courseId}`),
  create: (data) => api.post('/progress', data),
  update: (id, data) => api.put(`/progress/${id}`, data),
  delete: (id) => api.delete(`/progress/${id}`),
}

export default api






