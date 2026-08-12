import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateVerificationToken, sendVerificationEmail } from "@/lib/resend"
import { checkRateLimit } from "@/lib/rate-limit"

export async function POST(req: Request) {
  try {
    // Rate limit: 3 resend requests per hour per IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown"
    const rateLimitCheck = checkRateLimit(ip, "/api/auth/resend-verification", 3, 60 * 60 * 1000)
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal whether email exists for security
      return NextResponse.json(
        { message: "If an account exists with this email, a verification link has been sent." },
        { status: 200 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email is already verified. You can log in." },
        { status: 200 }
      )
    }

    // Generate new token
    const token = generateVerificationToken()
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: token,
        verificationTokenExpiry: expiry,
      },
    })

    // Send verification email
    const emailResult = await sendVerificationEmail(user.email, user.name, token)

    if (!emailResult.success) {
      console.error("[resend-verification] failed to send email:", emailResult.error)
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "Verification email sent! Please check your inbox." },
      { status: 200 }
    )
  } catch (error) {
    console.error("[resend-verification] error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
