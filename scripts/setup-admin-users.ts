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

// Allowed admin emails
const ALLOWED_ADMIN_EMAILS = [
  {
    email: 'mochamschool@gmail.com',
    name: 'MOCHAM School Admin',
    firstName: 'MOCHAM',
    lastName: 'School Admin'
  },
  {
    email: 'inyeneita1@gmail.com',
    name: 'Inyene Ita Admin',
    firstName: 'Inyene',
    lastName: 'Ita'
  }
]

async function setupAdminUsers() {
  console.log('🔄 Setting up admin users...\n')

  let createdCount = 0
  let updatedCount = 0

  for (const adminData of ALLOWED_ADMIN_EMAILS) {
    const normalizedEmail = adminData.email.toLowerCase().trim()
    
    try {
      // Check if admin user already exists
      const existingAdmin = await prisma.adminUser.findUnique({
        where: { email: normalizedEmail }
      })

      if (existingAdmin) {
        // Update to ensure it's active
        if (!existingAdmin.isActive) {
          await prisma.adminUser.update({
            where: { id: existingAdmin.id },
            data: {
              isActive: true,
              name: adminData.name,
              firstName: adminData.firstName,
              lastName: adminData.lastName
            }
          })
          updatedCount++
          console.log(`   ✅ Updated: ${normalizedEmail} (reactivated)`)
        } else {
          console.log(`   ℹ️  Already exists: ${normalizedEmail}`)
        }
      } else {
        // Create new admin user
        await prisma.adminUser.create({
          data: {
            email: normalizedEmail,
            name: adminData.name,
            firstName: adminData.firstName,
            lastName: adminData.lastName,
            isActive: true
          }
        })
        createdCount++
        console.log(`   ✅ Created: ${normalizedEmail}`)
      }
    } catch (error) {
      console.error(`   ❌ Error processing ${normalizedEmail}:`, error)
    }
  }

  console.log(`\n✅ Admin users setup completed!`)
  console.log(`   - Created: ${createdCount} new admin users`)
  console.log(`   - Updated: ${updatedCount} existing admin users`)
  console.log(`   - Total allowed emails: ${ALLOWED_ADMIN_EMAILS.length}`)
  console.log(`\n📧 Allowed admin emails:`)
  ALLOWED_ADMIN_EMAILS.forEach(admin => {
    console.log(`   - ${admin.email}`)
  })
}

if (require.main === module) {
  setupAdminUsers()
    .catch((e) => {
      console.error('❌ Error:', e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export default setupAdminUsers

