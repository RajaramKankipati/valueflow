import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    navigate('/')
  }

  // Don't show navbar on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                ValueFlow
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {/* Public navigation items - always visible */}
            {[
              { path: '/', label: 'Home' },
              { path: '/learn', label: 'Learn' },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(path)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {label}
              </Link>
            ))}

            {/* Protected navigation items - only visible when logged in */}
            {user && [
              { path: '/values', label: 'Values' },
              { path: '/habits', label: 'Habits' },
              { path: '/daily', label: 'Daily' },
              { path: '/weekly', label: 'Weekly' },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(path)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {label}
              </Link>
            ))}

            {/* User Menu */}
            <div className="relative ml-3">
              {user ? (
                <>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="hidden sm:inline">{user.name}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
