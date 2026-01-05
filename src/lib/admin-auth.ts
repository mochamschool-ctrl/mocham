import { auth } from './auth'
import { headers } from 'next/headers'
import { prisma } from './prisma'

// Allowed admin emails - anyone with these emails can login as admin
const ALLOWED_ADMIN_EMAILS = [
  'mochamschool@gmail.com',
  'inyeneita1@gmail.com'
]

export async function getAdminSession() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  if (!session) {
    return null
  }

  const email = session.user.email?.toLowerCase().trim()
  
  // Check if email is in allowed list
  if (email && ALLOWED_ADMIN_EMAILS.includes(email)) {
    return session
  }

  // Check if user email exists in AdminUser table
  const adminUser = await prisma.adminUser.findUnique({
    where: { 
      email: email || '',
      isActive: true
    }
  })
  
  if (!adminUser) {
    return null
  }

  return session
}

export async function requireAdminSession() {
  const session = await getAdminSession()
  
  if (!session) {
    throw new Error('Unauthorized: Admin access required')
  }
  
  return session
}

export async function isAdminEmail(email: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase().trim()
  
  // Check if email is in allowed list
  if (ALLOWED_ADMIN_EMAILS.includes(normalizedEmail)) {
    return true
  }
  
  // Check if user exists in AdminUser table
  const adminUser = await prisma.adminUser.findUnique({
    where: { 
      email: normalizedEmail,
      isActive: true
    }
  })
  
  return !!adminUser
}
