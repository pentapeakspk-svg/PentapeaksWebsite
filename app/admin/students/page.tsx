"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Download, Users, Trash2, X, Shield, Lock, BookOpen, MapPin, Phone, Mail, User, Award, Calendar } from "lucide-react"
import { prefetch } from "@/lib/admin-cache"

interface Student { id: string; rollNo: string; user: { name: string; email: string; password?: string; plainPassword?: string }; phone: string; city: string; education?: string; enrollmentType: string; paid: boolean; blocked: boolean; batch: { id: string; batchNo: string; title?: string } | null; enrollments?: any[]; createdAt: string }

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [batches, setBatches] = useState<{ id: string; batchNo: string; title: string }[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("")
  const [selectedBatchId, setSelectedBatchId] = useState("")
  const [error, setError] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [studentsData, batchesData] = await Promise.all([
          prefetch("/api/students"),
          prefetch("/api/batches")
        ])

        setStudents(studentsData.students || [])
        setBatches(batchesData.batches || [])
        setError("")
      } catch (error) {
        console.error("[admin/students] fetch error:", error)
        setError(error instanceof Error ? error.message : "Failed to load data")
        setStudents([])
        setBatches([])
      }
    }

    loadData()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this student? ALL associated data (login, password, attendance) will be irrecoverably lost!")) return;

    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete student")
      }
      setStudents(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : "Failed to delete the student")
    }
  }

  const handleTogglePayment = async (studentId: string, currentPaid: boolean) => {
    try {
      const res = await fetch(`/api/students/${studentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paid: !currentPaid }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to update payment status")
      }

      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, paid: !currentPaid } : s))
      if (selectedStudent && selectedStudent.id === studentId) {
        setSelectedStudent(prev => prev ? { ...prev, paid: !currentPaid } : null)
      }
    } catch (error) {
      console.error("[admin/students] toggle payment error:", error)
      alert(error instanceof Error ? error.message : "Failed to update payment status")
    }
  }

  const handleToggleBlock = async (studentId: string, currentBlocked: boolean) => {
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

      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, blocked: !currentBlocked } : s))
      if (selectedStudent && selectedStudent.id === studentId) {
        setSelectedStudent(prev => prev ? { ...prev, blocked: !currentBlocked } : null)
      }
    } catch (error) {
      console.error("[admin/students] toggle block error:", error)
      alert(error instanceof Error ? error.message : "Failed to update block status")
    }
  }

  const filtered = students.filter(s =>
    (!search || s.user.name.toLowerCase().includes(search.toLowerCase()) || s.user.email.toLowerCase().includes(search.toLowerCase())) &&
    (!filter || s.enrollmentType === filter) &&
    (!selectedBatchId || s.batch?.id === selectedBatchId)
  )

  const exportCSV = () => {
    const csv = "Roll No,Name,Email,Phone,City,Type,Batch,Date\n" + filtered.map(s =>
      `${s.rollNo},${s.user.name},${s.user.email},${s.phone},${s.city},${s.enrollmentType},${s.batch?.batchNo || "N/A"},${new Date(s.createdAt).toLocaleDateString()}`
    ).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = "students.csv"; a.click()
  }

  return (
    <div className="pt-24 pb-16 bg-gray-bg min-h-screen">
      <div className="sec-wrap">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-[clamp(0.75rem,1.5vw,1rem)]">
            <h1 className="text-3xl font-bold font-[family-name:var(--font-display)] text-text-dark"><Users className="w-8 h-8 text-primary inline mr-2" />Students</h1>
            <button onClick={exportCSV} className="btn-outline text-sm"><Download className="w-4 h-4" /> Export CSV</button>
          </div>

          <div className="flex gap-[clamp(0.75rem,1.5vw,1rem)] mb-6 flex-wrap">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input className="input-field" style={{ paddingLeft: "2.75rem" }} placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="input-field w-48" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="">All Types</option>
              <option value="BATCH">Batch</option>
              <option value="MENTORSHIP">Mentorship</option>
            </select>
            <select className="input-field w-48" value={selectedBatchId} onChange={e => setSelectedBatchId(e.target.value)}>
              <option value="">All Batches</option>
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.batchNo}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <div className="admin-card overflow-x-auto" style={{padding:0}}>
            <table className="table-premium">
              <thead>
                <tr><th>Roll No</th><th>Name</th><th>Email</th><th>Phone</th><th>City</th><th>Type</th><th>Batch</th><th>Payment</th><th>Status</th><th>Date</th><th className="text-right">Actions</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={11} className="text-center py-8 text-text-muted">No students found. Students will appear here after enrollment.</td></tr>
                ) : filtered.map(s => (
                  <tr key={s.id} className="cursor-pointer hover:bg-gray-50/80 transition-colors" onClick={() => setSelectedStudent(s)}>
                    <td className="text-primary font-medium">{s.rollNo}</td>
                    <td className="font-medium text-text-dark">{s.user.name}</td>
                    <td className="text-text-muted">{s.user.email}</td>
                    <td>{s.phone}</td>
                    <td>{s.city}</td>
                    <td><span className={`px-2 py-1 rounded text-xs ${s.enrollmentType === "BATCH" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>{s.enrollmentType}</span></td>
                    <td>
                      <div className="flex flex-col gap-2">
                        {s.enrollments && s.enrollments.length > 0 ? (
                          s.enrollments.map((e: any) => (
                            <div key={e.id} className="h-7 flex items-center font-medium">
                              {e.batch.batchNo}
                            </div>
                          ))
                        ) : (
                          <div className="h-7 flex items-center">{s.batch?.batchNo || "N/A"}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-2">
                        {s.enrollments && s.enrollments.length > 0 ? (
                          s.enrollments.map((e: any) => (
                            <div key={e.id} className="h-7 flex items-center">
                              <button
                                type="button"
                                onClick={async (event) => {
                                  event.stopPropagation();
                                  try {
                                    const res = await fetch(`/api/students/${s.id}`, {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ paid: !e.paid, batchId: e.batchId }),
                                    });
                                    if (res.ok) {
                                      const updatedRes = await fetch("/api/students", { cache: "no-store" });
                                      const updatedData = await updatedRes.json();
                                      if (updatedRes.ok) {
                                        setStudents(updatedData.students || []);
                                      }
                                    }
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                                className={`px-2.5 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                                  e.paid
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200"
                                    : "bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200"
                                }`}
                                title={`Click to toggle payment for ${e.batch.batchNo}`}
                                style={{ minWidth: "60px" }}
                              >
                                {e.paid ? "Paid" : "Unpaid"}
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="h-7 flex items-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTogglePayment(s.id, s.paid);
                              }}
                              className={`px-2.5 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                                s.paid
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200"
                                  : "bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200"
                              }`}
                              title="Click to toggle payment status"
                              style={{ minWidth: "60px" }}
                            >
                              {s.paid ? "Paid" : "Unpaid"}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleBlock(s.id, s.blocked);
                        }}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                          s.blocked
                            ? "bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                        }`}
                        title="Click to toggle Block/Unblock status"
                        style={{ minWidth: "75px" }}
                      >
                        {s.blocked ? "Blocked" : "Active"}
                      </button>
                    </td>
                    <td className="text-text-muted">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td className="text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}
                        className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 transition-colors"
                        title="Delete student permanently"
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
          STUDENT DETAILS MODAL
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
                  {selectedStudent.user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
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
                      onClick={() => handleTogglePayment(selectedStudent.id, selectedStudent.paid)}
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
                      onClick={() => handleToggleBlock(selectedStudent.id, selectedStudent.blocked)}
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
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#FAF8F4"; e.currentTarget.style.color = "#0B1A0E"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#8A9E8B"; }}
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
                      {selectedStudent.batch ? `${selectedStudent.batch.batchNo} - ${selectedStudent.batch.title || "Allocated Batch"}` : "N/A (Mentorship Direct Enrollment)"}
                    </span>
                  </div>
                  
                  {/* Registration Date */}
                  <div>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "#8A9E8B", fontWeight: "bold", textTransform: "uppercase" }}>Date Registered</span>
                    <span style={{ fontSize: "0.95rem", color: "#0B1A0E", fontWeight: "500", display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.2rem" }}>
                      <Calendar className="w-4 h-4 text-green" /> {new Date(selectedStudent.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                  </div>

                  {/* All Batch Enrollments */}
                  {selectedStudent.enrollments && selectedStudent.enrollments.length > 0 && (
                    <div style={{ gridColumn: "1 / -1", marginTop: "0.5rem" }}>
                      <span style={{ display: "block", fontSize: "0.75rem", color: "#8A9E8B", fontWeight: "bold", textTransform: "uppercase" }}>All Batch Enrollments & Fee Statuses</span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.4rem" }}>
                        {selectedStudent.enrollments.map((e: any) => (
                          <span 
                            key={e.id}
                            onClick={async () => {
                              try {
                                const res = await fetch(`/api/students/${selectedStudent.id}`, {
                                  method: "PATCH",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ paid: !e.paid, batchId: e.batchId }),
                                });
                                if (res.ok) {
                                  const updatedRes = await fetch("/api/students", { cache: "no-store" });
                                  const updatedData = await updatedRes.json();
                                  if (updatedRes.ok) {
                                    setStudents(updatedData.students || []);
                                    const updatedStudent = updatedData.students.find((s: any) => s.id === selectedStudent.id);
                                    if (updatedStudent) setSelectedStudent(updatedStudent);
                                  }
                                }
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            style={{ 
                              fontSize: "0.75rem", 
                              padding: "0.25rem 0.6rem", 
                              background: e.paid ? "#D1FAE5" : "#FEE2E2", 
                              color: e.paid ? "#065F46" : "#991B1B", 
                              borderRadius: "6px", 
                              fontWeight: "bold",
                              cursor: "pointer",
                              border: e.paid ? "1px solid #A7F3D0" : "1px solid #FCA5A5",
                              transition: "all 0.2s"
                            }}
                            title={`Click to toggle payment for ${e.batch.batchNo}`}
                          >
                            {e.batch.batchNo} - {e.batch.title || "Batch"}: {e.paid ? "PAID" : "UNPAID"}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
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
                      <code style={{ fontSize: "0.9rem", color: "#0B1A0E", fontFamily: "monospace", fontWeight: "bold" }}>{selectedStudent.user.email}</code>
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
                      <code style={{ fontSize: "0.9rem", color: "#0B1A0E", fontFamily: "monospace", fontWeight: "bold" }}>{selectedStudent.rollNo || "N/A"}</code>
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
                      <code style={{ fontSize: "0.95rem", color: "#1C5230", fontFamily: "monospace", fontWeight: "bold" }}>
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
