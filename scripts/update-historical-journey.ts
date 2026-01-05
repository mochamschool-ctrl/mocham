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

async function updateHistoricalJourney() {
  console.log('🔄 Updating Historical Journey section...\n')

  // Step 1: Delete all existing historical documents
  console.log('🗑️  Deleting all existing historical documents...')
  const deleteResult = await prisma.historicalDocument.deleteMany({})
  console.log(`   ✅ Deleted ${deleteResult.count} existing documents\n`)

  // Step 2: Create new historical documents with specified images
  const imageNumbers = [36, 37, 38, 39, 40, 41, 1, 20, 24, 30]
  
  // Titles and descriptions for each image
  const imageData = [
    { number: 36, title: 'Historical Moment - 1982', description: 'Early days of MOCHAM establishment' },
    { number: 37, title: 'Campus Development', description: 'Infrastructure development in the 1980s' },
    { number: 38, title: 'Academic Excellence', description: 'Students and faculty in early years' },
    { number: 39, title: 'Medical Training', description: 'Hands-on clinical training sessions' },
    { number: 40, title: 'Graduation Ceremony', description: 'Celebrating academic achievements' },
    { number: 41, title: 'Campus Facilities', description: 'State-of-the-art educational infrastructure' },
    { number: 1, title: 'Founding Years', description: 'The beginning of our journey in homeopathic medicine' },
    { number: 20, title: 'Student Life', description: 'Vibrant campus activities and student engagement' },
    { number: 24, title: 'Research Excellence', description: 'Pioneering research in alternative medicine' },
    { number: 30, title: 'International Recognition', description: 'Global achievements and partnerships' }
  ]

  console.log('📸 Creating new historical documents...')
  let createdCount = 0

  for (const imageInfo of imageData) {
    const imageUrl = `/new/${imageInfo.number}.png`
    
    // Estimate year based on image number (spreading from 1982 to 2024)
    const year = 1982 + Math.floor((imageInfo.number - 1) / 50 * 42)
    
    await prisma.historicalDocument.create({
      data: {
        title: imageInfo.title,
        description: imageInfo.description,
        fileUrl: imageUrl,
        documentType: 'photo',
        year: year,
        isFeatured: true, // All images are featured for the carousel
        source: 'MOCHAM Archives'
      }
    })
    
    createdCount++
    console.log(`   ✅ Created: ${imageInfo.title} (${imageUrl})`)
  }

  console.log(`\n✅ Historical Journey update completed!`)
  console.log(`   - Deleted: ${deleteResult.count} old documents`)
  console.log(`   - Created: ${createdCount} new documents`)
  console.log(`   - All images are marked as featured for the carousel`)
}

if (require.main === module) {
  updateHistoricalJourney()
    .catch((e) => {
      console.error('❌ Error:', e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export default updateHistoricalJourney

