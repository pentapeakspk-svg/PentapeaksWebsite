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

    const student = await prisma.student.findUnique({
      where: { id: studentId }
    })

    if (!student || !student.batchId) {
       return NextResponse.json({ links: [] })
    }

    const links = await prisma.classLink.findMany({
      where: { batchId: student.batchId },
      orderBy: { sentAt: "desc" }
    })

    return NextResponse.json({ links })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load class links"
    console.error("[api/student/class-links] fetch error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
