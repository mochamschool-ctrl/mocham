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
    console.log('📄 .env file size:', envContent.length, 'bytes')
    console.log('📄 .env file content preview:', envContent.substring(0, 50))
    
    // Match DATABASE_URL=value (with or without quotes, handling multiline)
    const lines = envContent.split(/\r?\n/)
    console.log('📄 Total lines in .env:', lines.length)
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()
      console.log(`Line ${i}:`, trimmed.substring(0, 30), '...')
      
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('DATABASE_URL=')) {
        const equalIndex = trimmed.indexOf('=')
        if (equalIndex > 0) {
          const value = trimmed.substring(equalIndex + 1).trim()
          // Remove surrounding quotes if present
          process.env.DATABASE_URL = value.replace(/^["']|["']$/g, '')
          console.log('✅ Loaded DATABASE_URL from .env file')
          console.log('✅ Value starts with:', process.env.DATABASE_URL.substring(0, 30))
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
  console.error('Example: DATABASE_URL="postgresql://user:password@localhost:5432/mocham?schema=public"')
  console.error('Current working directory:', process.cwd())
  console.error('Looking for .env at:', envPath)
  console.error('.env file exists:', fs.existsSync(envPath))
  process.exit(1)
}

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateContentFromMd() {
  console.log('Updating content from md.md...')

  // Read md.md file
  const mdPath = path.join(process.cwd(), 'md.md')
  const mdContent = fs.readFileSync(mdPath, 'utf-8')

  // Update Founder Information
  console.log('Updating founder information...')
  const existingFounder = await prisma.founderInfo.findFirst()
  
  if (existingFounder) {
    await prisma.founderInfo.update({
      where: { id: existingFounder.id },
      data: {
        name: 'Dr. E. U. Umoren',
        title: 'M.D.(HOMOEO), ND. D.SC., DB.M, Ph.D., (London) F.I.A.Sc',
        biography: {
          ...(existingFounder.biography as any),
          qualifications: [
            'M.D.(HOMOEO)',
            'ND (Naturopathy)',
            'D.SC. (Doctor of Science)',
            'DB.M (Doctor of Botanic Medicine)',
            'Ph.D. (London)',
            'F.I.A.Sc (Fellow of Indian Academy of Sciences)'
          ],
          title: 'Chief Medical Director/Founder',
          pastRoles: [
            'Past founder and Grand Patron ANHMA (All Nigeria Homoeopathic Medical Association)'
          ]
        }
      }
    })
    console.log('Updated founder information')
  } else {
    await prisma.founderInfo.create({
      data: {
        name: 'Dr. E. U. Umoren',
        title: 'M.D.(HOMOEO), ND. D.SC., DB.M, Ph.D., (London) F.I.A.Sc',
        biography: {
          qualifications: [
            'M.D.(HOMOEO)',
            'ND (Naturopathy)',
            'D.SC. (Doctor of Science)',
            'DB.M (Doctor of Botanic Medicine)',
            'Ph.D. (London)',
            'F.I.A.Sc (Fellow of Indian Academy of Sciences)'
          ],
          title: 'Chief Medical Director/Founder',
          pastRoles: [
            'Past founder and Grand Patron ANHMA (All Nigeria Homoeopathic Medical Association)'
          ]
        }
      }
    })
    console.log('Created founder information')
  }

  // Update College History Events
  console.log('Updating college history events...')
  
  // Check and update/create 1960 founding event
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
  } else {
    await prisma.collegeHistoryEvent.create({
      data: {
        year: 1960,
        title: 'Cottage Homoeopathic Medical College and Hospital Founded',
        description: 'Founded in Akwa Ibom State in 1960, with the name COTTAGE HOMOEOPATHIC MEDICAL COLLEGE AND HOSPITAL, No 60 Aka Road Uyo, by Late Dr. E. U. Umoren.',
        eventType: 'foundation',
        details: {
          location: 'No 60 Aka Road Uyo, Akwa Ibom State',
          originalName: 'Cottage Homoeopathic Medical College and Hospital',
          founder: 'Dr. E. U. Umoren'
        },
        order: 1
      }
    })
  }

  // Update/create 1965 Association event
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
  } else {
    await prisma.collegeHistoryEvent.create({
      data: {
        year: 1965,
        title: 'First Association of Nigerian Homoeopathic and Natural Therapeutics Association',
        description: 'Dr. Umoren used pioneer graduates to form the first Association of Nigerian Homoeopathic and Natural Therapeutics Association in 1965 with registration No. 130384.',
        eventType: 'achievement',
        details: {
          registration: 'No. 130384'
        },
        order: 2
      }
    })
  }

  // Update/create 1982 reforms event
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
  } else {
    await prisma.collegeHistoryEvent.create({
      data: {
        year: 1982,
        title: 'Major Reforms and Curriculum Redrafting',
        description: 'In 1982, as a founding father, Dr. Umoren left behind an authentic guideline on the original teaching methods of homoeopathy.',
        eventType: 'milestone',
        order: 3
      }
    })
  }

  // Update Academic Programs History
  console.log('Updating academic programs history...')
  
  const programs = [
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

  for (const program of programs) {
    const existing = await prisma.academicProgramHistory.findFirst({
      where: {
        facultyName: program.facultyName,
        programName: program.programName
      }
    })

    if (existing) {
      await prisma.academicProgramHistory.update({
        where: { id: existing.id },
        data: program
      })
    } else {
      await prisma.academicProgramHistory.create({
        data: program
      })
    }
  }
  console.log('Updated academic programs history')

  // Update Facilities History
  console.log('Updating facilities history...')
  
  const facilities = [
    {
      name: 'Anatomy/Physiology Laboratory',
      type: 'laboratory',
      description: 'Well-equipped anatomy and physiology laboratories for imparting practical training and research',
      establishedYear: 1982,
      equipment: ['Anatomical models', 'Physiological measurement equipment', 'Charts and specimens']
    },
    {
      name: 'Pathology Laboratory',
      type: 'laboratory',
      description: 'Pathology laboratory for practical training and research',
      establishedYear: 1982,
      equipment: ['Pathological specimens', 'Microscopes', 'Charts']
    },
    {
      name: 'Pharmacy Laboratory',
      type: 'laboratory',
      description: 'Pharmacy and chemical/analytical laboratories for practical training',
      establishedYear: 1982,
      equipment: ['Drug preparation equipment', 'Chemical analysis tools']
    },
    {
      name: 'Museum of Anatomy',
      type: 'museum',
      description: 'Museum of Anatomy equipped with model charts and specimens',
      establishedYear: 1982,
      equipment: ['Anatomical specimens', 'Educational charts', 'Models']
    },
    {
      name: 'Museum of Pathology',
      type: 'museum',
      description: 'Museum of Pathology with model charts and specimens',
      establishedYear: 1982,
      equipment: ['Pathological specimens', 'Educational charts']
    },
    {
      name: 'Museum of Pharmacology',
      type: 'museum',
      description: 'Museum of Pharmacology equipped with model charts and specimens',
      establishedYear: 1982,
      equipment: ['Pharmacological specimens', 'Educational charts']
    },
    {
      name: 'Research Center',
      type: 'research_center',
      description: 'MOCHAM Medical Research Apartment/Laboratory for research and practical training',
      establishedYear: 1982,
      equipment: ['Research equipment', 'Study materials']
    },
    {
      name: 'Library',
      type: 'library',
      description: 'Standard and well equipped library with important medical books, journals and periodicals on different subjects on medical science in general and Homoeopathy / other forms of alternative medicine in particular',
      establishedYear: 1982,
      equipment: ['Medical books', 'Journals', 'Periodicals']
    }
  ]

  for (const facility of facilities) {
    const existing = await prisma.facilityHistory.findFirst({
      where: {
        name: facility.name,
        type: facility.type
      }
    })

    if (existing) {
      await prisma.facilityHistory.update({
        where: { id: existing.id },
        data: facility
      })
    } else {
      await prisma.facilityHistory.create({
        data: facility
      })
    }
  }
  console.log('Updated facilities history')

  console.log('Content update from md.md completed!')
}

if (require.main === module) {
  updateContentFromMd()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export default updateContentFromMd

