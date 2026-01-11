import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from './components/Layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { isAuthenticated } from './utils/auth'

// Auth Pages
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'

// Public Pages
import Home from './pages/Home'
import Courses from './pages/Courses/Courses'
import CourseDetails from './pages/Courses/CourseDetails'

// Student Pages
import MyCourses from './pages/Student/MyCourses'
import MyAssignments from './pages/Student/MyAssignments'
import LessonView from './pages/Student/LessonView'

// Instructor Pages
import InstructorCourses from './pages/Instructor/InstructorCourses'
import CreateCourse from './pages/Instructor/CreateCourse'
import EditCourse from './pages/Instructor/EditCourse'
import InstructorAssignments from './pages/Instructor/InstructorAssignments'
import CreateAssignment from './pages/Instructor/CreateAssignment'
import ViewSubmissions from './pages/Instructor/ViewSubmissions'
import CreateLesson from './pages/Instructor/CreateLesson'

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminUsers from './pages/Admin/AdminUsers'
import AdminCourses from './pages/Admin/AdminCourses'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!isAuthenticated() ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated() ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />

          {/* Student Routes */}
          <Route
            path="/my-courses"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MyCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-assignments"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MyAssignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId/lessons/:lessonId"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <LessonView />
              </ProtectedRoute>
            }
          />

          {/* Instructor Routes */}
          <Route
            path="/instructor/courses"
            element={
              <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                <InstructorCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses/create"
            element={
              <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                <CreateCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                <EditCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses/:courseId/lessons/create"
            element={
              <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                <CreateLesson />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/assignments"
            element={
              <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                <InstructorAssignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/assignments/create"
            element={
              <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                <CreateAssignment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/assignments/:id/submissions"
            element={
              <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                <ViewSubmissions />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCourses />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Layout>
    </Router>
  )
}

export default App






