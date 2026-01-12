import { config } from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables FIRST, before importing Prisma
const envPath = path.join(process.cwd(), '.env')
const result = config({ path: envPath })

if (result.error) {
  console.warn('Warning: Could not load .env file:', result.error.message)
}

// Also try loading from process.env (in case it's already set)
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

// Verify DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL environment variable is not set!')
  console.error('Please add DATABASE_URL to your .env file.')
  process.exit(1)
}

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function populateGalleryAZ() {
  console.log('🖼️  Populating gallery with a-z and aa-ee images...\n')

  // Check which images actually exist in public/new folder
  const newDir = path.join(process.cwd(), 'public', 'new')
  
  if (!fs.existsSync(newDir)) {
    console.error('❌ Error: public/new directory not found!')
    process.exit(1)
  }

  // Get all JPG files from the directory
  const allFiles = fs.readdirSync(newDir)
  const jpgFiles = allFiles.filter(file => 
    file.toLowerCase().endsWith('.jpg')
  )

  // Filter for a-z and aa-ee images
  const azImages: string[] = []
  const aaeeImages: string[] = []
  
  for (const file of jpgFiles) {
    const nameWithoutExt = file.replace('.jpg', '').toLowerCase()
    
    // Check if it's a single letter (a-z)
    if (nameWithoutExt.length === 1 && nameWithoutExt >= 'a' && nameWithoutExt <= 'z') {
      azImages.push(file)
    }
    // Check if it's aa-ee pattern (two letters, both a-e)
    else if (nameWithoutExt.length === 2 && 
             nameWithoutExt[0] >= 'a' && nameWithoutExt[0] <= 'e' &&
             nameWithoutExt[1] >= 'a' && nameWithoutExt[1] <= 'e') {
      aaeeImages.push(file)
    }
  }

  // Sort a-z images
  azImages.sort((a, b) => a.localeCompare(b))
  
  // Sort aa-ee images
  aaeeImages.sort((a, b) => {
    const aName = a.replace('.jpg', '').toLowerCase()
    const bName = b.replace('.jpg', '').toLowerCase()
    if (aName[0] !== bName[0]) {
      return aName[0].localeCompare(bName[0])
    }
    return aName[1].localeCompare(bName[1])
  })

  // Combine all image names
  const allImages = [...azImages, ...aaeeImages]
  
  console.log(`📸 Found ${allImages.length} images in public/new:`)
  console.log(`   - a-z: ${azImages.length} images`)
  console.log(`   - aa-ee: ${aaeeImages.length} images\n`)

  // Categories for organizing images
  const categories = ['Campus', 'Events', 'Students', 'Faculty', 'General']
  
  let createdCount = 0
  let updatedCount = 0
  let skippedCount = 0

  for (let i = 0; i < allImages.length; i++) {
    const imageName = allImages[i]
    const imageUrl = `/new/${imageName}`
    
    // Determine category (distribute evenly)
    const categoryIndex = i % categories.length
    const category = categories[categoryIndex]
    
    // Mark first 8 as featured
    const isFeatured = i < 8
    
    // Title from image name
    const title = imageName.replace('.jpg', '').toUpperCase()
    const description = 'mocham school'
    
    try {
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
            order: i
          }
        })
        updatedCount++
        console.log(`   ✅ Updated: ${imageName}`)
      } else {
        // Create new record
        await prisma.gallery.create({
          data: {
            title,
            description,
            imageUrl,
            category,
            isFeatured,
            order: i
          }
        })
        createdCount++
        console.log(`   ✅ Created: ${imageName}`)
      }
    } catch (error: any) {
      console.error(`   ❌ Error processing ${imageName}:`, error.message)
      skippedCount++
    }
  }

  console.log(`\n✅ Gallery population completed!`)
  console.log(`   - Created: ${createdCount} images`)
  console.log(`   - Updated: ${updatedCount} images`)
  console.log(`   - Skipped: ${skippedCount} images`)
  console.log(`   - Total processed: ${allImages.length} images`)
  console.log(`\n📝 All images have description: "mocham school"`)
}

if (require.main === module) {
  populateGalleryAZ()
    .catch((e) => {
      console.error('❌ Error:', e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export default populateGalleryAZ

