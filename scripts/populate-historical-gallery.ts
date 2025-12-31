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
    const lines = envContent.split(/\r?\n/)
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
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
  console.error('Current working directory:', process.cwd())
  console.error('Looking for .env at:', envPath)
  console.error('.env file exists:', fs.existsSync(envPath))
  process.exit(1)
}

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function populateHistoricalGallery() {
  console.log('Populating historical gallery from public/new folder...')

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

  // Document types for organizing images
  const documentTypes = ['photo', 'image', 'document', 'certificate']
  
  // Categories/themes for the images
  const themes = [
    { title: 'Campus Life', description: 'Vibrant campus activities and facilities' },
    { title: 'Academic Excellence', description: 'Students and faculty in learning environments' },
    { title: 'Medical Training', description: 'Hands-on medical education and clinical practice' },
    { title: 'Graduation Ceremonies', description: 'Celebrating academic achievements' },
    { title: 'Campus Facilities', description: 'State-of-the-art educational infrastructure' },
    { title: 'Student Activities', description: 'Student life and extracurricular activities' },
    { title: 'Medical Practice', description: 'Clinical training and patient care' },
    { title: 'Historical Moments', description: 'Memorable events from our history' }
  ]
  
  // Featured images (first 12 images will be featured)
  const featuredCount = Math.min(12, files.length)

  let createdCount = 0
  let updatedCount = 0

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const imageUrl = `/new/${file}`
    
    // Extract number from filename for ordering
    const match = file.match(/(\d+)\.png/)
    const fileNumber = match ? parseInt(match[1]) : i + 1
    
    // Determine theme based on file number (distribute evenly)
    const themeIndex = Math.floor((fileNumber - 1) / Math.ceil(files.length / themes.length)) % themes.length
    const theme = themes[themeIndex]
    
    // Determine document type
    const typeIndex = Math.floor(fileNumber / 10) % documentTypes.length
    const documentType = documentTypes[typeIndex]
    
    // Mark first few as featured
    const isFeatured = i < featuredCount
    
    // Create title and description
    const title = `${theme.title} - ${fileNumber}`
    const description = `${theme.description} | Historical photograph from MOCHAM archives`

    // Estimate year based on image number (spreading from 1982 to 2024)
    const year = 1982 + Math.floor((fileNumber - 1) / files.length * 42)

    // Check if image already exists
    const existing = await prisma.historicalDocument.findFirst({
      where: { fileUrl: imageUrl }
    })

    if (existing) {
      // Update existing record
      await prisma.historicalDocument.update({
        where: { id: existing.id },
        data: {
          title,
          description,
          documentType,
          year,
          isFeatured
        }
      })
      updatedCount++
      console.log(`Updated: ${file}`)
    } else {
      // Create new record
      await prisma.historicalDocument.create({
        data: {
          title,
          description,
          fileUrl: imageUrl,
          documentType,
          year,
          isFeatured
        }
      })
      createdCount++
      console.log(`Created: ${file}`)
    }
  }

  console.log(`\n✅ Historical gallery population completed!`)
  console.log(`   - Created: ${createdCount} images`)
  console.log(`   - Updated: ${updatedCount} images`)
  console.log(`   - Total processed: ${files.length} images`)
}

if (require.main === module) {
  populateHistoricalGallery()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export default populateHistoricalGallery

