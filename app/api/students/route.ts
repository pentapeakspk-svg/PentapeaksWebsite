import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminSession } from "@/lib/api-auth"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  // Verify admin session
  const auth = await verifyAdminSession()
  if (!auth.isValid) {
    return NextResponse.json({ error: auth.error }, { status: auth.error?.includes("Forbidden") ? 403 : 401 })
  }
  try {
    const { searchParams } = new URL(req.url)
    const batchId = searchParams.get("batchId")

    let students
    if (batchId) {
      const enrollments = await prisma.batchEnrollment.findMany({
        where: { batchId },
        include: {
          student: {
            include: {
              user: { select: { name: true, email: true, password: true, plainPassword: true } },
              batch: { select: { id: true, batchNo: true, title: true } }
            }
          }
        },
        orderBy: { createdAt: "desc" }
      })
      students = enrollments
        .filter(e => e.student !== null)
        .map(e => ({
          ...e.student,
          paid: e.paid // Override student.paid with the enrollment paid status
        }))
    } else {
      students = await prisma.student.findMany({
        include: { 
          user: { select: { name: true, email: true, password: true, plainPassword: true } }, 
          batch: { select: { id: true, batchNo: true, title: true } },
          enrollments: {
            include: {
              batch: { select: { id: true, batchNo: true, title: true } }
            }
          }
        },
        orderBy: { createdAt: "desc" },
      })
    }
    return NextResponse.json({ students })
  } catch (error: unknown) {
    console.error("[api/students] fetch error:", error)
    return NextResponse.json({ students: [] }, { status: 500 })
  }
}
