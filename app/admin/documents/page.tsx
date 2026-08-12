"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, ExternalLink, Loader2, FileText, Search } from "lucide-react"

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  
  const [title, setTitle] = useState("")
  const [driveUrl, setDriveUrl] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/admin/documents")
      const data = await res.json()
      if (res.ok) {
        setDocuments(data.documents || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !driveUrl) {
      setError("Title and Drive URL are required")
      return
    }

    setSaving(true)
    setError("")

    try {
      const res = await fetch("/api/admin/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, driveUrl }),
      })
      
      const data = await res.json()
      if (res.ok) {
        setDocuments([data.document, ...documents])
        setTitle("")
        setDriveUrl("")
      } else {
        setError(data.error || "Failed to add document")
      }
    } catch (err) {
      setError("Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/documents?id=${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setDocuments(documents.filter(d => d.id !== id))
      }
    } catch (err) {
      console.error("Failed to delete", err)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0F1C0B] flex items-center gap-2">
            <FileText className="w-8 h-8 text-[#1C5230]" /> Document Links
          </h1>
          <p className="text-[#3D4F52] mt-1">Manage Google Drive links for your clients</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-[#D8D2C7] p-6">
            <h2 className="text-lg font-semibold text-[#0F1C0B] mb-4">Add New Link</h2>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#3D4F52] mb-1">Document Title</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Export Compliance Guide"
                  className="w-full px-4 py-2 bg-[#FAF8F4] border border-[#D8D2C7] rounded-lg focus:outline-none focus:border-[#C8963E] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3D4F52] mb-1">Google Drive URL</label>
                <input 
                  type="url"
                  value={driveUrl}
                  onChange={(e) => setDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full px-4 py-2 bg-[#FAF8F4] border border-[#D8D2C7] rounded-lg focus:outline-none focus:border-[#C8963E] transition-colors"
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-[#1C5230] text-white py-2.5 rounded-lg hover:bg-[#143e23] transition-colors disabled:opacity-70"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                Add Document Link
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-[#D8D2C7] overflow-hidden">
            <div className="p-6 border-b border-[#D8D2C7] flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#0F1C0B]">Available Links</h2>
            </div>
            
            <div className="p-0">
              {loading ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="w-8 h-8 text-[#C8963E] animate-spin" />
                </div>
              ) : documents.length === 0 ? (
                <div className="p-12 text-center text-[#7A8E92]">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No document links added yet.</p>
                </div>
              ) : (
                <ul className="divide-y divide-[#E8E3DC]">
                  {documents.map(doc => (
                    <motion.li 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={doc.id} 
                      className="p-4 hover:bg-[#FAF8F4] transition-colors flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-[#0F1C0B] truncate">{doc.title}</p>
                        <a 
                          href={doc.driveUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1 truncate max-w-[300px] md:max-w-md"
                        >
                          <ExternalLink className="w-3 h-3 flex-shrink-0" /> {doc.driveUrl}
                        </a>
                      </div>
                      
                      <button
                        onClick={() => handleDelete(doc.id)}
                        disabled={deleting === doc.id}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      >
                        {deleting === doc.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
