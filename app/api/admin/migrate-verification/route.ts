import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

/**
 * One-time migration endpoint to mark all existing users as email-verified.
 * This is needed because the emailVerified field defaults to false,
 * which would lock out existing students who registered before email verification was added.
 * 
 * Only accessible by admins. Can be safely called multiple times (idempotent).
 * DELETE this route after running it once in production.
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - admin access required" },
        { status: 401 }
      )
    }

    // Mark all existing users as email-verified
    const result = await prisma.user.updateMany({
      where: {
        emailVerified: false,
        verificationToken: null, // Only update users who don't have a pending verification
      },
      data: {
        emailVerified: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: `Marked ${result.count} existing user(s) as email-verified.`,
      count: result.count,
    })
  } catch (error) {
    console.error("[migrate-verification] error:", error)
    return NextResponse.json(
      { error: "Migration failed" },
      { status: 500 }
    )
  }
}
