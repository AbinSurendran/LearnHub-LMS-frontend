// import { Link, useNavigate, useLocation } from 'react-router-dom'
// import { getCurrentUser, removeCurrentUser, getUserRole } from '../../utils/auth'
// import { useState, useEffect } from 'react'
// import './Navbar.css'

// const Navbar = () => {
//   const [user, setUser] = useState(null)
//   const navigate = useNavigate()
//   const location = useLocation()

//   useEffect(() => {
//     // Check for user on mount
//     setUser(getCurrentUser())
//   }, [])

//   // Update user state when route changes (after login/register)
//   useEffect(() => {
//     setUser(getCurrentUser())
//   }, [location])

//   // Listen for custom login event
//   useEffect(() => {
//     const handleUserLogin = () => {
//       setUser(getCurrentUser())
//     }
    
//     window.addEventListener('userLogin', handleUserLogin)
    
//     return () => {
//       window.removeEventListener('userLogin', handleUserLogin)
//     }
//   }, [])

//   const handleLogout = () => {
//     removeCurrentUser()
//     setUser(null)
//     // Dispatch custom event
//     window.dispatchEvent(new Event('userLogin'))
//     navigate('/login')
//   }

//   const role = getUserRole()

//   return (
//     <nav className="navbar">
//       <div className="navbar-container">
//         <Link to="/" className="navbar-brand">
//           <div className="logo-icon">
//             <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <rect width="32" height="32" rx="8" fill="#14b8a6"/>
//               <path d="M16 10L10 13V20L16 23L22 20V13L16 10Z" fill="white"/>
//               <path d="M16 10V23" stroke="white" strokeWidth="2"/>
//             </svg>
//           </div>
//           <span className="logo-text">LearnHub</span>
//         </Link>
//         <div className="navbar-menu">
//           {user ? (
//             <>
//               <Link to="/" className="navbar-link">Home</Link>
//               <Link to="/courses" className="navbar-link">Courses</Link>
              
//               {role === 'student' && (
//                 <>
//                   <Link to="/my-courses" className="navbar-link">My Courses</Link>
//                   <Link to="/my-assignments" className="navbar-link">Assignments</Link>
//                 </>
//               )}
              
//               {role === 'instructor' && (
//                 <>
//                   <Link to="/instructor/courses" className="navbar-link">My Courses</Link>
//                   <Link to="/instructor/assignments" className="navbar-link">Assignments</Link>
//                 </>
//               )}
              
//               {role === 'admin' && (
//                 <Link to="/admin/dashboard" className="navbar-link">Dashboard</Link>
//               )}
              
//               <div className="navbar-user">
//                 <span className="navbar-username">{user.name}</span>
//                 <span className="navbar-role">{role}</span>
//                 <button onClick={handleLogout} className="btn btn-outline btn-sm">
//                   Logout
//                 </button>
//               </div>
//             </>
//           ) : (
//             <>
//               <Link to="/courses" className="navbar-link">Courses</Link>
//               <Link to="/login" className="navbar-link">Login</Link>
//               <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   )
// }

// export default Navbar




















import { Link, useNavigate, useLocation } from 'react-router-dom'
import { getCurrentUser, removeCurrentUser, getUserRole } from '../../utils/auth'
import { useState, useEffect } from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'   // 👈 change path if needed

const Navbar = () => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  useEffect(() => {
    setUser(getCurrentUser())
  }, [location])

  useEffect(() => {
    const handleUserLogin = () => {
      setUser(getCurrentUser())
    }
    
    window.addEventListener('userLogin', handleUserLogin)
    
    return () => {
      window.removeEventListener('userLogin', handleUserLogin)
    }
  }, [])

  const handleLogout = () => {
    removeCurrentUser()
    setUser(null)
    window.dispatchEvent(new Event('userLogin'))
    navigate('/login')
  }

  const role = getUserRole()

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* ✅ Brand Logo */}
        <Link to="/" className="navbar-brand">
          <img 
            src={logo} 
            alt="LearnHub Logo" 
            className="navbar-logo"
          />
          <span className="logo-text">LearnHub</span>
        </Link>

        <div className="navbar-menu">
          {user ? (
            <>
              <Link to="/" className="navbar-link">Home</Link>
              <Link to="/courses" className="navbar-link">Courses</Link>

              {role === 'student' && (
                <>
                  <Link to="/my-courses" className="navbar-link">My Courses</Link>
                  <Link to="/my-assignments" className="navbar-link">Assignments</Link>
                </>
              )}

              {role === 'instructor' && (
                <>
                  <Link to="/instructor/courses" className="navbar-link">My Courses</Link>
                  <Link to="/instructor/assignments" className="navbar-link">Assignments</Link>
                </>
              )}

              {role === 'admin' && (
                <Link to="/admin/dashboard" className="navbar-link">Dashboard</Link>
              )}

              <div className="navbar-user">
                <span className="navbar-username">{user.name}</span>
                <span className="navbar-role">{role}</span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/courses" className="navbar-link">Courses</Link>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
