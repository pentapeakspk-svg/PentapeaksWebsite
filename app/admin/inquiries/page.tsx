"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Inbox } from "lucide-react"
import { prefetch } from "@/lib/admin-cache"

interface Inquiry { id: string; name: string; email: string; phone: string | null; subject: string; message: string; createdAt: string }

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    const loadInquiries = async () => {
      try {
        const data = await prefetch("/api/contact")
        setInquiries(data.inquiries || [])
        setError("")
      } catch (error) {
        console.error("[admin/inquiries] fetch error:", error)
        setError(error instanceof Error ? error.message : "Failed to load contact inquiries")
        setInquiries([])
      }
    }

    loadInquiries()
  }, [])

  return (
    <div className="pt-24 pb-16 bg-gray-bg min-h-screen">
      <div className="sec-wrap">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-display)] mb-8 text-text-dark"><Inbox className="w-8 h-8 text-primary inline mr-2" />Contact Inquiries</h1>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <div className="space-y-4">
            {inquiries.length === 0 ? (
              <p className="text-text-muted text-center py-12">No contact inquiries yet.</p>
            ) : inquiries.map(inq => (
              <div key={inq.id} className="admin-card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-primary">{inq.name}</h3>
                    <p className="text-sm text-text-muted">{inq.email}{inq.phone ? ` • ${inq.phone}` : ""}</p>
                  </div>
                  <span className="text-xs text-text-muted">{new Date(inq.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-primary mb-2">Subject: {inq.subject}</p>
                <p className="text-text-body text-sm">{inq.message}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
