import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { supplierSchema } from "@/lib/validations-schemas"
import { checkRateLimit } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  // Rate limit: 20 supplier submissions per day per IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown"
  const rateLimitCheck = checkRateLimit(ip, "/api/supplier", 20, 24 * 60 * 60 * 1000)
  if (!rateLimitCheck.allowed) {
    const headers = new Headers()
    headers.set("Retry-After", rateLimitCheck.retryAfter?.toString() || "86400")
    return NextResponse.json({ error: rateLimitCheck.error }, { status: 429, headers })
  }
  try {
    const body = await req.json()
    
    // Validate input
    const validated = supplierSchema.parse(body)
    
    const supplier = await prisma.supplier.create({ data: { companyName: validated.companyName, contactPerson: validated.contactPerson, email: validated.email, phone: validated.phone, country: validated.country, products: validated.products, exportCapacity: validated.exportCapacity, certifications: validated.certifications || null, message: validated.message || null } })
    return NextResponse.json({ success: true, id: supplier.id }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed"
    console.error("[api/supplier] create error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({ orderBy: { createdAt: "desc" } })
    return NextResponse.json({ suppliers })
  } catch (error: unknown) {
    console.error("[api/supplier] fetch error:", error)
    return NextResponse.json({ suppliers: [] }, { status: 500 })
  }
}
