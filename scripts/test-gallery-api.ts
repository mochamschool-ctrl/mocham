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

async function testGallery() {
  try {
    console.log('Testing gallery database access...')
    const count = await prisma.gallery.count()
    console.log(`✅ Gallery table accessible. Total records: ${count}`)
    
    if (count > 0) {
      const sample = await prisma.gallery.findMany({ take: 3 })
      console.log('\nSample records:')
      sample.forEach((item, idx) => {
        console.log(`  ${idx + 1}. ${item.title} (${item.category}) - ${item.imageUrl}`)
      })
    }
  } catch (error: any) {
    console.error('❌ Error accessing gallery:', error.message)
    console.error('Error code:', error.code)
    console.error('Error details:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testGallery()

