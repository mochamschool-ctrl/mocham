import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const modelMap: Record<string, any> = {
  // Main content models
  programs: prisma.program,
  services: prisma.service,
  doctors: prisma.doctor,
  news: prisma.news,
  testimonials: prisma.testimonial,
  applications: prisma.application,
  appointments: prisma.appointment,
  contact_messages: prisma.contactMessage,
  contactmessages: prisma.contactMessage, // Backward compatibility
  publications: prisma.publication,
  research_studies: prisma.researchStudy,
  researchstudies: prisma.researchStudy, // Backward compatibility
  collaborations: prisma.collaboration,
  achievements: prisma.achievement,
  history_events: prisma.historyEvent,
  historyevents: prisma.historyEvent, // Backward compatibility
  college_history_events: prisma.collegeHistoryEvent,
  collegehistoryevents: prisma.collegeHistoryEvent, // Backward compatibility
  academic_programs_history: prisma.academicProgramHistory,
  academicprogramshistory: prisma.academicProgramHistory, // Backward compatibility
  facility_history: prisma.facilityHistory,
  facilityhistory: prisma.facilityHistory, // Backward compatibility
  legacy_achievements: prisma.legacyAchievement,
  legacyachievements: prisma.legacyAchievement, // Backward compatibility
  historical_documents: prisma.historicalDocument,
  historicaldocuments: prisma.historicalDocument, // Backward compatibility
  founder_info: prisma.founderInfo,
  founderinfo: prisma.founderInfo, // Backward compatibility
  // User management
  users: prisma.user,
  admin_users: prisma.adminUser,
  adminusers: prisma.adminUser, // Backward compatibility
  // Student data
  student_grades: prisma.studentGrade,
  studentgrades: prisma.studentGrade, // Backward compatibility
  student_certificates: prisma.studentCertificate,
  studentcertificates: prisma.studentCertificate, // Backward compatibility
  student_schedules: prisma.studentSchedule,
  studentschedules: prisma.studentSchedule, // Backward compatibility
  // Gallery
  gallery: prisma.gallery,
  // Course management
  courses: prisma.course,
  course_enrollments: prisma.courseEnrollment,
  courseenrollments: prisma.courseEnrollment, // Backward compatibility
}

async function verifyAdminSession(request: NextRequest) {
  // For now, let's make admin APIs accessible without session verification
  // since we're using localStorage on the client side
  return true
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ model: string }> }
) {
  const resolvedParams = await params
  
  try {
    await verifyAdminSession(request)
    const model = modelMap[resolvedParams.model]
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      )
    }

    // For student-related models, include user information
    const includeUser = ['student_grades', 'student_certificates', 'student_schedules'].includes(resolvedParams.model)
    const includeRelations = resolvedParams.model === 'course_enrollments' ? { user: true, course: true } : 
                           includeUser ? { user: true } : undefined
    
    const records = await model.findMany({
      include: includeRelations,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(records)
  } catch (error) {
    console.error(`Admin GET ${resolvedParams.model} error:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch records' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ model: string }> }
) {
  const resolvedParams = await params
  
  try {
    await verifyAdminSession(request)
    const model = modelMap[resolvedParams.model]
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    
    // Handle array fields
    const processedBody = { ...body }
    Object.keys(processedBody).forEach(key => {
      if (typeof processedBody[key] === 'string' && processedBody[key].includes(',')) {
        processedBody[key] = processedBody[key].split(',').map((item: string) => item.trim())
      }
    })

    const record = await model.create({
      data: processedBody
    })

    return NextResponse.json(record)
  } catch (error) {
    console.error(`Admin POST ${resolvedParams.model} error:`, error)
    return NextResponse.json(
      { error: 'Failed to create record' },
      { status: 500 }
    )
  }
}
