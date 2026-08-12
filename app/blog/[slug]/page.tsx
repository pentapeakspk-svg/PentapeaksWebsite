"use client"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, User, ArrowLeft, Loader2 } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string | null
  author: string
  published: boolean
  createdAt: string
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string

  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadPost() {
      try {
        const res = await fetch(`/api/blog/${slug}`)
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || "Failed to load article")
        }
        setPost(data.post)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (slug) {
      loadPost()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-bg flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-accent" />
        <p className="text-text-muted font-medium">Loading article...</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-bg flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-dark">Article Not Found</h2>
        <p className="text-text-muted max-w-md">{error || "The requested blog post could not be found or is not published yet."}</p>
        <Link href="/blog" className="inline-flex items-center gap-2 text-accent hover:underline mt-4">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-gray-bg min-h-screen">
      {/* ══ HERO BANNER ══ */}
      <section style={{ position: "relative", height: "70vh", minHeight: "450px", maxHeight: "700px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#050E1A", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          {post.coverImage ? (
            <img src={post.coverImage} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <img src="/images/Export9.webp" alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(5,14,26,.85) 0%,rgba(5,14,26,.65) 100%)" }} />
        </div>
        <div className="relative z-10 sec-wrap" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
          <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-semibold text-accent tracking-widest uppercase hover:underline mb-4">
            <ArrowLeft className="w-3 h-3" /> Back to Blog
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-display)] mb-4 px-4 leading-tight" style={{ color: "#ffffff", maxWidth: "800px" }}>
            {post.title}
          </h1>
          <div className="flex items-center gap-6 mt-2 text-sm text-gray-300">
            <span className="flex items-center gap-2"><User className="w-4 h-4 text-accent" /> {post.author}</span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" /> 
              {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
        </div>
      </section>

      {/* ══ CONTENT SECTION ══ */}
      <section className="sec-pad" style={{ background: "#ffffff" }}>
        <div className="sec-wrap-sm">
          <article className="prose prose-lg max-w-none text-text-dark">
            <p className="text-xl text-text-muted leading-relaxed font-light mb-8 italic border-l-4 border-accent pl-4">
              {post.excerpt}
            </p>
            <div className="space-y-6 text-text-body leading-relaxed font-light" style={{ fontSize: "1.05rem" }}>
              {post.content.split("\n").map((paragraph, idx) => {
                const trimmed = paragraph.trim()
                if (!trimmed) return null
                return <p key={idx}>{trimmed}</p>
              })}
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}
