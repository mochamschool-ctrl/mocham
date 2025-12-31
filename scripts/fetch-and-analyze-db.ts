import { config } from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables
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

async function fetchAndAnalyze() {
  console.log('='.repeat(80))
  console.log('FETCHING ALL DATABASE DATA')
  console.log('='.repeat(80))
  console.log()

  try {
    // 1. Founder Information
    console.log('📋 FOUNDER INFORMATION')
    console.log('-'.repeat(80))
    const founders = await prisma.founderInfo.findMany()
    if (founders.length === 0) {
      console.log('❌ No founder information found')
    } else {
      founders.forEach((founder, idx) => {
        console.log(`\nFounder ${idx + 1}:`)
        console.log(`  ID: ${founder.id}`)
        console.log(`  Name: ${founder.name}`)
        console.log(`  Title: ${founder.title || 'N/A'}`)
        console.log(`  Birth Date: ${founder.birthDate || 'N/A'}`)
        console.log(`  Death Date: ${founder.deathDate || 'N/A'}`)
        console.log(`  Biography:`, JSON.stringify(founder.biography, null, 2))
        console.log(`  Created: ${founder.createdAt}`)
        console.log(`  Updated: ${founder.updatedAt}`)
      })
    }
    console.log()

    // 2. College History Events
    console.log('📋 COLLEGE HISTORY EVENTS')
    console.log('-'.repeat(80))
    const historyEvents = await prisma.collegeHistoryEvent.findMany({
      orderBy: { year: 'asc' }
    })
    if (historyEvents.length === 0) {
      console.log('❌ No college history events found')
    } else {
      console.log(`Total: ${historyEvents.length} events\n`)
      historyEvents.forEach((event, idx) => {
        console.log(`Event ${idx + 1}:`)
        console.log(`  ID: ${event.id}`)
        console.log(`  Year: ${event.year}`)
        console.log(`  Title: ${event.title}`)
        console.log(`  Description: ${event.description || 'N/A'}`)
        console.log(`  Event Type: ${event.eventType}`)
        console.log(`  Details:`, JSON.stringify(event.details, null, 2))
        console.log(`  Image URL: ${event.imageUrl || 'N/A'}`)
        console.log(`  Is Active: ${event.isActive}`)
        console.log(`  Order: ${event.order}`)
        console.log()
      })
    }
    console.log()

    // 3. Academic Programs History
    console.log('📋 ACADEMIC PROGRAMS HISTORY')
    console.log('-'.repeat(80))
    const academicPrograms = await prisma.academicProgramHistory.findMany({
      orderBy: { facultyName: 'asc' }
    })
    if (academicPrograms.length === 0) {
      console.log('❌ No academic programs found')
    } else {
      console.log(`Total: ${academicPrograms.length} programs\n`)
      academicPrograms.forEach((program, idx) => {
        console.log(`Program ${idx + 1}:`)
        console.log(`  ID: ${program.id}`)
        console.log(`  Faculty: ${program.facultyName}`)
        console.log(`  Department: ${program.departmentName || 'N/A'}`)
        console.log(`  Program: ${program.programName}`)
        console.log(`  Degree Type: ${program.degreeType || 'N/A'}`)
        console.log(`  Established Year: ${program.establishedYear || 'N/A'}`)
        console.log(`  Description: ${program.description || 'N/A'}`)
        console.log(`  Is Active: ${program.isActive}`)
        console.log()
      })
    }
    console.log()

    // 4. Facilities History
    console.log('📋 FACILITIES HISTORY')
    console.log('-'.repeat(80))
    const facilities = await prisma.facilityHistory.findMany({
      orderBy: { name: 'asc' }
    })
    if (facilities.length === 0) {
      console.log('❌ No facilities found')
    } else {
      console.log(`Total: ${facilities.length} facilities\n`)
      facilities.forEach((facility, idx) => {
        console.log(`Facility ${idx + 1}:`)
        console.log(`  ID: ${facility.id}`)
        console.log(`  Name: ${facility.name}`)
        console.log(`  Type: ${facility.type}`)
        console.log(`  Description: ${facility.description || 'N/A'}`)
        console.log(`  Established Year: ${facility.establishedYear || 'N/A'}`)
        console.log(`  Equipment: ${facility.equipment.join(', ') || 'N/A'}`)
        console.log(`  Is Active: ${facility.isActive}`)
        console.log()
      })
    }
    console.log()

    // 5. Programs (Current Programs)
    console.log('📋 PROGRAMS (Current)')
    console.log('-'.repeat(80))
    const programs = await prisma.program.findMany({
      orderBy: { title: 'asc' }
    })
    if (programs.length === 0) {
      console.log('❌ No programs found')
    } else {
      console.log(`Total: ${programs.length} programs\n`)
      programs.forEach((program, idx) => {
        console.log(`Program ${idx + 1}:`)
        console.log(`  ID: ${program.id}`)
        console.log(`  Title: ${program.title}`)
        console.log(`  Description: ${program.description}`)
        console.log(`  Duration: ${program.duration}`)
        console.log(`  Type: ${program.type}`)
        console.log(`  Level: ${program.level}`)
        console.log(`  Slug: ${program.slug}`)
        console.log(`  Features: ${program.features.join(', ')}`)
        console.log()
      })
    }
    console.log()

    // 6. Legacy Achievements
    console.log('📋 LEGACY ACHIEVEMENTS')
    console.log('-'.repeat(80))
    const achievements = await prisma.legacyAchievement.findMany({
      orderBy: { year: 'desc' }
    })
    if (achievements.length === 0) {
      console.log('❌ No legacy achievements found')
    } else {
      console.log(`Total: ${achievements.length} achievements\n`)
      achievements.forEach((achievement, idx) => {
        console.log(`Achievement ${idx + 1}:`)
        console.log(`  ID: ${achievement.id}`)
        console.log(`  Title: ${achievement.title}`)
        console.log(`  Description: ${achievement.description || 'N/A'}`)
        console.log(`  Category: ${achievement.category}`)
        console.log(`  Year: ${achievement.year || 'N/A'}`)
        console.log(`  Details:`, JSON.stringify(achievement.details, null, 2))
        console.log(`  Is Featured: ${achievement.isFeatured}`)
        console.log()
      })
    }
    console.log()

    // 7. Historical Documents
    console.log('📋 HISTORICAL DOCUMENTS')
    console.log('-'.repeat(80))
    const documents = await prisma.historicalDocument.findMany({
      orderBy: { year: 'desc' }
    })
    if (documents.length === 0) {
      console.log('❌ No historical documents found')
    } else {
      console.log(`Total: ${documents.length} documents\n`)
      documents.forEach((doc, idx) => {
        console.log(`Document ${idx + 1}:`)
        console.log(`  ID: ${doc.id}`)
        console.log(`  Title: ${doc.title}`)
        console.log(`  Type: ${doc.documentType}`)
        console.log(`  Year: ${doc.year || 'N/A'}`)
        console.log(`  Description: ${doc.description || 'N/A'}`)
        console.log(`  File URL: ${doc.fileUrl || 'N/A'}`)
        console.log(`  Source: ${doc.source || 'N/A'}`)
        console.log(`  Is Featured: ${doc.isFeatured}`)
        console.log()
      })
    }
    console.log()

    // 8. Summary Statistics
    console.log('='.repeat(80))
    console.log('SUMMARY STATISTICS')
    console.log('='.repeat(80))
    const [
      founderCount,
      historyCount,
      programHistoryCount,
      facilityCount,
      programCount,
      achievementCount,
      documentCount,
      newsCount,
      doctorCount,
      serviceCount,
      publicationCount,
      researchStudyCount
    ] = await Promise.all([
      prisma.founderInfo.count(),
      prisma.collegeHistoryEvent.count(),
      prisma.academicProgramHistory.count(),
      prisma.facilityHistory.count(),
      prisma.program.count(),
      prisma.legacyAchievement.count(),
      prisma.historicalDocument.count(),
      prisma.news.count(),
      prisma.doctor.count(),
      prisma.service.count(),
      prisma.publication.count(),
      prisma.researchStudy.count()
    ])

    console.log(`Founder Info: ${founderCount}`)
    console.log(`College History Events: ${historyCount}`)
    console.log(`Academic Programs History: ${programHistoryCount}`)
    console.log(`Facilities History: ${facilityCount}`)
    console.log(`Programs (Current): ${programCount}`)
    console.log(`Legacy Achievements: ${achievementCount}`)
    console.log(`Historical Documents: ${documentCount}`)
    console.log(`News: ${newsCount}`)
    console.log(`Doctors: ${doctorCount}`)
    console.log(`Services: ${serviceCount}`)
    console.log(`Publications: ${publicationCount}`)
    console.log(`Research Studies: ${researchStudyCount}`)
    console.log()

    // 9. Compare with md.md expectations
    console.log('='.repeat(80))
    console.log('COMPARISON WITH md.md EXPECTATIONS')
    console.log('='.repeat(80))
    console.log()

    // Expected from md.md:
    const expectedPrograms = [
      'Homoeopathic medicine',
      'Alternative nursing and midwifery',
      'Alternative pharmacy',
      'Naturopathic medicine',
      'Herbal medicine',
      'Integrative medicine',
      'Acupuncture'
    ]

    console.log('Expected Programs from md.md:')
    expectedPrograms.forEach((prog, idx) => {
      const found = academicPrograms.some(p => 
        p.programName.toLowerCase().includes(prog.toLowerCase()) ||
        prog.toLowerCase().includes(p.programName.toLowerCase())
      )
      console.log(`  ${found ? '✅' : '❌'} ${prog}`)
    })
    console.log()

    // Expected History Events
    const expectedHistoryYears = [1960, 1965, 1982]
    console.log('Expected History Events from md.md:')
    expectedHistoryYears.forEach(year => {
      const found = historyEvents.some(e => e.year === year)
      console.log(`  ${found ? '✅' : '❌'} Year ${year}`)
    })
    console.log()

    // Expected Facilities
    const expectedFacilities = [
      'Library',
      'Research Center',
      'Anatomy/Physiology Laboratory',
      'Pathology Laboratory',
      'Pharmacy Laboratory',
      'Museum of Anatomy',
      'Museum of Pathology',
      'Museum of Pharmacology'
    ]
    console.log('Expected Facilities from md.md:')
    expectedFacilities.forEach(facility => {
      const found = facilities.some(f => 
        f.name.toLowerCase().includes(facility.toLowerCase()) ||
        facility.toLowerCase().includes(f.name.toLowerCase())
      )
      console.log(`  ${found ? '✅' : '❌'} ${facility}`)
    })
    console.log()

    // Expected Founder
    console.log('Expected Founder from md.md:')
    const hasFounder = founders.length > 0
    const correctFounder = founders.some(f => 
      f.name.includes('Umoren') || f.name.includes('E. U.')
    )
    console.log(`  ${hasFounder ? '✅' : '❌'} Founder information exists`)
    console.log(`  ${correctFounder ? '✅' : '❌'} Founder name matches (should contain "Umoren" or "E. U.")`)
    console.log()

    console.log('='.repeat(80))
    console.log('ANALYSIS COMPLETE')
    console.log('='.repeat(80))

  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

if (require.main === module) {
  fetchAndAnalyze()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export default fetchAndAnalyze

