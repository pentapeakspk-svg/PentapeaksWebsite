"use client"
import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { fadeUpVariant, staggerContainer } from "@/lib/animations"
import { BookOpen, Calendar, CheckCircle, XCircle, Clock, User, GraduationCap, LogOut, CreditCard, Video, Paperclip, Plus, Trash2, Check, RefreshCw, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface AttendanceRecord {
  id: string
  lectureNo: number | null
  date: string
  status: "PRESENT" | "ABSENT" | "LEAVE"
  batchNo: string
  batchTitle: string
}

interface AttendanceSummary {
  present: number
  absent: number
  leave: number
}

interface ClassLink {
  id: string
  title: string
  link: string
  sentAt: string
  attachments?: string[]
}

const initialSummary: AttendanceSummary = { present: 0, absent: 0, leave: 0 }

export default function StudentDashboard() {
  const { data: session } = useSession()
  const user = session?.user as Record<string, unknown> | undefined
  const [summary, setSummary] = useState<AttendanceSummary>(initialSummary)
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [classLinks, setClassLinks] = useState<ClassLink[]>([])
  const [classRecordings, setClassRecordings] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [enrolledBatches, setEnrolledBatches] = useState<any[]>([])
  const [availableBatches, setAvailableBatches] = useState<any[]>([])
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [loadingAttendance, setLoadingAttendance] = useState(false)
  const [loadingLinks, setLoadingLinks] = useState(false)
  const [loadingRecordings, setLoadingRecordings] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingBatches, setLoadingBatches] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const [loadingData, setLoadingData] = useState(false)

  const loadDashboardData = async () => {
    if (!session) return
    setLoadingData(true)
    setError("")
    setLoadingProfile(true)
    setLoadingAttendance(true)
    setLoadingLinks(true)
    setLoadingRecordings(true)
    setLoadingBatches(true)

    try {
      const res = await fetch("/api/student/dashboard-data", { cache: "no-store" })
      const data = await res.json()
      if (res.ok) {
        setProfile(data.profile)
        setSummary(data.attendance?.summary || initialSummary)
        setRecords(data.attendance?.records || [])
        setClassLinks(data.classLinks || [])
        setClassRecordings(data.classRecordings || [])
        setEnrolledBatches(data.batches?.enrolled || [])
        setAvailableBatches(data.batches?.available || [])
        setActiveBatchId(data.batches?.activeBatchId || null)
      } else {
        throw new Error(data.error || "Failed to load dashboard data")
      }
    } catch (err) {
      console.error("Dashboard load error:", err)
      setError(err instanceof Error ? err.message : "Failed to load dashboard data")
    } finally {
      setLoadingData(false)
      setLoadingProfile(false)
      setLoadingAttendance(false)
      setLoadingLinks(false)
      setLoadingRecordings(false)
      setLoadingBatches(false)
    }
  }

  const handleBatchAction = async (action: "join" | "leave" | "switch", batchId: string) => {
    setActionLoading(`${action}-${batchId}`)
    try {
      const res = await fetch("/api/student/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, batchId })
      })
      if (res.ok) {
        await loadDashboardData()
      } else {
        const data = await res.json()
        alert(data.error || "Failed to perform action")
      }
    } catch (err) {
      console.error("Batch action error:", err)
    } finally {
      setActionLoading(null)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [session])

  if (!session) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 text-text-dark">Please login to access your dashboard</h2>
        <Link href="/student/login" className="btn-primary">Student Login</Link>
      </div>
    </div>
  )

  const isPaid = profile ? profile.paid : (user?.paid as boolean | undefined) ?? false
  const enrollmentType = profile ? profile.enrollmentType : "BATCH"

  return (
    <div className="pt-24 pb-16 bg-gray-bg min-h-screen">
      <div className="sec-wrap">
        {/* Unpaid Warning Banner */}
        {!isPaid && !loadingProfile && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-8 p-4 rounded-xl border border-rose-200 bg-rose-50/40 text-rose-950 flex items-start gap-3 shadow-sm"
          >
            <Clock className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Fee Payment Status: Pending</h4>
              <p className="text-xs text-rose-800/90 mt-0.5 leading-relaxed">
                Our records indicate that your program registration fee has not yet been updated to paid. Please complete your fee submission and contact the administration to verify and update your enrollment status.
              </p>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-[family-name:var(--font-display)] text-text-dark">
              Welcome back, <span className="text-primary">{String(user?.name) || "Student"}</span>
            </h1>
            <div className="flex flex-wrap gap-[clamp(0.75rem,1.5vw,1rem)] mt-2 text-sm text-text-muted items-center">
              {profile?.batchNo ? <span>Batch: <strong className="text-primary">{String(profile.batchNo)}</strong></span> : null}
              {profile?.rollNo ? <span>Roll No: <strong className="text-primary">{String(profile.rollNo)}</strong></span> : null}
              <span className="flex items-center gap-1.5 ml-1">
                Fee Status: 
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  isPaid 
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                    : "bg-rose-100 text-rose-800 border border-rose-200"
                }`}>
                  {isPaid ? "Paid" : "Unpaid"}
                </span>
              </span>
            </div>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/student/login' })} 
            className="btn-outline flex items-center gap-2 text-sm px-4 py-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Batch Info */}
          <motion.div variants={fadeUpVariant} className="lg:col-span-2">
            <div className="admin-card">
              <h2 className="text-lg font-bold font-[family-name:var(--font-display)] mb-4 flex items-center gap-2 text-text-dark">
                <GraduationCap className="w-5 h-5 text-primary" /> Program & Enrollment
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-[clamp(0.75rem,1.5vw,1rem)] mb-6">
                {[
                  { label: "Batch No", value: (profile?.batchNo as string) || "N/A", colorClass: "text-primary" },
                  { label: "Roll No", value: (profile?.rollNo as string) || "N/A", colorClass: "text-primary" },
                  { label: "Type", value: enrollmentType === "BATCH" ? "Batch Course" : "Mentorship Circle", colorClass: "text-primary" },
                  { label: "Account Status", value: "Active", colorClass: "text-emerald-600 font-semibold" },
                  { 
                    label: "Fee Status", 
                    value: isPaid ? "Paid" : "Unpaid", 
                    colorClass: isPaid ? "text-emerald-600 font-bold" : "text-rose-600 font-bold" 
                  },
                  { label: "Schedule", value: profile?.batchSchedule || "Not Set", colorClass: "text-text-dark text-xs" },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-bg rounded-lg p-3 border border-border-light">
                    <p className="text-xs text-text-muted">{item.label}</p>
                    <p className={`text-sm font-semibold mt-1 ${item.colorClass}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Batch Management Area */}
              <div className="border-t border-border-light pt-6">
                <h3 className="text-sm font-bold text-text-dark mb-4 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-primary" /> My Batches & Enrollments
                </h3>
                
                {loadingBatches ? (
                  <div className="text-center py-4 text-text-muted text-xs">Loading enrollments...</div>
                ) : (
                  <div className="space-y-4">
                    {/* Enrolled Batches */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border-light text-text-muted uppercase tracking-wider text-[10px]">
                            <th className="pb-2 font-semibold">Batch No</th>
                            <th className="pb-2 font-semibold">Title</th>
                            <th className="pb-2 font-semibold">Schedule</th>
                            <th className="pb-2 font-semibold">Status</th>
                            <th className="pb-2 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {enrolledBatches.map((batch) => {
                            const isActive = batch.id === activeBatchId;
                            const isActionLoading = actionLoading?.includes(batch.id);
                            return (
                              <tr key={batch.id} className={`border-b border-border-light/60 ${isActive ? "bg-primary/5 font-semibold" : ""}`}>
                                <td className="py-3 text-text-dark font-medium">{batch.batchNo}</td>
                                <td className="py-3 text-text-dark">{batch.title}</td>
                                <td className="py-3 text-text-muted">{batch.schedule || "Not Set"}</td>
                                <td className="py-3">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    {isActive ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                                        <Check className="w-3 h-3" /> Active Batch
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-text-muted font-semibold text-[10px]">
                                        Enrolled
                                      </span>
                                    )}
                                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                      batch.paid 
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                        : "bg-rose-50 text-rose-700 border border-rose-200"
                                    }`}>
                                      {batch.paid ? "Paid" : "Unpaid"}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 text-right space-x-2">
                                  {!isActive && (
                                    <button
                                      disabled={!!actionLoading}
                                      onClick={() => handleBatchAction("switch", batch.id)}
                                      className="px-2.5 py-1 rounded bg-primary text-white hover:bg-primary-dark font-medium transition disabled:opacity-50"
                                    >
                                      Switch
                                    </button>
                                  )}
                                  <button
                                    disabled={!!actionLoading}
                                    onClick={() => {
                                      if (confirm("Are you sure you want to leave this batch?")) {
                                        handleBatchAction("leave", batch.id);
                                      }
                                    }}
                                    className="px-2.5 py-1 rounded border border-rose-200 text-rose-600 hover:bg-rose-50 font-medium transition disabled:opacity-50"
                                  >
                                    Leave
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                          {enrolledBatches.length === 0 && (
                            <tr>
                              <td colSpan={5} className="py-4 text-center text-text-muted italic">
                                You are not currently active in any batches.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Join Other Batches */}
                    {availableBatches.length > 0 && (
                      <div className="bg-primary/5 rounded-xl p-4 border border-primary/15 mt-4">
                        <h4 className="text-xs font-bold text-primary flex items-center gap-1.5 mb-3">
                          <Plus className="w-3.5 h-3.5" /> Join Another Batch
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {availableBatches.map((batch) => (
                            <div key={batch.id} className="bg-white rounded-lg p-3 border border-border-light shadow-sm flex items-center justify-between gap-3">
                              <div>
                                <p className="text-xs font-bold text-text-dark">{batch.title}</p>
                                <p className="text-[10px] text-text-muted mt-0.5">No: {batch.batchNo} | {batch.schedule || "No Schedule"} | Live via Zoom | Fee: Rs. {batch.fee?.toLocaleString() || "0"}</p>
                              </div>
                              <button
                                disabled={!!actionLoading}
                                onClick={() => handleBatchAction("join", batch.id)}
                                className="px-3 py-1.5 rounded bg-primary text-white hover:bg-primary-dark font-semibold text-xs transition flex items-center gap-1 flex-shrink-0 disabled:opacity-50"
                              >
                                <Plus className="w-3 h-3" /> Join
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Profile */}
          <motion.div variants={fadeUpVariant}>
            <div className="admin-card">
              <h2 className="text-lg font-bold font-[family-name:var(--font-display)] mb-4 flex items-center gap-2 text-text-dark">
                <User className="w-5 h-5 text-primary" /> Profile
              </h2>
              <div className="space-y-3 text-sm">
                <p><span className="text-text-muted">Name:</span> <span className="text-text-dark">{user?.name as string}</span></p>
                <p><span className="text-text-muted">Email:</span> <span className="text-text-dark">{user?.email as string}</span></p>
                {profile?.phone && <p><span className="text-text-muted">Phone:</span> <span className="text-text-dark">{profile.phone}</span></p>}
                {profile?.city && <p><span className="text-text-muted">City:</span> <span className="text-text-dark">{profile.city}</span></p>}
              </div>
            </div>
          </motion.div>

          {/* Class Links & Recordings OR Warning */}
          {isPaid ? (
            <>
              {/* Class Links */}
              <motion.div variants={fadeUpVariant} className="lg:col-span-2">
                <div className="admin-card">
                  <h2 className="text-lg font-bold font-[family-name:var(--font-display)] mb-4 flex items-center gap-2 text-text-dark">
                    <BookOpen className="w-5 h-5 text-primary" /> Class Join Links {profile?.batchNo ? `(${profile.batchNo})` : ""}
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="table-premium">
                      <thead><tr><th>#</th><th>Title</th><th>Link</th><th>Attachments</th><th>Date</th></tr></thead>
                      <tbody>
                        {loadingLinks ? (
                          <tr><td colSpan={5} className="text-center text-text-muted py-8">Loading class links...</td></tr>
                        ) : classLinks.length > 0 ? (
                          classLinks.map((link, idx) => (
                            <tr key={link.id}>
                              <td>{idx + 1}</td>
                              <td>{link.title}</td>
                              <td>
                                <a href={link.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                                  Join Class
                                </a>
                              </td>
                              <td>
                                {link.attachments && link.attachments.length > 0 ? (
                                  <div className="flex flex-col gap-1">
                                    {link.attachments.map((url: string, i: number) => {
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
                              <td>{new Date(link.sentAt).toLocaleDateString()}</td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={5} className="text-center text-text-muted py-8">No class links available yet. Your instructor will share links here.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>

              {/* Class Recordings */}
              <motion.div variants={fadeUpVariant} className="lg:col-span-2">
                <div className="admin-card">
                  <h2 className="text-lg font-bold font-[family-name:var(--font-display)] mb-4 flex items-center gap-2 text-text-dark">
                    <Video className="w-5 h-5 text-primary" /> Class Recordings {profile?.batchNo ? `(${profile.batchNo})` : ""}
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="table-premium">
                      <thead><tr><th>#</th><th>Title</th><th>Watch Link</th><th>Attachments</th><th>Date Uploaded</th></tr></thead>
                      <tbody>
                        {loadingRecordings ? (
                          <tr><td colSpan={5} className="text-center text-text-muted py-8">Loading recordings...</td></tr>
                        ) : classRecordings.length > 0 ? (
                          classRecordings.map((recording, idx) => (
                            <tr key={recording.id}>
                              <td>{idx + 1}</td>
                              <td>{recording.title}</td>
                              <td>
                                <a href={recording.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                                  Watch Recording
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
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={5} className="text-center text-text-muted py-8">No class recordings available yet. Your instructor will share class video recordings here.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            </>
          ) : loadingProfile ? (
            <motion.div variants={fadeUpVariant} className="lg:col-span-2">
              <div className="admin-card flex flex-col items-center justify-center text-center py-24 shadow-sm border border-border-light">
                <RefreshCw className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-sm text-text-muted">Loading classes and recordings...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div variants={fadeUpVariant} className="lg:col-span-2">
              <div className="admin-card border border-rose-200 bg-rose-50/40 flex flex-col items-center justify-center text-center py-16 shadow-sm">
                <Clock className="w-12 h-12 text-rose-500 mb-4 opacity-90" />
                <h2 className="text-xl font-bold font-[family-name:var(--font-display)] text-rose-950 mb-3">
                  Fee Clearance Required
                </h2>
                <p className="text-sm text-rose-800/90 max-w-md mx-auto leading-relaxed">
                  Your fee is currently due. Please clear your dues to access the live classes and recordings. 
                  Once the administration updates your status to "Paid", these sections will automatically unlock.
                </p>
              </div>
            </motion.div>
          )}

          {/* Attendance */}
          <motion.div variants={fadeUpVariant}>
            <div className="admin-card">
              <h2 className="text-lg font-bold font-[family-name:var(--font-display)] mb-4 flex items-center gap-2 text-text-dark">
                <Calendar className="w-5 h-5 text-primary" /> Attendance
              </h2>
              <div className="flex gap-[clamp(0.75rem,1.5vw,1rem)] justify-around mb-4">
                {[
                  { icon: CheckCircle, label: "Present", color: "text-primary", count: summary.present },
                  { icon: XCircle, label: "Absent", color: "text-red-500", count: summary.absent },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <item.icon className={`w-6 h-6 ${item.color} mx-auto`} />
                    <p className="text-lg font-bold mt-1">{item.count}</p>
                    <p className="text-xs text-text-muted">{item.label}</p>
                  </div>
                ))}
              </div>
              {loadingAttendance ? (
                <p className="text-sm text-text-muted text-center">Loading attendance...</p>
              ) : error ? (
                <p className="text-sm text-red-500 text-center">{error}</p>
              ) : records.length > 0 ? (
                <div className="space-y-3">
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="flex items-center justify-between rounded-lg bg-gray-bg border border-border-light px-3 py-3 rounded-lg text-sm">
                      <div>
                        <p className="font-semibold text-text-dark">L{record.lectureNo || "-"} - {record.batchNo}</p>
                        <p className="text-xs text-text-muted">{new Date(record.date).toLocaleDateString()}</p>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${record.status === "PRESENT" ? "bg-primary-pale text-primary" : record.status === "ABSENT" ? "bg-red-100 text-red-500" : "bg-yellow-100 text-yellow-600"}`}>
                        {record.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted text-center">No attendance records found yet.</p>
              )}
            </div>
          </motion.div>

          {/* AI Assistant Support Card */}
          <motion.div variants={fadeUpVariant}>
            <div className="admin-card bg-emerald-50/30 border border-emerald-100/80 shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-200/20 rounded-full blur-xl pointer-events-none" />
              <h2 className="text-lg font-bold font-[family-name:var(--font-display)] mb-2 flex items-center gap-2 text-emerald-900">
                ✨ AI Trade & Mentorship Assistant
              </h2>
              <p className="text-xs text-text-muted mb-4 leading-relaxed">
                Have questions about Letters of Credit (LC), documentation requirements, custom clearances, WEBOC setup, or our export commodities? Get instant, expert trade guidance from our AI Assistant.
              </p>
              <Link href="/student/counselor" className="btn-primary w-full text-center block text-sm py-2">
                Open AI Assistant
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
