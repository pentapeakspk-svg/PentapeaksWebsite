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
    const classLinks = await prisma.classLink.findMany({ 
      orderBy: { sentAt: "desc" },
      include: { batch: { select: { batchNo: true, title: true } } }
    })
    return NextResponse.json({ classLinks })
  } catch (error: unknown) {
    console.error("[api/class-links] fetch error:", error)
    return NextResponse.json({ classLinks: [] }, { status: 500 })
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
    
    // Validate input
    const validated = classLinkSchema.parse(body)
    const link = await prisma.classLink.create({
      data: { batchId: validated.batchId, title: validated.title, link: validated.link, note: validated.note || null, attachments: validated.attachments || [] },
    })
    return NextResponse.json({ success: true, link }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed"
    console.error("[api/class-links] create error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
