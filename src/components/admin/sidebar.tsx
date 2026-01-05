'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const adminModels = [
  { name: 'Programs', path: 'programs', icon: '🎓' },
  { name: 'Services', path: 'services', icon: '🏥' },
  { name: 'Doctors', path: 'doctors', icon: '👨‍⚕️' },
  { name: 'News', path: 'news', icon: '📰' },
  { name: 'Testimonials', path: 'testimonials', icon: '💬' },
  { name: 'Applications', path: 'applications', icon: '📝' },
  { name: 'Appointments', path: 'appointments', icon: '📅' },
  { name: 'Contact Messages', path: 'contact_messages', icon: '📧' },
  { name: 'Publications', path: 'publications', icon: '📚' },
  { name: 'Research Studies', path: 'research_studies', icon: '🔬' },
  { name: 'Collaborations', path: 'collaborations', icon: '🤝' },
  { name: 'Achievements', path: 'achievements', icon: '🏆' },
  { name: 'History Events', path: 'history_events', icon: '📜' },
  { name: 'College History', path: 'college_history_events', icon: '🏛️' },
  { name: 'Academic Programs History', path: 'academic_programs_history', icon: '🎯' },
  { name: 'Facility History', path: 'facility_history', icon: '🏢' },
  { name: 'Legacy Achievements', path: 'legacy_achievements', icon: '⭐' },
  { name: 'Historical Documents', path: 'historical_documents', icon: '📄' },
  { name: 'Founder Info', path: 'founder_info', icon: '👤' },
]

const userManagementModels = [
  { name: 'Students', path: 'users', icon: '👥' },
  { name: 'Admin Users', path: 'admin_users', icon: '👨‍💼' },
]

const studentDataModels = [
  { name: 'Student Grades', path: 'student_grades', icon: '📊' },
  { name: 'Student Certificates', path: 'student_certificates', icon: '🎓' },
  { name: 'Student Schedules', path: 'student_schedules', icon: '📅' },
]

const courseManagementModels = [
  { name: 'Courses', path: 'courses', icon: '📚' },
  { name: 'Course Enrollments', path: 'course_enrollments', icon: '👥' },
]

interface AdminSidebarProps {
  onLogout: () => void
  onClose?: () => void
}

export default function AdminSidebar({ onLogout, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  const handleLinkClick = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <Card className="h-full p-4">
      <div className="space-y-4">
        <div className="border-b pb-4">
          <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-sm text-gray-600">MOCHAM Management</p>
        </div>

        <div>
          <Link href="/admin" onClick={handleLinkClick}>
            <Button 
              variant={pathname === '/admin' ? 'default' : 'ghost'} 
              className="w-full justify-start"
            >
              🏠 Dashboard
            </Button>
          </Link>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Content Management</h3>
          <div className="space-y-1">
            {adminModels.map((model) => (
              <Link key={model.path} href={`/admin/${model.path}`} onClick={handleLinkClick}>
                <Button 
                  variant={pathname.includes(`/${model.path}`) ? 'default' : 'ghost'} 
                  className="w-full justify-start text-sm"
                >
                  <span className="mr-2">{model.icon}</span>
                  {model.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">User Management</h3>
          <div className="space-y-1">
            {userManagementModels.map((model) => (
              <Link key={model.path} href={`/admin/${model.path}`} onClick={handleLinkClick}>
                <Button 
                  variant={pathname.includes(`/${model.path}`) ? 'default' : 'ghost'} 
                  className="w-full justify-start text-sm"
                >
                  <span className="mr-2">{model.icon}</span>
                  {model.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Student Data Management</h3>
          <div className="space-y-1">
            {studentDataModels.map((model) => (
              <Link key={model.path} href={`/admin/${model.path}`} onClick={handleLinkClick}>
                <Button 
                  variant={pathname.includes(`/${model.path}`) ? 'default' : 'ghost'} 
                  className="w-full justify-start text-sm"
                >
                  <span className="mr-2">{model.icon}</span>
                  {model.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Course Management</h3>
          <div className="space-y-1">
            {courseManagementModels.map((model) => (
              <Link key={model.path} href={`/admin/${model.path}`} onClick={handleLinkClick}>
                <Button 
                  variant={pathname.includes(`/${model.path}`) ? 'default' : 'ghost'} 
                  className="w-full justify-start text-sm"
                >
                  <span className="mr-2">{model.icon}</span>
                  {model.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="w-full"
          >
            🚪 Logout
          </Button>
        </div>
      </div>
    </Card>
  )
}
