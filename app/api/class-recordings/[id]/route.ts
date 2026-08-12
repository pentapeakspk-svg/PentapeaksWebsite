import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminSession } from "@/lib/api-auth"

export const dynamic = "force-dynamic"

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await verifyAdminSession()
    if (!auth.isValid) {
      return NextResponse.json({ error: auth.error }, { status: auth.error?.includes("Forbidden") ? 403 : 401 })
    }

    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: "Missing recording ID" }, { status: 400 })
    }

    await prisma.classRecording.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete class recording"
    console.error("[api/class-recordings/delete] error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
