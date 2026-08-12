"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { fadeUpVariant } from "@/lib/animations"
import { Trash2, UploadCloud, Video, AlertCircle } from "lucide-react"

export default function StudentReviewsAdminPage() {
  const [videos, setVideos] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/admin/student-reviews")
      const data = await res.json()
      if (res.ok) {
        setVideos(data.files || [])
      } else {
        setError(data.error || "Failed to fetch videos")
      }
    } catch (err) {
      setError("Error fetching videos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Pre-check size limit client-side
    const MAX_SIZE = 3 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      setError("File size exceeds 3MB limit. Please select a smaller video.")
      return
    }

    setUploading(true)
    setError("")
    setSuccess("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/admin/student-reviews", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess("Video uploaded successfully!")
        fetchVideos()
      } else {
        setError(data.error || "Upload failed")
      }
    } catch (err) {
      setError("Something went wrong during upload")
    } finally {
      setUploading(false)
      // Reset the file input
      e.target.value = ""
    }
  }

  const handleDelete = async (fileName: string) => {
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) return

    setError("")
    setSuccess("")
    
    try {
      const res = await fetch("/api/admin/student-reviews", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess("Video deleted successfully!")
        fetchVideos()
      } else {
        setError(data.error || "Failed to delete video")
      }
    } catch (err) {
      setError("Something went wrong during deletion")
    }
  }

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-display)]">
            Student Reviews
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage mentorship review videos. Max size: 3MB.</p>
        </div>
        
        <div className="relative">
          <input
            type="file"
            accept="video/mp4,video/quicktime"
            onChange={handleUpload}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <button
            disabled={uploading}
            className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <UploadCloud className="w-5 h-5" />
            {uploading ? "Uploading..." : "Upload Video"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3 border border-green-100">
          <div className="w-5 h-5 shrink-0 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-600 text-xs font-bold">✓</span>
          </div>
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-100">
              <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No review videos found.</p>
            </div>
          ) : (
            videos.map((fileUrl) => {
              const fileName = fileUrl.split('/').pop() || "";
              return (
              <motion.div
                key={fileUrl}
                variants={fadeUpVariant}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group"
              >
                <div className="aspect-[9/16] bg-black relative">
                  <video
                    src={fileUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDelete(fileName)}
                      className="p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-lg backdrop-blur-sm transition-colors shadow-lg"
                      title="Delete video"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-3 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-600 truncate" title={fileName}>
                    {fileName}
                  </p>
                </div>
              </motion.div>
            )})
          )}
        </div>
      )}
    </div>
  )
}
