'use client'

import { useState } from 'react'
import { FileText } from 'lucide-react'

interface FileUploadFieldProps {
  value: string | null | undefined
  onChange: (url: string) => void
  label?: string
  accept?: string
}

export default function FileUploadField({
  value,
  onChange,
  label = 'PDF File',
  accept = 'application/pdf',
}: FileUploadFieldProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload-pdf', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      onChange(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload PDF')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="admin-form-group">
      <label className="block font-medium text-gray-700 mb-2">{label}</label>
      {value ? (
        <div className="space-y-2">
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
          >
            <FileText className="h-4 w-4" />
            View current PDF
          </a>
          <div className="flex gap-2 items-center">
            <input
              type="file"
              accept={accept}
              onChange={handleFileChange}
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      )}
      {uploading && (
        <p className="mt-1 text-sm text-gray-500">Uploading...</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
