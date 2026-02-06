'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import StatsCard from '@/components/admin/stats-card'
import { Card } from '@/components/ui/card'

interface DashboardStats {
  programs: number
  services: number
  doctors: number
  news: number
  testimonials: number
  applications: number
  appointments: number
  contactMessages: number
  publications: number
  researchStudies: number
  collaborations: number
  achievements: number
  historyEvents: number
  founderInfo: number
  collegeHistoryEvents: number
  academicProgramsHistory: number
  facilityHistory: number
  legacyAchievements: number
  historicalDocuments: number
  users: number
  adminUsers: number
  studentGrades: number
  studentCertificates: number
  studentSchedules: number
  pendingApplications?: number
  unreadContactMessages?: number
  courses?: number
  courseEnrollments?: number
  gallery?: number
}

interface ActivityItem {
  type: string
  id: string
  title: string
  createdAt: string
  model: string
  meta?: string
}

function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString()
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    programs: 0,
    services: 0,
    doctors: 0,
    news: 0,
    testimonials: 0,
    applications: 0,
    appointments: 0,
    contactMessages: 0,
    publications: 0,
    researchStudies: 0,
    collaborations: 0,
    achievements: 0,
    historyEvents: 0,
    founderInfo: 0,
    collegeHistoryEvents: 0,
    academicProgramsHistory: 0,
    facilityHistory: 0,
    legacyAchievements: 0,
    historicalDocuments: 0,
    users: 0,
    adminUsers: 0,
    studentGrades: 0,
    studentCertificates: 0,
    studentSchedules: 0
  })
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/activity')
        ])
        if (statsRes.ok) {
          const data = await statsRes.json()
          setStats(data)
        }
        if (activityRes.ok) {
          const data = await activityRes.json()
          setActivity(data)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="admin-stats-grid">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="admin-stats-grid">
        <StatsCard title="Academic Programs" value={stats.programs} icon="🎓" description="Total programs" href="/admin/programs" />
        <StatsCard title="Medical Services" value={stats.services} icon="🏥" description="Available services" href="/admin/services" />
        <StatsCard title="Medical Practitioners" value={stats.doctors} icon="👨‍⚕️" description="Active doctors" href="/admin/doctors" />
        <StatsCard title="News Articles" value={stats.news} icon="📰" description="Published articles" href="/admin/news" />
        <StatsCard
          title="Student Applications"
          value={stats.pendingApplications ?? stats.applications}
          icon="📝"
          description={`${stats.pendingApplications ?? 0} pending of ${stats.applications} total`}
          href="/admin/applications"
        />
        <StatsCard title="Patient Appointments" value={stats.appointments} icon="📅" description="Scheduled" href="/admin/appointments" />
        <StatsCard
          title="Contact Messages"
          value={stats.unreadContactMessages ?? stats.contactMessages}
          icon="📧"
          description={`${stats.unreadContactMessages ?? 0} unread of ${stats.contactMessages} total`}
          href="/admin/contact_messages"
        />
        <StatsCard title="Research Publications" value={stats.publications} icon="📚" description="Published research" href="/admin/publications" />
        <StatsCard title="Research Studies" value={stats.researchStudies} icon="🔬" description="Active studies" href="/admin/research_studies" />
        <StatsCard title="Gallery" value={stats.gallery ?? 0} icon="🖼️" description="Images" href="/admin/gallery" />
        <StatsCard title="Testimonials" value={stats.testimonials} icon="💬" description="Patient testimonials" href="/admin/testimonials" />
        <StatsCard title="Collaborations" value={stats.collaborations} icon="🤝" description="Partnerships" href="/admin/collaborations" />
        <StatsCard title="Achievements" value={stats.achievements} icon="🏆" description="College achievements" href="/admin/achievements" />
        <StatsCard title="History Events" value={stats.historyEvents} icon="📅" description="Timeline events" href="/admin/history_events" />
        <StatsCard title="Founder Info" value={stats.founderInfo} icon="👤" description="Founder records" href="/admin/founder_info" />
        <StatsCard title="College History" value={stats.collegeHistoryEvents} icon="🏛️" description="Historical events" href="/admin/college_history_events" />
        <StatsCard title="Academic Programs History" value={stats.academicProgramsHistory} icon="📖" description="Program history" href="/admin/academic_programs_history" />
        <StatsCard title="Facility History" value={stats.facilityHistory} icon="🏢" description="Infrastructure" href="/admin/facility_history" />
        <StatsCard title="Legacy Achievements" value={stats.legacyAchievements} icon="⭐" description="Legacy records" href="/admin/legacy_achievements" />
        <StatsCard title="Historical Documents" value={stats.historicalDocuments} icon="📄" description="Archived" href="/admin/historical_documents" />
        <StatsCard title="Students" value={stats.users} icon="👥" description="Registered" href="/admin/users" />
        <StatsCard title="Admin Users" value={stats.adminUsers} icon="👨‍💼" description="Administrators" href="/admin/admin_users" />
        <StatsCard title="Student Grades" value={stats.studentGrades} icon="📊" description="Grade records" href="/admin/student_grades" />
        <StatsCard title="Student Certificates" value={stats.studentCertificates} icon="🎓" description="Certificates" href="/admin/student_certificates" />
        <StatsCard title="Student Schedules" value={stats.studentSchedules} icon="📅" description="Schedule entries" href="/admin/student_schedules" />
        <StatsCard title="Courses" value={stats.courses ?? 0} icon="📚" description="Course catalog" href="/admin/courses" />
        <StatsCard title="Course Enrollments" value={stats.courseEnrollments ?? 0} icon="👥" description="Enrollments" href="/admin/course_enrollments" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {activity.length > 0 ? (
              activity.map((item) => (
                <Link
                  key={`${item.model}-${item.id}`}
                  href={`/admin/${item.model}/${item.id}`}
                  className="flex items-center justify-between py-2 border-b hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
                >
                  <span className="text-sm text-gray-600 truncate flex-1 mr-2">{item.title}</span>
                  <span className="text-xs text-gray-500 shrink-0">{formatRelativeTime(item.createdAt)}</span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-gray-500 py-4">No recent activity</p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link href="/admin/news/new" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium">Create News Article</span>
            </Link>
            <Link href="/admin/applications" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium">Review Applications</span>
            </Link>
            <Link href="/admin/appointments" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium">Manage Appointments</span>
            </Link>
            <Link href="/admin/contact_messages" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium">View Contact Messages</span>
            </Link>
            <Link href="/admin/publications/new" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium">Add Publication</span>
            </Link>
            <Link href="/admin/gallery/new" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium">Add Gallery Image</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
