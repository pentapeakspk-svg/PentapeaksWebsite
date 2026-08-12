import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { enrollmentSchema } from "@/lib/validations-schemas"
import { checkRateLimit } from "@/lib/rate-limit"
import { generateSafeRollNo } from "@/lib/rollno-generator"
import { generateVerificationToken, sendVerificationEmail } from "@/lib/resend"

export async function POST(req: Request) {
  try {
    // Rate limit: 5 enrollments per day per IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown"
    const rateLimitCheck = checkRateLimit(ip, "/api/enroll", 5, 24 * 60 * 60 * 1000)
    if (!rateLimitCheck.allowed) {
      const headers = new Headers()
      headers.set("Retry-After", rateLimitCheck.retryAfter?.toString() || "86400")
      return NextResponse.json({ error: rateLimitCheck.error }, { status: 429, headers })
    }

    const body = await req.json()
    
    // Validate input
    const validated = enrollmentSchema.parse(body)
    const { name, email, phone, city, education, enrollmentType, batchId, password } = validated

    // Check existing user
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 400 })

    if (enrollmentType === "BATCH" && !batchId) {
      return NextResponse.json({ error: "Please select a batch" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate roll number (concurrency-safe)
    const rollNo = await generateSafeRollNo(batchId || null, enrollmentType)

    // Generate verification token
    const verificationToken = generateVerificationToken()
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user and student
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        plainPassword: password, // Store original plain text password for admin lookup
        role: "STUDENT",
        emailVerified: false,
        verificationToken,
        verificationTokenExpiry,
        student: {
          create: {
            phone,
            city,
            education: education || null,
            enrollmentType,
            batchId: enrollmentType === "BATCH" ? batchId : null,
            rollNo,
            enrollments: enrollmentType === "BATCH" && batchId ? {
              create: {
                batchId: batchId as string
              }
            } : undefined,
          },
        },
      },
      include: { student: true },
    })

    // Send verification email (non-blocking)
    sendVerificationEmail(email, name, verificationToken).catch((err) =>
      console.error("[api/enroll] verification email error:", err)
    )

    return NextResponse.json({ success: true, rollNo, userId: user.id, requiresVerification: true }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Enrollment failed"
    console.error("[api/enroll] create error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
