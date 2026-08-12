import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { processCounselorMessage, getWelcomeMessage } from "@/lib/counselor-agent"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const name = session?.user?.name || "Guest"

  try {
    const { message, history, sessionData } = await req.json()
    if (message === undefined || message === null) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 })
    }

    const reply = await processCounselorMessage(message, history || [], { ...sessionData, name })
    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error("[api/student/counselor] error:", error)
    return NextResponse.json({ error: error.message || "Failed to process request." }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const language = searchParams.get("language") || undefined

  const welcome = getWelcomeMessage(language)
  return NextResponse.json({ welcome })
}
