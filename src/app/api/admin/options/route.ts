import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'users') {
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, firstName: true, lastName: true },
        orderBy: { name: 'asc' }
      })
      return NextResponse.json(
        users.map(u => ({
          id: u.id,
          label: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email
        }))
      )
    }

    if (type === 'courses') {
      const courses = await prisma.course.findMany({
        select: { id: true, title: true, code: true },
        orderBy: { code: 'asc' }
      })
      return NextResponse.json(
        courses.map(c => ({
          id: c.id,
          label: `${c.title} (${c.code})`
        }))
      )
    }

    return NextResponse.json(
      { error: 'Invalid type. Use ?type=users or ?type=courses' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Admin options error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch options' },
      { status: 500 }
    )
  }
}
