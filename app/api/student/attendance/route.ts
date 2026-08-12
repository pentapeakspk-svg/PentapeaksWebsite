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

    const studentId = auth.session?.user
      ? ((auth.session.user as Record<string, unknown>).studentId as string | null | undefined)
      : undefined

    if (!studentId) {
      return NextResponse.json({ error: "Student profile not linked to this account" }, { status: 400 })
    }

    const records = await prisma.attendance.findMany({
      where: { studentId },
      orderBy: [{ date: "desc" }, { lectureNo: "desc" }],
      include: {
        batch: { select: { batchNo: true, title: true } },
      },
    })

    const summary = records.reduce(
      (acc, record) => {
        if (record.status === "PRESENT") acc.present += 1
        if (record.status === "ABSENT") acc.absent += 1
        if (record.status === "LEAVE") acc.leave += 1
        return acc
      },
      { present: 0, absent: 0, leave: 0 }
    )

    return NextResponse.json({
      summary,
      records: records.map((record) => ({
        id: record.id,
        lectureNo: record.lectureNo,
        date: record.date,
        status: record.status,
        batchNo: record.batch.batchNo,
        batchTitle: record.batch.title,
      })),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load attendance"
    console.error("[api/student/attendance] fetch error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}