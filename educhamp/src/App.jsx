import { useState, useEffect } from 'react'
import { ClerkProvider, SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-react'
import './App.css'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import ClerkAuth from './components/ClerkAuth'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!publishableKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env.local')
}

function AppContent() {
  const { userId, getToken } = useAuth()
  const { user, isLoaded } = useUser()
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const syncUserAndFetchRole = async () => {
      if (userId && user && isLoaded) {
        try {
          // Get Clerk token to verify backend auth works
          const token = await getToken()
          console.log('Clerk token obtained')

          // Check if user has role metadata
          const role = user.unsafeMetadata?.role || 'parent'
          setUserRole(role)

          setLoading(false)
        } catch (error) {
          console.error('Error syncing user:', error)
          setLoading(false)
        }
      } else if (!userId && isLoaded) {
        setLoading(false)
      }
    }

    syncUserAndFetchRole()
  }, [userId, user, isLoaded, getToken])

  if (!isLoaded || loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="app">
      <SignedOut>
        <div className="auth-container">
          <div className="auth-card">
            <h1>EduChamp</h1>
            <p>Student Results Management System</p>
            <ClerkAuth />
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        {userRole === 'admin' ? (
          <AdminPanel user={user} />
        ) : (
          <Dashboard user={user} />
        )}
      </SignedIn>
    </div>
  )
}

function App() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <AppContent />
    </ClerkProvider>
  )
}

export default App
