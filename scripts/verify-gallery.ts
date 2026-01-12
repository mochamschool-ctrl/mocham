import { config } from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables
const envPath = path.join(process.cwd(), '.env')
const result = config({ path: envPath })

if (result.error) {
  console.warn('Warning: Could not load .env file:', result.error.message)
}

if (!process.env.DATABASE_URL) {
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8')
    const lines = envContent.split(/\r?\n/)
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()
      
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('DATABASE_URL=')) {
        const equalIndex = trimmed.indexOf('=')
        if (equalIndex > 0) {
          const value = trimmed.substring(equalIndex + 1).trim()
          process.env.DATABASE_URL = value.replace(/^["']|["']$/g, '')
          break
        }
      }
    }
  }
}

if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL environment variable is not set!')
  process.exit(1)
}

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyGallery() {
  console.log('🔍 Verifying gallery entries...\n')

  try {
    // Get all a-z and aa-ee gallery entries
    const allEntries = await prisma.gallery.findMany({
      where: {
        OR: [
          { imageUrl: { startsWith: '/new/a.jpg' } },
          { imageUrl: { startsWith: '/new/b.jpg' } },
          { imageUrl: { startsWith: '/new/c.jpg' } },
          { imageUrl: { startsWith: '/new/d.jpg' } },
          { imageUrl: { startsWith: '/new/e.jpg' } },
          { imageUrl: { startsWith: '/new/f.jpg' } },
          { imageUrl: { startsWith: '/new/g.jpg' } },
          { imageUrl: { startsWith: '/new/h.jpg' } },
          { imageUrl: { startsWith: '/new/i.jpg' } },
          { imageUrl: { startsWith: '/new/j.jpg' } },
          { imageUrl: { startsWith: '/new/k.jpg' } },
          { imageUrl: { startsWith: '/new/l.jpg' } },
          { imageUrl: { startsWith: '/new/m.jpg' } },
          { imageUrl: { startsWith: '/new/n.jpg' } },
          { imageUrl: { startsWith: '/new/o.jpg' } },
          { imageUrl: { startsWith: '/new/p.jpg' } },
          { imageUrl: { startsWith: '/new/q.jpg' } },
          { imageUrl: { startsWith: '/new/r.jpg' } },
          { imageUrl: { startsWith: '/new/s.jpg' } },
          { imageUrl: { startsWith: '/new/t.jpg' } },
          { imageUrl: { startsWith: '/new/u.jpg' } },
          { imageUrl: { startsWith: '/new/v.jpg' } },
          { imageUrl: { startsWith: '/new/w.jpg' } },
          { imageUrl: { startsWith: '/new/x.jpg' } },
          { imageUrl: { startsWith: '/new/y.jpg' } },
          { imageUrl: { startsWith: '/new/z.jpg' } },
        ]
      },
      orderBy: { imageUrl: 'asc' }
    })

    // Also get aa-ee entries
    const aaeeEntries = await prisma.gallery.findMany({
      where: {
        OR: [
          { imageUrl: { startsWith: '/new/aa.jpg' } },
          { imageUrl: { startsWith: '/new/ab.jpg' } },
          { imageUrl: { startsWith: '/new/ac.jpg' } },
          { imageUrl: { startsWith: '/new/ad.jpg' } },
          { imageUrl: { startsWith: '/new/ae.jpg' } },
          { imageUrl: { startsWith: '/new/ba.jpg' } },
          { imageUrl: { startsWith: '/new/bb.jpg' } },
          { imageUrl: { startsWith: '/new/bc.jpg' } },
          { imageUrl: { startsWith: '/new/bd.jpg' } },
          { imageUrl: { startsWith: '/new/be.jpg' } },
          { imageUrl: { startsWith: '/new/ca.jpg' } },
          { imageUrl: { startsWith: '/new/cb.jpg' } },
          { imageUrl: { startsWith: '/new/cc.jpg' } },
          { imageUrl: { startsWith: '/new/cd.jpg' } },
          { imageUrl: { startsWith: '/new/ce.jpg' } },
          { imageUrl: { startsWith: '/new/da.jpg' } },
          { imageUrl: { startsWith: '/new/db.jpg' } },
          { imageUrl: { startsWith: '/new/dc.jpg' } },
          { imageUrl: { startsWith: '/new/dd.jpg' } },
          { imageUrl: { startsWith: '/new/de.jpg' } },
          { imageUrl: { startsWith: '/new/ea.jpg' } },
          { imageUrl: { startsWith: '/new/eb.jpg' } },
          { imageUrl: { startsWith: '/new/ec.jpg' } },
          { imageUrl: { startsWith: '/new/ed.jpg' } },
          { imageUrl: { startsWith: '/new/ee.jpg' } },
        ]
      },
      orderBy: { imageUrl: 'asc' }
    })

    const allAzAeeEntries = [...allEntries, ...aaeeEntries]
    const uniqueEntries = Array.from(new Map(allAzAeeEntries.map(e => [e.imageUrl, e])).values())

    console.log(`📊 Found ${uniqueEntries.length} a-z and aa-ee entries\n`)

    let issuesFound = 0
    let fixedCount = 0

    for (const entry of uniqueEntries) {
      const issues: string[] = []
      
      // Check path
      if (!entry.imageUrl.startsWith('/new/')) {
        issues.push(`Wrong path: ${entry.imageUrl}`)
      }
      
      // Check description
      if (entry.description !== 'mocham school') {
        issues.push(`Wrong description: "${entry.description}"`)
      }

      if (issues.length > 0) {
        issuesFound++
        console.log(`⚠️  ${entry.imageUrl}:`)
        issues.forEach(issue => console.log(`   - ${issue}`))
        
        // Fix the issues
        const updates: any = {}
        if (!entry.imageUrl.startsWith('/new/')) {
          const imageName = entry.imageUrl.split('/').pop()
          updates.imageUrl = `/new/${imageName}`
        }
        if (entry.description !== 'mocham school') {
          updates.description = 'mocham school'
        }
        
        if (Object.keys(updates).length > 0) {
          await prisma.gallery.update({
            where: { id: entry.id },
            data: updates
          })
          fixedCount++
          console.log(`   ✅ Fixed`)
        }
        console.log('')
      }
    }

    if (issuesFound === 0) {
      console.log('✅ All entries are correct!')
      console.log(`   - All paths start with /new/`)
      console.log(`   - All descriptions are "mocham school"`)
    } else {
      console.log(`\n✅ Fixed ${fixedCount} entries`)
    }

    // Show summary
    console.log(`\n📊 Summary:`)
    console.log(`   - Total a-z and aa-ee entries: ${uniqueEntries.length}`)
    console.log(`   - Entries with correct paths: ${uniqueEntries.filter(e => e.imageUrl.startsWith('/new/')).length}`)
    console.log(`   - Entries with correct description: ${uniqueEntries.filter(e => e.description === 'mocham school').length}`)

  } catch (error: any) {
    console.error('❌ Error:', error)
    throw error
  }
}

if (require.main === module) {
  verifyGallery()
    .catch((e) => {
      console.error('❌ Error:', e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export default verifyGallery




