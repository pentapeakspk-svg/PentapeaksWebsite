import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminSession } from "@/lib/api-auth"
import { blogSchema } from "@/lib/validations-schemas"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } })
    return NextResponse.json({ posts })
  } catch (error: unknown) {
    console.error("[api/blog] fetch error:", error)
    return NextResponse.json({ posts: [] }, { status: 500 })
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
    const validated = blogSchema.parse(body)
    
    const post = await prisma.blogPost.create({
      data: { title: validated.title, slug: validated.slug, excerpt: validated.excerpt, content: validated.content, coverImage: validated.coverImage || null, author: validated.author || "Penta Peaks Team", published: validated.published || false },
    })
    return NextResponse.json({ post }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed"
    console.error("[api/blog] create error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
