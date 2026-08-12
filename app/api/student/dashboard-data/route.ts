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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 1. Fetch user and student profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: {
          include: {
            batch: true
          }
        }
      }
    })

    if (!user || !user.student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 })
    }

    const student = user.student
    const studentId = student.id
    const activeBatchId = student.batchId

    // 2. Fetch all other data in parallel on the server
    const [attendanceRecords, classLinks, classRecordings, enrolledEnrollments, availableBatches] = await Promise.all([
      // Fetch attendance
      prisma.attendance.findMany({
        where: { 
          studentId,
          ...(activeBatchId ? { batchId: activeBatchId } : {})
        },
        orderBy: [{ date: "desc" }, { lectureNo: "desc" }],
        include: {
          batch: { select: { batchNo: true, title: true } },
        },
      }),
      // Fetch class links
      activeBatchId
        ? prisma.classLink.findMany({
            where: { batchId: activeBatchId },
            orderBy: { sentAt: "desc" },
          })
        : Promise.resolve([]),
      // Fetch class recordings
      activeBatchId
        ? prisma.classRecording.findMany({
            where: { batchId: activeBatchId },
            orderBy: { sentAt: "desc" },
          })
        : Promise.resolve([]),
      // Fetch enrolled batches
      prisma.batchEnrollment.findMany({
        where: { studentId },
        include: {
          batch: {
            select: {
              id: true,
              batchNo: true,
              title: true,
              schedule: true,
              status: true,
              fee: true,
            }
          }
        },
        orderBy: { createdAt: "desc" }
      }),
      // Fetch available batches
      prisma.batch.findMany({
        where: {
          hidden: false,
          status: "ACTIVE",
          enrollments: {
            none: { studentId }
          }
        },
        select: {
          id: true,
          batchNo: true,
          title: true,
          schedule: true,
          status: true,
          fee: true,
        },
        orderBy: { createdAt: "desc" }
      })
    ])

    // Compute attendance summary
    const summary = attendanceRecords.reduce(
      (acc, record) => {
        if (record.status === "PRESENT") acc.present += 1
        if (record.status === "ABSENT") acc.absent += 1
        if (record.status === "LEAVE") acc.leave += 1
        return acc
      },
      { present: 0, absent: 0, leave: 0 }
    )

    const formattedAttendance = attendanceRecords.map((record) => ({
      id: record.id,
      lectureNo: record.lectureNo,
      date: record.date,
      status: record.status,
      batchNo: record.batch.batchNo,
      batchTitle: record.batch.title,
    }))

    const activeEnrollment = enrolledEnrollments.find(e => e.batchId === activeBatchId)
    const isPaid = activeEnrollment ? activeEnrollment.paid : student.paid

    return NextResponse.json({
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: student.id,
        rollNo: student.rollNo,
        phone: student.phone,
        city: student.city,
        education: student.education,
        enrollmentType: student.enrollmentType,
        paid: isPaid,
        blocked: student.blocked,
        createdAt: student.createdAt,
        batchId: student.batchId,
        batchNo: student.batch?.batchNo || null,
        batchTitle: student.batch?.title || null,
        batchSchedule: student.batch?.schedule || null,
      },
      attendance: {
        summary,
        records: formattedAttendance,
      },
      classLinks,
      classRecordings,
      batches: {
        enrolled: enrolledEnrollments.map(e => ({
          id: e.batch.id,
          batchNo: e.batch.batchNo,
          title: e.batch.title,
          schedule: e.batch.schedule,
          status: e.batch.status,
          paid: e.paid,
        })),
        available: availableBatches,
        activeBatchId,
      }
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load dashboard data"
    console.error("[api/student/dashboard-data] fetch error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
