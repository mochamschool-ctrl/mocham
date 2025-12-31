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

async function cleanEmptyCollections() {
  console.log('='.repeat(80))
  console.log('ANALYZING AND CLEANING EMPTY COLLECTIONS')
  console.log('='.repeat(80))
  console.log()

  try {
    // Get counts for all models
    const counts = {
      adminUser: await prisma.adminUser.count(),
      account: await prisma.account.count(),
      session: await prisma.session.count(),
      verificationToken: await prisma.verificationToken.count(),
      program: await prisma.program.count(),
      service: await prisma.service.count(),
      doctor: await prisma.doctor.count(),
      news: await prisma.news.count(),
      testimonial: await prisma.testimonial.count(),
      application: await prisma.application.count(),
      appointment: await prisma.appointment.count(),
      contactMessage: await prisma.contactMessage.count(),
      historyEvent: await prisma.historyEvent.count(),
      publication: await prisma.publication.count(),
      researchStudy: await prisma.researchStudy.count(),
      collaboration: await prisma.collaboration.count(),
      achievement: await prisma.achievement.count(),
      founderInfo: await prisma.founderInfo.count(),
      collegeHistoryEvent: await prisma.collegeHistoryEvent.count(),
      academicProgramHistory: await prisma.academicProgramHistory.count(),
      facilityHistory: await prisma.facilityHistory.count(),
      legacyAchievement: await prisma.legacyAchievement.count(),
      historicalDocument: await prisma.historicalDocument.count(),
      gallery: await prisma.gallery.count(),
      studentGrade: await prisma.studentGrade.count(),
      studentCertificate: await prisma.studentCertificate.count(),
      studentSchedule: await prisma.studentSchedule.count(),
      course: await prisma.course.count(),
      courseEnrollment: await prisma.courseEnrollment.count(),
      user: await prisma.user.count()
    }

    console.log('📊 COLLECTION COUNTS:')
    console.log('-'.repeat(80))
    
    const emptyCollections: string[] = []
    const nonEmptyCollections: Array<{ name: string; count: number }> = []

    for (const [name, count] of Object.entries(counts)) {
      if (count === 0) {
        emptyCollections.push(name)
        console.log(`  ❌ ${name.padEnd(30)} : 0 records (EMPTY)`)
      } else {
        nonEmptyCollections.push({ name, count })
        console.log(`  ✅ ${name.padEnd(30)} : ${count} records`)
      }
    }

    console.log()
    console.log('='.repeat(80))
    console.log('SUMMARY')
    console.log('='.repeat(80))
    console.log(`Total Collections: ${Object.keys(counts).length}`)
    console.log(`Empty Collections: ${emptyCollections.length}`)
    console.log(`Non-Empty Collections: ${nonEmptyCollections.length}`)
    console.log()

    if (emptyCollections.length > 0) {
      console.log('📋 EMPTY COLLECTIONS:')
      emptyCollections.forEach(name => {
        console.log(`  - ${name}`)
      })
      console.log()
      
      // Note: We can't delete tables via Prisma client, but we can note which ones are empty
      // If the user wants to delete tables, they would need to use migrations
      console.log('ℹ️  Note: Empty collections (tables) cannot be deleted via Prisma client.')
      console.log('   To delete empty tables, you would need to create a Prisma migration.')
      console.log('   These empty tables are safe to keep and will not affect your application.')
      console.log()
    }

    // Also check for records with empty/null critical fields
    console.log('='.repeat(80))
    console.log('CHECKING FOR RECORDS WITH EMPTY/NULL CRITICAL FIELDS')
    console.log('='.repeat(80))
    console.log()

    // Check programs with empty titles
    const allPrograms = await prisma.program.findMany()
    const programsWithEmptyTitles = allPrograms.filter(p => 
      !p.title || p.title.trim() === '' || !p.description || p.description.trim() === ''
    )
    if (programsWithEmptyTitles.length > 0) {
      console.log(`⚠️  Found ${programsWithEmptyTitles.length} programs with empty titles/descriptions`)
      for (const program of programsWithEmptyTitles) {
        console.log(`  - ID: ${program.id}, Title: "${program.title || '(empty)'}"`)
      }
      console.log()
    }

    // Check services with empty names
    const allServices = await prisma.service.findMany()
    const servicesWithEmptyNames = allServices.filter(s => 
      !s.name || s.name.trim() === '' || !s.description || s.description.trim() === ''
    )
    if (servicesWithEmptyNames.length > 0) {
      console.log(`⚠️  Found ${servicesWithEmptyNames.length} services with empty names/descriptions`)
      for (const service of servicesWithEmptyNames) {
        console.log(`  - ID: ${service.id}, Name: "${service.name || '(empty)'}"`)
      }
      console.log()
    }

    // Check doctors with empty names
    const allDoctors = await prisma.doctor.findMany()
    const doctorsWithEmptyNames = allDoctors.filter(d => 
      !d.name || d.name.trim() === '' || !d.title || d.title.trim() === ''
    )
    if (doctorsWithEmptyNames.length > 0) {
      console.log(`⚠️  Found ${doctorsWithEmptyNames.length} doctors with empty names/titles`)
      for (const doctor of doctorsWithEmptyNames) {
        console.log(`  - ID: ${doctor.id}, Name: "${doctor.name || '(empty)'}"`)
      }
      console.log()
    }

    // Check news with empty titles
    const allNews = await prisma.news.findMany()
    const newsWithEmptyTitles = allNews.filter(n => 
      !n.title || n.title.trim() === '' || !n.content || n.content.trim() === ''
    )
    if (newsWithEmptyTitles.length > 0) {
      console.log(`⚠️  Found ${newsWithEmptyTitles.length} news items with empty titles/content`)
      for (const news of newsWithEmptyTitles) {
        console.log(`  - ID: ${news.id}, Title: "${news.title || '(empty)'}"`)
      }
      console.log()
    }

    // Check testimonials with empty content
    const allTestimonials = await prisma.testimonial.findMany()
    const testimonialsWithEmptyContent = allTestimonials.filter(t => 
      !t.name || t.name.trim() === '' || !t.content || t.content.trim() === ''
    )
    if (testimonialsWithEmptyContent.length > 0) {
      console.log(`⚠️  Found ${testimonialsWithEmptyContent.length} testimonials with empty names/content`)
      for (const testimonial of testimonialsWithEmptyContent) {
        console.log(`  - ID: ${testimonial.id}, Name: "${testimonial.name || '(empty)'}"`)
      }
      console.log()
    }

    // Check gallery with empty image URLs
    const allGallery = await prisma.gallery.findMany()
    const galleryWithEmptyUrls = allGallery.filter(g => 
      !g.imageUrl || g.imageUrl.trim() === '' || !g.title || g.title.trim() === ''
    )
    if (galleryWithEmptyUrls.length > 0) {
      console.log(`⚠️  Found ${galleryWithEmptyUrls.length} gallery items with empty image URLs/titles`)
      for (const gallery of galleryWithEmptyUrls) {
        console.log(`  - ID: ${gallery.id}, Title: "${gallery.title || '(empty)'}", ImageURL: "${gallery.imageUrl || '(empty)'}"`)
      }
      console.log()
    }

    // Check historical documents with empty file URLs
    const allDocuments = await prisma.historicalDocument.findMany()
    const documentsWithEmptyUrls = allDocuments.filter(d => 
      !d.fileUrl || d.fileUrl.trim() === '' || !d.title || d.title.trim() === ''
    )
    if (documentsWithEmptyUrls.length > 0) {
      console.log(`⚠️  Found ${documentsWithEmptyUrls.length} historical documents with empty file URLs/titles`)
      for (const doc of documentsWithEmptyUrls) {
        console.log(`  - ID: ${doc.id}, Title: "${doc.title || '(empty)'}", FileURL: "${doc.fileUrl || '(empty)'}"`)
      }
      console.log()
    }

    // Summary of records with empty fields
    const totalEmptyRecords = 
      programsWithEmptyTitles.length +
      servicesWithEmptyNames.length +
      doctorsWithEmptyNames.length +
      newsWithEmptyTitles.length +
      testimonialsWithEmptyContent.length +
      galleryWithEmptyUrls.length +
      documentsWithEmptyUrls.length

    if (totalEmptyRecords === 0) {
      console.log('✅ No records found with empty/null critical fields')
    } else {
      console.log(`⚠️  Total records with empty/null critical fields: ${totalEmptyRecords}`)
      console.log()
      console.log('💡 To delete these records, you can manually delete them via Prisma Studio:')
      console.log('   Run: npm run db:studio')
    }

    console.log()
    console.log('='.repeat(80))
    console.log('✅ ANALYSIS COMPLETE')
    console.log('='.repeat(80))

  } catch (error) {
    console.error('Error analyzing collections:', error)
    throw error
  }
}

if (require.main === module) {
  cleanEmptyCollections()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export default cleanEmptyCollections

