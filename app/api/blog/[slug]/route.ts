import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminSession } from "@/lib/api-auth"
import { blogSchema } from "@/lib/validations-schemas"

export const dynamic = "force-dynamic"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const post = await prisma.blogPost.findUnique({
      where: { slug }
    })
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }
    
    return NextResponse.json({ post })
  } catch (error: unknown) {
    console.error("[api/blog/[slug]] fetch error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Verify admin session
    const auth = await verifyAdminSession()
    if (!auth.isValid) {
      return NextResponse.json({ error: auth.error }, { status: auth.error?.includes("Forbidden") ? 403 : 401 })
    }

    const { slug: oldSlug } = await params
    const body = await req.json()

    // Validate body
    let validated
    try {
      validated = blogSchema.parse(body)
    } catch (err: any) {
      const issues = err.issues?.map((issue: any) => `${issue.path.join(".")}: ${issue.message}`).join("; ") || "Validation failed"
      return NextResponse.json({ error: `Validation error: ${issues}` }, { status: 400 })
    }

    // Check if post exists
    const existing = await prisma.blogPost.findUnique({
      where: { slug: oldSlug }
    })
    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Check if new slug already exists and belongs to a different post
    if (validated.slug !== oldSlug) {
      const duplicate = await prisma.blogPost.findUnique({
        where: { slug: validated.slug }
      })
      if (duplicate) {
        return NextResponse.json({ error: "Another blog post with this slug already exists" }, { status: 400 })
      }
    }

    const post = await prisma.blogPost.update({
      where: { slug: oldSlug },
      data: {
        title: validated.title,
        slug: validated.slug,
        excerpt: validated.excerpt,
        content: validated.content,
        coverImage: validated.coverImage || null,
        author: validated.author || "Penta Peaks Team",
        published: validated.published || false
      }
    })

    return NextResponse.json({ success: true, post })
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to update blog post"
    console.error("[api/blog/[slug]] PATCH update error:", error)
    return NextResponse.json({ error: errorMsg }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Verify admin session
    const auth = await verifyAdminSession()
    if (!auth.isValid) {
      return NextResponse.json({ error: auth.error }, { status: auth.error?.includes("Forbidden") ? 403 : 401 })
    }

    const { slug } = await params

    // Check if post exists
    const existing = await prisma.blogPost.findUnique({
      where: { slug }
    })
    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    await prisma.blogPost.delete({
      where: { slug }
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to delete blog post"
    console.error("[api/blog/[slug]] DELETE error:", error)
    return NextResponse.json({ error: errorMsg }, { status: 500 })
  }
}
