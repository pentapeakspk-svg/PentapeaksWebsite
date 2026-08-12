import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendWelcomeEmailResend } from "@/lib/resend"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const token = body.token

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      )
    }

    // Find user with this verification token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
      include: { student: { include: { batch: true } } },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Invalid verification token. The link may have already been used or is invalid." },
        { status: 400 }
      )
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email already verified", alreadyVerified: true },
        { status: 200 }
      )
    }

    // Check token expiry
    if (user.verificationTokenExpiry && new Date() > user.verificationTokenExpiry) {
      return NextResponse.json(
        { error: "Verification link has expired. Please request a new one." },
        { status: 400 }
      )
    }

    // Mark user as verified and clear the token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    })

    // Send welcome email (non-blocking - don't fail verification if this errors)
    if (user.student?.rollNo) {
      sendWelcomeEmailResend(user.email, user.name, user.student.rollNo).catch(
        (err) => console.error("[verify-email] welcome email failed:", err)
      )
    }

    return NextResponse.json(
      { 
        message: "Email verified successfully!",
        verified: true,
        name: user.name,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[verify-email] error:", error)
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    )
  }
}
