import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

const MAX_SIZE = 4 * 1024 * 1024 // 4.5MB - Vercel serverless limit
const ALLOWED_TYPE = 'application/pdf'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (file.type !== ALLOWED_TYPE) {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size must be under 4.5MB. For larger files, use a direct URL.' },
        { status: 400 }
      )
    }

    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const pathname = `research/${Date.now()}-${filename}`

    const blob = await put(pathname, file, {
      access: 'public',
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('PDF upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload PDF' },
      { status: 500 }
    )
  }
}
