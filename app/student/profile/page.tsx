"use client"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { User, Mail, Phone, MapPin, GraduationCap, Hash, CreditCard, Award, BookOpen } from "lucide-react"
import Link from "next/link"

export default function StudentProfilePage() {
  const { data: session } = useSession()
  const user = session?.user as Record<string, unknown> | undefined
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      if (!session) return
      setLoading(true)
      try {
        const res = await fetch("/api/student/profile", { cache: "no-store" })
        const data = await res.json()
        if (res.ok) {
          setProfile(data.profile)
        }
      } catch (err) {
        console.error("Failed to load profile:", err)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [session])

  if (!session) return (
    <div className="min-h-screen flex items-center justify-center">
      <Link href="/student/login" className="btn-primary">Login to view profile</Link>
    </div>
  )

  const isPaid = profile ? profile.paid : (user?.paid as boolean | undefined) ?? false

  const fields = [
    { icon: User, label: "Full Name", value: (profile?.name || user?.name || "N/A") as string },
    { icon: Mail, label: "Email", value: (profile?.email || user?.email || "N/A") as string },
    { icon: Hash, label: "Roll Number", value: (profile?.rollNo || user?.rollNo || "N/A") as string },
    { icon: GraduationCap, label: "Batch", value: (profile?.batchNo || user?.batchNo || "N/A") as string },
    { icon: Phone, label: "Phone Number", value: (profile?.phone || "N/A") as string },
    { icon: MapPin, label: "City", value: (profile?.city || "N/A") as string },
    { icon: BookOpen, label: "Highest Education", value: (profile?.education || "N/A") as string },
    { icon: Award, label: "Enrollment Type", value: profile?.enrollmentType === "BATCH" ? "Batch Course" : profile?.enrollmentType === "MENTORSHIP" ? "Mentorship Circle" : "N/A" },
    { 
      icon: CreditCard, 
      label: "Fee Status", 
      value: isPaid ? "Paid" : "Unpaid", 
      badge: true, 
      paid: isPaid 
    },
  ]

  return (
    <div className="pt-24 pb-16 bg-gray-bg min-h-screen">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h1 className="text-3xl font-bold font-[family-name:var(--font-display)] text-text-dark">My <span className="text-primary">Profile</span></h1>
            <Link href="/student/dashboard" className="btn-outline text-xs px-3 py-1.5">
              Back to Dashboard
            </Link>
          </div>
          <div className="bg-white border border-border-light rounded-2xl p-8 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-primary-pale flex items-center justify-center mx-auto mb-6 relative border-2 border-primary/20">
              <User className="w-10 h-10 text-primary" />
              {loading && (
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              )}
            </div>
            <div className="space-y-4">
              {fields.map((f) => (
                <div key={f.label} className="flex items-center justify-between p-4 bg-gray-bg/50 rounded-lg hover:bg-gray-bg transition-colors border border-border-light/30">
                  <div className="flex items-center gap-[clamp(0.75rem,1.5vw,1rem)]">
                    <f.icon className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-text-muted">{f.label}</p>
                      <p className="text-text-dark font-medium mt-0.5">{f.value}</p>
                    </div>
                  </div>
                  {f.badge && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      f.paid 
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                        : "bg-rose-100 text-rose-800 border border-rose-200"
                    }`}>
                      {f.paid ? "Paid" : "Unpaid"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
