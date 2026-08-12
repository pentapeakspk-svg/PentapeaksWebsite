import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminSession } from "@/lib/api-auth"
import { batchSchema } from "@/lib/validations-schemas"
import { checkRateLimit } from "@/lib/rate-limit"
import { parseFlexibleDate } from "@/lib/date-parser"

export const dynamic = "force-dynamic"

export async function GET() {
  // Verify admin session
  const auth = await verifyAdminSession()
  if (!auth.isValid) {
    return NextResponse.json({ error: auth.error }, { status: auth.error?.includes("Forbidden") ? 403 : 401 })
  }
  try {
    const batches = await prisma.batch.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { students: true } } },
    })
    return NextResponse.json({ batches })
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to fetch batches"
    // Handle Supabase pooler prepared statement error
    if (errorMsg.includes("already exists") || errorMsg.includes("ConnectorError")) {
      console.error("[api/batches] Pooler connection issue:", errorMsg)
      return NextResponse.json(
        { error: "Database connection issue. Please try again.", batches: [] },
        { status: 500 }
      )
    }
    console.error("[api/batches] fetch error:", error)
    return NextResponse.json({ error: errorMsg, batches: [] }, { status: 500 })
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
    let validated
    try {
      validated = batchSchema.parse(body)
    } catch (validationError: unknown) {
      const zodError = validationError as any
      const issues = zodError.issues?.map((issue: any) => `${issue.path.join(".")}: ${issue.message}`).join("; ") || "Validation failed"
      return NextResponse.json({ error: `Validation error: ${issues}` }, { status: 400 })
    }

    // Parse dates with better error handling
    const startDate = validated.startDate ? parseFlexibleDate(validated.startDate) : null
    const endDate = validated.endDate ? parseFlexibleDate(validated.endDate) : null
    
    if (validated.startDate && !startDate) {
      return NextResponse.json({ error: `Invalid start date format: "${validated.startDate}". Use MM/DD/YYYY, DD/Mon/YYYY, or YYYY-MM-DD` }, { status: 400 })
    }
    if (validated.endDate && !endDate) {
      return NextResponse.json({ error: `Invalid end date format: "${validated.endDate}". Use MM/DD/YYYY, DD/Mon/YYYY, or YYYY-MM-DD` }, { status: 400 })
    }

    const batch = await prisma.batch.create({
      data: {
        batchNo: validated.batchNo,
        title: validated.title,
        description: validated.description || null,
        status: validated.status || "UPCOMING",
        startDate,
        endDate,
        fee: validated.fee,
      },
    })
    return NextResponse.json({ batch }, { status: 201 })
  } catch (error: unknown) {
    let errorMsg = error instanceof Error ? error.message : "Failed to create batch"
    console.error("[api/batches] create error:", error)
    
    if (errorMsg.includes("Unique constraint failed") && errorMsg.includes("batchNo")) {
      errorMsg = "A batch with this Batch Number already exists. Please use a unique Batch No."
      return NextResponse.json({ error: errorMsg }, { status: 400 })
    }
    
    // Handle Supabase pooler prepared statement error
    if (errorMsg.includes("already exists") || errorMsg.includes("ConnectorError")) {
      return NextResponse.json(
        { error: "Database connection issue. Please try again or refresh the page." },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ error: errorMsg }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await verifyAdminSession()
    if (!auth.isValid) {
      return NextResponse.json({ error: auth.error }, { status: auth.error?.includes("Forbidden") ? 403 : 401 })
    }

    const { searchParams } = new URL(req.url)
    const batchId = searchParams.get("batchId")

    if (!batchId) {
      return NextResponse.json({ error: "batchId is required" }, { status: 400 })
    }

    // Retry logic for pooler errors
    let attempt = 0
    const maxRetries = 2
    
    while (attempt <= maxRetries) {
      try {
        const rollNoCounterTable = await prisma.$queryRaw<Array<{ exists: string | null }>>`
          SELECT to_regclass('public."RollNoCounter"')::text AS exists
        `

        const operations = [
          prisma.attendance.deleteMany({ where: { batchId } }),
          prisma.classLink.deleteMany({ where: { batchId } }),
          prisma.student.updateMany({ where: { batchId }, data: { batchId: null } }),
          prisma.batch.delete({ where: { id: batchId } }),
        ]

        if (rollNoCounterTable[0]?.exists) {
          operations.splice(3, 0, prisma.rollNoCounter.deleteMany({ where: { batchId } }))
        }

        await prisma.$transaction(operations)
        return NextResponse.json({ success: true })
      } catch (error: any) {
        const errorMsg = error.message || ""
        const isPoolerError = errorMsg.includes("prepared statement") || errorMsg.includes("already exists") || errorMsg.includes("ConnectorError")
        
        if (isPoolerError && attempt < maxRetries) {
          attempt++
          console.warn(`[api/batches] Delete attempt ${attempt} failed due to pooler error. Retrying...`)
          await new Promise(r => setTimeout(r, 500)) // Wait 500ms before retry
          continue
        }
        
        console.error("[api/batches] delete error:", error)
        if (isPoolerError) {
          return NextResponse.json(
            { error: "Database connection issue. Please try again or refresh the page." },
            { status: 500 }
          )
        }
        return NextResponse.json({ error: errorMsg }, { status: 500 })
      }
    }
    
    return NextResponse.json({ error: "Failed to delete batch after retries" }, { status: 500 })
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: errorMsg }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await verifyAdminSession()
    if (!auth.isValid) {
      return NextResponse.json({ error: auth.error }, { status: auth.error?.includes("Forbidden") ? 403 : 401 })
    }

    const { searchParams } = new URL(req.url)
    const batchId = searchParams.get("batchId")

    if (!batchId) {
      return NextResponse.json({ error: "batchId is required" }, { status: 400 })
    }

    const body = await req.json()
    const { hidden, status, title, description, startDate, endDate, batchNo, schedule, fee } = body

    const updateData: any = {}
    if (fee !== undefined) {
      updateData.fee = parseInt(fee) || 0
    }

    if (hidden !== undefined) {
      if (typeof hidden !== "boolean") {
        return NextResponse.json({ error: "hidden must be a boolean value" }, { status: 400 })
      }
      updateData.hidden = hidden
    }

    if (status !== undefined) {
      if (typeof status !== "string") {
        return NextResponse.json({ error: "status must be a string" }, { status: 400 })
      }
      updateData.status = status
    }

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (batchNo !== undefined) updateData.batchNo = batchNo
    if (schedule !== undefined) updateData.schedule = schedule

    if (startDate !== undefined) {
      updateData.startDate = startDate ? parseFlexibleDate(startDate) : null
    }
    if (endDate !== undefined) {
      updateData.endDate = endDate ? parseFlexibleDate(endDate) : null
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields provided to update" }, { status: 400 })
    }

    const batch = await prisma.batch.update({
      where: { id: batchId },
      data: updateData,
    })

    return NextResponse.json({ success: true, batch })
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to update batch"
    console.error("[api/batches] PATCH update error:", error)
    return NextResponse.json({ error: errorMsg }, { status: 500 })
  }
}

