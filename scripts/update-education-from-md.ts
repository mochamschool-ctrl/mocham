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

async function updateEducationFromMd() {
  console.log('='.repeat(80))
  console.log('UPDATING EDUCATION DATABASE FROM md.md')
  console.log('='.repeat(80))
  console.log()

  try {
    // Courses from md.md - TERMS OF ENROLMENT section (lines 205-214)
    const coursesFromMd = [
      {
        title: 'Homoeopathic Medicine',
        description: 'Comprehensive program in Homoeopathic medical sciences with a standard and approved syllabus. The college operates under the faculty of Homoeopathic medicine guide of 1981. Homoeopathy is a branch of scientific medicine which necessitates a competent knowledge of all other subjects including in the term MEDICINE Anatomy, physiology, pathology, Bacteriology, Biochemistry, genetics psychiatry and clinical Diagnosis.',
        duration: '5 Years',
        type: 'degree',
        level: 'undergraduate',
        slug: 'homoeopathic-medicine',
        features: [
          'Standard Curriculum',
          'Approved Syllabus (1981 Guide)',
          'Clinical Training',
          'Research Opportunities',
          'Comprehensive Medical Knowledge'
        ]
      },
      {
        title: 'Alternative Nursing and Midwifery',
        description: 'Training in General Nursing and midwifery with particular reference to the use of Alternative drugs. An alternative Nurse is a person who has completed a programme of basic alternative Nursing education and is qualified and authorized to practice nursing. The curriculum contains abstract frameworks linking facts and phenomena that assist nurses to plan Nursing care, investigate problems related to clinical practice, and study the outcomes of Nursing actions and interventions.',
        duration: '3 Years',
        type: 'diploma',
        level: 'professional',
        slug: 'alternative-nursing-midwifery',
        features: [
          'Nursing Process (Assessment, Planning, Implementation, Evaluation)',
          'Clinical Practice',
          'Alternative Drugs',
          'Professional Certification',
          'Registered with Alternative Nursing and Midwifery Council'
        ]
      },
      {
        title: 'Alternative Pharmacy',
        description: 'Training for pharmaceutical scientists, chemist and druggists in Alternative medicine who shall be able to manufacture hygienic highly potent and efficacious herbal medications, Homoeopathic remedies, Naturopathic supplements etc. that shall meet both NAFDAC specification and international standard.',
        duration: '4 Years',
        type: 'degree',
        level: 'undergraduate',
        slug: 'alternative-pharmacy',
        features: [
          'Pharmaceutical Science',
          'Herbal Medicine Manufacturing',
          'Homoeopathic Remedies',
          'Naturopathic Supplements',
          'NAFDAC Standards',
          'International Standards'
        ]
      },
      {
        title: 'Naturopathic Medicine',
        description: 'Comprehensive naturopathic medicine program focusing on natural healing methods, lifestyle counseling, and holistic approaches to health and wellness. Naturopathy emphasizes the body\'s inherent ability to heal itself through natural means.',
        duration: '4 Years',
        type: 'degree',
        level: 'undergraduate',
        slug: 'naturopathic-medicine',
        features: [
          'Natural Healing Methods',
          'Lifestyle Counseling',
          'Herbal Medicine',
          'Holistic Approach',
          'Preventive Medicine',
          'Evidence-Based Practice'
        ]
      },
      {
        title: 'Herbal Medicine',
        description: 'Training in herbal medicine and traditional therapeutics for the manufacture of hygienic highly potent and efficacious herbal medications. This program combines traditional knowledge with modern scientific approaches to herbal medicine.',
        duration: '3 Years',
        type: 'diploma',
        level: 'professional',
        slug: 'herbal-medicine',
        features: [
          'Traditional Therapeutics',
          'Herbal Preparation',
          'Clinical Application',
          'Research Methods',
          'Quality Control',
          'Safety Standards'
        ]
      },
      {
        title: 'Integrative Medicine',
        description: 'Integrative approach combining various alternative medicine practices to provide comprehensive healthcare solutions. This program integrates homeopathy, naturopathy, herbal medicine, and other modalities to offer holistic patient care.',
        duration: '5 Years',
        type: 'degree',
        level: 'undergraduate',
        slug: 'integrative-medicine',
        features: [
          'Holistic Approach',
          'Multiple Modalities',
          'Clinical Integration',
          'Research Based',
          'Patient-Centered Care',
          'Evidence Integration'
        ]
      },
      {
        title: 'Acupuncture',
        description: 'Training in acupuncture and related techniques for the treatment of various acute and chronic disease conditions. Acupuncture is a form of prescribable treatment using precise needle placement to stimulate healing and restore balance.',
        duration: '3 Years',
        type: 'diploma',
        level: 'professional',
        slug: 'acupuncture',
        features: [
          'Acupuncture Techniques',
          'Clinical Practice',
          'Traditional Methods',
          'Modern Applications',
          'Meridian Theory',
          'Point Location'
        ]
      }
    ]

    console.log('📚 Updating Programs (Education Courses) from md.md...')
    console.log(`   Found ${coursesFromMd.length} courses in md.md\n`)

    // Delete existing programs and create new ones to ensure they match md.md exactly
    const existingCount = await prisma.program.count()
    console.log(`   Current programs in database: ${existingCount}`)
    
    await prisma.program.deleteMany({})
    console.log('   ✅ Cleared existing programs')

    // Create all programs from md.md
    for (const course of coursesFromMd) {
      await prisma.program.create({
        data: {
          ...course,
          capacity: 50,
          isAccredited: true
        }
      })
      console.log(`   ✅ Created: ${course.title}`)
    }
    console.log()

    // Also update AcademicProgramHistory to ensure consistency
    console.log('📚 Ensuring AcademicProgramHistory matches md.md...')
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
        console.log(`   ✅ Updated: ${expected.programName}`)
      } else {
        await prisma.academicProgramHistory.create({
          data: expected
        })
        console.log(`   ✅ Created: ${expected.programName}`)
      }
    }
    console.log()

    // Summary
    const finalCount = await prisma.program.count()
    console.log('='.repeat(80))
    console.log('✅ EDUCATION DATABASE UPDATE COMPLETE!')
    console.log('='.repeat(80))
    console.log()
    console.log('Summary:')
    console.log(`  - Updated Programs table: ${finalCount} programs`)
    console.log(`  - All programs match md.md TERMS OF ENROLMENT section`)
    console.log(`  - AcademicProgramHistory updated for consistency`)
    console.log()
    console.log('Courses available:')
    coursesFromMd.forEach((course, idx) => {
      console.log(`  ${idx + 1}. ${course.title} (${course.type}, ${course.duration})`)
    })

  } catch (error) {
    console.error('Error updating education database:', error)
    throw error
  }
}

if (require.main === module) {
  updateEducationFromMd()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export default updateEducationFromMd

