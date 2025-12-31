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

async function cleanAndUpdate() {
  console.log('='.repeat(80))
  console.log('CLEANING DUPLICATES AND UPDATING DATA FROM md.md')
  console.log('='.repeat(80))
  console.log()

  try {
    // 1. Clean duplicate College History Events
    console.log('🧹 Cleaning duplicate College History Events...')
    const allHistoryEvents = await prisma.collegeHistoryEvent.findMany({
      orderBy: { year: 'asc' }
    })

    // Group by year and title
    const eventsByKey = new Map<string, any[]>()
    for (const event of allHistoryEvents) {
      const key = `${event.year}-${event.title.toLowerCase().trim()}`
      if (!eventsByKey.has(key)) {
        eventsByKey.set(key, [])
      }
      eventsByKey.get(key)!.push(event)
    }

    // Keep the first one, delete duplicates
    let deletedHistory = 0
    for (const [key, events] of eventsByKey.entries()) {
      if (events.length > 1) {
        console.log(`  Found ${events.length} duplicates for: ${key}`)
        // Keep the first one (or the one with more details)
        const toKeep = events[0]
        const toDelete = events.slice(1)
        
        for (const event of toDelete) {
          await prisma.collegeHistoryEvent.delete({ where: { id: event.id } })
          deletedHistory++
        }
        console.log(`  ✅ Kept one, deleted ${toDelete.length} duplicates`)
      }
    }
    console.log(`✅ Cleaned ${deletedHistory} duplicate history events\n`)

    // 2. Update key history events to match md.md exactly
    console.log('📝 Updating key history events from md.md...')
    
    // Update 1960 event
    const event1960 = await prisma.collegeHistoryEvent.findFirst({
      where: { year: 1960 }
    })
    if (event1960) {
      await prisma.collegeHistoryEvent.update({
        where: { id: event1960.id },
        data: {
          title: 'Cottage Homoeopathic Medical College and Hospital Founded',
          description: 'Founded in Akwa Ibom State in 1960, with the name COTTAGE HOMOEOPATHIC MEDICAL COLLEGE AND HOSPITAL, No 60 Aka Road Uyo, by Late Dr. E. U. Umoren. It was dedicated to the teaching of classical and modern Homoeopathy as well as other forms of Alternative medicine with the expertise of qualified expatriates.',
          eventType: 'foundation',
          details: {
            location: 'No 60 Aka Road Uyo, Akwa Ibom State',
            originalName: 'Cottage Homoeopathic Medical College and Hospital',
            founder: 'Dr. E. U. Umoren',
            purpose: 'Teaching of classical and modern Homoeopathy and other forms of Alternative medicine'
          },
          order: 1
        }
      })
      console.log('  ✅ Updated 1960 event')
    }

    // Update 1965 event
    const event1965 = await prisma.collegeHistoryEvent.findFirst({
      where: { year: 1965 }
    })
    if (event1965) {
      await prisma.collegeHistoryEvent.update({
        where: { id: event1965.id },
        data: {
          title: 'First Association of Nigerian Homoeopathic and Natural Therapeutics Association',
          description: 'Dr. Umoren used pioneer graduates to form the first Association of Nigerian Homoeopathic and Natural Therapeutics Association in 1965 with registration No. 130384.',
          eventType: 'achievement',
          details: {
            registration: 'No. 130384',
            significance: 'First organized homeopathic association in Nigeria'
          },
          order: 2
        }
      })
      console.log('  ✅ Updated 1965 event')
    }

    // Update 1982 event
    const event1982 = await prisma.collegeHistoryEvent.findFirst({
      where: { year: 1982 }
    })
    if (event1982) {
      await prisma.collegeHistoryEvent.update({
        where: { id: event1982.id },
        data: {
          title: 'Major Reforms and Curriculum Redrafting',
          description: 'In 1982, as a founding father, Dr. Umoren left behind an authentic guideline on the original teaching methods of homoeopathy and other forms of alternative medicine. A committee was set up to redraft the curriculum.',
          eventType: 'milestone',
          details: {
            committee: [
              'Dr. Edem Umoren - Chairman',
              'Dr. B. A. Edem - Member',
              'Dr. Linus Inyang - Secretary',
              'Mrs. Ekatte E. Akpan - Member',
              'Mrs. Anthonia B. Edem - Member',
              'Prof. Lawrence Usip - Member'
            ],
            reviewCommittee: 'Prof. E. E. Essien, Dean, Faculty of Pharmacy, University of Uyo'
          },
          order: 3
        }
      })
      console.log('  ✅ Updated 1982 event')
    }
    console.log()

    // 3. Clean duplicate Academic Programs
    console.log('🧹 Cleaning duplicate Academic Programs...')
    const allPrograms = await prisma.academicProgramHistory.findMany()

    // Group by faculty and program name
    const programsByKey = new Map<string, any[]>()
    for (const program of allPrograms) {
      const key = `${program.facultyName.toLowerCase().trim()}-${program.programName.toLowerCase().trim()}`
      if (!programsByKey.has(key)) {
        programsByKey.set(key, [])
      }
      programsByKey.get(key)!.push(program)
    }

    // Keep the first one, delete duplicates
    let deletedPrograms = 0
    for (const [key, programs] of programsByKey.entries()) {
      if (programs.length > 1) {
        console.log(`  Found ${programs.length} duplicates for: ${key}`)
        const toKeep = programs[0]
        const toDelete = programs.slice(1)
        
        for (const program of toDelete) {
          await prisma.academicProgramHistory.delete({ where: { id: program.id } })
          deletedPrograms++
        }
        console.log(`  ✅ Kept one, deleted ${toDelete.length} duplicates`)
      }
    }
    console.log(`✅ Cleaned ${deletedPrograms} duplicate academic programs\n`)

    // 4. Ensure all 7 programs from md.md exist
    console.log('📝 Ensuring all programs from md.md exist...')
    const expectedPrograms = [
      {
        facultyName: 'Homoeopathic Medical Sciences',
        programName: 'Homoeopathic medicine',
        description: 'Comprehensive program in Homoeopathic medical sciences',
        establishedYear: 1982
      },
      {
        facultyName: 'Alternative Medicine',
        programName: 'Alternative nursing and midwifery',
        description: 'Training in General Nursing and midwifery with particular reference to the use of Alternative drugs',
        establishedYear: 1982
      },
      {
        facultyName: 'Alternative Medicine',
        programName: 'Alternative pharmacy',
        description: 'Training for pharmaceutical scientists, chemist and druggists in Alternative medicine',
        establishedYear: 1982
      },
      {
        facultyName: 'Alternative Medicine',
        programName: 'Naturopathic medicine',
        description: 'Comprehensive naturopathic medicine program',
        establishedYear: 1982
      },
      {
        facultyName: 'Alternative Medicine',
        programName: 'Herbal medicine',
        description: 'Training in herbal medicine and traditional therapeutics',
        establishedYear: 1982
      },
      {
        facultyName: 'Alternative Medicine',
        programName: 'Integrative medicine',
        description: 'Integrative approach combining various alternative medicine practices',
        establishedYear: 1982
      },
      {
        facultyName: 'Alternative Medicine',
        programName: 'Acupuncture',
        description: 'Training in acupuncture and related techniques',
        establishedYear: 1982
      }
    ]

    for (const expected of expectedPrograms) {
      const existing = await prisma.academicProgramHistory.findFirst({
        where: {
          facultyName: expected.facultyName,
          programName: expected.programName
        }
      })

      if (existing) {
        await prisma.academicProgramHistory.update({
          where: { id: existing.id },
          data: expected
        })
        console.log(`  ✅ Updated: ${expected.programName}`)
      } else {
        await prisma.academicProgramHistory.create({
          data: expected
        })
        console.log(`  ✅ Created: ${expected.programName}`)
      }
    }
    console.log()

    // 5. Clean duplicate Facilities
    console.log('🧹 Cleaning duplicate Facilities...')
    const allFacilities = await prisma.facilityHistory.findMany()

    // Group by name (case-insensitive, normalize variations)
    const facilitiesByKey = new Map<string, any[]>()
    for (const facility of allFacilities) {
      // Normalize "Research Center" and "Research Centre" to the same key
      let normalizedName = facility.name.toLowerCase().trim()
      if (normalizedName.includes('research center') || normalizedName.includes('research centre')) {
        normalizedName = 'research center'
      }
      const key = `${normalizedName}-${facility.type.toLowerCase().trim()}`
      if (!facilitiesByKey.has(key)) {
        facilitiesByKey.set(key, [])
      }
      facilitiesByKey.get(key)!.push(facility)
    }

    // Keep the first one, delete duplicates
    let deletedFacilities = 0
    for (const [key, facilities] of facilitiesByKey.entries()) {
      if (facilities.length > 1) {
        console.log(`  Found ${facilities.length} duplicates for: ${key}`)
        const toKeep = facilities[0]
        const toDelete = facilities.slice(1)
        
        for (const facility of toDelete) {
          await prisma.facilityHistory.delete({ where: { id: facility.id } })
          deletedFacilities++
        }
        console.log(`  ✅ Kept one, deleted ${toDelete.length} duplicates`)
      }
    }
    console.log(`✅ Cleaned ${deletedFacilities} duplicate facilities\n`)

    // 6. Update location information in history events
    console.log('📝 Updating location information...')
    // Update 1960 event with original location
    if (event1960) {
      await prisma.collegeHistoryEvent.update({
        where: { id: event1960.id },
        data: {
          details: {
            ...(event1960.details as any),
            originalLocation: 'No 60 Aka Road Uyo, Akwa Ibom State',
            currentLocation: '11 homoeopathic crescent by 152 Aka Road Uyo, behind the Popular Uyo Township Stadium'
          }
        }
      })
    }

    // Add a new event for current location if needed
    const currentLocationEvent = await prisma.collegeHistoryEvent.findFirst({
      where: {
        title: { contains: 'Current Location' }
      }
    })

    if (!currentLocationEvent) {
      // Find the most recent event to determine a reasonable year
      const recentEvents = await prisma.collegeHistoryEvent.findMany({
        orderBy: { year: 'desc' },
        take: 1
      })
      const recentYear = recentEvents[0]?.year || 2024

      await prisma.collegeHistoryEvent.create({
        data: {
          year: recentYear,
          title: 'Current Campus Location',
          description: 'The school is situated in a quiet and secluded part of Uyo capital city, 11 homoeopathic crescent by 152 Aka Road Uyo behind the Popular Uyo Township Stadium. A few kilometers from state police command, Ikot Akpanabia.',
          eventType: 'milestone',
          details: {
            location: '11 homoeopathic crescent by 152 Aka Road Uyo',
            landmark: 'Behind the Popular Uyo Township Stadium',
            distance: 'A few kilometers from state police command, Ikot Akpanabia',
            description: 'A beautiful strategic area, a citadel of learning and academy of science and research'
          },
          order: 999
        }
      })
      console.log('  ✅ Added current location event')
    }
    console.log()

    // 7. Update Programs (Current) to match md.md
    console.log('📝 Updating current Programs to match md.md...')
    const expectedCurrentPrograms = [
      {
        title: 'Homoeopathic Medicine',
        description: 'Comprehensive program in Homoeopathic medical sciences with a standard and approved syllabus. The college operates under the faculty of Homoeopathic medicine guide of 1981.',
        duration: '5 Years',
        type: 'degree',
        level: 'undergraduate',
        slug: 'homoeopathic-medicine',
        features: ['Standard Curriculum', 'Approved Syllabus', 'Clinical Training', 'Research Opportunities']
      },
      {
        title: 'Alternative Nursing and Midwifery',
        description: 'Training in General Nursing and midwifery with particular reference to the use of Alternative drugs. An alternative Nurse is a person who has completed a programme of basic alternative Nursing education.',
        duration: '3 Years',
        type: 'diploma',
        level: 'professional',
        slug: 'alternative-nursing-midwifery',
        features: ['Nursing Process', 'Clinical Practice', 'Alternative Drugs', 'Professional Certification']
      },
      {
        title: 'Alternative Pharmacy',
        description: 'Training for pharmaceutical scientists, chemist and druggists in Alternative medicine who shall be able to manufacture hygienic highly potent and efficacious herbal medications, Homoeopathic remedies, Naturopathic supplements etc.',
        duration: '4 Years',
        type: 'degree',
        level: 'undergraduate',
        slug: 'alternative-pharmacy',
        features: ['Pharmaceutical Science', 'Herbal Medicine', 'NAFDAC Standards', 'International Standards']
      },
      {
        title: 'Naturopathic Medicine',
        description: 'Comprehensive naturopathic medicine program focusing on natural healing methods and lifestyle counseling.',
        duration: '4 Years',
        type: 'degree',
        level: 'undergraduate',
        slug: 'naturopathic-medicine',
        features: ['Natural Healing', 'Lifestyle Counseling', 'Herbal Medicine', 'Holistic Approach']
      },
      {
        title: 'Herbal Medicine',
        description: 'Training in herbal medicine and traditional therapeutics for the manufacture of hygienic highly potent and efficacious herbal medications.',
        duration: '3 Years',
        type: 'diploma',
        level: 'professional',
        slug: 'herbal-medicine',
        features: ['Traditional Therapeutics', 'Herbal Preparation', 'Clinical Application', 'Research']
      },
      {
        title: 'Integrative Medicine',
        description: 'Integrative approach combining various alternative medicine practices to provide comprehensive healthcare solutions.',
        duration: '5 Years',
        type: 'degree',
        level: 'undergraduate',
        slug: 'integrative-medicine',
        features: ['Holistic Approach', 'Multiple Modalities', 'Clinical Integration', 'Research Based']
      },
      {
        title: 'Acupuncture',
        description: 'Training in acupuncture and related techniques for the treatment of various acute and chronic disease conditions.',
        duration: '3 Years',
        type: 'diploma',
        level: 'professional',
        slug: 'acupuncture',
        features: ['Acupuncture Techniques', 'Clinical Practice', 'Traditional Methods', 'Modern Applications']
      }
    ]

    // Delete existing programs and create new ones
    await prisma.program.deleteMany({})
    console.log('  ✅ Cleared existing programs')

    for (const program of expectedCurrentPrograms) {
      await prisma.program.create({
        data: {
          ...program,
          capacity: 50,
          isAccredited: true
        }
      })
      console.log(`  ✅ Created: ${program.title}`)
    }
    console.log()

    console.log('='.repeat(80))
    console.log('✅ CLEANUP AND UPDATE COMPLETE!')
    console.log('='.repeat(80))
    console.log()
    console.log('Summary:')
    console.log(`  - Deleted ${deletedHistory} duplicate history events`)
    console.log(`  - Deleted ${deletedPrograms} duplicate academic programs`)
    console.log(`  - Deleted ${deletedFacilities} duplicate facilities`)
    console.log(`  - Updated key history events (1960, 1965, 1982)`)
    console.log(`  - Ensured all 7 programs from md.md exist`)
    console.log(`  - Updated current location information`)
    console.log(`  - Updated current Programs to match md.md`)

  } catch (error) {
    console.error('Error during cleanup and update:', error)
    throw error
  }
}

if (require.main === module) {
  cleanAndUpdate()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export default cleanAndUpdate

