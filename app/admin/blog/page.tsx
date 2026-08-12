"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FileText, PlusCircle, Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import { prefetch, invalidate } from "@/lib/admin-cache"

interface Post { id: string; title: string; slug: string; excerpt: string; content: string; coverImage: string | null; author: string; published: boolean; createdAt: string }

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", coverImage: "", author: "Penta Peaks Team", published: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 80 * 1024) {
      alert("Image size must be under 80KB")
      return
    }

    if (file.type !== "image/webp") {
      alert("Only WebP files are allowed")
      return
    }

    setUploadingImage(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to upload image")

      setForm((p) => ({ ...p, coverImage: data.url }))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const fetchPosts = async () => {
    try {
      invalidate("/api/blog")
      const data = await prefetch("/api/blog")
      setPosts(data.posts || [])
      setError("")
    } catch (error) {
      console.error("[admin/blog] fetch error:", error)
      setError(error instanceof Error ? error.message : "Failed to load blog posts")
      setPosts([])
    }
  }

  useEffect(() => { fetchPosts() }, [])

  const autoSlug = (title: string) => title.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-")

  const handleEditStart = (post: Post) => {
    setEditingPost(post)
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage || "",
      author: post.author,
      published: post.published
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingPost(null)
    setForm({ title: "", slug: "", excerpt: "", content: "", coverImage: "", author: "Penta Peaks Team", published: false })
  }

  const handleDelete = async (slug: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete post "${title}"?`)) return

    setError("")
    try {
      const res = await fetch(`/api/blog/${encodeURIComponent(slug)}`, {
        method: "DELETE"
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete post")
      }

      await fetchPosts()
    } catch (error) {
      console.error("[admin/blog] delete error:", error)
      setError(error instanceof Error ? error.message : "Failed to delete post")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let res
      if (editingPost) {
        res = await fetch(`/api/blog/${encodeURIComponent(editingPost.slug)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        })
      } else {
        res = await fetch("/api/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        })
      }

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `Failed to ${editingPost ? "update" : "create"} post`)
      }

      handleCloseForm()
      await fetchPosts()
    } catch (error) {
      console.error("[admin/blog] submit error:", error)
      setError(error instanceof Error ? error.message : `Failed to ${editingPost ? "update" : "create"} post`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 pb-16 bg-gray-bg min-h-screen">
      <div className="sec-wrap">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold font-[family-name:var(--font-display)] text-text-dark"><FileText className="w-8 h-8 text-primary inline mr-2" />Blog CMS</h1>
            <button 
              onClick={() => { if (showForm) { handleCloseForm() } else { setShowForm(true) } }} 
              className="btn-primary text-sm"
            >
              <PlusCircle className="w-4 h-4" /> {editingPost ? "Edit Mode" : "New Post"}
            </button>
          </div>

          {showForm && (
            <div className="admin-card mb-8">
              <h3 className="text-lg font-bold mb-4">{editingPost ? "Edit Blog Post" : "Create Post"}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="block text-sm text-text-muted mb-1">Title *</label><input required className="input-field" value={form.title} onChange={e => { setForm(p => ({ ...p, title: e.target.value, slug: autoSlug(e.target.value) })) }} /></div>
                <div><label className="block text-sm text-text-muted mb-1">Slug</label><input className="input-field" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} /></div>
                <div><label className="block text-sm text-text-muted mb-1">Excerpt *</label><textarea required rows={2} className="input-field" value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} /></div>
                <div><label className="block text-sm text-text-muted mb-1">Content (Markdown) *</label><textarea required rows={10} className="input-field font-[family-name:var(--font-mono)] text-sm" value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} /></div>
                <div>
                  <label className="block text-sm text-text-muted mb-1">Cover Image (WebP only, Max 80KB)</label>
                  <div className="flex items-center gap-4">
                    <input type="file" accept=".webp,image/webp" onChange={handleImageUpload} disabled={uploadingImage} className="text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#1A5F7A]/10 file:text-[#1A5F7A] hover:file:bg-[#1A5F7A]/20 cursor-pointer" />
                    {uploadingImage && <span className="text-sm text-[#C8963E]">Uploading...</span>}
                  </div>
                  {form.coverImage && (
                    <div className="mt-2">
                      <img src={form.coverImage} alt="Cover preview" className="h-24 w-auto object-cover rounded border border-[#DDD8CF]" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.published} onChange={e => setForm(p => ({ ...p, published: e.target.checked }))} className="w-4 h-4" />
                    <span className="text-sm text-text-muted">Publish immediately</span>
                  </label>
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? (editingPost ? "Updating..." : "Creating...") : (editingPost ? "Update Post" : "Create Post")}
                  </button>
                  <button type="button" onClick={handleCloseForm} className="btn-outline">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <div className="admin-card overflow-x-auto" style={{padding:0}}>
            <table className="table-premium">
              <thead><tr><th>Title</th><th>Slug</th><th>Author</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-text-muted">No blog posts yet. Create your first post above.</td></tr>
                ) : posts.map(p => (
                  <tr key={p.id}>
                    <td className="text-primary">{p.title}</td>
                    <td className="text-text-muted">{p.slug}</td>
                    <td>{p.author}</td>
                    <td>{p.published ? <span className="text-primary flex items-center gap-1"><Eye className="w-3 h-3" /> Published</span> : <span className="text-text-muted flex items-center gap-1"><EyeOff className="w-3 h-3" /> Draft</span>}</td>
                    <td className="text-text-muted">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="flex gap-2">
                      <button 
                        onClick={() => handleEditStart(p)} 
                        className="text-text-muted hover:text-primary transition-colors p-1"
                        title="Edit Post"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.slug, p.title)} 
                        className="text-text-muted hover:text-red-500 transition-colors p-1"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
