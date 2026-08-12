import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminSession } from "@/lib/api-auth"

export const dynamic = "force-dynamic"

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await verifyAdminSession()
    if (!auth.isValid) {
      return NextResponse.json({ error: auth.error }, { status: auth.error?.includes("Forbidden") ? 403 : 401 })
    }

    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: "Missing student ID" }, { status: 400 })
    }

    const student = await prisma.student.findUnique({ where: { id } })
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Since onDelete: Cascade is not set in Prisma schema,
    // we must delete dependent records in order within a transaction.
    await prisma.$transaction([
      prisma.attendance.deleteMany({ where: { studentId: id } }),
      prisma.student.delete({ where: { id } }),
      prisma.user.delete({ where: { id: student.userId } })
    ])

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete student"
    console.error("[api/students/delete] error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await verifyAdminSession()
    if (!auth.isValid) {
      return NextResponse.json({ error: auth.error }, { status: auth.error?.includes("Forbidden") ? 403 : 401 })
    }

    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: "Missing student ID" }, { status: 400 })
    }

    const body = await req.json()
    const { paid, blocked, batchId: bodyBatchId } = body

    const updateData: any = {}
    if (typeof paid === "boolean") {
      updateData.paid = paid
    }
    if (typeof blocked === "boolean") {
      updateData.blocked = blocked
    }
    if (bodyBatchId !== undefined) {
      updateData.batchId = bodyBatchId
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    const student = await prisma.student.update({
      where: { id },
      data: updateData,
    })

    // If paid status is updated, also synchronize the BatchEnrollment record
    if (typeof paid === "boolean") {
      const targetBatchId = bodyBatchId || student.batchId
      if (targetBatchId) {
        await prisma.batchEnrollment.upsert({
          where: {
            studentId_batchId: { studentId: id, batchId: targetBatchId }
          },
          update: { paid },
          create: { studentId: id, batchId: targetBatchId, paid }
        })
      }
    }

    return NextResponse.json({ success: true, student })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update student"
    console.error("[api/students/patch] error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

