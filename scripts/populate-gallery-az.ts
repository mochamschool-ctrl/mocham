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

  // Generate a-z image names
  const azImages: string[] = []
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(97 + i) // 'a' to 'z'
    azImages.push(`${letter}.jpg`)
  }

  // Generate aa-ee image names
  const aaeeImages: string[] = []
  const firstLetters = ['a', 'b', 'c', 'd', 'e']
  const secondLetters = ['a', 'b', 'c', 'd', 'e']
  
  for (const first of firstLetters) {
    for (const second of secondLetters) {
      aaeeImages.push(`${first}${second}.jpg`)
    }
  }

  // Combine all image names
  const allImages = [...azImages, ...aaeeImages]
  
  console.log(`📸 Found ${allImages.length} images to add:`)
  console.log(`   - a-z: ${azImages.length} images`)
  console.log(`   - aa-ee: ${aaeeImages.length} images\n`)

  // Categories for organizing images
  const categories = ['Campus', 'Events', 'Students', 'Faculty', 'General']
  
  let createdCount = 0
  let updatedCount = 0
  let skippedCount = 0

  for (let i = 0; i < allImages.length; i++) {
    const imageName = allImages[i]
    const imageUrl = `/${imageName}`
    
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

