'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  LayoutDashboard,
  GraduationCap,
  Stethoscope,
  Image,
  Newspaper,
  MessageSquare,
  FileText,
  Calendar,
  Mail,
  BookOpen,
  FlaskConical,
  Handshake,
  Trophy,
  History,
  Building2,
  Target,
  Star,
  FileStack,
  User,
  Users,
  BarChart3,
  Award,
  CalendarDays,
  BookMarked,
  UserPlus,
  LogOut,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'

const adminModels = [
  { name: 'Programs', path: 'programs', icon: GraduationCap },
  { name: 'Services', path: 'services', icon: Stethoscope },
  { name: 'Doctors', path: 'doctors', icon: Stethoscope },
  { name: 'Gallery', path: 'gallery', icon: Image },
  { name: 'News', path: 'news', icon: Newspaper },
  { name: 'Testimonials', path: 'testimonials', icon: MessageSquare },
  { name: 'Applications', path: 'applications', icon: FileText },
  { name: 'Appointments', path: 'appointments', icon: Calendar },
  { name: 'Contact Messages', path: 'contact_messages', icon: Mail },
  { name: 'Publications', path: 'publications', icon: BookOpen },
  { name: 'Research Studies', path: 'research_studies', icon: FlaskConical },
  { name: 'Collaborations', path: 'collaborations', icon: Handshake },
  { name: 'Achievements', path: 'achievements', icon: Trophy },
  { name: 'History Events', path: 'history_events', icon: History },
  { name: 'College History', path: 'college_history_events', icon: Building2 },
  { name: 'Academic Programs History', path: 'academic_programs_history', icon: Target },
  { name: 'Facility History', path: 'facility_history', icon: Building2 },
  { name: 'Legacy Achievements', path: 'legacy_achievements', icon: Star },
  { name: 'Historical Documents', path: 'historical_documents', icon: FileStack },
  { name: 'Founder Info', path: 'founder_info', icon: User },
]

const userManagementModels = [
  { name: 'Students', path: 'users', icon: Users },
  { name: 'Admin Users', path: 'admin_users', icon: User },
]

const studentDataModels = [
  { name: 'Student Grades', path: 'student_grades', icon: BarChart3 },
  { name: 'Student Certificates', path: 'student_certificates', icon: Award },
  { name: 'Student Schedules', path: 'student_schedules', icon: CalendarDays },
]

const courseManagementModels = [
  { name: 'Courses', path: 'courses', icon: BookMarked },
  { name: 'Course Enrollments', path: 'course_enrollments', icon: UserPlus },
]

interface AdminSidebarProps {
  onLogout: () => void
  onClose?: () => void
}

function NavSection({
  title,
  models,
  pathname,
  onLinkClick,
  defaultOpen = true,
}: {
  title: string
  models: { name: string; path: string; icon: React.ComponentType<{ className?: string }> }[]
  pathname: string
  onLinkClick: () => void
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const hasActive = models.some((m) => pathname.includes(`/${m.path}`))

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        <span>{title}</span>
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {open && (
        <div className="space-y-1">
          {models.map((model) => {
            const Icon = model.icon
            const isActive = pathname.includes(`/${model.path}`)
            return (
              <Link key={model.path} href={`/admin/${model.path}`} onClick={onLinkClick}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className="w-full justify-start text-sm min-h-[44px] px-3"
                >
                  <Icon className="h-4 w-4 mr-2 shrink-0" />
                  <span className="truncate">{model.name}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function AdminSidebar({ onLogout, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  const handleLinkClick = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <Card className="h-full p-4 border-0 shadow-none bg-transparent">
      <div className="space-y-4">
        <div className="border-b pb-4">
          <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-sm text-gray-600">MOCHAM Management</p>
        </div>

        <div>
          <Link href="/admin" onClick={handleLinkClick}>
            <Button
              variant={pathname === '/admin' ? 'default' : 'ghost'}
              className="w-full justify-start min-h-[44px]"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>

        <NavSection
          title="Content Management"
          models={adminModels}
          pathname={pathname}
          onLinkClick={handleLinkClick}
        />

        <NavSection
          title="User Management"
          models={userManagementModels}
          pathname={pathname}
          onLinkClick={handleLinkClick}
        />

        <NavSection
          title="Student Data"
          models={studentDataModels}
          pathname={pathname}
          onLinkClick={handleLinkClick}
        />

        <NavSection
          title="Course Management"
          models={courseManagementModels}
          pathname={pathname}
          onLinkClick={handleLinkClick}
        />

        <div className="border-t pt-4">
          <Button
            variant="outline"
            onClick={onLogout}
            className="w-full min-h-[44px]"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </Card>
  )
}
