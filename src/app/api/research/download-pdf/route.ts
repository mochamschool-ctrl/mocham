import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Proxies the research PDF so the browser downloads it (Content-Disposition: attachment)
 * instead of opening it in a new tab. Query: ?slug=...&type=publication|study
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const type = searchParams.get('type') || 'publication'

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
    }

    let pdfUrl: string | null = null
    let title = 'research'

    if (type === 'study') {
      const study = await prisma.researchStudy.findUnique({
        where: { slug },
        select: { pdfUrl: true, title: true }
      })
      if (study?.pdfUrl) {
        pdfUrl = study.pdfUrl
        title = study.title
      }
    } else {
      const publication = await prisma.publication.findUnique({
        where: { slug },
        select: { pdfUrl: true, title: true }
      })
      if (publication?.pdfUrl) {
        pdfUrl = publication.pdfUrl
        title = publication.title
      }
    }

    if (!pdfUrl) {
      return NextResponse.json({ error: 'PDF not found for this research' }, { status: 404 })
    }

    const res = await fetch(pdfUrl, { headers: { Accept: 'application/pdf' } })
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch PDF' }, { status: 502 })
    }

    const contentType = res.headers.get('content-type') || 'application/pdf'
    const blob = await res.arrayBuffer()
    const safeName = `${title.replace(/[^a-zA-Z0-9-_]/g, '_')}.pdf`

    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${safeName}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Research PDF download error:', error)
    return NextResponse.json({ error: 'Download failed' }, { status: 500 })
  }
}
