import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import DashboardClient from "./DashboardClient"

// Fetch all stats in parallel, directly from DB on the server
async function getAdminStats() {
  const [totalStudents, activeBatches, supplierForms, buyerInquiries, blogPosts] =
    await Promise.all([
      prisma.student.count().catch(() => 0),
      prisma.batch.count({ where: { status: "ACTIVE" } }).catch(() => 0),
      prisma.supplier.count().catch(() => 0),
      prisma.buyerInquiry.count().catch(() => 0),
      prisma.blogPost.count().catch(() => 0),
    ])

  return { totalStudents, activeBatches, supplierForms, buyerInquiries, blogPosts }
}

// Revalidate every 30 seconds - stats don't need to be real-time to the millisecond
export const revalidate = 30

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) redirect("/student/login")
  if ((session.user as any)?.role !== "ADMIN") redirect("/student/dashboard")

  // Data is fetched here on the server - zero client-side waterfall
  const stats = await getAdminStats()

  return (
    <DashboardClient
      stats={stats}
      adminName={session.user?.name || "Administrator"}
    />
  )
}
