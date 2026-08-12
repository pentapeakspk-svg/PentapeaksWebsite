"use client"

import { signOut } from "next-auth/react"
import { motion } from "framer-motion"
import { staggerContainer } from "@/lib/animations"
import {
  Users, Layers, Package, ShoppingCart, FileText,
  ArrowRight, PlusCircle, Send, ClipboardCheck, Inbox, LogOut,
} from "lucide-react"
import Link from "next/link"

interface AdminStats {
  totalStudents: number
  activeBatches: number
  supplierForms: number
  buyerInquiries: number
  blogPosts: number
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType
  label: string
  value: number
  href: string
}) {
  return (
    <Link href={href} className="admin-card group block">
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-8 h-8 text-primary" />
        <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
      </div>
      {/* Value is already available - no skeleton needed */}
      <div className="text-3xl font-bold text-primary font-[family-name:var(--font-display)]">
        {value}
      </div>
      <p className="text-sm text-text-muted mt-1">{label}</p>
    </Link>
  )
}

const quickActions = [
  { icon: PlusCircle, label: "Create Batch", href: "/admin/batches" },
  { icon: Send, label: "Send Class Link", href: "/admin/send-link" },
  { icon: ClipboardCheck, label: "Mark Attendance", href: "/admin/attendance" },
  { icon: Inbox, label: "View Inquiries", href: "/admin/inquiries" },
]

export default function DashboardClient({
  stats,
  adminName,
}: {
  stats: AdminStats
  adminName: string
}) {
  return (
    <div className="pt-24 pb-16 bg-gray-bg min-h-screen">
      <div className="sec-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-start flex-wrap gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold font-[family-name:var(--font-display)] mb-2 text-text-dark">
              Admin <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-text-muted">Welcome back, {adminName}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/student/login" })}
            className="btn-outline flex items-center gap-2 text-sm px-4 py-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </motion.div>

        {/* Stats - rendered immediately, no loading skeleton */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[clamp(1rem,2vw,1.5rem)] mb-12"
        >
          <StatCard icon={Users}        label="Total Students"  value={stats.totalStudents}  href="/admin/students"  />
          <StatCard icon={Layers}       label="Active Batches"  value={stats.activeBatches}  href="/admin/batches"   />
          <StatCard icon={Package}      label="Supplier Forms"  value={stats.supplierForms}  href="/admin/suppliers" />
          <StatCard icon={ShoppingCart} label="Buyer Inquiries" value={stats.buyerInquiries} href="/admin/buyers"    />
          <StatCard icon={FileText}     label="Blog Posts"      value={stats.blogPosts}      href="/admin/blog"      />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold font-[family-name:var(--font-display)] mb-4 text-text-dark">
            Quick <span className="text-primary">Actions</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[clamp(0.75rem,1.5vw,1rem)]">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="admin-card flex flex-col items-center justify-center text-center group block"
              >
                <action.icon className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 group-hover:text-accent transition-transform" />
                <p className="text-sm font-medium text-text-dark">{action.label}</p>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
