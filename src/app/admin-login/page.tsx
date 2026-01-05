'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if already logged in
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const adminSession = localStorage.getItem('adminSession')
        if (adminSession) {
          const sessionData = JSON.parse(adminSession)
          const isExpired = sessionData.loginTime && (Date.now() - sessionData.loginTime > 24 * 60 * 60 * 1000)
          if (!isExpired && sessionData.email) {
            // Already logged in, redirect to admin
            router.push('/admin')
          }
        }
      }
    } catch (error) {
      // Ignore errors, just continue with login
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    setLoading(true)
    setError('')
    
    if (!email || !email.trim()) {
      setError('Please enter an email address')
      setLoading(false)
      return false
    }

    try {
      const response = await fetch('/api/admin/check-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
        credentials: 'same-origin'
      })

      // Check if response is ok first
      if (!response.ok) {
        let errorMessage = 'Access denied. This email is not registered as an admin.'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // If JSON parsing fails, use default message
        }
        setError(errorMessage)
        setLoading(false)
        return false
      }

      // Parse response data
      let data
      try {
        data = await response.json()
      } catch (parseError) {
        console.error('Failed to parse response:', parseError)
        setError('Invalid response from server. Please try again.')
        setLoading(false)
        return false
      }

      // Check if adminUser exists in response
      if (!data || !data.adminUser) {
        setError('Invalid response from server. Please try again.')
        setLoading(false)
        return false
      }

      // Store admin session in localStorage
      try {
        if (typeof window === 'undefined' || !window.localStorage) {
          setError('LocalStorage is not available. Please enable it in your browser settings.')
          setLoading(false)
          return false
        }

        const sessionData = {
          email: data.adminUser.email,
          name: data.adminUser.name || data.adminUser.email.split('@')[0],
          loginTime: Date.now()
        }

        localStorage.setItem('adminSession', JSON.stringify(sessionData))
        
        // Verify it was saved
        const saved = localStorage.getItem('adminSession')
        if (!saved) {
          setError('Failed to save session. Please try again.')
          setLoading(false)
          return false
        }

        console.log('Session saved successfully, redirecting...')
        
        // Use Next.js router for client-side navigation (better for mobile)
        // Add a small delay to ensure localStorage is committed
        setTimeout(() => {
          try {
            console.log('Attempting router.push to /admin')
            router.push('/admin')
            
            // Fallback to window.location if router.push doesn't work within 1 second
            setTimeout(() => {
              if (window.location.pathname !== '/admin' && window.location.pathname !== '/admin/') {
                console.log('Router.push did not redirect, using window.location as fallback')
                window.location.href = '/admin'
              }
            }, 1000)
          } catch (routerError) {
            console.error('Router error:', routerError)
            // Fallback to window.location
            window.location.href = '/admin'
          }
        }, 200)
        
      } catch (storageError: any) {
        console.error('Storage error:', storageError)
        setError(`Failed to save session: ${storageError.message || 'Unknown error'}. Please try again.`)
        setLoading(false)
      }
    } catch (error: any) {
      console.error('Login error:', error)
      setError(`An unexpected error occurred: ${error.message || 'Please check your internet connection and try again.'}`)
      setLoading(false)
    }
    
    return false
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-lg shadow-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">MOCHAM Admin Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                required
                disabled={loading}
                className="mt-1 block w-full px-3 py-3 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your admin email"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full bg-blue-600 text-white px-4 py-3 text-base font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed active:bg-blue-800 touch-manipulation"
              onClick={(e) => {
                // Prevent any default button behavior
                if (loading || !email.trim()) {
                  e.preventDefault()
                  e.stopPropagation()
                }
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Only registered administrators can access this dashboard.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Contact your system administrator if you need access.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
