import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { emailVerified: true },
    })

    if (!user) {
      // Don't reveal whether email exists
      return NextResponse.json({ verified: false }, { status: 200 })
    }

    return NextResponse.json(
      { verified: user.emailVerified },
      { status: 200 }
    )
  } catch (error) {
    console.error("[verification-status] error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
