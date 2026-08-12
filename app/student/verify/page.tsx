"use client"
import { useState, useEffect, Suspense, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight } from "lucide-react"
import Link from "next/link"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [status, setStatus] = useState<"loading" | "success" | "already" | "error">("loading")
  const [message, setMessage] = useState("")
  const [userName, setUserName] = useState("")

  const hasFired = useRef(false)

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("No verification token provided. Please check your email for the verification link.")
      return
    }

    if (hasFired.current) return
    hasFired.current = true

    const verifyEmail = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        })
        const data = await res.json()

        if (res.ok) {
          if (data.alreadyVerified) {
            setStatus("already")
            setMessage("Your email has already been verified.")
          } else {
            setStatus("success")
            setMessage(data.message || "Email verified successfully!")
            setUserName(data.name || "")
          }
        } else {
          setStatus("error")
          setMessage(data.error || "Verification failed.")
        }
      } catch {
        setStatus("error")
        setMessage("Something went wrong. Please try again.")
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-hero">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div style={{
          background: "#fff",
          border: "1px solid #E8E3DC",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(11,26,14,0.1)",
        }}>
          {/* Top accent bar */}
          <div style={{
            height: 4,
            background: status === "success" || status === "already"
              ? "linear-gradient(90deg, #1C5230, #4ade80, #1C5230)"
              : status === "error"
                ? "linear-gradient(90deg, #dc2626, #f87171, #dc2626)"
                : "linear-gradient(90deg, #1C5230, #C8963E, #1C5230)",
          }} />

          <div style={{ padding: "clamp(2rem, 5vw, 3rem)", textAlign: "center" }}>
            {/* Loading state */}
            {status === "loading" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div style={{
                  width: 72, height: 72,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(28,82,48,0.1), rgba(200,150,62,0.1))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                }}>
                  <Loader2 style={{ width: 32, height: 32, color: "#C8963E" }} className="animate-spin" />
                </div>
                <h2 style={{
                  fontFamily: "'Calibri', sans-serif",
                  fontSize: "clamp(1.5rem, 4vw, 2rem)",
                  fontWeight: 400,
                  color: "#0B1A0E",
                  marginBottom: "0.75rem",
                }}>
                  Verifying Your Email
                </h2>
                <p style={{
                  fontFamily: "'Calibri', sans-serif",
                  fontSize: "0.9rem",
                  color: "#4A5D4C",
                  lineHeight: 1.6,
                }}>
                  Please wait while we verify your email address...
                </p>
              </motion.div>
            )}

            {/* Success state */}
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <motion.div
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
                  style={{
                    width: 80, height: 80,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #1C5230, #133B22)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.75rem",
                    boxShadow: "0 12px 30px rgba(28,82,48,0.25)",
                  }}
                >
                  <CheckCircle style={{ width: 36, height: 36, color: "#fff" }} />
                </motion.div>

                <h2 style={{
                  fontFamily: "'Calibri', sans-serif",
                  fontSize: "clamp(1.75rem, 5vw, 2.4rem)",
                  fontWeight: 400,
                  color: "#0B1A0E",
                  marginBottom: "0.75rem",
                }}>
                  Email Verified!
                </h2>

                {userName && (
                  <p style={{
                    fontFamily: "'Calibri', sans-serif",
                    fontSize: "1rem",
                    color: "#1C5230",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                  }}>
                    Welcome, {userName}!
                  </p>
                )}

                <p style={{
                  fontFamily: "'Calibri', sans-serif",
                  fontSize: "0.88rem",
                  color: "#4A5D4C",
                  lineHeight: 1.7,
                  marginBottom: "2rem",
                  maxWidth: 380,
                  margin: "0 auto 2rem",
                }}>
                  {message} You can now log in to your student dashboard and start your export journey.
                </p>

                <Link
                  href="/student/login"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.625rem",
                    background: "#1C5230",
                    color: "#fff",
                    fontFamily: "'Calibri', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    padding: "1rem 2.25rem",
                    borderRadius: 8,
                    textDecoration: "none",
                    boxShadow: "0 10px 25px rgba(28,82,48,0.25)",
                    transition: "all 0.3s ease",
                    width: "100%",
                  }}
                >
                  <span>Login to Student Portal</span>
                  <ArrowRight style={{ width: 15, height: 15 }} />
                </Link>
              </motion.div>
            )}

            {/* Already verified state */}
            {status === "already" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div style={{
                  width: 72, height: 72,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(28,82,48,0.12), rgba(42,122,75,0.07))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                }}>
                  <CheckCircle style={{ width: 32, height: 32, color: "#1C5230" }} />
                </div>

                <h2 style={{
                  fontFamily: "'Calibri', sans-serif",
                  fontSize: "clamp(1.5rem, 4vw, 2rem)",
                  fontWeight: 400,
                  color: "#0B1A0E",
                  marginBottom: "0.75rem",
                }}>
                  Already Verified
                </h2>

                <p style={{
                  fontFamily: "'Calibri', sans-serif",
                  fontSize: "0.88rem",
                  color: "#4A5D4C",
                  lineHeight: 1.7,
                  marginBottom: "2rem",
                }}>
                  {message}
                </p>

                <Link
                  href="/student/login"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.625rem",
                    background: "#1C5230",
                    color: "#fff",
                    fontFamily: "'Calibri', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    padding: "1rem 2.25rem",
                    borderRadius: 8,
                    textDecoration: "none",
                    boxShadow: "0 10px 25px rgba(28,82,48,0.25)",
                    transition: "all 0.3s ease",
                    width: "100%",
                  }}
                >
                  <span>Login to Student Portal</span>
                  <ArrowRight style={{ width: 15, height: 15 }} />
                </Link>
              </motion.div>
            )}

            {/* Error state */}
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div style={{
                  width: 72, height: 72,
                  borderRadius: "50%",
                  background: "rgba(220,38,38,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                }}>
                  <XCircle style={{ width: 32, height: 32, color: "#dc2626" }} />
                </div>

                <h2 style={{
                  fontFamily: "'Calibri', sans-serif",
                  fontSize: "clamp(1.5rem, 4vw, 2rem)",
                  fontWeight: 400,
                  color: "#0B1A0E",
                  marginBottom: "0.75rem",
                }}>
                  Verification Failed
                </h2>

                <p style={{
                  fontFamily: "'Calibri', sans-serif",
                  fontSize: "0.88rem",
                  color: "#dc2626",
                  lineHeight: 1.7,
                  marginBottom: "2rem",
                }}>
                  {message}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <Link
                    href="/student/login"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.625rem",
                      background: "#1C5230",
                      color: "#fff",
                      fontFamily: "'Calibri', sans-serif",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      padding: "1rem 2.25rem",
                      borderRadius: 8,
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      width: "100%",
                    }}
                  >
                    <Mail style={{ width: 15, height: 15 }} />
                    <span>Go to Login</span>
                  </Link>

                  <Link
                    href="/mentorship"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Calibri', sans-serif",
                      fontSize: "0.82rem",
                      color: "#4A5D4C",
                      textDecoration: "underline",
                      transition: "color 0.2s",
                    }}
                  >
                    Back to Enrollment
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div style={{
          fontFamily: "'Calibri', sans-serif",
          color: "#4A5D4C",
          fontSize: "1rem",
        }}>Loading...</div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
