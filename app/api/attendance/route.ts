import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminSession } from "@/lib/api-auth"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const auth = await verifyAdminSession()
    if (!auth.isValid) {
      return NextResponse.json({ error: auth.error }, { status: auth.error?.includes("Forbidden") ? 403 : 401 })
    }

    const { searchParams } = new URL(req.url)
    const batchId = searchParams.get("batchId")

    if (!batchId) {
      return NextResponse.json({ error: "Missing batchId" }, { status: 400 })
    }

    const records = await prisma.attendance.findMany({
      where: { batchId },
      orderBy: { lectureNo: "desc" },
      select: { studentId: true, lectureNo: true, status: true, date: true }
    })

    return NextResponse.json({ records })
  } catch (error: unknown) {
    console.error("[api/attendance] GET error:", error)
    return NextResponse.json({ error: "Failed to load past attendance" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Verify admin session
    const auth = await verifyAdminSession()
    if (!auth.isValid) {
      return NextResponse.json({ error: auth.error }, { status: auth.error?.includes("Forbidden") ? 403 : 401 })
    }

    const body = await req.json()
    const { batchId, lectureNo, date, records } = body

    if (!batchId || !Number.isInteger(lectureNo) || !Array.isArray(records)) {
      return NextResponse.json({ error: "Invalid attendance payload" }, { status: 400 })
    }

    const operations = records.map((r: { studentId: string; status: string }) =>
      prisma.attendance.upsert({
        where: { studentId_batchId_lectureNo: { studentId: r.studentId, batchId, lectureNo } },
        update: { status: r.status as "PRESENT" | "ABSENT" | "LEAVE", date: new Date(date) },
        create: { studentId: r.studentId, batchId, lectureNo, status: r.status as "PRESENT" | "ABSENT" | "LEAVE", date: new Date(date) },
      })
    )
    await prisma.$transaction(operations)
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed"
    console.error("[api/attendance] save error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
