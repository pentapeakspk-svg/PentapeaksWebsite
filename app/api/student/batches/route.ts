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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { student: true },
    })

    if (!user || !user.student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 })
    }

    const studentId = user.student.id

    // Fetch enrolled batches
    const enrolled = await prisma.batchEnrollment.findMany({
      where: { studentId },
      include: {
        batch: {
          select: {
            id: true,
            batchNo: true,
            title: true,
            schedule: true,
            status: true,
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    // Fetch other active, unjoined batches
    const available = await prisma.batch.findMany({
      where: {
        hidden: false,
        status: "ACTIVE", // Or UPCOMING, maybe we allow both
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
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({
      enrolled: enrolled.map(e => ({
        id: e.batch.id,
        batchNo: e.batch.batchNo,
        title: e.batch.title,
        schedule: e.batch.schedule,
        status: e.batch.status,
        paid: e.paid,
      })),
      activeBatchId: user.student.batchId,
      available,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load batches"
    console.error("[api/student/batches] GET error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: Request) {
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { student: true },
    })

    if (!user || !user.student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 })
    }

    const studentId = user.student.id
    const { action, batchId } = await req.json()

    if (!action || !batchId) {
      return NextResponse.json({ error: "Missing action or batchId" }, { status: 400 })
    }

    if (action === "join") {
      // 1. Create enrollment
      await prisma.batchEnrollment.upsert({
        where: {
          studentId_batchId: { studentId, batchId }
        },
        update: {},
        create: { studentId, batchId }
      })

      // 2. If student has no active batch, set this as active
      if (!user.student.batchId) {
        await prisma.student.update({
          where: { id: studentId },
          data: { batchId }
        })
      }

      return NextResponse.json({ success: true, message: "Enrolled in batch successfully." })
    }

    if (action === "leave") {
      // 1. Remove enrollment
      await prisma.batchEnrollment.deleteMany({
        where: { studentId, batchId }
      })

      // 2. If this was the active batch, switch to another batch or set to null
      if (user.student.batchId === batchId) {
        const otherEnrollment = await prisma.batchEnrollment.findFirst({
          where: { studentId },
          select: { batchId: true }
        })
        await prisma.student.update({
          where: { id: studentId },
          data: { batchId: otherEnrollment?.batchId || null }
        })
      }

      return NextResponse.json({ success: true, message: "Left batch successfully." })
    }

    if (action === "switch") {
      // 1. Verify enrollment exists
      const enrolled = await prisma.batchEnrollment.findUnique({
        where: {
          studentId_batchId: { studentId, batchId }
        }
      })

      if (!enrolled) {
        return NextResponse.json({ error: "You are not enrolled in this batch" }, { status: 400 })
      }

      // 2. Update active batch
      await prisma.student.update({
        where: { id: studentId },
        data: { batchId }
      })

      return NextResponse.json({ success: true, message: "Switched active batch successfully." })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to perform action"
    console.error("[api/student/batches] POST error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
