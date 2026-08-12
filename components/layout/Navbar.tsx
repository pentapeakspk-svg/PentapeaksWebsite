"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useSession, signOut } from "next-auth/react"
import { Menu, X, ChevronDown, Phone, Mail, Globe, ArrowRight, User, LogOut } from "lucide-react"

const navLinks = [
  { href: "/about", label: "About" },
  {
    href: "/products", label: "Products",
    children: [
      { href: "/products/rice", label: "Rice" },
      { href: "/products/fresh-fruits-and-vegetables", label: "Fresh Fruits and Vegetables" },
      { href: "/products/meat", label: "Meat & Poultry" },
      { href: "/products/grains", label: "Grains & Corn" },
      { href: "/products/animal-feed", label: "Animal Feed" },
      { href: "/spices", label: "Spices & Masalas" },
      { href: "/products/gloves", label: "Gloves" },
      { href: "/products/salt-lamps", label: "Salt Lamps" },
      { href: "/products/supplements", label: "Shilajit" },
      { href: "/our-products", label: "Specialty Products" },
      { href: "/products/sports-goods-and-apparel", label: "Sports Goods & Apparel" },
    ],
  },
  { href: "/services", label: "Services" },
  { href: "/mentorship", label: "Mentorship" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
]

/* ── Inline styles ── */
const s = {
  /* Top bar */
  topBar: {
    background: "#0B1A0E",
    borderBottom: "1px solid rgba(200,150,62,0.2)",
    padding: "0.35rem 0",
    position: "relative" as const,
    zIndex: 60,
  } as React.CSSProperties,

  topBarInner: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "0 clamp(1rem, 3.5vw, 3rem)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  } as React.CSSProperties,

  topBarLink: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.68rem",
    fontWeight: 400,
    color: "rgba(255,255,255,0.55)",
    textDecoration: "none",
    letterSpacing: "0.06em",
    transition: "color 0.2s",
  } as React.CSSProperties,

  topBarDivider: {
    width: 1,
    height: 10,
    background: "rgba(200,150,62,0.3)",
  } as React.CSSProperties,

  /* Header */
  header: (scrolled: boolean): React.CSSProperties => ({
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: scrolled ? "rgba(250,248,244,0.97)" : "#FAF8F4",
    backdropFilter: scrolled ? "blur(12px)" : "none",
    borderBottom: "1px solid #E8E3DC",
    boxShadow: scrolled ? "0 4px 24px rgba(11,26,14,0.07)" : "none",
    transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
  }),

  inner: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "0 clamp(1rem, 3.5vw, 3rem)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "clamp(64px, 6.5vw, 76px)",
    gap: "clamp(0.75rem, 2vw, 2rem)",
  } as React.CSSProperties,

  /* Logo */
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    textDecoration: "none",
    flexShrink: 0,
  } as React.CSSProperties,

  logoMark: {
    width: "clamp(120px, 16vw, 175px)",
    height: "clamp(120px, 16vw, 175px)",
    borderRadius: 8,
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    position: "relative" as const,
    overflow: "visible",
  } as React.CSSProperties,

  logoMarkInner: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)",
    fontWeight: 700,
    color: "#fff",
    lineHeight: 1,
  } as React.CSSProperties,

  logoText: {
    display: "flex",
    flexDirection: "column" as const,
  } as React.CSSProperties,

  logoName: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)",
    fontWeight: 700,
    color: "#16261A",
    lineHeight: 1,
    letterSpacing: "-0.01em",
  } as React.CSSProperties,

  logoSub: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "clamp(0.5rem, 0.9vw, 0.6rem)",
    fontWeight: 400,
    color: "#8A9E8B",
    letterSpacing: "0.22em",
    textTransform: "uppercase" as const,
    marginTop: "0.2rem",
  } as React.CSSProperties,

  /* Nav link */
  navLink: (active: boolean): React.CSSProperties => ({
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    padding: "0.55rem clamp(0.7rem, 1.2vw, 0.95rem)",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "clamp(0.8rem, 1.1vw, 0.92rem)",
    fontWeight: active ? 700 : 600,
    color: active ? "#0B1A0E" : "#2B3A2E",
    textDecoration: "none",
    letterSpacing: "0.04em",
    transition: "color 0.2s",
    whiteSpace: "nowrap",
  }),

  /* Dropdown */
  dropdownWrap: {
    position: "absolute" as const,
    top: "100%",
    left: 0,
    paddingTop: "0.75rem",
    zIndex: 50,
  } as React.CSSProperties,

  dropdownBox: {
    width: 228,
    background: "#FAF8F4",
    border: "1px solid #E8E3DC",
    borderRadius: 10,
    overflow: "hidden",
    boxShadow: "0 16px 48px rgba(11,26,14,0.12), 0 4px 12px rgba(11,26,14,0.06)",
  } as React.CSSProperties,

  dropdownHeader: {
    padding: "0.8rem 1.1rem",
    background: "#fff",
    borderBottom: "1px solid #E8E3DC",
  } as React.CSSProperties,

  dropdownHeaderText: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.6rem",
    fontWeight: 700,
    color: "#C8963E",
    letterSpacing: "0.25em",
    textTransform: "uppercase" as const,
  } as React.CSSProperties,

  dropdownLink: (active: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.7rem 1.1rem",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.8rem",
    fontWeight: active ? 700 : 600,
    color: active ? "#0B1A0E" : "#2B3A2E",
    textDecoration: "none",
    borderLeft: `2px solid ${active ? "#C8963E" : "transparent"}`,
    background: active ? "rgba(28,82,48,0.05)" : "transparent",
    transition: "all 0.2s",
  }),

  dropdownFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.35rem",
    padding: "0.7rem 1.1rem",
    background: "#fff",
    borderTop: "1px solid #E8E3DC",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.65rem",
    fontWeight: 600,
    color: "#1C5230",
    textDecoration: "none",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    transition: "color 0.2s",
  } as React.CSSProperties,

  /* CTA buttons */
  btnOutline: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "clamp(0.72rem, 0.95vw, 0.82rem)",
    fontWeight: 600,
    color: "#0B1A0E",
    border: "1px solid #0B1A0E",
    borderRadius: 6,
    padding: "0.7rem clamp(1.1rem, 2vw, 1.6rem)",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    textDecoration: "none",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
  } as React.CSSProperties,

  btnFilled: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "clamp(0.72rem, 0.95vw, 0.82rem)",
    fontWeight: 600,
    color: "#fff",
    background: "#133B22",
    borderRadius: 6,
    padding: "0.7rem clamp(1.1rem, 2vw, 1.6rem)",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    textDecoration: "none",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
  } as React.CSSProperties,
}

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdown, setDropdown] = useState<string | null>(null)
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null)
  const [profileDropdown, setProfileDropdown] = useState(false)
  const [quoteDropdown, setQuoteDropdown] = useState(false)
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null)
  const profileDropdownTimeout = useRef<NodeJS.Timeout | null>(null)
  const quoteDropdownTimeout = useRef<NodeJS.Timeout | null>(null)

  const { data: session } = useSession()
  const user = session?.user as any
  const isLoggedIn = !!user
  const isAdmin = user?.role === "ADMIN"
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : (isAdmin ? "A" : "S")
  const dashboardLink = isAdmin ? "/admin/dashboard" : "/student/dashboard"
  const dashboardLabel = isAdmin ? "Admin Dashboard" : "Student Dashboard"
  const portalLabel = isAdmin ? "Admin Portal" : "Student Portal"

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // If logged in via NextAuth persistent cookie, but the browser session cookie is gone
    // (which happens when the browser is completely closed and reopened), force logout.
    if (isLoggedIn) {
      const hasSessionCookie = document.cookie.includes("penta_browser_session=active")
      if (!hasSessionCookie) {
        signOut({ callbackUrl: "/student/login" })
      }
    }
  }, [isLoggedIn])

  useEffect(() => {
    setMobileOpen(false)
    setMobileDropdown(null)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current)
    setDropdown(label)
  }

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setDropdown(null), 150)
  }

  const handleProfileEnter = () => {
    if (profileDropdownTimeout.current) clearTimeout(profileDropdownTimeout.current)
    setProfileDropdown(true)
  }

  const handleProfileLeave = () => {
    profileDropdownTimeout.current = setTimeout(() => setProfileDropdown(false), 150)
  }

  const handleQuoteEnter = () => {
    if (quoteDropdownTimeout.current) clearTimeout(quoteDropdownTimeout.current)
    setQuoteDropdown(true)
  }

  const handleQuoteLeave = () => {
    quoteDropdownTimeout.current = setTimeout(() => setQuoteDropdown(false), 150)
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;600;700;800&display=swap');`}</style>

      <div data-navbar className="w-full flex flex-col z-50 relative">
        {/* ─── Top Utility Bar ─── */}
        <div style={s.topBar} className="block">
          {/* gold top line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #C8963E 40%, transparent)" }} />
          <div style={s.topBarInner}>
            {/* Left: contact */}
            <div className="hidden lg:flex" style={{ alignItems: "center", gap: "1.25rem" }}>
              <a
                href="tel:+923086222283"
                style={s.topBarLink}
                onMouseEnter={e => (e.currentTarget.style.color = "#C8963E")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
              >
                <Phone style={{ width: 11, height: 11 }} />
                PK: +92 308 6222283
              </a>
              <div style={s.topBarDivider} />
              <a
                href="tel:+16096355116"
                style={s.topBarLink}
                onMouseEnter={e => (e.currentTarget.style.color = "#C8963E")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
              >
                <Phone style={{ width: 11, height: 11 }} />
                USA: +1 609 635 5116
              </a>
              <div style={s.topBarDivider} />
              <a
                href="mailto:info@pentapeaks.com"
                style={s.topBarLink}
                onMouseEnter={e => (e.currentTarget.style.color = "#C8963E")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
              >
                <Mail style={{ width: 11, height: 11 }} />
                info@pentapeaks.com
              </a>
            </div>

            {/* Right: portals */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginLeft: "auto" }}>
              <Link
                href="/student/login"
                style={s.topBarLink}
                onMouseEnter={e => (e.currentTarget.style.color = "#C8963E")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
              >
                Student Portal
              </Link>

            </div>
          </div>
        </div>

        {/* ─── Main Navigation ─── */}
        <header style={s.header(scrolled)}>
          <div style={s.inner}>

            {/* ─── Logo ─── */}
            <Link href="/" style={s.logoWrap}>
              <div style={s.logoMark}>
                <Image 
                  src="/images/logo.webp" 
                  alt="Penta Peaks Logo" 
                  width={150} 
                  height={150} 
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  priority
                />
              </div>
            </Link>

            {/* ─── Desktop Nav ─── */}
            <nav className="hidden lg:flex" style={{ alignItems: "center", gap: "0.1rem", flex: 1, justifyContent: "center" }}>
              {navLinks.map((link) => (
                <div
                  key={link.href}
                  style={{ position: "relative" }}
                  onMouseEnter={() => link.children ? handleMouseEnter(link.label) : undefined}
                  onMouseLeave={link.children ? handleMouseLeave : undefined}
                >
                  <Link
                    href={link.href}
                    style={s.navLink(isActive(link.href))}
                    onMouseEnter={e => { if (!isActive(link.href)) (e.currentTarget as HTMLAnchorElement).style.color = "#1C5230" }}
                    onMouseLeave={e => { if (!isActive(link.href)) (e.currentTarget as HTMLAnchorElement).style.color = "#4A5D4C" }}
                  >
                    {link.label}
                    {link.children && (
                      <ChevronDown
                        style={{
                          width: 13, height: 13,
                          transition: "transform 0.25s",
                          transform: dropdown === link.label ? "rotate(180deg)" : "rotate(0deg)",
                          color: "#8A9E8B",
                        }}
                      />
                    )}
                    {/* Active gold underline */}
                    {isActive(link.href) && (
                      <motion.div
                        layoutId="nav-active"
                        style={{
                          position: "absolute",
                          bottom: 2,
                          left: "0.875rem",
                          right: "0.875rem",
                          height: 1.5,
                          background: "#C8963E",
                          borderRadius: 1,
                        }}
                        transition={{ type: "spring", stiffness: 350, damping: 35 }}
                      />
                    )}
                  </Link>

                  {/* ─── Dropdown ─── */}
                  <AnimatePresence>
                    {link.children && dropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        style={s.dropdownWrap}
                        onMouseEnter={() => handleMouseEnter(link.label)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div style={s.dropdownBox}>
                          {/* Header */}
                          <div style={s.dropdownHeader}>
                            <span style={s.dropdownHeaderText}>Our {link.label}</span>
                          </div>

                          {/* Items */}
                          <div style={{ padding: "0.375rem 0" }}>
                            {link.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                style={s.dropdownLink(isActive(child.href))}
                                onMouseEnter={e => {
                                  if (!isActive(child.href)) {
                                    (e.currentTarget as HTMLAnchorElement).style.color = "#1C5230"
                                    ;(e.currentTarget as HTMLAnchorElement).style.background = "rgba(28,82,48,0.04)"
                                    ;(e.currentTarget as HTMLAnchorElement).style.borderLeftColor = "#C8963E"
                                  }
                                }}
                                onMouseLeave={e => {
                                  if (!isActive(child.href)) {
                                    (e.currentTarget as HTMLAnchorElement).style.color = "#4A5D4C"
                                    ;(e.currentTarget as HTMLAnchorElement).style.background = "transparent"
                                    ;(e.currentTarget as HTMLAnchorElement).style.borderLeftColor = "transparent"
                                  }
                                }}
                              >
                                <ArrowRight style={{ width: 11, height: 11, color: "#C8963E", flexShrink: 0 }} />
                                {child.label}
                              </Link>
                            ))}
                          </div>

                          {/* Footer */}
                          <Link
                            href={link.href}
                            style={s.dropdownFooter}
                            onMouseEnter={e => (e.currentTarget.style.color = "#C8963E")}
                            onMouseLeave={e => (e.currentTarget.style.color = "#1C5230")}
                          >
                            View All {link.label}
                            <ArrowRight style={{ width: 11, height: 11 }} />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* ─── Desktop CTAs ─── */}
            <div className="hidden lg:flex" style={{ alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
              <div 
                style={{ position: "relative" }}
                onMouseEnter={handleQuoteEnter}
                onMouseLeave={handleQuoteLeave}
              >
                <div 
                  style={{ ...s.btnOutline, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.background = "#1C5230"
                    ;(e.currentTarget as HTMLDivElement).style.color = "#fff"
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.background = "transparent"
                    ;(e.currentTarget as HTMLDivElement).style.color = "#1C5230"
                  }}
                >
                  Get Quote
                  <ChevronDown style={{ width: 13, height: 13, transition: "transform 0.2s", transform: quoteDropdown ? "rotate(180deg)" : "rotate(0)" }} />
                </div>

                <AnimatePresence>
                  {quoteDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        paddingTop: "0.75rem",
                        zIndex: 50,
                      }}
                    >
                      <div style={{ ...s.dropdownBox, width: 180 }}>
                        <div style={{ padding: "0.375rem 0" }}>
                          <Link
                            href="/supplier"
                            style={{
                              ...s.dropdownLink(isActive("/supplier")),
                              padding: "0.6rem 1.1rem",
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(28,82,48,0.04)" }}
                            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent" }}
                          >
                            Seller
                          </Link>
                          <Link
                            href="/buyer"
                            style={{
                              ...s.dropdownLink(isActive("/buyer")),
                              padding: "0.6rem 1.1rem",
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(28,82,48,0.04)" }}
                            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent" }}
                          >
                            Bulk Buyer
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {isLoggedIn ? (
                <div 
                  style={{ position: "relative", zIndex: 60 }}
                  onMouseEnter={handleProfileEnter}
                  onMouseLeave={handleProfileLeave}
                >
                  <div style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: "#133B22",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    border: "2px solid #C8963E",
                    boxShadow: "0 4px 12px rgba(11,26,14,0.1)",
                  }}>
                    {userInitial}
                  </div>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {profileDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        style={{
                          position: "absolute",
                          top: "100%",
                          right: 0,
                          paddingTop: "0.75rem",
                          zIndex: 50,
                        }}
                      >
                        <div style={s.dropdownBox}>
                          <div style={s.dropdownHeader}>
                            <span style={s.dropdownHeaderText}>{portalLabel}</span>
                          </div>
                          <div style={{ padding: "0.375rem 0" }}>
                            <Link
                              href={dashboardLink}
                              style={{
                                ...s.dropdownLink(isActive(dashboardLink)),
                                padding: "0.6rem 1.1rem",
                              }}
                              onMouseEnter={e => {
                                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(28,82,48,0.04)"
                              }}
                              onMouseLeave={e => {
                                (e.currentTarget as HTMLAnchorElement).style.background = "transparent"
                              }}
                            >
                              <User style={{ width: 15, height: 15, color: "#C8963E" }} />
                              {dashboardLabel}
                            </Link>
                            <button
                              onClick={() => signOut({ callbackUrl: '/' })}
                              style={{
                                ...s.dropdownLink(false),
                                width: "100%",
                                textAlign: "left",
                                cursor: "pointer",
                                border: "none",
                                borderLeft: "2px solid transparent",
                                padding: "0.6rem 1.1rem",
                              }}
                              onMouseEnter={e => {
                                (e.currentTarget as HTMLButtonElement).style.background = "rgba(28,82,48,0.04)"
                              }}
                              onMouseLeave={e => {
                                (e.currentTarget as HTMLButtonElement).style.background = "transparent"
                              }}
                            >
                              <LogOut style={{ width: 15, height: 15, color: "#C8963E" }} />
                              Logout
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/mentorship"
                  style={s.btnFilled}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "#0B1A0E"
                    ;(e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"
                    ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 20px rgba(11,26,14,0.2)"
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "#1C5230"
                    ;(e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"
                    ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"
                  }}
                >
                  Enroll Now
                </Link>
              )}
            </div>

            {/* ─── Mobile Menu Trigger ─── */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex"
              aria-label="Toggle menu"
              style={{
                width: 40, height: 40,
                alignItems: "center", justifyContent: "center",
                borderRadius: 8,
                border: "1px solid #E8E3DC",
                background: "transparent",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F2EDE4")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <X style={{ width: 18, height: 18, color: "#16261A" }} />
                  </motion.div>
                ) : (
                  <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <Menu style={{ width: 18, height: 18, color: "#16261A" }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Bottom gold rule - visible when scrolled */}
          <motion.div
            animate={{ opacity: scrolled ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(200,150,62,0.4) 50%, transparent)" }}
          />
        </header>
      </div>


      {/* ─── Mobile Menu ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden"
              style={{ position: "fixed", inset: 0, background: "rgba(11,26,14,0.45)", backdropFilter: "blur(4px)", zIndex: 60 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Slide panel - dark forest theme */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="lg:hidden"
              style={{
                position: "fixed",
                top: 0, right: 0, bottom: 0, left: 0,
                width: "100vw",
                maxWidth: "100vw",
                background: "#0B1A0E",
                zIndex: 70,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Gold top accent */}
              <div style={{ height: 2, background: "linear-gradient(90deg, transparent, #C8963E)" }} />

              {/* Panel header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.65rem", textDecoration: "none" }} onClick={() => setMobileOpen(false)}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", overflow: "hidden", border: "1px solid rgba(200,150,62,0.3)", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
                    <Image src="/images/logo.webp" alt="Penta Peaks" width={38} height={38} style={{ objectFit: "contain" }} />
                  </div>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>Penta Peaks</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  style={{ width: 34, height: 34, borderRadius: 7, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <X style={{ width: 16, height: 16, color: "rgba(255,255,255,0.6)" }} />
                </button>
              </div>

              {/* Nav links */}
              <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem 1rem" }}>
                {navLinks.map((link, idx) => (
                  <div key={link.href}>
                    {link.children ? (
                      <>
                        <button
                          onClick={() => setMobileDropdown(mobileDropdown === link.label ? null : link.label)}
                          style={{
                            width: "100%",
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "0.875rem 1rem",
                            borderRadius: 8,
                            background: isActive(link.href) ? "rgba(200,150,62,0.1)" : "transparent",
                            border: "none", cursor: "pointer",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "0.9rem",
                            fontWeight: isActive(link.href) ? 500 : 400,
                            color: isActive(link.href) ? "#C8963E" : "rgba(255,255,255,0.75)",
                            transition: "all 0.2s",
                            textAlign: "left",
                          }}
                        >
                          {link.label}
                          <ChevronDown
                            style={{
                              width: 15, height: 15,
                              color: "rgba(255,255,255,0.4)",
                              transition: "transform 0.25s",
                              transform: mobileDropdown === link.label ? "rotate(180deg)" : "rotate(0deg)",
                            }}
                          />
                        </button>

                        <AnimatePresence>
                          {mobileDropdown === link.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22 }}
                              style={{ overflow: "hidden" }}
                            >
                              <div style={{ marginLeft: "1rem", paddingLeft: "1rem", borderLeft: "1px solid rgba(200,150,62,0.25)", paddingTop: "0.25rem", paddingBottom: "0.5rem" }}>
                                {link.children.map((child) => (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    style={{
                                      display: "block",
                                      padding: "0.65rem 0.75rem",
                                      borderRadius: 6,
                                      fontFamily: "'DM Sans', sans-serif",
                                      fontSize: "0.85rem",
                                      fontWeight: isActive(child.href) ? 500 : 400,
                                      color: isActive(child.href) ? "#C8963E" : "rgba(255,255,255,0.55)",
                                      textDecoration: "none",
                                      transition: "color 0.2s",
                                    }}
                                    onClick={() => setMobileOpen(false)}
                                  >
                                    {child.label}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={link.href}
                        style={{
                          display: "block",
                          padding: "0.875rem 1rem",
                          borderRadius: 8,
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.9rem",
                          fontWeight: isActive(link.href) ? 500 : 400,
                          color: isActive(link.href) ? "#C8963E" : "rgba(255,255,255,0.75)",
                          textDecoration: "none",
                          background: isActive(link.href) ? "rgba(200,150,62,0.1)" : "transparent",
                          transition: "all 0.2s",
                        }}
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )}

                    {/* Thin separator between items */}
                    {idx < navLinks.length - 1 && (
                      <div style={{ height: 1, background: "rgba(255,255,255,0.04)", margin: "0.2rem 0" }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Footer CTAs */}
              <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <Link
                    href="/supplier"
                    style={{
                      flex: 1, textAlign: "center",
                      padding: "1rem",
                      border: "1px solid rgba(168,117,31,0.8)",
                      borderRadius: 7,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.82rem", fontWeight: 600,
                      color: "#A8751F",
                      letterSpacing: "0.15em", textTransform: "uppercase",
                      textDecoration: "none",
                      transition: "all 0.2s",
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Seller
                  </Link>
                  <Link
                    href="/buyer"
                    style={{
                      flex: 1, textAlign: "center",
                      padding: "1rem",
                      border: "1px solid rgba(168,117,31,0.8)",
                      borderRadius: 7,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.82rem", fontWeight: 600,
                      color: "#A8751F",
                      letterSpacing: "0.15em", textTransform: "uppercase",
                      textDecoration: "none",
                      transition: "all 0.2s",
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Bulk Buyer
                  </Link>
                </div>

                {isLoggedIn ? (
                  <>
                    <Link
                      href={dashboardLink}
                      style={{
                        display: "block", textAlign: "center",
                        padding: "1rem",
                        background: "#133B22",
                        borderRadius: 7,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.82rem", fontWeight: 600,
                        color: "#fff",
                        letterSpacing: "0.15em", textTransform: "uppercase",
                        textDecoration: "none",
                        transition: "all 0.2s",
                      }}
                      onClick={() => setMobileOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/' }); }}
                      style={{
                        display: "block", textAlign: "center", width: "100%",
                        padding: "1rem",
                        border: "1px solid rgba(168,117,31,0.8)",
                        background: "transparent",
                        borderRadius: 7,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.82rem", fontWeight: 600,
                        color: "#A8751F",
                        letterSpacing: "0.15em", textTransform: "uppercase",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <Link
                      href="/student/login"
                      style={{
                        display: "block", textAlign: "center",
                        padding: "1rem",
                        background: "transparent",
                        border: "1px solid #1C5230",
                        borderRadius: 7,
                        fontFamily: "var(--font-body)",
                        fontSize: "0.82rem", fontWeight: 600,
                        color: "#FAF8F4",
                        letterSpacing: "0.15em", textTransform: "uppercase",
                        textDecoration: "none",
                        transition: "all 0.2s",
                      }}
                      onClick={() => setMobileOpen(false)}
                    >
                      Student Portal Login
                    </Link>
                    <Link
                      href="/mentorship"
                      style={{
                        display: "block", textAlign: "center",
                        padding: "1rem",
                        background: "#133B22",
                        borderRadius: 7,
                        fontFamily: "var(--font-body)",
                        fontSize: "0.82rem", fontWeight: 600,
                        color: "#fff",
                        letterSpacing: "0.15em", textTransform: "uppercase",
                        textDecoration: "none",
                        transition: "all 0.2s",
                      }}
                      onClick={() => setMobileOpen(false)}
                    >
                      Enroll Now
                    </Link>
                  </div>
                )}

                {/* Contact row */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingTop: "0.5rem" }}>
                  <a
                    href="tel:+923086222283"
                    style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}
                  >
                    <Phone style={{ width: 11, height: 11 }} />
                    PK: +92 308 6222283
                  </a>
                  <a
                    href="tel:+16096355116"
                    style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}
                  >
                    <Phone style={{ width: 11, height: 11 }} />
                    USA: +1 609 635 5116
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}