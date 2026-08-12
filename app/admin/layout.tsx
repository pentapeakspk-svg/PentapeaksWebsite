"use client"
import { SessionProvider, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard, Users, Layers, Package, ShoppingCart,
  FileText, Send, ClipboardCheck, Inbox, Menu, ChevronLeft, X, Video, Presentation, UserPlus
} from "lucide-react"
import Footer from "@/components/layout/Footer"
import { prefetchAllAdminData } from "@/lib/admin-cache"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [navbarHeight, setNavbarHeight] = useState(72)
  const [unreadCounts, setUnreadCounts] = useState({ students: 0, batches: 0, demoClass: 0 })

  useEffect(() => {
    if (!session || (session.user as any)?.role !== "ADMIN") return
    
    const fetchCounts = async () => {
      try {
        const res = await fetch("/api/admin/unread-counts")
        if (res.ok) {
          const data = await res.json()
          setUnreadCounts({
            students: data.students || 0,
            batches: data.batches || 0,
            demoClass: data.demoClass || 0
          })
        }
      } catch (err) {}
    }
    
    fetchCounts()
    const interval = setInterval(fetchCounts, 30000)
    return () => clearInterval(interval)
  }, [session, pathname])

  useEffect(() => {
    if (!session || (session.user as any)?.role !== "ADMIN") return
    
    if (pathname === "/admin/students") {
      fetch("/api/admin/mark-read", { method: "POST", body: JSON.stringify({ type: "students" }) })
    } else if (pathname === "/admin/batches") {
      fetch("/api/admin/mark-read", { method: "POST", body: JSON.stringify({ type: "batches" }) })
    } else if (pathname === "/admin/demo-class/enrollments") {
      fetch("/api/admin/mark-read", { method: "POST", body: JSON.stringify({ type: "demoClass" }) })
    }
  }, [pathname, session])

  // Navbar height dynamically detect karo
  useEffect(() => {
    const measure = () => {
      const navbar =
        document.querySelector("nav") ||
        document.querySelector("header") ||
        document.querySelector("[data-navbar]")
      if (navbar) {
        setNavbarHeight(navbar.getBoundingClientRect().height)
      }
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const sidebarLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/batches", label: "Batches", icon: Layers },
    { href: "/admin/attendance", label: "Attendance", icon: ClipboardCheck },
    { href: "/admin/send-link", label: "Class Links", icon: Send },
    { href: "/admin/send-recording", label: "Class Recordings", icon: Video },
    { href: "/admin/student-reviews", label: "Student Reviews", icon: Video },
    { href: "/admin/gallery-videos", label: "Gallery Videos", icon: Video },
    { href: "/admin/suppliers", label: "Suppliers", icon: Package },
    { href: "/admin/buyers", label: "Buyers", icon: ShoppingCart },
    { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
    { href: "/admin/blog", label: "Blog Posts", icon: FileText },
    { href: "/admin/documents", label: "Documents", icon: FileText },
    { href: "/admin/demo-class", label: "Demo Class", icon: Presentation },
    { href: "/admin/demo-class/enrollments", label: "Demo Enrollments", icon: UserPlus },
  ]

  useEffect(() => {
    if (status === "loading") return
    if (!session) { router.push("/student/login"); return }
    if ((session.user as any)?.role !== "ADMIN") { router.push("/student/dashboard"); return }
    prefetchAllAdminData()
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || (session.user as any)?.role !== "ADMIN") return null

  return (
    <div className="flex min-h-screen bg-gray-50 relative">

      {/* ── Mobile Backdrop ── */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`
          fixed inset-0 z-40 bg-black/40 backdrop-blur-sm
          transition-opacity duration-300 lg:hidden
          ${mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"}
        `}
      />

      {/* ── Mobile Toggle Button ──
          Navbar ke bilkul neeche, left side fixed
          navbarHeight dynamically set hota hai
      ── */}
      <button
        onClick={() => setMobileMenuOpen(prev => !prev)}
        aria-label="Toggle sidebar"
        style={{ top: `${navbarHeight + 12}px` }}
        className={`
          fixed left-3 z-50 lg:hidden
          w-9 h-9 rounded-xl
          bg-primary text-white
          shadow-lg shadow-primary/30
          flex items-center justify-center
          transition-all duration-200
          hover:bg-primary-dark active:scale-95
          border-0 cursor-pointer
        `}
      >
        {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* ── Sidebar ──
          top: navbarHeight - navbar ke exactly neeche se start
      ── */}
      <aside
        style={{ top: `${navbarHeight}px` }}
        className={`
          fixed left-0 bottom-0 z-50
          flex flex-col
          bg-white
          border-r border-gray-100
          shadow-[2px_0_20px_rgba(0,0,0,0.04)]
          transition-all duration-300 ease-in-out
          overflow-hidden
          ${sidebarOpen ? "w-64" : "w-[70px]"}
          ${mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Sidebar Header */}
        <div className={`
          h-[56px] flex items-center border-b border-gray-100 shrink-0
          ${sidebarOpen ? "px-4 justify-between" : "justify-center px-2"}
        `}>
          {sidebarOpen ? (
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">
              Admin Panel
            </span>
          ) : (
            <span className="text-[10px] font-bold text-gray-400 uppercase">
              AP
            </span>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setSidebarOpen(prev => !prev)}
            title={sidebarOpen ? "Collapse" : "Expand"}
            className={`
              hidden lg:flex items-center justify-center
              w-7 h-7 rounded-lg shrink-0
              text-gray-400 hover:text-primary hover:bg-primary/10
              transition-colors duration-200
              border-0 bg-transparent cursor-pointer
            `}
          >
            {sidebarOpen
              ? <ChevronLeft className="w-4 h-4" />
              : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5">
          {sidebarLinks.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href || pathname?.startsWith(href + "/")
            return (
              <Link
                key={href}
                href={href}
                title={!sidebarOpen ? label : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  group flex items-center gap-3 rounded-xl relative
                  transition-all duration-200 select-none
                  ${sidebarOpen
                    ? "px-3 py-2.5"
                    : "px-0 py-2.5 justify-center"}
                  ${isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-gray-500 hover:bg-primary/10 hover:text-primary"}
                `}
              >
                <Icon className={`
                  w-[18px] h-[18px] shrink-0 transition-transform duration-200
                  ${!isActive ? "group-hover:scale-110" : ""}
                `} />
                {sidebarOpen && (
                  <span className="text-[13px] font-medium flex-1 truncate leading-none flex items-center justify-between">
                    {label}
                    {((href === "/admin/students" && unreadCounts.students > 0 && pathname !== "/admin/students") ||
                      (href === "/admin/batches" && unreadCounts.batches > 0 && pathname !== "/admin/batches") ||
                      (href === "/admin/demo-class/enrollments" && unreadCounts.demoClass > 0 && pathname !== "/admin/demo-class/enrollments")) && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {href === "/admin/students" ? unreadCounts.students : href === "/admin/batches" ? unreadCounts.batches : unreadCounts.demoClass}
                      </span>
                    )}
                  </span>
                )}
                {!sidebarOpen && ((href === "/admin/students" && unreadCounts.students > 0 && pathname !== "/admin/students") ||
                      (href === "/admin/batches" && unreadCounts.batches > 0 && pathname !== "/admin/batches") ||
                      (href === "/admin/demo-class/enrollments" && unreadCounts.demoClass > 0 && pathname !== "/admin/demo-class/enrollments")) && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {href === "/admin/students" ? unreadCounts.students : href === "/admin/batches" ? unreadCounts.batches : unreadCounts.demoClass}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <div className={`
        flex flex-col flex-1 min-w-0 min-h-screen
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? "lg:ml-64" : "lg:ml-[70px]"}
      `}>
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </div>

    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  )
}