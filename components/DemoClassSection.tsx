"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Presentation, Loader2, ArrowRight, X, Send } from "lucide-react"
import { fadeUpVariant } from "@/lib/animations"

type DemoClassConfig = {
  isActive: boolean
  heading: string
  details: string
  detailsRoman?: string
  detailsUrdu?: string
  whatsappLink: string
}

interface DemoClassSectionProps {
  initialConfig?: DemoClassConfig | null
}

export default function DemoClassSection({ initialConfig }: DemoClassSectionProps) {
  const [config, setConfig] = useState<DemoClassConfig | null>(
    initialConfig && initialConfig.isActive ? initialConfig : null
  )
  const [loading, setLoading] = useState(!initialConfig)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Only fetch if no initialConfig was provided (fallback for other pages)
  useEffect(() => {
    if (initialConfig !== undefined) return
    fetchConfig()
  }, [initialConfig])

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/demo-class/config")
      const data = await res.json()
      if (data.config && data.config.isActive) {
        setConfig(data.config)
      }
    } catch (err) {
      console.error("Failed to fetch demo class config", err)
    } finally {
      setLoading(false)
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/demo-class/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to enroll")
      }

      setIsSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !config) return null

  return (
    <>
      <section id="demo-class" className="sec" style={{ background: "#FAF8F4", borderBottom: "1px solid #E8E3DC" }}>
        <div className="wrap">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: "-60px" }} 
            style={{ textAlign: "center", marginBottom: "clamp(2rem,5vw,3.5rem)" }}
          >
            <p className="tag" style={{ color: "#1C5230", fontSize: "clamp(0.9rem, 2vw, 1.1rem)", fontWeight: 800, letterSpacing: "0.15em", padding: "0.6rem 1.75rem", background: "rgba(28, 82, 48, 0.08)", borderRadius: "50px", display: "inline-block", marginBottom: "1.2rem", border: "1px solid rgba(28, 82, 48, 0.2)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>🔥 FREE SESSION</p>
            <h2 className="serif" style={{ fontSize: "clamp(1.6rem,4vw,3.2rem)", fontWeight: 400, color: "var(--dk)", marginBottom: ".9rem" }}>
              {config.heading}
            </h2>
            <span className="g-rule-c" />
          </motion.div>

          <motion.div 
            variants={fadeUpVariant} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-60px" }}
            style={{
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: "clamp(1.5rem,4vw,2.5rem)",
              maxWidth: 800,
              margin: "0 auto",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
            }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: "50%", background: "rgba(200,150,62,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem"
            }}>
              <Presentation style={{ width: 24, height: 24, color: "#C8963E" }} />
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem", textAlign: "left", background: "#f8fafc", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <p className="body" style={{ fontSize: "clamp(.9rem, 2vw, 1.05rem)", lineHeight: 1.8, color: "var(--dk)" }}>
                {config.details}
              </p>
              
              {config.detailsRoman && (
                <p className="body" style={{ fontSize: "clamp(.9rem, 2vw, 1.05rem)", lineHeight: 1.8, color: "var(--md)", borderTop: "1px solid #e2e8f0", paddingTop: "1.25rem" }}>
                  {config.detailsRoman}
                </p>
              )}
              
              {config.detailsUrdu && (
                <p className="body" dir="rtl" style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)", lineHeight: 2, color: "var(--md)", borderTop: "1px solid #e2e8f0", paddingTop: "1.25rem", fontFamily: "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif" }}>
                  {config.detailsUrdu}
                </p>
              )}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-gold"
              style={{ padding: "1rem 2rem", fontSize: "1rem" }}
            >
              Enroll in Demo Class <ArrowRight style={{ width: 18, height: 18 }} />
            </button>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {isModalOpen && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center", padding: "1.25rem"
          }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              style={{ position: "absolute", inset: 0, background: "rgba(11,26,14,0.65)", backdropFilter: "blur(8px)" }}
              onClick={() => !isSubmitting && setIsModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                position: "relative", zIndex: 1010, background: "#fff", border: "1px solid #E8E3DC",
                borderRadius: 24, width: "100%", maxWidth: 500, overflow: "hidden",
                boxShadow: "0 32px 80px rgba(11,26,14,0.18)"
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #1C5230, #C8963E, #1C5230)" }} />
              
              <div style={{ padding: "1.5rem", borderBottom: "1px solid #E8E3DC", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h3 className="serif" style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--dk)", margin: 0 }}>
                  Demo Class Enrollment
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--lt)" }}
                >
                  <X style={{ width: 20, height: 20 }} />
                </button>
              </div>

              {!isSuccess ? (
                <form onSubmit={handleSubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label className="flabel" style={{ marginBottom: "0.3rem" }}>Full Name *</label>
                    <input 
                      required className="pp-input" placeholder="Your full name" 
                      value={form.name} onChange={e => setForm({...form, name: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="flabel" style={{ marginBottom: "0.3rem" }}>Email Address *</label>
                    <input 
                      required type="email" className="pp-input" placeholder="your@email.com" 
                      value={form.email} onChange={e => setForm({...form, email: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="flabel" style={{ marginBottom: "0.3rem" }}>Phone Number *</label>
                    <input 
                      required className="pp-input" placeholder="+92 300 0000000" 
                      value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="flabel" style={{ marginBottom: "0.3rem" }}>Address *</label>
                    <input 
                      required className="pp-input" placeholder="Your city/address" 
                      value={form.address} onChange={e => setForm({...form, address: e.target.value})} 
                    />
                  </div>

                  {error && (
                    <div style={{ padding: "0.75rem", background: "#FEE2E2", color: "#DC2626", borderRadius: 8, fontSize: "0.85rem" }}>
                      {error}
                    </div>
                  )}

                  <button 
                    type="submit" disabled={isSubmitting}
                    className="btn-dark"
                    style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }}
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" style={{ width: 16, height: 16 }} /> : <Send style={{ width: 16, height: 16 }} />}
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </button>
                </form>
              ) : (
                <div style={{ padding: "2.5rem 1.5rem", textAlign: "center" }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: "50%", background: "#DCFCE7",
                    display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem"
                  }}>
                    <Send style={{ width: 28, height: 28, color: "#16A34A" }} />
                  </div>
                  
                  <h3 className="serif" style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--dk)", marginBottom: "1rem" }}>
                    Enrollment Successful!
                  </h3>
                  
                  <p className="body" style={{ fontSize: "0.95rem", marginBottom: "2rem" }}>
                    Your details have been submitted. Please join our WhatsApp community to get updates about the Demo Class.
                  </p>

                  <a 
                    href={config.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold"
                    style={{ width: "100%", justifyContent: "center", padding: "1.25rem 2rem", fontSize: "1.15rem", fontWeight: 700, borderRadius: "12px", boxShadow: "0 10px 30px rgba(200,150,62,0.35)" }}
                  >
                    Join WhatsApp Community <ArrowRight style={{ width: 18, height: 18 }} />
                  </a>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
