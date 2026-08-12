import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminSession } from "@/lib/api-auth"
import { classLinkSchema } from "@/lib/validations-schemas"

export const dynamic = "force-dynamic"

export async function GET() {
  // Verify admin session
  const auth = await verifyAdminSession()
  if (!auth.isValid) {
    return NextResponse.json({ error: auth.error }, { status: auth.error?.includes("Forbidden") ? 403 : 401 })
  }

  try {
    const classRecordings = await prisma.classRecording.findMany({ 
      orderBy: { sentAt: "desc" },
      include: { batch: { select: { batchNo: true, title: true } } }
    })
    return NextResponse.json({ classRecordings })
  } catch (error: unknown) {
    console.error("[api/class-recordings] fetch error:", error)
    return NextResponse.json({ classRecordings: [] }, { status: 500 })
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
    
    // Validate input using the same classLinkSchema
    const validated = classLinkSchema.parse(body)
    const recording = await prisma.classRecording.create({
      data: { batchId: validated.batchId, title: validated.title, link: validated.link, note: validated.note || null, attachments: validated.attachments || [] },
    })
    return NextResponse.json({ success: true, recording }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed"
    console.error("[api/class-recordings] create error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
