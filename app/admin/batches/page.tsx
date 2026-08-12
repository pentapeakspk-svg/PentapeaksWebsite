"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  PlusCircle, Layers, Pencil, Trash2, Eye, EyeOff, 
  X, User, Mail, Phone, MapPin, Calendar, Lock, Award, BookOpen, Hash 
} from "lucide-react"
import { prefetch, invalidate } from "@/lib/admin-cache"

interface Batch { id: string; batchNo: string; title: string; description: string | null; status: string; startDate: string | null; endDate: string | null; schedule: string | null; hidden: boolean; fee: number; _count: { students: number } }

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ batchNo: "", title: "", description: "", status: "UPCOMING", startDate: "", endDate: "", schedule: "", fee: 0 })
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState("")

  // New states for dynamic batch student popup details
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)
  const [batchStudents, setBatchStudents] = useState<any[]>([])
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)
  const [isEditingBatch, setIsEditingBatch] = useState(false)
  const [editForm, setEditForm] = useState({ batchNo: "", title: "", description: "", status: "UPCOMING", startDate: "", endDate: "", schedule: "", fee: 0 })
  const [assignIdentifier, setAssignIdentifier] = useState("")
  const [assignLoading, setAssignLoading] = useState(false)

  const fetchBatches = async () => {
    try {
      invalidate("/api/batches")
      const data = await prefetch("/api/batches")
      setBatches(data.batches || [])
      setError("")
    } catch (error) {
      console.error("[admin/batches] fetch error:", error)
      setError(error instanceof Error ? error.message : "Failed to load batches")
      setBatches([])
    }
  }

  useEffect(() => { fetchBatches() }, [])

  // Fetch students registered in the selected batch
  useEffect(() => {
    const loadBatchStudents = async () => {
      if (!selectedBatch) {
        setBatchStudents([])
        return
      }

      setLoadingStudents(true)
      try {
        const res = await fetch(`/api/students?batchId=${encodeURIComponent(selectedBatch.id)}`, { cache: "no-store" })
        const data = await res.json()
        if (res.ok) {
          setBatchStudents(data.students || [])
        }
      } catch (err) {
        console.error("Failed to load batch students:", err)
      } finally {
        setLoadingStudents(false)
      }
    }

    loadBatchStudents()
  }, [selectedBatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to create batch")
      }

      setForm({ batchNo: "", title: "", description: "", status: "UPCOMING", startDate: "", endDate: "", schedule: "", fee: 0 })
      setShowForm(false)
      await fetchBatches()
    } catch (error) {
      console.error("[admin/batches] create error:", error)
      setError(error instanceof Error ? error.message : "Failed to create batch")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (batchId: string, batchNo: string) => {
    if (!confirm(`Delete batch ${batchNo}? This will remove its attendance and class links.`)) return

    setDeletingId(batchId)
    setError("")

    try {
      const res = await fetch(`/api/batches?batchId=${encodeURIComponent(batchId)}`, {
        method: "DELETE",
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete batch")
      }

      await fetchBatches()
    } catch (error) {
      console.error("[admin/batches] delete error:", error)
      setError(error instanceof Error ? error.message : "Failed to delete batch")
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleHide = async (batchId: string, currentHidden: boolean) => {
    setError("")
    try {
      const res = await fetch(`/api/batches?batchId=${encodeURIComponent(batchId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hidden: !currentHidden }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to update batch status")
      }

      await fetchBatches()
    } catch (error) {
      console.error("[admin/batches] toggle hide error:", error)
      setError(error instanceof Error ? error.message : "Failed to update batch status")
    }
  }

  const handleToggleStatus = async (batchId: string, newStatus: string) => {
    setError("")
    try {
      const res = await fetch(`/api/batches?batchId=${encodeURIComponent(batchId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to update status")
      }

      await fetchBatches()
      if (selectedBatch?.id === batchId) {
        setSelectedBatch(prev => prev ? { ...prev, status: newStatus } : null)
      }
    } catch (error) {
      console.error("[admin/batches] toggle status error:", error)
      setError(error instanceof Error ? error.message : "Failed to update status")
    }
  }

  const handleUpdateBatch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBatch) return
    setLoading(true)
    try {
      const res = await fetch(`/api/batches?batchId=${encodeURIComponent(selectedBatch.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to update batch")
      }

      await fetchBatches()
      setSelectedBatch({ ...selectedBatch, ...editForm } as any)
      setIsEditingBatch(false)
    } catch (error) {
      console.error("[admin/batches] update error:", error)
      alert(error instanceof Error ? error.message : "Failed to update batch")
    } finally {
      setLoading(false)
    }
  }

  // Manage student status toggling within the batch details popup
  const handleToggleStudentPayment = async (studentId: string, currentPaid: boolean) => {
    try {
      const res = await fetch(`/api/students/${studentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paid: !currentPaid, batchId: selectedBatch?.id }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to update payment status")
      }

      setBatchStudents((prev: any[]) => prev.map((s: any) => s.id === studentId ? { ...s, paid: !currentPaid } : s))
      if (selectedStudent && selectedStudent.id === studentId) {
        setSelectedStudent((prev: any) => prev ? { ...prev, paid: !currentPaid } : null)
      }
    } catch (error) {
      console.error("[admin/batches] toggle student payment error:", error)
      alert(error instanceof Error ? error.message : "Failed to update payment status")
    }
  }

  const handleToggleStudentBlock = async (studentId: string, currentBlocked: boolean) => {
    try {
      const res = await fetch(`/api/students/${studentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocked: !currentBlocked }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to update block status")
      }

      setBatchStudents((prev: any[]) => prev.map((s: any) => s.id === studentId ? { ...s, blocked: !currentBlocked } : s))
      if (selectedStudent && selectedStudent.id === studentId) {
        setSelectedStudent((prev: any) => prev ? { ...prev, blocked: !currentBlocked } : null)
      }
    } catch (error) {
      console.error("[admin/batches] toggle student block error:", error)
      alert(error instanceof Error ? error.message : "Failed to update block status")
    }
  }

  const handleStudentDelete = async (studentId: string, studentName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete student ${studentName}? ALL associated data will be lost!`)) return;

    try {
      const res = await fetch(`/api/students/${studentId}`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete student")
      }
      setBatchStudents((prev: any[]) => prev.filter((s: any) => s.id !== studentId))
      setBatches((prev: Batch[]) => prev.map((b: Batch) => b.id === selectedBatch?.id ? { ...b, _count: { students: Math.max(0, (b._count?.students || 1) - 1) } } : b))
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : "Failed to delete student")
    }
  }

  const handleAssignStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!assignIdentifier || !selectedBatch) return
    setAssignLoading(true)
    try {
      const res = await fetch("/api/students", { cache: "no-store" })
      const data = await res.json()
      const students = data.students || []
      
      const studentToAssign = students.find((s: any) => 
        s.user.email.toLowerCase() === assignIdentifier.toLowerCase() || 
        s.rollNo === assignIdentifier
      )

      if (!studentToAssign) {
        alert("Student not found with that Email or Roll No.")
        setAssignLoading(false)
        return
      }

      if (studentToAssign.batchId === selectedBatch.id) {
        alert("Student is already in this batch.")
        setAssignLoading(false)
        return
      }

      const updateRes = await fetch(`/api/students/${studentToAssign.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchId: selectedBatch.id })
      })

      if (!updateRes.ok) {
        throw new Error("Failed to assign student")
      }

      alert("Student assigned successfully!")
      setAssignIdentifier("")
      const refreshRes = await fetch(`/api/students?batchId=${encodeURIComponent(selectedBatch.id)}`, { cache: "no-store" })
      const refreshData = await refreshRes.json()
      setBatchStudents(refreshData.students || [])
      fetchBatches()
    } catch (err: any) {
      alert(err.message || "Failed to assign student")
    } finally {
      setAssignLoading(false)
    }
  }

  const handleUnassignStudent = async (studentId: string, studentName: string) => {
    if (!confirm(`Remove ${studentName} from this batch? (They will not be deleted, just unassigned)`)) return
    try {
      const res = await fetch(`/api/students/${studentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchId: null })
      })
      if (!res.ok) throw new Error("Failed to remove student from batch")
      
      setBatchStudents(prev => prev.filter(s => s.id !== studentId))
      fetchBatches()
    } catch (err: any) {
      alert(err.message || "Failed to remove student")
    }
  }

  return (
    <div className="pt-24 pb-16 bg-gray-bg min-h-screen">
      <div className="sec-wrap">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold font-[family-name:var(--font-display)] text-text-dark"><Layers className="w-8 h-8 text-primary inline mr-2" />Batch Management</h1>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm"><PlusCircle className="w-4 h-4" /> Create Batch</button>
          </div>

          {showForm && (
            <div className="admin-card mb-8">
              <h3 className="text-lg font-bold mb-4">New Batch</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(0.75rem,1.5vw,1rem)]">
                <div><label className="block text-sm text-text-muted mb-1">Batch No *</label><input required className="input-field" placeholder="B-003" value={form.batchNo} onChange={e => setForm(p => ({ ...p, batchNo: e.target.value }))} /></div>
                <div><label className="block text-sm text-text-muted mb-1">Title *</label><input required className="input-field" placeholder="Advanced Export Batch" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
                <div className="md:col-span-2"><label className="block text-sm text-text-muted mb-1">Description</label><textarea className="input-field" rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
                <div><label className="block text-sm text-text-muted mb-1">Start Date</label><input type="date" className="input-field" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} /></div>
                <div><label className="block text-sm text-text-muted mb-1">End Date</label><input type="date" className="input-field" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} /></div>
                <div><label className="block text-sm text-text-muted mb-1">Schedule</label><input className="input-field" placeholder="e.g. Mon, Wed 8:00 PM" value={form.schedule} onChange={e => setForm(p => ({ ...p, schedule: e.target.value }))} /></div>
                <div><label className="block text-sm text-text-muted mb-1">Fee (PKR) *</label><input type="number" required className="input-field" placeholder="e.g. 15000" value={form.fee || ""} onChange={e => setForm(p => ({ ...p, fee: parseInt(e.target.value) || 0 }))} /></div>
                <div><label className="block text-sm text-text-muted mb-1">Status</label>
                  <select className="input-field" value={form.status} disabled onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                    <option value="UPCOMING">Upcoming</option>
                  </select>
                </div>
                <div className="flex items-end"><button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Saving..." : "Save Batch"}</button></div>
              </form>
            </div>
          )}

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <div className="admin-card overflow-x-auto" style={{padding:0}}>
            <table className="table-premium">
              <thead><tr><th>Batch No</th><th>Title</th><th>Students</th><th>Start</th><th>End</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {batches.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-text-muted">No batches yet. Create your first batch above.</td></tr>
                ) : batches.map(b => (
                  <tr 
                    key={b.id} 
                    className="cursor-pointer hover:bg-gray-50/80 transition-colors" 
                    onClick={() => setSelectedBatch(b)}
                    title="Click to view details & enrolled students"
                  >
                    <td className="text-primary font-semibold">{b.batchNo}</td>
                    <td className="font-medium text-text-dark">{b.title}</td>
                    <td>{b._count?.students || 0}</td>
                    <td className="text-text-muted">{b.startDate ? new Date(b.startDate).toLocaleDateString() : "-"}</td>
                    <td className="text-text-muted">{b.endDate ? new Date(b.endDate).toLocaleDateString() : "-"}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-col gap-1 items-start">
                        <select
                          value={b.status}
                          onChange={(e) => handleToggleStatus(b.id, e.target.value)}
                          className={`px-2 py-1 rounded text-xs font-semibold border border-transparent cursor-pointer outline-none transition-colors ${
                            b.status === "ACTIVE"
                              ? "bg-primary-pale text-primary hover:bg-primary-pale/80"
                              : b.status === "UPCOMING"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          <option value="UPCOMING">Upcoming</option>
                          <option value="ACTIVE">Active</option>
                          <option value="COMPLETED">Ended</option>
                        </select>
                        {b.hidden && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                            HIDDEN
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="flex gap-2 items-center justify-end" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleToggleHide(b.id, b.hidden)}
                        className={`cursor-pointer p-1.5 rounded transition-colors ${
                          b.hidden
                            ? "text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100"
                            : "text-text-muted hover:text-primary hover:bg-gray-100"
                        }`}
                        title={b.hidden ? "Show Batch (Currently Hidden)" : "Hide Batch (Currently Visible)"}
                        aria-label={b.hidden ? `Show batch ${b.batchNo}` : `Hide batch ${b.batchNo}`}
                      >
                        {b.hidden ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setSelectedBatch(b)}
                        className="cursor-pointer text-text-muted hover:text-primary p-1 rounded hover:bg-gray-100"
                        title="View details & students"
                      >
                        <Eye className="w-4 h-4 text-primary" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(b.id, b.batchNo)}
                        disabled={deletingId === b.id}
                        className="cursor-pointer text-text-muted hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 p-1 rounded hover:bg-gray-100"
                        aria-label={`Delete batch ${b.batchNo}`}
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

      {/* ══════════════════════════════════════
          BATCH DETAILS & STUDENTS LIST MODAL
      ══════════════════════════════════════ */}
      {selectedBatch && (
        <div style={{ position: "fixed", inset: 0, zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
          {/* overlay backdrop */}
          <div 
            onClick={() => setSelectedBatch(null)}
            style={{ position: "absolute", inset: 0, backgroundColor: "rgba(11,26,14,.55)", backdropFilter: "blur(4px)" }} 
          />
          
          {/* modal card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.97, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ 
              position: "relative", 
              zIndex: 95, 
              width: "100%", 
              maxWidth: "1150px", 
              maxHeight: "90vh",
              backgroundColor: "#ffffff", 
              borderRadius: "20px", 
              overflow: "hidden", 
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)", 
              border: "1px solid #DDD8CF",
              display: "flex",
              flexDirection: "column"
            }}
          >
            {/* Gold Accent Header Stripe */}
            <div style={{ height: "4px", background: "linear-gradient(90deg, #1C5230, #C8963E)" }} />
            
            {/* Modal Header */}
            <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #F2EDE4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 className="serif text-2xl font-bold text-text-dark" style={{ margin: 0 }}>
                  Batch Details: <span className="text-primary font-mono">{selectedBatch.batchNo}</span>
                </h3>
                <p className="text-sm text-text-muted mt-1">{selectedBatch.title}</p>
              </div>
              <button 
                onClick={() => setSelectedBatch(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-text-muted hover:text-text-dark cursor-pointer border-0 bg-transparent"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div style={{ padding: "2rem", overflowY: "auto", flex: 1 }}>
              {/* Batch Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-bg rounded-xl p-4 border border-border-light">
                  <span className="text-xs text-text-muted uppercase font-bold tracking-wider">Start Date</span>
                  <span className="block text-sm font-semibold text-text-dark mt-1">
                    {selectedBatch.startDate ? new Date(selectedBatch.startDate).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="bg-gray-bg rounded-xl p-4 border border-border-light">
                  <span className="text-xs text-text-muted uppercase font-bold tracking-wider">End Date</span>
                  <span className="block text-sm font-semibold text-text-dark mt-1">
                    {selectedBatch.endDate ? new Date(selectedBatch.endDate).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="bg-gray-bg rounded-xl p-4 border border-border-light">
                  <span className="text-xs text-text-muted uppercase font-bold tracking-wider">Total Enrolled</span>
                  <span className="block text-sm font-semibold text-primary mt-1">
                    {selectedBatch._count?.students || 0} Students
                  </span>
                </div>
                <div className="bg-gray-bg rounded-xl p-4 border border-border-light">
                  <span className="text-xs text-text-muted uppercase font-bold tracking-wider">Status</span>
                  <span className="block text-sm font-semibold text-text-dark mt-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      selectedBatch.status === "ACTIVE"
                        ? "bg-primary-pale text-primary"
                        : selectedBatch.status === "UPCOMING"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {selectedBatch.status}
                    </span>
                  </span>
                </div>
                <div className="bg-gray-bg rounded-xl p-4 border border-border-light md:col-span-3">
                  <span className="text-xs text-text-muted uppercase font-bold tracking-wider">Schedule</span>
                  <span className="block text-sm font-semibold text-text-dark mt-1">
                    {selectedBatch.schedule || "Not set"}
                  </span>
                </div>
                <div className="bg-gray-bg rounded-xl p-4 border border-border-light md:col-span-1">
                  <span className="text-xs text-text-muted uppercase font-bold tracking-wider">Fee (PKR)</span>
                  <span className="block text-sm font-semibold text-primary mt-1">
                    Rs. {selectedBatch.fee?.toLocaleString() || "0"}
                  </span>
                </div>
              </div>

              {isEditingBatch && (
                <div className="admin-card mb-8">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Pencil className="w-5 h-5" /> Edit Batch</h3>
                  <form onSubmit={handleUpdateBatch} className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(0.75rem,1.5vw,1rem)]">
                    <div><label className="block text-sm text-text-muted mb-1">Batch No</label><input className="input-field" value={editForm.batchNo} onChange={e => setEditForm(p => ({ ...p, batchNo: e.target.value }))} /></div>
                    <div><label className="block text-sm text-text-muted mb-1">Title</label><input required className="input-field" value={editForm.title} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))} /></div>
                    <div className="md:col-span-2"><label className="block text-sm text-text-muted mb-1">Description</label><textarea className="input-field" rows={2} value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} /></div>
                    <div><label className="block text-sm text-text-muted mb-1">Start Date</label><input type="date" className="input-field" value={editForm.startDate} onChange={e => setEditForm(p => ({ ...p, startDate: e.target.value }))} /></div>
                    <div><label className="block text-sm text-text-muted mb-1">End Date</label><input type="date" className="input-field" value={editForm.endDate} onChange={e => setEditForm(p => ({ ...p, endDate: e.target.value }))} /></div>
                    <div><label className="block text-sm text-text-muted mb-1">Schedule</label><input className="input-field" placeholder="e.g. Mon, Wed 8:00 PM" value={editForm.schedule} onChange={e => setEditForm(p => ({ ...p, schedule: e.target.value }))} /></div>
                    <div><label className="block text-sm text-text-muted mb-1">Fee (PKR) *</label><input type="number" required className="input-field" placeholder="e.g. 15000" value={editForm.fee || ""} onChange={e => setEditForm(p => ({ ...p, fee: parseInt(e.target.value) || 0 }))} /></div>
                    <div><label className="block text-sm text-text-muted mb-1">Status</label>
                      <select className="input-field" value={editForm.status} onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))}>
                        <option value="UPCOMING">Upcoming</option>
                        <option value="ACTIVE">Active</option>
                        <option value="COMPLETED">Ended</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 flex items-center justify-end gap-3 mt-2">
                      <button type="button" onClick={() => setIsEditingBatch(false)} className="btn-secondary">Cancel</button>
                      <button type="submit" disabled={loading} className="btn-primary">{loading ? "Saving..." : "Save Changes"}</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Students Table Section */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                <h4 className="text-lg font-bold text-text-dark flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Enrolled Students List
                </h4>
                <form onSubmit={handleAssignStudent} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Student Email or Roll No"
                    value={assignIdentifier}
                    onChange={e => setAssignIdentifier(e.target.value)}
                    className="input-field"
                    style={{ padding: "0.5rem 1rem", minWidth: "250px" }}
                    required
                  />
                  <button type="submit" disabled={assignLoading} className="btn-primary" style={{ padding: "0.5rem 1rem", whiteSpace: "nowrap" }}>
                    {assignLoading ? "Adding..." : "Add to Batch"}
                  </button>
                </form>
              </div>

              <div className="border border-border-light rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="table-premium w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="p-3">Roll No</th>
                        <th className="p-3">Name</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">City</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingStudents ? (
                        <tr>
                          <td colSpan={8} className="text-center py-8 text-text-muted">
                            <span className="inline-block animate-spin mr-2">⏳</span> Loading students...
                          </td>
                        </tr>
                      ) : batchStudents.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center py-8 text-text-muted">
                            No students registered in this batch yet.
                          </td>
                        </tr>
                      ) : (
                        batchStudents.map((s) => (
                          <tr 
                            key={s.id} 
                            className="cursor-pointer hover:bg-gray-50/80 transition-colors"
                            onClick={() => setSelectedStudent(s)}
                          >
                            <td className="text-primary font-semibold p-3">{s.rollNo}</td>
                            <td className="font-medium text-text-dark p-3">{s.user.name}</td>
                            <td className="text-text-muted p-3">{s.user.email}</td>
                            <td className="p-3">{s.phone}</td>
                            <td className="p-3">{s.city}</td>
                            <td className="p-3" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => handleToggleStudentPayment(s.id, s.paid)}
                                className={`px-2.5 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                                  s.paid
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                                    : "bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200"
                                }`}
                              >
                                {s.paid ? "Paid" : "Unpaid"}
                              </button>
                            </td>
                            <td className="p-3" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => handleToggleStudentBlock(s.id, s.blocked)}
                                className={`px-2.5 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                                  s.blocked
                                    ? "bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200"
                                    : "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                                }`}
                              >
                                {s.blocked ? "Blocked" : "Active"}
                              </button>
                            </td>
                            <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => setSelectedStudent(s)}
                                className="text-primary hover:text-primary-dark p-1.5 rounded-md hover:bg-primary-pale transition-colors mr-1"
                                title="View credentials & detail info"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleUnassignStudent(s.id, s.user.name)}
                                className="text-orange-500 hover:text-orange-700 p-1.5 rounded-md hover:bg-orange-50 transition-colors mr-1"
                                title="Remove from batch (Unassign)"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleStudentDelete(s.id, s.user.name)}
                                className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                                title="Delete student permanently"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "1.25rem 2rem", background: "#FAF8F4", borderTop: "1px solid #F2EDE4", display: "flex", justifyContent: "space-between" }}>
              <button 
                onClick={() => {
                  setEditForm({
                    batchNo: selectedBatch.batchNo,
                    title: selectedBatch.title,
                    description: selectedBatch.description || "",
                    status: selectedBatch.status,
                    startDate: selectedBatch.startDate ? selectedBatch.startDate.split("T")[0] : "",
                    endDate: selectedBatch.endDate ? selectedBatch.endDate.split("T")[0] : "",
                    schedule: selectedBatch.schedule || "",
                    fee: selectedBatch.fee || 0
                  })
                  setIsEditingBatch(!isEditingBatch)
                }}
                className="btn-secondary"
                style={{ padding: "0.6rem 1.75rem", fontSize: "0.85rem" }}
              >
                {isEditingBatch ? "Cancel Edit" : "Edit Batch Details"}
              </button>
              <button 
                onClick={() => {
                  setSelectedBatch(null)
                  setIsEditingBatch(false)
                }}
                className="btn-primary"
                style={{ padding: "0.6rem 1.75rem", fontSize: "0.85rem" }}
              >
                Close Details
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ══════════════════════════════════════
          NESTED STUDENT DETAILS CARD POPUP
      ══════════════════════════════════════ */}
      {selectedStudent && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
          {/* overlay backdrop */}
          <div 
            onClick={() => setSelectedStudent(null)}
            style={{ position: "absolute", inset: 0, backgroundColor: "rgba(11,26,14,.55)", backdropFilter: "blur(4px)" }} 
          />
          
          {/* modal card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: "relative", zIndex: 110, width: "100%", maxWidth: "680px", backgroundColor: "#ffffff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)", border: "1px solid #DDD8CF" }}
          >
            {/* Gold Accent Header Stripe */}
            <div style={{ height: "4px", background: "linear-gradient(90deg, #1C5230, #C8963E)" }} />
            
            {/* Modal Header */}
            <div style={{ padding: "1.75rem 2rem 1.25rem", borderBottom: "1px solid #F2EDE4", display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "linear-gradient(135deg, #1C5230, #2A7A4B)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: "1.3rem", fontWeight: "bold" }}>
                  {selectedStudent.user.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <h3 className="serif" style={{ fontSize: "1.6rem", fontWeight: "bold", color: "#0B1A0E", margin: 0 }}>
                    {selectedStudent.user.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.72rem", padding: "0.15rem 0.5rem", background: "#FAF8F4", border: "1px solid #C8963E", color: "#C8963E", borderRadius: "4px", fontWeight: "bold", letterSpacing: "0.05em" }}>
                      {selectedStudent.rollNo || "NO ROLL NO"}
                    </span>
                    <span style={{ fontSize: "0.72rem", padding: "0.15rem 0.5rem", background: selectedStudent.enrollmentType === "BATCH" ? "#E0F2FE" : "#F3E8FF", color: selectedStudent.enrollmentType === "BATCH" ? "#0369A1" : "#7E22CE", borderRadius: "4px", fontWeight: "bold" }}>
                      {selectedStudent.enrollmentType === "BATCH" ? "BATCH PROGRAM" : "DIRECT MENTORSHIP"}
                    </span>
                    <span 
                      onClick={() => handleToggleStudentPayment(selectedStudent.id, selectedStudent.paid)}
                      style={{ 
                        fontSize: "0.72rem", 
                        padding: "0.15rem 0.5rem", 
                        background: selectedStudent.paid ? "#D1FAE5" : "#FEE2E2", 
                        color: selectedStudent.paid ? "#065F46" : "#991B1B", 
                        borderRadius: "4px", 
                        fontWeight: "bold",
                        cursor: "pointer",
                        border: selectedStudent.paid ? "1px solid #A7F3D0" : "1px solid #FCA5A5"
                      }}
                      title="Click to toggle payment status"
                    >
                      {selectedStudent.paid ? "PAID" : "UNPAID"}
                    </span>
                    <span 
                      onClick={() => handleToggleStudentBlock(selectedStudent.id, selectedStudent.blocked)}
                      style={{ 
                        fontSize: "0.72rem", 
                        padding: "0.15rem 0.5rem", 
                        background: selectedStudent.blocked ? "#FEE2E2" : "#D1FAE5", 
                        color: selectedStudent.blocked ? "#991B1B" : "#065F46", 
                        borderRadius: "4px", 
                        fontWeight: "bold",
                        cursor: "pointer",
                        border: selectedStudent.blocked ? "1px solid #FCA5A5" : "1px solid #A7F3D0"
                      }}
                      title="Click to toggle Block/Unblock status"
                    >
                      {selectedStudent.blocked ? "BLOCKED" : "ACTIVE"}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)}
                style={{ marginLeft: "auto", border: "none", background: "none", color: "#8A9E8B", cursor: "pointer", padding: "0.5rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div style={{ padding: "2rem", maxHeight: "calc(80vh - 120px)", overflowY: "auto" }}>
              
              {/* SECTION 1: Personal & Enrollment Profile */}
              <div style={{ marginBottom: "2rem" }}>
                <h4 style={{ fontSize: "0.8rem", color: "#C8963E", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", borderBottom: "1px solid #FAF8F4", paddingBottom: "0.3rem" }}>
                  <User className="w-4 h-4" /> Personal & Contact Profile
                </h4>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
                  {/* Name field */}
                  <div>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "#8A9E8B", fontWeight: "bold", textTransform: "uppercase" }}>Full Registered Name</span>
                    <span style={{ fontSize: "0.95rem", color: "#0B1A0E", fontWeight: "500", display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.2rem" }}>
                      {selectedStudent.user.name}
                    </span>
                  </div>
                  
                  {/* Email field */}
                  <div>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "#8A9E8B", fontWeight: "bold", textTransform: "uppercase" }}>Email Address</span>
                    <span style={{ fontSize: "0.95rem", color: "#0B1A0E", fontWeight: "500", display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.2rem" }}>
                      <Mail className="w-4 h-4 text-green" /> {selectedStudent.user.email}
                    </span>
                  </div>
                  
                  {/* Phone field */}
                  <div>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "#8A9E8B", fontWeight: "bold", textTransform: "uppercase" }}>Phone Number</span>
                    <span style={{ fontSize: "0.95rem", color: "#0B1A0E", fontWeight: "500", display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.2rem" }}>
                      <Phone className="w-4 h-4 text-green" /> {selectedStudent.phone}
                    </span>
                  </div>
                  
                  {/* City field */}
                  <div>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "#8A9E8B", fontWeight: "bold", textTransform: "uppercase" }}>Current City</span>
                    <span style={{ fontSize: "0.95rem", color: "#0B1A0E", fontWeight: "500", display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.2rem" }}>
                      <MapPin className="w-4 h-4 text-green" /> {selectedStudent.city}
                    </span>
                  </div>

                  {/* Education level */}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "#8A9E8B", fontWeight: "bold", textTransform: "uppercase" }}>Highest Education Level</span>
                    <span style={{ fontSize: "0.95rem", color: "#0B1A0E", fontWeight: "500", display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.2rem" }}>
                      <BookOpen className="w-4 h-4 text-green" /> {selectedStudent.education || "Undergraduate / Matric / Intermediate / Not Specified"}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* SECTION 2: Academic Program */}
              <div style={{ marginBottom: "2rem" }}>
                <h4 style={{ fontSize: "0.8rem", color: "#C8963E", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", borderBottom: "1px solid #FAF8F4", paddingBottom: "0.3rem" }}>
                  <Award className="w-4 h-4" /> Academic & Program Sourcing
                </h4>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
                  {/* Enrollment Program */}
                  <div>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "#8A9E8B", fontWeight: "bold", textTransform: "uppercase" }}>Enrollment Program</span>
                    <span style={{ fontSize: "0.95rem", color: "#0B1A0E", fontWeight: "500", marginTop: "0.2rem", display: "block" }}>
                      {selectedStudent.enrollmentType === "BATCH" ? "Regular Batch Program" : "Exporters Mentorship Circle"}
                    </span>
                  </div>
                  
                  {/* Allocated Batch */}
                  <div>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "#8A9E8B", fontWeight: "bold", textTransform: "uppercase" }}>Allocated Batch</span>
                    <span style={{ fontSize: "0.95rem", color: "#0B1A0E", fontWeight: "500", marginTop: "0.2rem", display: "block" }}>
                      {selectedStudent.batch ? `${selectedStudent.batch.batchNo} - ${selectedStudent.batch.title || "Allocated Batch"}` : `${selectedBatch?.batchNo || "N/A"} - ${selectedBatch?.title || "N/A"}`}
                    </span>
                  </div>
                  
                  {/* Registration Date */}
                  <div>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "#8A9E8B", fontWeight: "bold", textTransform: "uppercase" }}>Date Registered</span>
                    <span style={{ fontSize: "0.95rem", color: "#0B1A0E", fontWeight: "500", display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.2rem" }}>
                      <Calendar className="w-4 h-4 text-green" /> {new Date(selectedStudent.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* SECTION 3: Security Credentials */}
              <div style={{ background: "#FAF8F4", border: "1px solid #EAE4D9", borderRadius: "12px", padding: "1.5rem" }}>
                <h4 style={{ fontSize: "0.8rem", color: "#1C5230", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <Lock className="w-4 h-4 text-accent" /> Security Credentials
                </h4>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #EAE4D9", paddingBottom: "0.75rem" }}>
                    <div>
                      <span style={{ display: "block", fontSize: "0.75rem", color: "#8A9E8B", fontWeight: "bold" }}>USERNAME / SIGN-IN EMAIL</span>
                      <code style={{ fontSize: "0.9rem", color: "#0B1A0E", fontFamily: "monospace", fontWidth: "bold" }}>{selectedStudent.user.email}</code>
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(selectedStudent.user.email);
                        alert("Email copied to clipboard!");
                      }}
                      style={{ fontSize: "0.7rem", padding: "0.3rem 0.6rem", border: "1px solid #DDD8CF", backgroundColor: "#ffffff", borderRadius: "5px", cursor: "pointer", color: "#4A5D4C", fontWeight: "500" }}
                    >
                      Copy
                    </button>
                  </div>
                  
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #EAE4D9", paddingBottom: "0.75rem" }}>
                    <div>
                      <span style={{ display: "block", fontSize: "0.75rem", color: "#8A9E8B", fontWeight: "bold" }}>STUDENT SYSTEM ID / ROLL NO</span>
                      <code style={{ fontSize: "0.9rem", color: "#0B1A0E", fontFamily: "monospace", fontWidth: "bold" }}>{selectedStudent.rollNo || "N/A"}</code>
                    </div>
                    <button 
                      onClick={() => {
                        if (selectedStudent.rollNo) {
                          navigator.clipboard.writeText(selectedStudent.rollNo);
                          alert("Roll No copied to clipboard!");
                        }
                      }}
                      style={{ fontSize: "0.7rem", padding: "0.3rem 0.6rem", border: "1px solid #DDD8CF", backgroundColor: "#ffffff", borderRadius: "5px", cursor: "pointer", color: "#4A5D4C", fontWeight: "500" }}
                    >
                      Copy
                    </button>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #EAE4D9", paddingBottom: "0.75rem" }}>
                    <div>
                      <span style={{ display: "block", fontSize: "0.75rem", color: "#8A9E8B", fontWeight: "bold" }}>ORIGINAL PASSWORD (PLAIN TEXT)</span>
                      <code style={{ fontSize: "0.95rem", color: "#1C5230", fontFamily: "monospace", fontWidth: "bold" }}>
                        {selectedStudent.user.plainPassword || "Legacy Enrolled (Hashed Only)"}
                      </code>
                    </div>
                    {selectedStudent.user.plainPassword && (
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(selectedStudent.user.plainPassword || "");
                          alert("Original password copied to clipboard!");
                        }}
                        style={{ fontSize: "0.7rem", padding: "0.3rem 0.6rem", border: "1px solid #DDD8CF", backgroundColor: "#ffffff", borderRadius: "5px", cursor: "pointer", color: "#4A5D4C", fontWeight: "500" }}
                      >
                        Copy
                      </button>
                    )}
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ maxWidth: "80%" }}>
                      <span style={{ display: "block", fontSize: "0.75rem", color: "#8A9E8B", fontWeight: "bold" }}>CRYPTOGRAPHIC HASH (BCRYPT ENCRYPTION)</span>
                      <code style={{ fontSize: "0.75rem", color: "#8A9E8B", fontFamily: "monospace", wordBreak: "break-all" }}>
                        {selectedStudent.user.password || "Secure Bcrypt One-Way Hash"}
                      </code>
                    </div>
                    <span style={{ fontSize: "0.65rem", padding: "0.25rem 0.5rem", border: "1px solid #1C5230", backgroundColor: "rgba(28,82,48,.08)", borderRadius: "5px", color: "#1C5230", fontWeight: "bold", textTransform: "uppercase" }}>
                      Bcrypt-V2
                    </span>
                  </div>
                </div>
              </div>

            </div>
            
            {/* Modal Footer */}
            <div style={{ padding: "1.25rem 2rem", background: "#FAF8F4", borderTop: "1px solid #F2EDE4", display: "flex", justifyContent: "end" }}>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="btn-primary"
                style={{ padding: "0.6rem 1.75rem", fontSize: "0.85rem" }}
              >
                Close Profile
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
