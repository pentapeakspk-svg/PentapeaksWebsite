import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyUserSession } from "@/lib/api-auth"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const auth = await verifyUserSession()
    if (!auth.isValid) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }

    const userId = auth.session?.user
      ? ((auth.session.user as Record<string, unknown>).id as string | null | undefined)
      : undefined

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized: Invalid session" }, { status: 401 })
    }

    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: {
          include: {
            batch: true
          }
        }
      }
    })

    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!userProfile.student) {
      return NextResponse.json({ error: "Student profile not linked to this account" }, { status: 400 })
    }

    return NextResponse.json({
      profile: {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        role: userProfile.role,
        studentId: userProfile.student.id,
        rollNo: userProfile.student.rollNo,
        phone: userProfile.student.phone,
        city: userProfile.student.city,
        education: userProfile.student.education,
        enrollmentType: userProfile.student.enrollmentType,
        paid: userProfile.student.paid,
        blocked: userProfile.student.blocked,
        createdAt: userProfile.student.createdAt,
        batchId: userProfile.student.batchId,
        batchNo: userProfile.student.batch?.batchNo || null,
        batchTitle: userProfile.student.batch?.title || null,
        batchSchedule: userProfile.student.batch?.schedule || null,
      }
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load student profile"
    console.error("[api/student/profile] fetch error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
