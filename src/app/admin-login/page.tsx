'use client'

import { useState, useEffect } from 'react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
      setIsMobile(isMobileDevice)
    }
    checkMobile()
  }, [])

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

      const data = await response.json()

      if (response.ok && data.adminUser) {
        try {
          // Store admin session in localStorage
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('adminSession', JSON.stringify({
              email: data.adminUser.email,
              name: data.adminUser.name,
              loginTime: Date.now()
            }))
            
            // Use window.location.replace for better mobile compatibility
            window.location.replace('/admin')
          } else {
            setError('LocalStorage is not available. Please enable it in your browser settings.')
            setLoading(false)
          }
        } catch (storageError) {
          console.error('Storage error:', storageError)
          setError('Failed to save session. Please try again.')
          setLoading(false)
        }
      } else {
        setError(data.error || 'Access denied. This email is not registered as an admin.')
        setLoading(false)
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An unexpected error occurred. Please check your internet connection and try again.')
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
