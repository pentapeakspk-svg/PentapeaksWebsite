"use client"
import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Mail, GraduationCap, Eye, EyeOff, Send, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function StudentLoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  useEffect(() => {
    if (status === "authenticated" && session) {
      const userRole = (session.user as any)?.role
      if (userRole === "ADMIN") {
        window.location.href = "/admin/dashboard"
      } else {
        window.location.href = "/student/dashboard"
      }
    }
  }, [status, session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(""); setShowVerification(false); setResendSuccess(false)
    const result = await signIn("credentials", { email, password, loginType: "auto", redirect: false })
    if (result?.error) {
      // Check if the error is about email not being verified
      if (result.error.includes("EMAIL_NOT_VERIFIED")) {
        setShowVerification(true)
        setError("")
      } else {
        setError(result.error || "Invalid email or password")
      }
      setLoading(false)
      return
    }

    // Set a session cookie that expires when the browser is closed
    document.cookie = "penta_browser_session=active; path=/";

    // Fetch session to check user role
    const sessionRes = await fetch("/api/auth/session")
    const sessionData = await sessionRes.json()
    const userRole = (sessionData?.user as any)?.role
    
    // Redirect based on role using hard navigation to prevent stale auth state
    if (userRole === "ADMIN") {
      window.location.href = "/admin/dashboard"
    } else {
      window.location.href = "/student/dashboard"
    }
  }

  const handleResendVerification = async () => {
    setResendLoading(true)
    setResendSuccess(false)
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setResendSuccess(true)
      } else {
        setError(data.error || "Failed to resend verification email")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-hero">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white border border-border-light rounded-2xl p-8">
          <div className="text-center mb-8">
            <GraduationCap className="w-12 h-12 text-primary mx-auto mb-3" />
            <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-dark">Student <span className="text-primary">Portal</span></h1>
            <p className="text-sm text-text-muted mt-1">Login to access your dashboard</p>
          </div>

          {/* Email Verification Required Banner */}
          <AnimatePresence>
            {showVerification && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: "hidden", marginBottom: "1.25rem" }}
              >
                <div style={{
                  background: "linear-gradient(135deg, rgba(200,150,62,0.08), rgba(28,82,48,0.06))",
                  border: "1px solid rgba(200,150,62,0.3)",
                  borderRadius: 12,
                  padding: "1.25rem",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.875rem" }}>
                    <div style={{
                      width: 36, height: 36,
                      borderRadius: "50%",
                      background: "rgba(200,150,62,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <Mail style={{ width: 16, height: 16, color: "#C8963E" }} />
                    </div>
                    <div>
                      <p style={{
                        fontFamily: "'Calibri', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.88rem",
                        color: "#0B1A0E",
                        marginBottom: "0.25rem",
                      }}>
                        Email Verification Required
                      </p>
                      <p style={{
                        fontFamily: "'Calibri', sans-serif",
                        fontSize: "0.78rem",
                        color: "#4A5D4C",
                        lineHeight: 1.6,
                      }}>
                        Please check your inbox for a verification link. You need to verify your email before you can log in.
                      </p>
                    </div>
                  </div>

                  {resendSuccess ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        background: "rgba(28,82,48,0.1)",
                        border: "1px solid rgba(28,82,48,0.2)",
                        borderRadius: 8,
                        padding: "0.625rem 0.875rem",
                      }}
                    >
                      <CheckCircle style={{ width: 14, height: 14, color: "#1C5230" }} />
                      <span style={{
                        fontFamily: "'Calibri', sans-serif",
                        fontSize: "0.78rem",
                        color: "#1C5230",
                        fontWeight: 500,
                      }}>
                        Verification email sent! Check your inbox.
                      </span>
                    </motion.div>
                  ) : (
                    <button
                      onClick={handleResendVerification}
                      disabled={resendLoading}
                      type="button"
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        background: "#C8963E",
                        color: "#fff",
                        fontFamily: "'Calibri', sans-serif",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase" as const,
                        padding: "0.625rem 1rem",
                        borderRadius: 8,
                        border: "none",
                        cursor: resendLoading ? "not-allowed" : "pointer",
                        opacity: resendLoading ? 0.7 : 1,
                        transition: "all 0.2s",
                      }}
                    >
                      <Send style={{ width: 13, height: 13 }} />
                      {resendLoading ? "Sending..." : "Resend Verification Email"}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-text-muted mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  required
                  className="input-field"
                  style={{ paddingLeft: "2.75rem" }}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="input-field"
                  style={{ paddingLeft: "2.75rem", paddingRight: "2.75rem" }}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm bg-red-50 border border-red-200 text-red-600 rounded-lg p-2">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">{loading ? "Logging in..." : "Login"}</button>
          </form>
          <p className="text-center text-sm text-text-muted mt-6">
            Don&apos;t have an account? <Link href="/mentorship" className="text-primary hover:underline">Enroll Now</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
