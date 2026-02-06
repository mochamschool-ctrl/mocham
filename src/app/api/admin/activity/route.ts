import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function verifyAdminSession(request: NextRequest) {
  return true
}

export async function GET(request: NextRequest) {
  try {
    await verifyAdminSession(request)

    const [applications, appointments, contactMessages, news] = await Promise.all([
      prisma.application.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, firstName: true, lastName: true, status: true, createdAt: true }
      }),
      prisma.appointment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, firstName: true, lastName: true, date: true, status: true, createdAt: true }
      }),
      prisma.contactMessage.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, subject: true, status: true, createdAt: true }
      }),
      prisma.news.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, isPublished: true, createdAt: true }
      })
    ])

    const activity = [
      ...applications.map(a => ({
        type: 'application',
        id: a.id,
        title: `${a.firstName} ${a.lastName} - Application`,
        createdAt: a.createdAt,
        model: 'applications',
        meta: a.status
      })),
      ...appointments.map(a => ({
        type: 'appointment',
        id: a.id,
        title: `${a.firstName} ${a.lastName} - Appointment`,
        createdAt: a.createdAt,
        model: 'appointments',
        meta: a.status
      })),
      ...contactMessages.map(a => ({
        type: 'contact_message',
        id: a.id,
        title: `${a.name} - ${a.subject}`,
        createdAt: a.createdAt,
        model: 'contact_messages',
        meta: a.status
      })),
      ...news.map(a => ({
        type: 'news',
        id: a.id,
        title: a.title,
        createdAt: a.createdAt,
        model: 'news',
        meta: a.isPublished ? 'published' : 'draft'
      }))
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)

    return NextResponse.json(activity)
  } catch (error) {
    console.error('Admin activity error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity' },
      { status: 500 }
    )
  }
}
