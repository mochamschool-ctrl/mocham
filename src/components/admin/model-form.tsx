'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import FileUploadField from '@/components/admin/file-upload-field'

interface ModelFormProps {
  modelName: string
  recordId?: string
  initialData?: any
}

const formFields: Record<string, any[]> = {
  programs: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'duration', label: 'Duration', type: 'text', required: true },
    { key: 'type', label: 'Type', type: 'select', options: ['degree', 'diploma', 'certificate'], required: true },
    { key: 'level', label: 'Level', type: 'select', options: ['undergraduate', 'graduate', 'professional'], required: true },
    { key: 'capacity', label: 'Capacity', type: 'number', required: true },
    { key: 'isAccredited', label: 'Accredited', type: 'checkbox' },
    { key: 'features', label: 'Features (comma-separated)', type: 'text' },
    { key: 'slug', label: 'Slug', type: 'text', required: true }
  ],
  services: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'price', label: 'Price', type: 'number', required: true },
    { key: 'duration', label: 'Duration', type: 'text' },
    { key: 'category', label: 'Category', type: 'select', options: ['homeopathy', 'integrative', 'herbal'], required: true },
    { key: 'isActive', label: 'Active', type: 'checkbox' },
    { key: 'features', label: 'Features (comma-separated)', type: 'text' },
    { key: 'slug', label: 'Slug', type: 'text', required: true }
  ],
  doctors: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'specialization', label: 'Specialization', type: 'text', required: true },
    { key: 'bio', label: 'Bio', type: 'textarea', required: true },
    { key: 'education', label: 'Education', type: 'textarea', required: true },
    { key: 'experience', label: 'Experience (years)', type: 'number', required: true },
    { key: 'rating', label: 'Rating', type: 'number' },
    { key: 'isActive', label: 'Active', type: 'checkbox' },
    { key: 'slug', label: 'Slug', type: 'text', required: true }
  ],
  news: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'content', label: 'Content', type: 'textarea', required: true },
    { key: 'excerpt', label: 'Excerpt', type: 'textarea', required: true },
    { key: 'category', label: 'Category', type: 'select', options: ['education', 'research', 'general'], required: true },
    { key: 'author', label: 'Author', type: 'text', required: true },
    { key: 'isPublished', label: 'Published', type: 'checkbox' },
    { key: 'slug', label: 'Slug', type: 'text', required: true }
  ],
  applications: [
    { key: 'firstName', label: 'First Name', type: 'text', required: true },
    { key: 'lastName', label: 'Last Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'phone', label: 'Phone', type: 'text', required: true },
    { key: 'programId', label: 'Program ID', type: 'text', required: true },
    { key: 'status', label: 'Status', type: 'select', options: ['pending', 'approved', 'rejected'], required: true },
    { key: 'documents', label: 'Documents (comma-separated)', type: 'text' },
    { key: 'notes', label: 'Notes', type: 'textarea' }
  ],
  appointments: [
    { key: 'firstName', label: 'First Name', type: 'text', required: true },
    { key: 'lastName', label: 'Last Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'phone', label: 'Phone', type: 'text', required: true },
    { key: 'serviceId', label: 'Service ID', type: 'text', required: true },
    { key: 'doctorId', label: 'Doctor ID', type: 'text' },
    { key: 'date', label: 'Date', type: 'datetime-local', required: true },
    { key: 'time', label: 'Time', type: 'text', required: true },
    { key: 'status', label: 'Status', type: 'select', options: ['scheduled', 'completed', 'cancelled'], required: true },
    { key: 'notes', label: 'Notes', type: 'textarea' }
  ],
  contact_messages: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'subject', label: 'Subject', type: 'text', required: true },
    { key: 'message', label: 'Message', type: 'textarea', required: true },
    { key: 'status', label: 'Status', type: 'select', options: ['unread', 'read', 'replied'], required: true }
  ],
  testimonials: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'content', label: 'Content', type: 'textarea', required: true },
    { key: 'rating', label: 'Rating', type: 'number', min: 1, max: 5, required: true },
    { key: 'service', label: 'Service', type: 'text' },
    { key: 'isActive', label: 'Active', type: 'checkbox' }
  ],
  publications: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'content', label: 'Content', type: 'textarea' },
    { key: 'type', label: 'Type', type: 'select', options: ['journal', 'conference', 'study'], required: true },
    { key: 'year', label: 'Year', type: 'number', required: true },
    { key: 'journal', label: 'Journal', type: 'text' },
    { key: 'authors', label: 'Authors (comma-separated)', type: 'text' },
    { key: 'doi', label: 'DOI', type: 'text' },
    { key: 'url', label: 'URL', type: 'url' },
    { key: 'imageUrl', label: 'Image URL', type: 'url' },
    { key: 'pdfUrl', label: 'PDF File', type: 'file-upload' },
    { key: 'slug', label: 'Slug', type: 'text', required: true },
    { key: 'tags', label: 'Tags (comma-separated)', type: 'text' },
    { key: 'readingTime', label: 'Reading Time (minutes)', type: 'number' },
    { key: 'isPublished', label: 'Published', type: 'checkbox' }
  ],
  research_studies: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'content', label: 'Content', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'select', options: ['active', 'recruiting', 'completed', 'planning'], required: true },
    { key: 'startDate', label: 'Start Date', type: 'date', required: true },
    { key: 'endDate', label: 'End Date', type: 'date' },
    { key: 'participants', label: 'Participants', type: 'number' },
    { key: 'centers', label: 'Centers', type: 'number' },
    { key: 'imageUrl', label: 'Image URL', type: 'url' },
    { key: 'pdfUrl', label: 'PDF File', type: 'file-upload' },
    { key: 'slug', label: 'Slug', type: 'text', required: true },
    { key: 'tags', label: 'Tags (comma-separated)', type: 'text' },
    { key: 'readingTime', label: 'Reading Time (minutes)', type: 'number' },
    { key: 'isActive', label: 'Active', type: 'checkbox' }
  ],
  collaborations: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'logo', label: 'Logo URL', type: 'url' },
    { key: 'website', label: 'Website', type: 'url' },
    { key: 'isActive', label: 'Active', type: 'checkbox' }
  ],
  gallery: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'imageUrl', label: 'Image URL', type: 'url', required: true },
    { key: 'category', label: 'Category', type: 'select', options: ['Campus', 'Events', 'Students', 'Faculty', 'General'], required: true },
    { key: 'isFeatured', label: 'Featured', type: 'checkbox' },
    { key: 'order', label: 'Order', type: 'number' }
  ],
  achievements: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'icon', label: 'Icon', type: 'text', required: true },
    { key: 'color', label: 'Color', type: 'select', options: ['ucsf-blue', 'medical-green', 'accent-orange'], required: true },
    { key: 'order', label: 'Order', type: 'number' },
    { key: 'isActive', label: 'Active', type: 'checkbox' }
  ],
  history_events: [
    { key: 'year', label: 'Year', type: 'number', required: true },
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'icon', label: 'Icon', type: 'text', required: true },
    { key: 'color', label: 'Color', type: 'select', options: ['ucsf-blue', 'medical-green', 'accent-orange'], required: true },
    { key: 'stats', label: 'Stats (comma-separated)', type: 'text' },
    { key: 'order', label: 'Order', type: 'number' },
    { key: 'isActive', label: 'Active', type: 'checkbox' }
  ],
  founder_info: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'birthDate', label: 'Birth Date', type: 'date' },
    { key: 'deathDate', label: 'Death Date', type: 'date' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'biography', label: 'Biography (JSON)', type: 'textarea' }
  ],
  college_history_events: [
    { key: 'year', label: 'Year', type: 'number', required: true },
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'eventType', label: 'Event Type', type: 'select', options: ['foundation', 'milestone', 'achievement', 'expansion', 'recognition'], required: true },
    { key: 'details', label: 'Details (JSON)', type: 'textarea' },
    { key: 'imageUrl', label: 'Image URL', type: 'url' },
    { key: 'order', label: 'Order', type: 'number' },
    { key: 'isActive', label: 'Active', type: 'checkbox' }
  ],
  academic_programs_history: [
    { key: 'facultyName', label: 'Faculty Name', type: 'text', required: true },
    { key: 'departmentName', label: 'Department Name', type: 'text' },
    { key: 'programName', label: 'Program Name', type: 'text', required: true },
    { key: 'degreeType', label: 'Degree Type', type: 'text' },
    { key: 'establishedYear', label: 'Established Year', type: 'number' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'isActive', label: 'Active', type: 'checkbox' }
  ],
  facility_history: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'type', label: 'Type', type: 'select', options: ['laboratory', 'museum', 'research_center', 'library', 'clinic'], required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'establishedYear', label: 'Established Year', type: 'number' },
    { key: 'equipment', label: 'Equipment (comma-separated)', type: 'text' },
    { key: 'isActive', label: 'Active', type: 'checkbox' }
  ],
  legacy_achievements: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'category', label: 'Category', type: 'select', options: ['recognition', 'graduation', 'international', 'research', 'community'], required: true },
    { key: 'year', label: 'Year', type: 'number' },
    { key: 'details', label: 'Details (JSON)', type: 'textarea' },
    { key: 'isFeatured', label: 'Featured', type: 'checkbox' }
  ],
  historical_documents: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'documentType', label: 'Document Type', type: 'select', options: ['image', 'document', 'certificate', 'newspaper', 'photo'], required: true },
    { key: 'fileUrl', label: 'File URL', type: 'url' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'year', label: 'Year', type: 'number' },
    { key: 'source', label: 'Source', type: 'text' },
    { key: 'isFeatured', label: 'Featured', type: 'checkbox' }
  ],
  // Alternative naming conventions for backward compatibility
  researchstudies: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'content', label: 'Content', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'select', options: ['active', 'recruiting', 'completed', 'planning'], required: true },
    { key: 'startDate', label: 'Start Date', type: 'date', required: true },
    { key: 'endDate', label: 'End Date', type: 'date' },
    { key: 'participants', label: 'Participants', type: 'number' },
    { key: 'centers', label: 'Centers', type: 'number' },
    { key: 'imageUrl', label: 'Image URL', type: 'url' },
    { key: 'slug', label: 'Slug', type: 'text', required: true },
    { key: 'tags', label: 'Tags (comma-separated)', type: 'text' },
    { key: 'readingTime', label: 'Reading Time (minutes)', type: 'number' },
    { key: 'isActive', label: 'Active', type: 'checkbox' }
  ],
  historyevents: [
    { key: 'year', label: 'Year', type: 'number', required: true },
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'icon', label: 'Icon', type: 'text', required: true },
    { key: 'color', label: 'Color', type: 'select', options: ['ucsf-blue', 'medical-green', 'accent-orange'], required: true },
    { key: 'stats', label: 'Stats (comma-separated)', type: 'text' },
    { key: 'order', label: 'Order', type: 'number' },
    { key: 'isActive', label: 'Active', type: 'checkbox' }
  ],
  collegehistoryevents: [
    { key: 'year', label: 'Year', type: 'number', required: true },
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'eventType', label: 'Event Type', type: 'select', options: ['foundation', 'milestone', 'achievement', 'expansion', 'recognition'], required: true },
    { key: 'details', label: 'Details (JSON)', type: 'textarea' },
    { key: 'imageUrl', label: 'Image URL', type: 'url' },
    { key: 'order', label: 'Order', type: 'number' },
    { key: 'isActive', label: 'Active', type: 'checkbox' }
  ],
  academicprogramshistory: [
    { key: 'facultyName', label: 'Faculty Name', type: 'text', required: true },
    { key: 'departmentName', label: 'Department Name', type: 'text' },
    { key: 'programName', label: 'Program Name', type: 'text', required: true },
    { key: 'degreeType', label: 'Degree Type', type: 'text' },
    { key: 'establishedYear', label: 'Established Year', type: 'number' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'isActive', label: 'Active', type: 'checkbox' }
  ],
  facilityhistory: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'type', label: 'Type', type: 'select', options: ['laboratory', 'museum', 'research_center', 'library', 'clinic'], required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'establishedYear', label: 'Established Year', type: 'number' },
    { key: 'equipment', label: 'Equipment (comma-separated)', type: 'text' },
    { key: 'isActive', label: 'Active', type: 'checkbox' }
  ],
  legacyachievements: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'category', label: 'Category', type: 'select', options: ['recognition', 'graduation', 'international', 'research', 'community'], required: true },
    { key: 'year', label: 'Year', type: 'number' },
    { key: 'details', label: 'Details (JSON)', type: 'textarea' },
    { key: 'isFeatured', label: 'Featured', type: 'checkbox' }
  ],
  historicaldocuments: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'documentType', label: 'Document Type', type: 'select', options: ['image', 'document', 'certificate', 'newspaper', 'photo'], required: true },
    { key: 'fileUrl', label: 'File URL', type: 'url' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'year', label: 'Year', type: 'number' },
    { key: 'source', label: 'Source', type: 'text' },
    { key: 'isFeatured', label: 'Featured', type: 'checkbox' }
  ],
  founderinfo: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'birthDate', label: 'Birth Date', type: 'date' },
    { key: 'deathDate', label: 'Death Date', type: 'date' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'biography', label: 'Biography (JSON)', type: 'textarea' }
  ],
  contactmessages: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'subject', label: 'Subject', type: 'text', required: true },
    { key: 'message', label: 'Message', type: 'textarea', required: true },
    { key: 'status', label: 'Status', type: 'select', options: ['unread', 'read', 'replied'], required: true }
  ],
  // User management forms
  users: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'firstName', label: 'First Name', type: 'text' },
    { key: 'lastName', label: 'Last Name', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'program', label: 'Program', type: 'text' },
    { key: 'qualifications', label: 'Qualifications', type: 'text' },
    { key: 'studentId', label: 'Student ID', type: 'text' },
    { key: 'enrollmentStatus', label: 'Enrollment Status', type: 'select', options: ['active', 'inactive', 'graduated', 'suspended'] }
  ],
  admin_users: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'firstName', label: 'First Name', type: 'text' },
    { key: 'lastName', label: 'Last Name', type: 'text' },
    { key: 'isActive', label: 'Active', type: 'checkbox' }
  ],
  student_grades: [
    { key: 'userId', label: 'Student', type: 'select-api', optionsFromApi: 'users', required: true },
    { key: 'courseName', label: 'Course Name', type: 'text', required: true },
    { key: 'courseCode', label: 'Course Code', type: 'text', required: true },
    { key: 'semester', label: 'Semester', type: 'text', required: true },
    { key: 'academicYear', label: 'Academic Year', type: 'text', required: true },
    { key: 'grade', label: 'Grade', type: 'select', options: ['A', 'B', 'C', 'D', 'F', 'P', 'NP'], required: true },
    { key: 'score', label: 'Score', type: 'number' },
    { key: 'maxScore', label: 'Max Score', type: 'number' },
    { key: 'comments', label: 'Comments', type: 'textarea' }
  ],
  student_certificates: [
    { key: 'userId', label: 'Student', type: 'select-api', optionsFromApi: 'users', required: true },
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'certificateType', label: 'Type', type: 'select', options: ['degree', 'diploma', 'certificate', 'transcript', 'completion'], required: true },
    { key: 'fileUrl', label: 'File URL', type: 'url', required: true },
    { key: 'issueDate', label: 'Issue Date', type: 'date', required: true },
    { key: 'expiryDate', label: 'Expiry Date', type: 'date' },
    { key: 'isActive', label: 'Active', type: 'checkbox' }
  ],
  student_schedules: [
    { key: 'userId', label: 'Student', type: 'select-api', optionsFromApi: 'users', required: true },
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'courseCode', label: 'Course Code', type: 'text' },
    { key: 'courseName', label: 'Course Name', type: 'text' },
    { key: 'instructor', label: 'Instructor', type: 'text' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'startTime', label: 'Start Time', type: 'text', required: true },
    { key: 'endTime', label: 'End Time', type: 'text', required: true },
    { key: 'dayOfWeek', label: 'Day of Week', type: 'select', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], required: true },
    { key: 'scheduleType', label: 'Type', type: 'select', options: ['class', 'exam', 'meeting', 'event'], required: true },
    { key: 'semester', label: 'Semester', type: 'text', required: true },
    { key: 'academicYear', label: 'Academic Year', type: 'text', required: true },
    { key: 'isActive', label: 'Active', type: 'checkbox' }
  ],
  courses: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'code', label: 'Code', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'credits', label: 'Credits', type: 'number' },
    { key: 'duration', label: 'Duration', type: 'text', required: true },
    { key: 'level', label: 'Level', type: 'select', options: ['beginner', 'intermediate', 'advanced'], required: true },
    { key: 'category', label: 'Category', type: 'select', options: ['core', 'elective', 'practical'], required: true },
    { key: 'instructor', label: 'Instructor', type: 'text' },
    { key: 'prerequisites', label: 'Prerequisites (comma-separated)', type: 'text' },
    { key: 'semester', label: 'Semester', type: 'text', required: true },
    { key: 'academicYear', label: 'Academic Year', type: 'text', required: true },
    { key: 'maxStudents', label: 'Max Students', type: 'number' },
    { key: 'isActive', label: 'Active', type: 'checkbox' }
  ],
  course_enrollments: [
    { key: 'userId', label: 'Student', type: 'select-api', optionsFromApi: 'users', required: true },
    { key: 'courseId', label: 'Course', type: 'select-api', optionsFromApi: 'courses', required: true },
    { key: 'status', label: 'Status', type: 'select', options: ['active', 'completed', 'dropped', 'failed'], required: true },
    { key: 'finalGrade', label: 'Final Grade', type: 'text' },
    { key: 'completedAt', label: 'Completed At', type: 'date' }
  ]
}

