'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

interface DataTableProps {
  data: any[]
  columns: Column[]
  modelName: string
  modelPath?: string
  singularName?: string
  onDelete?: (id: string) => void
  searchable?: boolean
  searchFields?: string[]
  pageSize?: number
  error?: string | null
  getExtraActions?: (row: any) => React.ReactNode
}

const DEFAULT_SINGULAR: Record<string, string> = {
  programs: 'Program',
  services: 'Service',
  doctors: 'Doctor',
  news: 'News',
  testimonials: 'Testimonial',
  applications: 'Application',
  appointments: 'Appointment',
  contact_messages: 'Contact Message',
  publications: 'Publication',
  research_studies: 'Research Study',
  collaborations: 'Collaboration',
  achievements: 'Achievement',
  history_events: 'History Event',
  college_history_events: 'College History Event',
  academic_programs_history: 'Academic Program History',
  facility_history: 'Facility History',
  legacy_achievements: 'Legacy Achievement',
  historical_documents: 'Historical Document',
  founder_info: 'Founder Info',
  gallery: 'Gallery Image',
  users: 'Student',
  admin_users: 'Admin User',
  student_grades: 'Student Grade',
  student_certificates: 'Student Certificate',
  student_schedules: 'Student Schedule',
  courses: 'Course',
  course_enrollments: 'Course Enrollment',
}

export default function DataTable({ 
  data, 
  columns, 
  modelName, 
  modelPath,
  singularName,
  onDelete, 
  searchable = true,
  searchFields = ['title', 'name', 'email'],
  pageSize: initialPageSize = 25,
  error: externalError,
  getExtraActions
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [internalError, setInternalError] = useState<string | null>(null)
  const errorMessage = externalError ?? internalError

  const path = modelPath || modelName.toLowerCase().replace(/\s+/g, '_')
  const singular = singularName || DEFAULT_SINGULAR[path] || modelName.replace(/s$/, '').replace(/_/g, ' ')

  const filteredData = data.filter(item => {
    if (!searchTerm) return true
    return searchFields.some(field => {
      // Handle nested fields like 'user.name' or 'user.email'
      const fieldParts = field.split('.')
      let value = item
      for (const part of fieldParts) {
        value = value?.[part]
        if (value === null || value === undefined) break
      }
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    })
  })

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0
    
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const totalPages = Math.ceil(sortedData.length / pageSize)
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold capitalize">{modelName}</h2>
        <Link href={`/admin/${path}/new`}>
          <Button>Add New {singular}</Button>
        </Link>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {errorMessage}
        </div>
      )}

      {searchable && (
        <div className="mb-4">
          <input
            type="text"
            placeholder={`Search ${modelName.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {sortField === column.key && (
                      <span className="text-xs">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={row.id || index} className="border-b hover:bg-gray-50">
                {columns.map((column) => {
                  // Handle nested fields like 'user.name'
                  const fieldParts = column.key.split('.')
                  let value = row
                  for (const part of fieldParts) {
                    value = value?.[part]
                    if (value === null || value === undefined) break
                  }
                  
                  return (
                    <td key={column.key} className="py-3 px-4">
                      {column.render 
                        ? column.render(value, row)
                        : value !== null && value !== undefined ? String(value) : 'N/A'
                      }
                    </td>
                  )
                })}
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/${path}/${row.id}`}>
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                    <Link href={`/admin/${path}/${row.id}/edit`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    {getExtraActions?.(row)}
                    {onDelete && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onDelete(row.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No {path.replace(/_/g, ' ')} found
        </div>
      )}

      {sortedData.length > 0 && totalPages > 1 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
