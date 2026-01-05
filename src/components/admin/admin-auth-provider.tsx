'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface AdminSession {
  email: string
  name: string
  loginTime: number
}

interface AdminAuthContextType {
  session: AdminSession | null
  loading: boolean
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for admin session in localStorage
    const checkSession = () => {
      try {
        if (typeof window === 'undefined' || !window.localStorage) {
          setSession(null)
          setLoading(false)
          return
        }

        const adminSession = localStorage.getItem('adminSession')
        if (adminSession) {
          try {
            const sessionData = JSON.parse(adminSession)
            // Check if session is not expired (24 hours)
            const isExpired = sessionData.loginTime && (Date.now() - sessionData.loginTime > 24 * 60 * 60 * 1000)
            if (!isExpired && sessionData.email) {
              setSession(sessionData)
            } else {
              localStorage.removeItem('adminSession')
              setSession(null)
            }
          } catch (parseError) {
            console.error('Failed to parse session data:', parseError)
            localStorage.removeItem('adminSession')
            setSession(null)
          }
        } else {
          setSession(null)
        }
      } catch (error) {
        console.error('Session check failed:', error)
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem('adminSession')
        }
        setSession(null)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
    
    // Also listen for storage events (for cross-tab synchronization)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminSession') {
        checkSession()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('adminSession')
    setSession(null)
    window.location.href = '/admin/login'
  }

  return (
    <AdminAuthContext.Provider value={{ session, loading, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}