// import { Link } from 'react-router-dom'
// import './Footer.css'

// const Footer = () => {
//   return (
//     <footer className="footer">
//       <div className="container">
//         <div className="footer-content">
//           <div className="footer-section">
//             <div className="footer-brand">
//               <div className="logo-icon">
//                 <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <rect width="32" height="32" rx="8" fill="#14b8a6"/>
//                   <path d="M16 10L10 13V20L16 23L22 20V13L16 10Z" fill="white"/>
//                   <path d="M16 10V23" stroke="white" strokeWidth="2"/>
//                 </svg>
//               </div>
//               <span className="logo-text">LearnHub</span>
//             </div>
//             <p className="footer-description">
//               A comprehensive learning management system designed to help students, instructors, and administrators achieve their educational goals.
//             </p>
//           </div>

//           <div className="footer-section">
//             <h4 className="footer-title">Quick Links</h4>
//             <ul className="footer-links">
//               <li><Link to="/">Home</Link></li>
//               <li><Link to="/courses">Browse Courses</Link></li>
//               <li><Link to="/register">Get Started</Link></li>
//               <li><Link to="/login">Login</Link></li>
//             </ul>
//           </div>

          

//           <div className="footer-section">
//             <h4 className="footer-title">Contact</h4>
//             <ul className="footer-links">
//               <li>Email: support@learnhub.com</li>
//               <li>Phone: 8976554498</li>
//             </ul>
//           </div>
//         </div>

//         <div className="footer-bottom">
//           <p className="footer-copyright">© 2025 LearnHub. All rights reserved.</p>
//         </div>
//       </div>
//     </footer>
//   )
// }

// export default Footer




import { Link } from 'react-router-dom'
import './Footer.css'
import logo from '../../assets/logo.png'   // adjust path if needed

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand">
              <div className="logo-icon">
                <img 
                  src={logo} 
                  alt="LearnHub Logo" 
                  className="footer-logo"
                />
              </div>
              <span className="logo-text">LearnHub</span>
            </div>

            <p className="footer-description">
              A comprehensive learning management system designed to help students, instructors, achieve their educational goals.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/courses">Browse Courses</Link></li>
              <li><Link to="/register">Get Started</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Contact</h4>
            <ul className="footer-links">
              <li>Email: support@learnhub.com</li>
              <li>Phone: 8976554498</li>
            </ul>
          </div>
        </div>

        
      </div>
    </footer>
  )
}

export default Footer

