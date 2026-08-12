import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminSession } from "@/lib/api-auth"

// Cache stats for 30 seconds - fresh enough for a dashboard, avoids a DB hit every open
export const revalidate = 30

async function countSafely(label: string, query: () => Promise<number>) {
  try {
    return await query()
  } catch (error) {
    console.warn(`[api/admin/stats] ${label} count failed:`, error)
    return 0
  }
}

export async function GET() {
  // Verify admin session
  const auth = await verifyAdminSession()
  if (!auth.isValid) {
    return NextResponse.json({ error: auth.error }, { status: auth.error?.includes("Forbidden") ? 403 : 401 })
  }
  try {
    const [totalStudents, activeBatches, supplierForms, buyerInquiries, blogPosts] = await Promise.all([
      countSafely("students", () => prisma.student.count()),
      countSafely("batches", () => prisma.batch.count({ where: { status: "ACTIVE" } })),
      countSafely("suppliers", () => prisma.supplier.count()),
      countSafely("buyer inquiries", () => prisma.buyerInquiry.count()),
      countSafely("blog posts", () => prisma.blogPost.count()),
    ])

    return NextResponse.json({
      totalStudents,
      activeBatches,
      supplierForms,
      buyerInquiries,
      blogPosts,
    })
  } catch (error: unknown) {
    console.error("[api/admin/stats] fetch error:", error)
    const message = error instanceof Error ? error.message : "Failed to load admin stats"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}