export default function ModelForm({ modelName, recordId, initialData }: ModelFormProps) {
  const [formData, setFormData] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [apiOptions, setApiOptions] = useState<Record<string, { id: string; label: string }[]>>({})
  const router = useRouter()

  const fields = formFields[modelName] || []

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  useEffect(() => {
    const apiFields = fields.filter((f: any) => f.type === 'select-api' && f.optionsFromApi)
    if (apiFields.length === 0) return

    const fetchOptions = async () => {
      const options: Record<string, { id: string; label: string }[]> = {}
      for (const field of apiFields) {
        try {
          const res = await fetch(`/api/admin/options?type=${field.optionsFromApi}`)
          if (res.ok) {
            options[field.key] = await res.json()
          }
        } catch {
          options[field.key] = []
        }
      }
      setApiOptions(prev => ({ ...prev, ...options }))
    }
    fetchOptions()
  }, [modelName])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    try {
      const url = recordId 
        ? `/api/admin/${modelName}/${recordId}`
        : `/api/admin/${modelName}`
      
      const method = recordId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push(`/admin/${modelName}`)
      } else {
        const error = await response.json()
        setErrorMessage(error.error || `Failed to ${recordId ? 'update' : 'create'} record`)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setErrorMessage(`Failed to ${recordId ? 'update' : 'create'} record`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value
    }))
  }

  if (fields.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Form Not Configured</h2>
        <p className="text-gray-600">The form for {modelName} needs to be configured.</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">
        {recordId ? 'Edit' : 'Create'} {modelName.charAt(0).toUpperCase() + modelName.slice(1).replace(/_/g, ' ').replace(/s$/, '')}
      </h2>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field) => (
          <div key={field.key} className="admin-form-group">
            <label htmlFor={field.key} className="admin-form-group label">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {field.type === 'textarea' ? (
              <textarea
                id={field.key}
                value={formData[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                required={field.required}
                className="admin-form-group textarea"
              />
            ) : field.type === 'select' ? (
              <select
                id={field.key}
                value={formData[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                required={field.required}
                className="admin-form-group select"
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((option: any) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <input
                id={field.key}
                type="checkbox"
                checked={formData[field.key] || false}
                onChange={(e) => handleChange(field.key, e.target.checked)}
                className="mr-2"
              />
            ) : field.type === 'file-upload' ? (
              <FileUploadField
                value={formData[field.key] || ''}
                onChange={(url) => handleChange(field.key, url)}
                label={field.label}
              />
            ) : field.type === 'select-api' ? (
              <select
                id={field.key}
                value={formData[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                required={field.required}
                className="admin-form-group select"
              >
                <option value="">Select {field.label}</option>
                {(apiOptions[field.key] || []).map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={field.key}
                type={field.type}
                value={formData[field.key] || ''}
                onChange={(e) => handleChange(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                required={field.required}
                className="admin-form-group input"
              />
            )}
          </div>
        ))}

        <div className="admin-form-actions">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : (recordId ? 'Update' : 'Create')}
          </Button>
        </div>
      </form>
    </Card>
  )
}
