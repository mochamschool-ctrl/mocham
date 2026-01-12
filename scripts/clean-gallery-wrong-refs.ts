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

async function cleanGalleryWrongRefs() {
  console.log('🧹 Cleaning gallery - removing wrong references...\n')

  // Allowed image names: a-z and aa, bb, cc, dd, ee
  const allowedImages = new Set<string>()
  
  // Add a-z
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(97 + i) // 'a' to 'z'
    allowedImages.add(`${letter}.jpg`)
  }
  
  // Add double letters
  const doubleLetters = ['aa', 'bb', 'cc', 'dd', 'ee']
  for (const dl of doubleLetters) {
    allowedImages.add(`${dl}.jpg`)
  }

  console.log(`✅ Allowed images: ${allowedImages.size} total`)
  console.log(`   - a-z: 26 images`)
  console.log(`   - Double letters: ${doubleLetters.length} images (${doubleLetters.join(', ')})\n`)

  try {
    // Get all gallery entries
    const allEntries = await prisma.gallery.findMany()
    
    console.log(`📊 Total gallery entries: ${allEntries.length}\n`)

    let deletedCount = 0
    const entriesToDelete: any[] = []

    for (const entry of allEntries) {
      // Extract filename from imageUrl
      const filename = entry.imageUrl.split('/').pop() || entry.imageUrl
      const imageName = filename.toLowerCase()
      
      // Check if this is an a-z or double letter image
      const isAzImage = imageName.length === 5 && imageName.endsWith('.jpg') && 
                       imageName[0] >= 'a' && imageName[0] <= 'z' && 
                       imageName[1] === '.'
      const isDoubleLetter = imageName.length === 6 && imageName.endsWith('.jpg') &&
                            doubleLetters.includes(imageName.substring(0, 2))
      
      if (isAzImage || isDoubleLetter) {
        // This is a valid a-z or double letter image
        // Check if it's in the allowed list
        if (!allowedImages.has(imageName)) {
          console.log(`   🗑️  Marking for deletion: ${entry.imageUrl} (not in allowed list)`)
          entriesToDelete.push(entry)
        }
      } else {
        // This might be a different type of image, check if it matches a-z or double letter pattern incorrectly
        const nameWithoutExt = imageName.replace('.jpg', '')
        
        // Check if it's a wrong double letter combination (like ab, ac, etc. but not aa, bb, cc, dd, ee)
        if (nameWithoutExt.length === 2 && 
            nameWithoutExt[0] >= 'a' && nameWithoutExt[0] <= 'e' &&
            nameWithoutExt[1] >= 'a' && nameWithoutExt[1] <= 'e' &&
            !doubleLetters.includes(nameWithoutExt)) {
          console.log(`   🗑️  Marking for deletion: ${entry.imageUrl} (wrong double letter: ${nameWithoutExt})`)
          entriesToDelete.push(entry)
        }
      }
    }

    // Delete wrong entries
    for (const entry of entriesToDelete) {
      await prisma.gallery.delete({
        where: { id: entry.id }
      })
      deletedCount++
    }

    console.log(`\n✅ Cleanup completed!`)
    console.log(`   - Deleted: ${deletedCount} entries with wrong references`)
    console.log(`   - Remaining entries: ${allEntries.length - deletedCount}`)

    // Now verify what's left
    const remainingEntries = await prisma.gallery.findMany({
      where: {
        imageUrl: {
          startsWith: '/new/'
        }
      }
    })

    const azEntries = remainingEntries.filter(e => {
      const name = e.imageUrl.split('/').pop()?.toLowerCase() || ''
      return name.length === 5 && name[0] >= 'a' && name[0] <= 'z' && name.endsWith('.jpg')
    })

    const doubleLetterEntries = remainingEntries.filter(e => {
      const name = e.imageUrl.split('/').pop()?.toLowerCase() || ''
      return name.length === 6 && doubleLetters.includes(name.substring(0, 2)) && name.endsWith('.jpg')
    })

    console.log(`\n📊 Final status:`)
    console.log(`   - a-z entries: ${azEntries.length}`)
    console.log(`   - Double letter entries (aa, bb, cc, dd, ee): ${doubleLetterEntries.length}`)
    console.log(`   - Total a-z and double letter entries: ${azEntries.length + doubleLetterEntries.length}`)

  } catch (error: any) {
    console.error('❌ Error:', error)
    throw error
  }
}

if (require.main === module) {
  cleanGalleryWrongRefs()
    .catch((e) => {
      console.error('❌ Error:', e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export default cleanGalleryWrongRefs




