"use client"
import { SessionProvider, useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { 
  LayoutDashboard, User, Sparkles, LogOut, Menu, ChevronLeft, X, Clock 
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

function StudentLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === "/student/login"
  const isVerifyPage = pathname === "/student/verify"
  const isPublicPage = isLoginPage || isVerifyPage
  
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showTimeoutModal, setShowTimeoutModal] = useState(false)
  const [hadSession, setHadSession] = useState(false)
  const [navbarHeight, setNavbarHeight] = useState(72)

  // Dynamic navbar height measurement
  useEffect(() => {
    const measure = () => {
      const navbar =
        document.querySelector("[data-navbar]") ||
        document.querySelector("header") ||
        document.querySelector("nav")
      if (navbar) {
        setNavbarHeight(navbar.getBoundingClientRect().height)
      }
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Track if user was ever authenticated during this component lifecycle
  useEffect(() => {
    if (status === "authenticated") {
      setHadSession(true)
    }
  }, [status])

  useEffect(() => {
    if (isPublicPage) return

    if (status === "loading") return

    if (!session) {
      if (hadSession) {
        setShowTimeoutModal(true)
      } else {
        router.push("/student/login")
      }
      return
    }

    if ((session.user as any)?.role !== "STUDENT") {
      router.push("/admin/dashboard")
      return
    }
  }, [session, status, router, isPublicPage, hadSession])

  if (isPublicPage) {
    return <>{children}</>
  }

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

  if (!session || (session.user as any)?.role !== "STUDENT") {
    return null
  }

  const sidebarLinks = [
    { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/student/profile", label: "My Profile", icon: User },
    { href: "/student/counselor", label: "AI Trade Assistant", icon: Sparkles },
  ]

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
        <div className="flex flex-col h-full justify-between pb-4">
          <div>
            {/* Sidebar Header */}
            <div className={`
              h-[56px] flex items-center border-b border-gray-100 shrink-0
              ${sidebarOpen ? "px-4 justify-between" : "justify-center px-2"}
            `}>
              {sidebarOpen ? (
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">
                  Student Portal
                </span>
              ) : (
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  SP
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
                const isActive = pathname === href || pathname?.startsWith(href + "/")
                return (
                  <Link 
                    key={href} 
                    href={href} 
                    title={!sidebarOpen ? label : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      group flex items-center gap-3 rounded-xl
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
                      <span className="text-[13px] font-medium flex-1 truncate leading-none">
                        {label}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Quick Logout Button at the bottom of the sidebar */}
          <div className="pt-4 border-t border-gray-100 mt-auto px-2">
            <button
              onClick={() => signOut({ callbackUrl: '/student/login' })}
              title={!sidebarOpen ? "Logout" : undefined}
              className={`
                group flex items-center gap-3 rounded-xl
                w-full text-red-500 hover:bg-red-50 hover:text-red-600
                transition-all duration-200 cursor-pointer border-0 bg-transparent
                ${!sidebarOpen ? "justify-center px-0 py-2.5" : "px-3 py-2.5 text-left"}
              `}
            >
              <LogOut className={`
                w-[18px] h-[18px] shrink-0 transition-transform duration-200
                group-hover:scale-110
              `} />
              {sidebarOpen && <span className="text-[13px] font-medium leading-none">Logout</span>}
            </button>
          </div>
        </div>
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
      </div>

      {/* ── Session Timeout Modal ── */}
      <AnimatePresence>
        {showTimeoutModal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
            <div 
              style={{ position: "absolute", inset: 0, backgroundColor: "rgba(11,26,14,.65)", backdropFilter: "blur(6px)" }} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ 
                position: "relative", 
                zIndex: 10000, 
                width: "100%", 
                maxWidth: "400px", 
                backgroundColor: "#ffffff", 
                borderRadius: "20px", 
                overflow: "hidden", 
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", 
                border: "1px solid #DDD8CF",
                padding: "2.5rem 2rem",
                textAlign: "center"
              }}
            >
              <div style={{ 
                width: "64px", 
                height: "64px", 
                borderRadius: "50%", 
                background: "rgba(220, 38, 38, 0.1)", 
                border: "1px solid rgba(220, 38, 38, 0.2)",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                margin: "0 auto 1.5rem"
              }}>
                <Clock className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="serif text-xl font-bold text-text-dark mb-2">
                Time out
              </h3>
              <p className="text-sm text-text-muted mb-6 leading-relaxed">
                Your session has expired. Please login again to continue.
              </p>
              <button 
                onClick={() => {
                  setShowTimeoutModal(false)
                  router.push("/student/login")
                }}
                className="btn-primary w-full justify-center"
                style={{ padding: "0.75rem 1.5rem" }}
              >
                Login Again
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StudentLayoutContent>{children}</StudentLayoutContent>
    </SessionProvider>
  )
}
