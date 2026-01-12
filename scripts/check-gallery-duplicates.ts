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
          console.log('✅ Loaded DATABASE_URL from .env file')
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

async function checkGalleryDuplicates() {
  console.log('🔍 Checking for duplicate gallery entries...\n')

  try {
    // Get all gallery entries
    const allEntries = await prisma.gallery.findMany({
      orderBy: { createdAt: 'asc' }
    })

    console.log(`📊 Total gallery entries: ${allEntries.length}\n`)

    // Group by image name (extract filename from imageUrl)
    const entriesByImageName = new Map<string, any[]>()
    
    for (const entry of allEntries) {
      const imageName = entry.imageUrl.split('/').pop() || entry.imageUrl
      if (!entriesByImageName.has(imageName)) {
        entriesByImageName.set(imageName, [])
      }
      entriesByImageName.get(imageName)!.push(entry)
    }

    // Find duplicates
    const duplicates: { imageName: string; entries: any[] }[] = []
    let totalDuplicates = 0

    for (const [imageName, entries] of entriesByImageName.entries()) {
      if (entries.length > 1) {
        duplicates.push({ imageName, entries })
        totalDuplicates += entries.length - 1
      }
    }

    if (duplicates.length === 0) {
      console.log('✅ No duplicates found!')
      return
    }

    console.log(`⚠️  Found ${duplicates.length} images with duplicates (${totalDuplicates} duplicate entries):\n`)

    let deletedCount = 0

    for (const { imageName, entries } of duplicates) {
      console.log(`📸 ${imageName}: ${entries.length} entries`)
      
      // Prefer entries with correct path (/new/...), otherwise keep the oldest
      entries.sort((a, b) => {
        const aHasCorrectPath = a.imageUrl.startsWith('/new/')
        const bHasCorrectPath = b.imageUrl.startsWith('/new/')
        
        if (aHasCorrectPath && !bHasCorrectPath) return -1
        if (!aHasCorrectPath && bHasCorrectPath) return 1
        
        // If both have same path correctness, keep the oldest
        return a.createdAt.getTime() - b.createdAt.getTime()
      })
      
      // Keep the first one (prefer correct path, then oldest), delete the rest
      const toKeep = entries[0]
      const toDelete = entries.slice(1)
      
      console.log(`   ✅ Keeping: ${toKeep.imageUrl} (created: ${toKeep.createdAt.toISOString()})`)
      
      for (const entry of toDelete) {
        console.log(`   🗑️  Deleting: ${entry.imageUrl} (created: ${entry.createdAt.toISOString()})`)
        await prisma.gallery.delete({
          where: { id: entry.id }
        })
        deletedCount++
      }
      console.log('')
    }

    console.log(`\n✅ Cleanup completed!`)
    console.log(`   - Deleted: ${deletedCount} duplicate entries`)
    console.log(`   - Kept: ${duplicates.length} original entries`)

    // Now check for entries with wrong paths (should be /new/...)
    console.log(`\n🔍 Checking for entries with incorrect paths...\n`)
    
    const allEntriesAfter = await prisma.gallery.findMany()
    let updatedCount = 0

    for (const entry of allEntriesAfter) {
      const imageName = entry.imageUrl.split('/').pop() || entry.imageUrl
      
      // If path doesn't start with /new/, update it
      if (!entry.imageUrl.startsWith('/new/')) {
        const correctPath = `/new/${imageName}`
        console.log(`   🔄 Updating: ${entry.imageUrl} → ${correctPath}`)
        
        await prisma.gallery.update({
          where: { id: entry.id },
          data: { imageUrl: correctPath }
        })
        updatedCount++
      }
    }

    if (updatedCount > 0) {
      console.log(`\n✅ Updated ${updatedCount} entries with correct paths`)
    } else {
      console.log(`\n✅ All paths are correct`)
    }

  } catch (error: any) {
    console.error('❌ Error:', error)
    throw error
  }
}

if (require.main === module) {
  checkGalleryDuplicates()
    .catch((e) => {
      console.error('❌ Error:', e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export default checkGalleryDuplicates

