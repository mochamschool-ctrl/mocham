import { config } from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables FIRST, before importing Prisma
// Try multiple paths to find .env file
const envPath = path.join(process.cwd(), '.env')
const result = config({ path: envPath })

if (result.error) {
  console.warn('Warning: Could not load .env file:', result.error.message)
}

// Also try loading from process.env (in case it's already set)
if (!process.env.DATABASE_URL) {
  // Try alternative loading - read file directly and parse
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8')
    // Match DATABASE_URL=value (with or without quotes, handling multiline)
    const lines = envContent.split(/\r?\n/)
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('DATABASE_URL=')) {
        const equalIndex = trimmed.indexOf('=')
        if (equalIndex > 0) {
          const value = trimmed.substring(equalIndex + 1).trim()
          // Remove surrounding quotes if present
          process.env.DATABASE_URL = value.replace(/^["']|["']$/g, '')
          console.log('✅ Loaded DATABASE_URL from .env file')
          break
        }
      }
    }
  }
}

// Verify DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL environment variable is not set!')
  console.error('Please add DATABASE_URL to your .env file.')
  console.error('Example: DATABASE_URL="postgresql://user:password@localhost:5432/mocham?schema=public"')
  console.error('Current working directory:', process.cwd())
  console.error('Looking for .env at:', envPath)
  console.error('.env file exists:', fs.existsSync(envPath))
  process.exit(1)
}

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function populateGallery() {
  console.log('Populating gallery from public/new folder...')

  // Get all PNG files from public/new directory
  const galleryDir = path.join(process.cwd(), 'public', 'new')
  
  if (!fs.existsSync(galleryDir)) {
    console.error('Gallery directory not found:', galleryDir)
    return
  }

  const files = fs.readdirSync(galleryDir).filter(file => 
    file.toLowerCase().endsWith('.png')
  )

  console.log(`Found ${files.length} PNG files`)

  // Categories for organizing images
  const categories = ['Campus', 'Events', 'Students', 'Faculty', 'General']
  
  // Featured images (first 6-8 images)
  const featuredCount = Math.min(8, files.length)

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const imageUrl = `/new/${file}`
    
    // Extract number from filename for ordering
    const match = file.match(/(\d+)\.png/)
    const fileNumber = match ? parseInt(match[1]) : i + 1
    
    // Determine category based on file number (simple distribution)
    const categoryIndex = Math.floor((fileNumber - 1) / Math.ceil(files.length / categories.length)) % categories.length
    const category = categories[categoryIndex]
    
    // Mark first few as featured
    const isFeatured = i < featuredCount
    
    // Create title from filename
    const title = `Gallery Image ${fileNumber}`
    const description = `${category} - Image ${fileNumber} from MOCHAM collection`

    // Check if image already exists
    const existing = await prisma.gallery.findFirst({
      where: { imageUrl }
    })

    if (existing) {
      // Update existing record
      await prisma.gallery.update({
        where: { id: existing.id },
        data: {
          title,
          description,
          category,
          isFeatured,
          order: fileNumber
        }
      })
      console.log(`Updated: ${file}`)
    } else {
      // Create new record
      await prisma.gallery.create({
        data: {
          title,
          description,
          imageUrl,
          category,
          isFeatured,
          order: fileNumber
        }
      })
      console.log(`Created: ${file}`)
    }
  }

  console.log(`Gallery population completed! Processed ${files.length} images.`)
}

if (require.main === module) {
  populateGallery()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export default populateGallery

