import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const batches = await prisma.batch.findMany({
      where: {
        status: { in: ["UPCOMING", "ACTIVE"] },
        hidden: false,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        batchNo: true,
        title: true,
        startDate: true,
        status: true,
        fee: true,
      }
    })
    return NextResponse.json({ batches })
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to fetch batches"
    console.error("[api/public/batches] fetch error:", errorMsg)
    return NextResponse.json({ error: "Failed to fetch batches", batches: [] }, { status: 500 })
  }
}
