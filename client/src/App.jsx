import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Values from './pages/Values'
import Habits from './pages/Habits'
import DailyTracker from './pages/DailyTracker'
import WeeklyTracker from './pages/WeeklyTracker'
import Learn from './pages/Learn'
import Login from './pages/Login'
import Register from './pages/Register'
import { AuthProvider } from './contexts/AuthContext'
import { AppProvider } from './contexts/AppContext'

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50">
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/learn" element={<Learn />} />

              {/* Protected Routes - Require Authentication */}
              <Route path="/values" element={<ProtectedRoute><Values /></ProtectedRoute>} />
              <Route path="/habits" element={<ProtectedRoute><Habits /></ProtectedRoute>} />
              <Route path="/daily" element={<ProtectedRoute><DailyTracker /></ProtectedRoute>} />
              <Route path="/weekly" element={<ProtectedRoute><WeeklyTracker /></ProtectedRoute>} />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  )
}

export default App
