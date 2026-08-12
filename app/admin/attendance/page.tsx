"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ClipboardCheck, Save } from "lucide-react"

interface Batch { id: string; batchNo: string; title: string }
interface Student { id: string; rollNo: string; user: { name: string } }
interface PastAttendanceRecord { studentId: string; lectureNo: number; status: "PRESENT" | "ABSENT" | "LEAVE"; date: string }

export default function AdminAttendancePage() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [selectedBatch, setSelectedBatch] = useState("")
  const [students, setStudents] = useState<Student[]>([])
  const [lectureNo, setLectureNo] = useState(1)
  const [attendance, setAttendance] = useState<Record<string, string>>({})
  const [pastRecords, setPastRecords] = useState<PastAttendanceRecord[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadBatches = async () => {
      try {
        const res = await fetch("/api/batches", { cache: "no-store" })
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || "Failed to load batches")
        }

        setBatches(data.batches || [])
      } catch (error) {
        console.error("[admin/attendance] batches fetch error:", error)
        setError(error instanceof Error ? error.message : "Failed to load batches")
      }
    }

    loadBatches()
  }, [])

  useEffect(() => {
    if (selectedBatch) {
      const loadStudents = async () => {
        try {
          const res = await fetch(`/api/students?batchId=${selectedBatch}`, { cache: "no-store" })
          const data = await res.json()

          if (!res.ok) {
            throw new Error(data.error || "Failed to load students")
          }

          setStudents(data.students || [])
          const initial: Record<string, string> = {}
          data.students?.forEach((s: Student) => { initial[s.id] = "PRESENT" })
          setAttendance(initial)

          // Load past attendance
          try {
            const attRes = await fetch(`/api/attendance?batchId=${selectedBatch}`, { cache: "no-store" })
            const attData = await attRes.json()
            if (attRes.ok && attData.records) {
              setPastRecords(attData.records)
              if (attData.records.length > 0) {
                const maxLecture = Math.max(...attData.records.map((r: any) => r.lectureNo))
                setLectureNo(maxLecture + 1)
              } else {
                setLectureNo(1)
              }
            }
          } catch (err) {
            console.error("Failed to load past attendance", err)
          }

          setError("")
        } catch (error) {
          console.error("[admin/attendance] students fetch error:", error)
          setError(error instanceof Error ? error.message : "Failed to load students")
          setStudents([])
          setAttendance({})
          setPastRecords([])
        }
      }

      loadStudents()
    }
  }, [selectedBatch])

  const handleSave = async () => {
    setSaving(true)
    setError("")
    const records = Object.entries(attendance).map(([studentId, status]) => ({ studentId, status }))
    try {
      if (!selectedBatch) {
        throw new Error("Please select a batch")
      }

      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchId: selectedBatch, lectureNo, date: new Date().toISOString(), records }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to save attendance")
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      
      // Refresh past records
      const attRes = await fetch(`/api/attendance?batchId=${selectedBatch}`, { cache: "no-store" })
      const attData = await attRes.json()
      if (attRes.ok) {
        setPastRecords(attData.records || [])
        setLectureNo(prev => prev + 1)
      }
    } catch (error) {
      console.error("[admin/attendance] save error:", error)
      setError(error instanceof Error ? error.message : "Failed to save attendance")
    } finally {
      setSaving(false)
    }
  }

  const pastLecturesMap = new Map<number, string>()
  pastRecords.forEach(r => {
    if (!pastLecturesMap.has(r.lectureNo)) pastLecturesMap.set(r.lectureNo, r.date)
  })
  const pastLectureNos = Array.from(pastLecturesMap.keys()).sort((a, b) => b - a)
  const displayPastLectures = pastLectureNos.filter(l => l !== lectureNo)

  return (
    <div className="pt-24 pb-16 bg-gray-bg min-h-screen">
      <div className="sec-wrap">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-display)] mb-8 text-text-dark">
            <ClipboardCheck className="w-8 h-8 text-primary inline mr-2" />Attendance Portal
          </h1>

          <div className="flex gap-[clamp(0.75rem,1.5vw,1rem)] mb-8 flex-wrap">
            <select className="input-field w-64" value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)}>
              <option value="">Select Batch</option>
              {batches.map(b => <option key={b.id} value={b.id}>{b.batchNo} - {b.title}</option>)}
            </select>
            <div>
              <label className="text-sm text-text-muted mr-2">Lecture #</label>
              <input type="number" min={1} className="input-field w-24 inline-block" value={lectureNo} onChange={e => setLectureNo(parseInt(e.target.value) || 1)} />
            </div>
            {students.length > 0 && (
              <button onClick={handleSave} disabled={saving} className="btn-primary ml-auto">
                <Save className="w-4 h-4" /> {saving ? "Saving..." : saved ? "Saved!" : "Save Attendance"}
              </button>
            )}
          </div>

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          {students.length > 0 ? (
            <div className="admin-card overflow-x-auto" style={{padding:0}}>
              <table className="table-premium min-w-max w-full">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-10 bg-[#051114] w-[140px] min-w-[140px]">Roll No</th>
                    <th className="sticky left-[140px] z-10 bg-[#051114] w-[200px] min-w-[200px]">Student Name</th>
                    <th className="text-center sticky left-[340px] z-10 bg-[#051114] border-r border-[#1a363d] w-[220px] min-w-[220px]">
                      L{lectureNo} - {new Date().toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                    </th>
                    {displayPastLectures.map(l => (
                      <th key={l} className="text-center text-text-muted font-normal text-xs min-w-[80px]">
                        L{l} <br/> {new Date(pastLecturesMap.get(l)!).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id} className="group">
                      <td className="text-primary sticky left-0 z-0 bg-white group-hover:bg-gray-50 transition-colors w-[140px] min-w-[140px] truncate">{s.rollNo}</td>
                      <td className="sticky left-[140px] z-0 bg-white group-hover:bg-gray-50 transition-colors whitespace-nowrap w-[200px] min-w-[200px] truncate">{s.user.name}</td>
                      <td className="sticky left-[340px] z-0 bg-white group-hover:bg-gray-50 transition-colors border-r border-border-light shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] w-[220px] min-w-[220px]">
                        <div className="flex justify-center items-center">
                          <label className="cursor-pointer select-none">
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={attendance[s.id] === "PRESENT"}
                                onChange={(e) => {
                                  const newStatus = e.target.checked ? "PRESENT" : "ABSENT"
                                  setAttendance(prev => ({ ...prev, [s.id]: newStatus }))
                                }}
                                className="sr-only"
                              />
                              <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
                                attendance[s.id] === "PRESENT"
                                  ? "bg-primary border-primary text-white scale-100"
                                  : "border-border-light bg-white hover:border-primary/50 text-transparent"
                              }`}>
                                <svg className="w-3.5 h-3.5 stroke-[3] stroke-current" fill="none" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              </div>
                            </div>
                          </label>
                        </div>
                      </td>
                      {displayPastLectures.map(l => {
                        const rec = pastRecords.find(r => r.studentId === s.id && r.lectureNo === l)
                        return (
                          <td key={l} className="text-center font-bold text-sm">
                            {rec ? (
                              rec.status === "PRESENT" ? <span className="text-primary">P</span> :
                              rec.status === "ABSENT" ? <span className="text-red-500">A</span> :
                              <span className="text-yellow-600">L</span>
                            ) : (
                              <span className="text-text-muted">-</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : selectedBatch ? (
            <p className="text-text-muted text-center py-12">No students enrolled in this batch yet.</p>
          ) : (
            <p className="text-text-muted text-center py-12">Select a batch to view students and mark attendance.</p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
