import { Outlet, Link, useNavigate } from 'react-router-dom'
import api from './api/client.js'
import { useEffect, useState } from 'react'

function App() {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    let isMounted = true

    const checkAuth = async () => {
      try {
        await api.get('/api/users/me', { timeout: 5000 })
        if (isMounted) setIsLoggedIn(true)
      } catch {
        if (isMounted) setIsLoggedIn(false)
      }
    }

    checkAuth()
    const onAuthChange = () => {
      checkAuth()
    }
    window.addEventListener('edu-auth-changed', onAuthChange)
    return () => {
      isMounted = false
      window.removeEventListener('edu-auth-changed', onAuthChange)
    }
  }, [])

  
  const onLogout = async () => {
    setIsLoggingOut(true)
    try {
      await api.post('/api/users/logout', {}, { timeout: 5000 })
      setIsLoggedIn(false)
      navigate('/')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-xl font-bold tracking-tight text-slate-900">
            Edu<span className="text-indigo-600">Track</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/add-student" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300">
              Add Data
            </Link>
            <Link to="/students" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50 hover:text-indigo-600">
              Find All
            </Link>
            <Link to="/search" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50 hover:text-indigo-600">
              Find by ID
            </Link>
            {isLoggedIn && (
              <button
                type="button"
                onClick={onLogout}
                disabled={isLoggingOut}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50 hover:text-red-600 disabled:opacity-70"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </main>
  )
}

export default App
