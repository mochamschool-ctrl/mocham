import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Verify prisma client is properly initialized
if (!prisma || !prisma.gallery) {
  console.error('[Gallery API] Prisma client not properly initialized. Gallery model not found.')
  console.error('[Gallery API] Available models:', Object.keys(prisma || {}))
}

export async function GET(request: Request) {
  try {
    console.log('[Gallery API] Request received:', request.url)
    
    let searchParams: URLSearchParams
    try {
      const url = new URL(request.url)
      searchParams = url.searchParams
      console.log('[Gallery API] URL parsed successfully')
    } catch (urlError: any) {
      console.error('[Gallery API] Error parsing request URL:', urlError)
      return NextResponse.json(
        { error: 'Invalid request URL', details: urlError?.message },
        { status: 400 }
      )
    }
    
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')

    console.log('[Gallery API] Query params:', { category, featured, limit })

    const where: any = {}
    
    if (category && category !== 'all') {
      where.category = category
    }
    
    if (featured === 'true') {
      where.isFeatured = true
    }

    console.log('[Gallery API] Where clause:', JSON.stringify(where))
    console.log('[Gallery API] Attempting to fetch gallery from database...')
    
    // Verify prisma.gallery exists
    if (!prisma.gallery) {
      console.error('[Gallery API] prisma.gallery is undefined!')
      console.error('[Gallery API] Available prisma models:', Object.keys(prisma).filter(key => !key.startsWith('$') && !key.startsWith('_')))
      return NextResponse.json(
        { 
          error: 'Prisma client not properly initialized. Gallery model not found.',
          hint: 'Please run: npx prisma generate and restart your dev server'
        },
        { status: 500 }
      )
    }

    // Build orderBy clause - Prisma supports array of orderBy objects
    const gallery = await prisma.gallery.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
      take: limit ? parseInt(limit) : undefined
    })

    console.log('[Gallery API] Successfully fetched', gallery.length, 'gallery items')
    return NextResponse.json(gallery, { status: 200 })
  } catch (error: any) {
    console.error('[Gallery API] Error fetching gallery:', error)
    console.error('[Gallery API] Error details:', {
      code: error?.code,
      message: error?.message,
      name: error?.name,
      meta: error?.meta,
      clientVersion: error?.clientVersion,
      stack: error?.stack?.substring(0, 500) // Limit stack trace
    })
    
    // Handle case where Gallery table doesn't exist yet
    if (error?.code === 'P2021' || error?.message?.includes('does not exist')) {
      return NextResponse.json(
        { error: 'Gallery table not found. Please run database migration first.' },
        { status: 503 }
      )
    }
    
    // Handle Prisma connection errors
    if (error?.code === 'P1001' || error?.message?.includes('Can\'t reach database')) {
      return NextResponse.json(
        { error: 'Database connection failed. Please check your database configuration.' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch gallery', 
        details: error?.message || 'Unknown error',
        code: error?.code || 'UNKNOWN'
      },
      { status: 500 }
    )
  }
}

