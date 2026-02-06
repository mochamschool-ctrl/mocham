/**
 * Populates gallery with new images from public/new folder:
 * - IMAGE 4.jpeg: Chief AKANG, K.E(AMB.P) DIRECTOR, STUDENT AFFAIRS
 * - IMAGE.jpeg: Registrar Mrs Lucia Ituen BSC, MSc, PhD (Uniuyo)
 * - IMAGE1.jpeg: Students during their defence work
 * - IMAGE2.jpeg: Students during their defence work
 * - FOUNDER.jpeg: Founder portrait (also used in About/History)
 *
 * Also updates historical documents to use FOUNDER.jpeg instead of placeholder.
 */

import { config } from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

const envPath = path.join(process.cwd(), '.env')
config({ path: envPath })

if (!process.env.DATABASE_URL && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  const lines = envContent.split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('DATABASE_URL=')) {
      const equalIndex = trimmed.indexOf('=')
      if (equalIndex > 0) {
        process.env.DATABASE_URL = trimmed.substring(equalIndex + 1).trim().replace(/^["']|["']$/g, '')
        break
      }
    }
  }
}

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not set. Add it to .env')
  process.exit(1)
}

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const GALLERY_IMAGES = [
  {
    file: 'IMAGE 4.jpeg',
    title: 'Chief AKANG, K.E (AMB.P)',
    description: 'Director, Student Affairs',
    category: 'Faculty',
    isFeatured: true,
    order: 1
  },
  {
    file: 'IMAGE.jpeg',
    title: 'Registrar Mrs Lucia Ituen',
    description: 'BSC, MSc, PhD (Uniuyo)',
    category: 'Faculty',
    isFeatured: true,
    order: 2
  },
  {
    file: 'IMAGE1.jpeg',
    title: 'Students During Defence',
    description: 'Students during their defence work',
    category: 'Students',
    isFeatured: true,
    order: 3
  },
  {
    file: 'IMAGE2.jpeg',
    title: 'Students During Defence',
    description: 'Students during their defence work',
    category: 'Students',
    isFeatured: true,
    order: 4
  },
  {
    file: 'FOUNDER.jpeg',
    title: 'Dr. E. U. Umoren - Founder',
    description: 'Founder and Father of Homeopathy in Nigeria',
    category: 'Faculty',
    isFeatured: true,
    order: 5
  }
]

async function populateGalleryNewImages() {
  console.log('📷 Populating gallery with new images...')

  const galleryDir = path.join(process.cwd(), 'public', 'new')
  if (!fs.existsSync(galleryDir)) {
    console.error('Gallery directory not found:', galleryDir)
    return
  }

  for (const item of GALLERY_IMAGES) {
    const filePath = path.join(galleryDir, item.file)
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Skipping ${item.file} - file not found`)
      continue
    }

    const imageUrl = `/new/${item.file}`

    const existing = await prisma.gallery.findFirst({
      where: { imageUrl }
    })

    const data = {
      title: item.title,
      description: item.description,
      imageUrl,
      category: item.category,
      isFeatured: item.isFeatured,
      order: item.order
    }

    if (existing) {
      await prisma.gallery.update({
        where: { id: existing.id },
        data
      })
      console.log(`  Updated: ${item.file}`)
    } else {
      await prisma.gallery.create({ data })
      console.log(`  Created: ${item.file}`)
    }
  }

  console.log('✅ Gallery population completed!')
}

async function updateHistoricalDocuments() {
  console.log('\n📜 Updating historical documents with FOUNDER.jpeg...')

  const founderUrl = '/new/FOUNDER.jpeg'
  const founderPath = path.join(process.cwd(), 'public', 'new', 'FOUNDER.jpeg')

  if (!fs.existsSync(founderPath)) {
    console.warn('⚠️  FOUNDER.jpeg not found, skipping historical documents update')
    return
  }

  const docs = await prisma.historicalDocument.findMany({
    where: {
      OR: [
        { fileUrl: '/IMG.JPG' },
        { fileUrl: null }
      ]
    }
  })

  for (const doc of docs) {
    await prisma.historicalDocument.update({
      where: { id: doc.id },
      data: { fileUrl: founderUrl }
    })
    console.log(`  Updated: ${doc.title}`)
  }

  console.log(`✅ Updated ${docs.length} historical documents`)
}

async function main() {
  await populateGalleryNewImages()
  await updateHistoricalDocuments()
  console.log('\n🎉 All done!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
