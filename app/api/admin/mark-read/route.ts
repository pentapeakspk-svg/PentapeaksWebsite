import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminSession } from "@/lib/api-auth"

export async function POST(req: Request) {
  try {
    const auth = await verifyAdminSession()
    if (!auth.isValid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { type } = body

    if (type === "students") {
      await prisma.student.updateMany({ where: { isRead: false }, data: { isRead: true } })
    } else if (type === "batches") {
      await prisma.batchEnrollment.updateMany({ where: { isRead: false }, data: { isRead: true } })
    } else if (type === "demoClass") {
      await prisma.demoClassEnrollment.updateMany({ where: { isRead: false }, data: { isRead: true } })
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[api/admin/mark-read] POST error:", error)
    return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 })
  }
}
