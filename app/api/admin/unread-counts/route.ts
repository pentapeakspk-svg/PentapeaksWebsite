import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminSession } from "@/lib/api-auth"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const auth = await verifyAdminSession()
    if (!auth.isValid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const [students, batches, demoClass] = await Promise.all([
      prisma.student.count({ where: { isRead: false } }),
      prisma.batchEnrollment.count({ where: { isRead: false } }),
      prisma.demoClassEnrollment.count({ where: { isRead: false } })
    ])

    return NextResponse.json({ students, batches, demoClass })
  } catch (error) {
    console.error("[api/admin/unread-counts] GET error:", error)
    return NextResponse.json({ error: "Failed to fetch counts" }, { status: 500 })
  }
}
