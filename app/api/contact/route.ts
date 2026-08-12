import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { contactSchema } from "@/lib/validations-schemas"
import { checkRateLimit } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  // Rate limit: 10 contact inquiries per day per IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown"
  const rateLimitCheck = checkRateLimit(ip, "/api/contact", 10, 24 * 60 * 60 * 1000)
  if (!rateLimitCheck.allowed) {
    const headers = new Headers()
    headers.set("Retry-After", rateLimitCheck.retryAfter?.toString() || "86400")
    return NextResponse.json({ error: rateLimitCheck.error }, { status: 429, headers })
  }
  try {
    const body = await req.json()
    
    // Validate input
    const validated = contactSchema.parse(body)
    
    const inquiry = await prisma.contactInquiry.create({ data: { name: validated.name, email: validated.email, phone: validated.phone || null, subject: validated.subject, message: validated.message } })
    return NextResponse.json({ success: true, id: inquiry.id }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed"
    console.error("[api/contact] create error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const inquiries = await prisma.contactInquiry.findMany({ orderBy: { createdAt: "desc" } })
    return NextResponse.json({ inquiries })
  } catch (error: unknown) {
    console.error("[api/contact] fetch error:", error)
    return NextResponse.json({ inquiries: [] }, { status: 500 })
  }
}
