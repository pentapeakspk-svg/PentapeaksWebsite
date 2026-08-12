"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Send, Video, CheckCircle, Trash2, Paperclip } from "lucide-react"
import { prefetch, invalidate } from "@/lib/admin-cache"

interface Batch { id: string; batchNo: string; title: string; _count?: { students: number } }

interface ClassRecording {
  id: string
  title: string
  link: string
  note: string | null
  sentAt: string
  batch: { batchNo: string; title: string }
  attachments?: string[]
}

export default function AdminSendRecordingPage() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [form, setForm] = useState({ batchId: "", title: "", link: "", note: "", attachmentsText: "" })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState("")

  const [pastRecordings, setPastRecordings] = useState<ClassRecording[]>([])
  const [loadingRecordings, setLoadingRecordings] = useState(false)

  const loadPastRecordings = async () => {
    setLoadingRecordings(true)
    try {
      const res = await fetch("/api/class-recordings", { cache: "no-store" })
      const data = await res.json()
      if (res.ok) {
        setPastRecordings(data.classRecordings || [])
      }
    } catch (err) {
      console.error("Failed to load past recordings", err)
    } finally {
      setLoadingRecordings(false)
    }
  }

  const handleDeleteRecording = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this class recording? It will be removed from the student portal immediately.")) return;
    
    try {
      const res = await fetch(`/api/class-recordings/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete recording")
      setPastRecordings(prev => prev.filter(r => r.id !== id))
    } catch (err) {
      console.error("Failed to delete the recording:", err)
      alert("Failed to delete the recording")
    }
  }

  useEffect(() => {
    const loadBatches = async () => {
      try {
        const data = await prefetch("/api/batches")
        setBatches(data.batches || [])
        setError("")
      } catch (error) {
        console.error("[admin/send-recording] batches fetch error:", error)
        setError(error instanceof Error ? error.message : "Failed to load batches")
        setBatches([])
      }
    }

    loadBatches()
    loadPastRecordings()
  }, [])

  const selectedBatch = batches.find(b => b.id === form.batchId)

  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)

  const handleSend = async () => {
    setLoading(true)
    setError("")

    try {
      let attachmentUrls: string[] = []
      
      // Upload files if any selected
      if (files.length > 0) {
        setUploading(true)
        const formData = new FormData()
        files.forEach(f => formData.append("files", f))
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData
        })
        const uploadData = await uploadRes.json()
        
        if (!uploadRes.ok) throw new Error(uploadData.error || "Failed to upload files")
        attachmentUrls = uploadData.urls
        setUploading(false)
      }

      const payload = { ...form, attachments: attachmentUrls }

      const res = await fetch("/api/class-recordings", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(payload) 
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to send class recording link")
      }

      setSuccess(true)
      setShowConfirm(false)
      loadPastRecordings()
      setTimeout(() => { 
        setSuccess(false)
        setForm({ batchId: "", title: "", link: "", note: "", attachmentsText: "" }) 
        setFiles([])
      }, 3000)
    } catch (error) {
      console.error("[admin/send-recording] create error:", error)
      setError(error instanceof Error ? error.message : "Failed to send class recording link")
      setUploading(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 pb-16 bg-gray-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-display)] mb-8 text-text-dark">
            <Video className="w-8 h-8 text-primary inline mr-2" />Send Class Recording
          </h1>

          {success ? (
            <div className="bg-primary-pale border border-primary/30 rounded-xl p-8 text-center">
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="text-xl font-bold text-primary">Recording Sent Successfully!</h3>
              <p className="text-text-body mt-2">Students can now access this class recording on their dashboard.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div><label className="block text-sm text-text-muted mb-2">Select Batch *</label>
                <select required className="input-field" value={form.batchId} onChange={e => setForm(p => ({ ...p, batchId: e.target.value }))}>
                  <option value="">Choose a batch</option>
                  {batches.map(b => <option key={b.id} value={b.id}>{b.batchNo} - {b.title} ({b._count?.students || 0} students)</option>)}
                </select>
              </div>
              <div><label className="block text-sm text-text-muted mb-2">Recording Title *</label><input required className="input-field" placeholder="Lecture 7 Recording - Documentary Credits" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
              <div><label className="block text-sm text-text-muted mb-2">Class Recording Link *</label><input required className="input-field" placeholder="https://drive.google.com/... or https://youtube.com/..." value={form.link} onChange={e => setForm(p => ({ ...p, link: e.target.value }))} /></div>
              <div><label className="block text-sm text-text-muted mb-2">Additional Note</label><textarea rows={3} className="input-field" placeholder="Password or password protection instructions (if any)" value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} /></div>
              <div>
                <label className="block text-sm text-text-muted mb-2">Attachments (PDFs, PPTs)</label>
                <input 
                  type="file" 
                  multiple 
                  accept=".pdf,.ppt,.pptx,.doc,.docx"
                  className="input-field cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  onChange={e => e.target.files && setFiles(Array.from(e.target.files))} 
                />
                {files.length > 0 && <p className="text-xs text-primary mt-2">{files.length} file(s) selected</p>}
              </div>

              <button onClick={() => setShowConfirm(true)} disabled={!form.batchId || !form.title || !form.link || uploading || loading} className="btn-primary w-full justify-center">
                {uploading ? "Uploading files..." : loading ? "Sending..." : <><Send className="w-4 h-4" /> Preview & Send Recording</>}
              </button>

              {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
            </div>
          )}

          {/* Confirmation Modal */}
          {showConfirm && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
              <div className="bg-white border border-border-light rounded-xl p-8 max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">Confirm Send Recording</h3>
                <p className="text-text-body mb-6">
                  You are about to share the recording &quot;<strong className="text-primary">{form.title}</strong>&quot; with{" "}
                  <strong className="text-primary">{selectedBatch?._count?.students || 0} students</strong> in{" "}
                  <strong>{selectedBatch?.batchNo}</strong>.
                </p>
                <div className="flex gap-[clamp(0.75rem,1.5vw,1rem)]">
                  <button onClick={() => setShowConfirm(false)} className="btn-outline flex-1 justify-center">Cancel</button>
                  <button onClick={handleSend} disabled={loading} className="btn-primary flex-1 justify-center">{loading ? "Sending..." : "Confirm & Send"}</button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Past Recordings Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-12">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] mb-6 text-text-dark">
            Sent Class Recordings
          </h2>
          <div className="admin-card">
            <div className="overflow-x-auto">
              <table className="table-premium">
                <thead>
                  <tr>
                    <th>Batch</th>
                    <th>Title</th>
                    <th>Recording Link</th>
                    <th>Attachments</th>
                    <th>Date Sent</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingRecordings ? (
                    <tr><td colSpan={6} className="text-center text-text-muted py-8">Loading sent recordings...</td></tr>
                  ) : pastRecordings.length > 0 ? (
                    pastRecordings.map(recording => (
                      <tr key={recording.id}>
                        <td><span className="font-semibold text-primary">{recording.batch?.batchNo || "Unknown"}</span></td>
                        <td>{recording.title}</td>
                        <td>
                          <a href={recording.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold text-sm">
                            {recording.link}
                          </a>
                        </td>
                        <td>
                          {recording.attachments && recording.attachments.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {recording.attachments.map((url: string, i: number) => {
                                let fileName = `File ${i + 1}`;
                                let isDataUri = url.startsWith("data:");
                                if (isDataUri) {
                                  const match = url.match(/name=([^;]+)/);
                                  if (match) fileName = decodeURIComponent(match[1]);
                                }
                                return (
                                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" download={isDataUri ? fileName : undefined} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
                                    <Paperclip className="w-3 h-3" /> {fileName}
                                  </a>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-text-muted text-xs">None</span>
                          )}
                        </td>
                        <td>{new Date(recording.sentAt).toLocaleDateString()}</td>
                        <td className="text-right">
                          <button 
                            onClick={() => handleDeleteRecording(recording.id)} 
                            className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 transition-colors"
                            title="Delete recording link"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={6} className="text-center text-text-muted py-8">No class recordings have been shared yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
