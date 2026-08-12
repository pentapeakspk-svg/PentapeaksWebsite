"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trash2, UploadCloud, Video, AlertCircle } from "lucide-react"

export default function GalleryVideosAdminPage() {
  const [homeVideos, setHomeVideos] = useState<string[]>([])
  const [mentorshipVideos, setMentorshipVideos] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [selectedSection, setSelectedSection] = useState<"home-" | "mentorship-">("home-")

  const fetchVideos = async () => {
    try {
      const resHome = await fetch("/api/admin/gallery-videos?prefix=home-")
      const dataHome = await resHome.json()
      if (resHome.ok) setHomeVideos(dataHome.files || [])

      const resMentorship = await fetch("/api/admin/gallery-videos?prefix=mentorship-")
      const dataMentorship = await resMentorship.json()
      if (resMentorship.ok) setMentorshipVideos(dataMentorship.files || [])

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
    const MAX_SIZE = 1.5 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      setError("File size exceeds 1.5MB limit. Please select a smaller video.")
      return
    }

    if (selectedSection === "home-" && homeVideos.length >= 3) {
      setError("Home page limit reached (max 3 videos). Please delete one first.")
      return
    }

    if (selectedSection === "mentorship-" && mentorshipVideos.length >= 2) {
      setError("Mentorship page limit reached (max 2 videos). Please delete one first.")
      return
    }

    setUploading(true)
    setError("")
    setSuccess("")

    const formData = new FormData()
    formData.append("file", file)
    formData.append("prefix", selectedSection)

    try {
      const res = await fetch("/api/admin/gallery-videos", {
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
      e.target.value = ""
    }
  }

  const handleDelete = async (fileName: string) => {
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) return

    setError("")
    setSuccess("")
    
    try {
      const res = await fetch("/api/admin/gallery-videos", {
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

  const renderGallery = (title: string, videos: string[], limit: number) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full text-gray-600">
          {videos.length} / {limit} uploaded
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <Video className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No videos uploaded yet.</p>
          </div>
        ) : (
          videos.map((fileUrl) => {
            const fileName = fileUrl.split('/').pop() || "";
            return (
              <motion.div
                key={fileUrl}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm group relative"
              >
                <div className="aspect-[4/5] bg-black">
                  <video
                    src={fileUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => handleDelete(fileName)}
                  className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete video"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="p-2 bg-gray-50 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-500 truncate" title={fileName}>{fileName}</p>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8">
      
      {/* Upload Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Gallery Videos</h1>
          <p className="text-sm text-gray-500 mt-1">Manage videos for the Home and Mentorship pages. Max size: 1.5MB per video.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value as any)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1C5230] focus:outline-none"
            >
              <option value="home-">Home Page (Max 3)</option>
              <option value="mentorship-">Mentorship Page (Max 2)</option>
            </select>
          </div>
          
          <div className="w-full sm:w-auto sm:mt-6 relative">
            <input
              type="file"
              accept="video/mp4,video/quicktime"
              onChange={handleUpload}
              disabled={uploading || (selectedSection === "home-" ? homeVideos.length >= 3 : mentorshipVideos.length >= 2)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <button
              disabled={uploading || (selectedSection === "home-" ? homeVideos.length >= 3 : mentorshipVideos.length >= 2)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1C5230] hover:bg-[#143e23] text-white px-6 py-2.5 rounded-xl disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              <UploadCloud className="w-5 h-5" />
              {uploading ? "Uploading..." : "Upload Video"}
            </button>
          </div>
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
          <div className="w-8 h-8 border-2 border-[#C8963E] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          {renderGallery("Home Page Videos", homeVideos, 3)}
          {renderGallery("Mentorship Page Videos", mentorshipVideos, 2)}
        </div>
      )}
    </div>
  )
}
