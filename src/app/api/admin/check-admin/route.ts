import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Allowed admin emails
const ALLOWED_ADMIN_EMAILS = [
  'mochamschool@gmail.com',
  'inyeneita1@gmail.com'
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body
    
    console.log('Admin login attempt:', { email })
    
    if (!email) {
      console.log('No email provided')
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if email is in the allowed list
    const normalizedEmail = email.toLowerCase().trim()
    console.log('Normalized email:', normalizedEmail)
    console.log('Allowed emails:', ALLOWED_ADMIN_EMAILS)
    
    const isAllowedEmail = ALLOWED_ADMIN_EMAILS.includes(normalizedEmail)
    console.log('Is allowed:', isAllowedEmail)

    if (!isAllowedEmail) {
      console.log('Email not in allowed list')
      return NextResponse.json(
        { error: 'Not an admin user' },
        { status: 403 }
      )
    }

    // Find or create admin user
    let adminUser = await prisma.adminUser.findUnique({
      where: { email: normalizedEmail }
    })

    // If admin user doesn't exist, create it
    if (!adminUser) {
      const nameParts = normalizedEmail.split('@')[0].split('.')
      const firstName = nameParts[0] || 'Admin'
      const lastName = nameParts.slice(1).join(' ') || 'User'
      const fullName = `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}`

      adminUser = await prisma.adminUser.create({
        data: {
          email: normalizedEmail,
          name: fullName,
          firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
          lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
          isActive: true
        }
      })
    } else if (!adminUser.isActive) {
      // Reactivate if previously deactivated
      adminUser = await prisma.adminUser.update({
        where: { id: adminUser.id },
        data: { isActive: true }
      })
    }

    console.log('Admin login successful:', { email: adminUser.email, id: adminUser.id })
    
    return NextResponse.json({ 
      success: true,
      adminUser: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName
      }
    })
  } catch (error) {
    console.error('Admin check error:', error)
    return NextResponse.json(
      { error: 'Failed to check admin status', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
