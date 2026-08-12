import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminSession } from "@/lib/api-auth"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const auth = await verifyAdminSession()
    if (!auth.isValid) {
      return NextResponse.json({ error: auth.error }, { status: auth.error?.includes("Forbidden") ? 403 : 401 })
    }

    const enrollments = await prisma.demoClassEnrollment.findMany({
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ enrollments })
  } catch (error: unknown) {
    console.error("[api/demo-class/enroll] GET error:", error)
    return NextResponse.json({ error: "Failed to load enrollments" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, address } = body

    if (!name || !email || !phone || !address) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const enrollment = await prisma.demoClassEnrollment.create({
      data: { name, email, phone, address }
    })

    return NextResponse.json({ enrollment })
  } catch (error: unknown) {
    console.error("[api/demo-class/enroll] POST error:", error)
    return NextResponse.json({ error: "Failed to submit enrollment" }, { status: 500 })
  }
}
