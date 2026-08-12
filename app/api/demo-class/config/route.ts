import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminSession } from "@/lib/api-auth"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    let config = await prisma.demoClassConfig.findUnique({
      where: { id: "1" }
    })
    
    if (!config) {
      config = await prisma.demoClassConfig.create({
        data: {
          id: "1",
          isActive: false,
          heading: "Join our free Demo Class",
          details: "Learn from industry experts in a comprehensive demo session.",
          detailsRoman: "",
          detailsUrdu: "",
          whatsappLink: ""
        }
      })
    }
    
    return NextResponse.json({ config })
  } catch (error: unknown) {
    console.error("[api/demo-class/config] GET error:", error)
    return NextResponse.json({ error: "Failed to load config" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const auth = await verifyAdminSession()
    if (!auth.isValid) {
      return NextResponse.json({ error: auth.error }, { status: auth.error?.includes("Forbidden") ? 403 : 401 })
    }

    const body = await req.json()
    const { isActive, heading, details, detailsRoman, detailsUrdu, whatsappLink } = body

    const config = await prisma.demoClassConfig.upsert({
      where: { id: "1" },
      update: { isActive, heading, details, detailsRoman, detailsUrdu, whatsappLink },
      create: { id: "1", isActive, heading, details, detailsRoman, detailsUrdu, whatsappLink }
    })

    return NextResponse.json({ config })
  } catch (error: unknown) {
    console.error("[api/demo-class/config] PUT error:", error)
    return NextResponse.json({ error: "Failed to update config" }, { status: 500 })
  }
}
