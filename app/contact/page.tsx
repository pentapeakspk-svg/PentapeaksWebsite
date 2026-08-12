"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Mail, Phone, MapPin, MessageCircle, Clock, Send } from "lucide-react"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message")
      }

      setSuccess(true)
      setForm({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" })
    } catch (error) {
      console.error("[contact page] submit error:", error)
      setError(error instanceof Error ? error.message : "Failed to send message")
    } finally { setLoading(false) }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        :root {
          --ivory: #FAF8F4; --cream: #F2EDE4; --forest: #0B1A0E;
          --green: #1C5230; --leaf: #2A7A4B; --gold: #C8963E;
          --border: #DDD8CF; --textdk: #16261A; --textmd: #4A5D4C; --textlt: #8A9E8B;
        }
        body { font-family: 'Calibri', sans-serif; background: var(--ivory); margin: 0; }

        .pp-tag { font-size:.62rem; font-weight:600; letter-spacing:.28em; text-transform:uppercase; color:var(--gold); }
        .pp-display-serif { font-family:'Calibri', sans-serif; }
        .pp-section-heading { font-family:'Calibri', sans-serif; font-size:clamp(1.8rem,4vw,3.25rem); font-weight:400; color:var(--textdk); line-height:1.08; letter-spacing:-.01em; margin:0; }
        .pp-body { color:var(--textmd); line-height:1.8; font-weight:300; }
        .gold-rule-c { display:block; width:2.5rem; height:1px; background:var(--gold); margin:0 auto; }

        .sec-pad { padding:clamp(3.5rem,7vw,6rem) 0; }
        .sec-wrap { max-width:1280px; margin:0 auto; padding:0 clamp(1.25rem,5vw,4rem); }

        .contact-split { display:grid; grid-template-columns:1fr; gap:clamp(2.5rem,5vw,4rem); }
        @media(min-width:1024px){ .contact-split { grid-template-columns:1fr 1fr; } }

        .info-item { display:flex; align-items:flex-start; gap:1rem; margin-bottom:clamp(1.5rem,3vw,2.25rem); }
        .info-icon { width:44px; height:44px; border-radius:10px; background:linear-gradient(135deg,rgba(28,82,48,.12),rgba(42,122,75,.08)); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .info-text { flex:1; }
        .info-label { font-size:.8rem; color:var(--textlt); text-transform:uppercase; letter-spacing:.08em; font-weight:600; margin-bottom:.25rem; }
        .info-value { font-size:clamp(.95rem,1.8vw,1.05rem); color:var(--textdk); font-weight:500; }

        .map-box { border-radius:12px; overflow:hidden; border:1px solid var(--border); height:clamp(200px,30vw,300px); margin-bottom:clamp(1.5rem,3vw,2rem); }
        .map-box iframe { transition:all .5s ease; }
        @media(hover:hover){
          .map-box:hover iframe { filter:brightness(1.05); }
        }

        .form-box { background:#fff; border:1px solid var(--border); border-radius:14px; padding:clamp(1.5rem,4vw,2.5rem); }
        .form-group { margin-bottom:clamp(1.25rem,3vw,1.75rem); }
        .form-label { display:block; font-size:clamp(.8rem,1.6vw,.88rem); color:var(--textmd); margin-bottom:.5rem; font-weight:500; }
        .form-input, .form-textarea, .form-select { width:100%; padding:clamp(.75rem,2vw,.875rem) 1rem; background:var(--ivory); border:1px solid var(--border); border-radius:8px; font-family:'Calibri', sans-serif; font-size:clamp(.85rem,1.8vw,.95rem); color:var(--textdk); outline:none; transition:all .3s ease; }
        .form-input::placeholder, .form-textarea::placeholder { color:var(--textlt); }
        .form-input:focus, .form-textarea:focus, .form-select:focus { border-color:var(--green); box-shadow:0 0 0 3px rgba(28,82,48,.08); }
        .form-textarea { resize:none; }

        .form-row { display:grid; grid-template-columns:1fr; gap:clamp(.875rem,2vw,1.1rem); }
        @media(min-width:540px){ .form-row { grid-template-columns:1fr 1fr; } }

        .submit-btn { width:100%; background:var(--forest); color:#fff; font-family:'Calibri', sans-serif; font-size:clamp(.65rem,1.4vw,.7rem); font-weight:600; letter-spacing:.18em; text-transform:uppercase; padding:clamp(.85rem,2.5vw,1rem); border-radius:8px; border:none; cursor:pointer; transition:all .3s ease; display:flex; align-items:center; justify-content:center; gap:.5rem; margin-top:clamp(1rem,2vw,1.5rem); }
        @media(hover:hover){
          .submit-btn:hover:not(:disabled) { background:var(--green); transform:translateY(-2px); }
        }
        .submit-btn:disabled { opacity:.6; cursor:not-allowed; }

        .success-box { background:linear-gradient(135deg,rgba(28,82,48,.08),rgba(42,122,75,.04)); border:1px solid var(--green); border-radius:12px; padding:clamp(1.5rem,4vw,2rem); text-align:center; }
        .success-title { font-family:'Calibri', sans-serif; font-size:clamp(1.3rem,2.5vw,1.6rem); color:var(--green); margin-bottom:.5rem; }
        .success-text { color:var(--textmd); font-size:clamp(.9rem,1.8vw,1rem); }

        .ticker { background: #0D2B4A; border-top: 1px solid rgba(200,150,62,0.2); border-bottom: 1px solid rgba(200,150,62,0.2); overflow: hidden; padding: 0.75rem 0; }
        .ticker-inner { display: flex; gap: 0; white-space: nowrap; animation: tickerScroll 28s linear infinite; }
        .ticker-inner:hover { animation-play-state: paused; }
        .ticker-item { display: inline-flex; align-items: center; gap: 0.75rem; padding: 0 2.5rem; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.75); }
        .ticker-dot { width: 4px; height: 4px; border-radius: 50%; background: #C8963E; flex-shrink: 0; }
        @keyframes tickerScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>

      {/* ══ HERO BANNER ══ */}
      <section style={{ position: "relative", height: "95svh", minHeight: "560px", maxHeight: "900px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#050E1A", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <Image src="/images/Export8.webp" alt="Contact Penta Peaks Logistics" fill style={{ objectFit: "cover" }} priority sizes="100vw" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(5,14,26,.85) 0%,rgba(5,14,26,.65) 100%)" }} />
        </div>
        <div className="relative z-10 sec-wrap" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
          <span className="inline-block px-3 py-1 bg-accent/20 border border-accent/40 rounded-full text-xs font-bold text-accent tracking-wider uppercase mb-4">
            Connect Globally
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-[family-name:var(--font-display)] mb-4" style={{ color: "#ffffff" }}>
            Contact <span className="font-normal italic serif" style={{ color: "#C9972C" }}>Our Team</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Get in touch with our global trade officers, logistics desks, and academic mentors today to begin your journey.
          </p>
        </div>
      </section>

      {/* ══ TICKER BAND ══ */}
      <div className="ticker">
        <div className="ticker-inner">
          {[...Array(2)].map((_, rep) => (
            ["Basmati Rice Export", "Himalayan Pink Salt", "Mango & Citrus", "Farm-to-Port Logistics", "TDAP Certified", "LC & TT Payments", "15+ Countries", "500+ Students Trained"].map((item, i) => (
              <span key={`${rep}-${i}`} className="ticker-item">
                <span className="ticker-dot" />
                {item}
              </span>
            ))
          ))}
        </div>
      </div>

      <section className="sec-pad" style={{ background:"var(--ivory)" }}>
        <div className="sec-wrap">
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} style={{ textAlign:"center", marginBottom:"clamp(2rem,5vw,3.5rem)" }}>
            <p className="pp-tag" style={{ marginBottom:".9rem" }}>Get In Touch</p>
            <h2 className="pp-section-heading" style={{ marginBottom:".9rem" }}>
              Contact <em style={{ fontStyle:"italic", color:"var(--green)" }}>Us</em>
            </h2>
            <span className="gold-rule-c" />
          </motion.div>

          <div className="contact-split">
            {/* Info Section */}
            <motion.div initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true, margin:"-60px" }} transition={{ duration:.8 }}>
              <h2 className="pp-display-serif" style={{ fontSize:"clamp(1.6rem,3.5vw,2.2rem)", fontWeight:400, color:"var(--textdk)", marginBottom:"clamp(1.5rem,4vw,2.5rem)" }}>
                We&apos;d Love to Hear from You
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem", marginBottom: "2rem" }}>
                {/* Pakistan Office */}
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--textdk)", marginBottom: "1.25rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>Pakistan Office</h3>
                  {[
                    { icon: MapPin, label: "Address", value: "WAPDA Town Lahore, Punjab", url: "https://www.google.com/maps/place/WAPDA+Town+Lahore,+Pakistan/@31.427302,74.261013,14.6z/data=!4m6!3m5!1s0x391901080b110569:0x33b0fb0b941e5adf!8m2!3d31.4311985!4d74.2643582!16zL20vMGNzM2h2?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D" },
                    { icon: Phone, label: "Phone", value: "+92 308 6222283", href: "tel:+923086222283" },
                    { icon: MessageCircle, label: "WhatsApp", value: "+92 308 6222283", href: "https://wa.me/923086222283" },
                    { icon: Mail, label: "Email", value: "info@pentapeaks.com", href: "mailto:info@pentapeaks.com" },
                    { icon: Clock, label: "Hours", value: "Mon-Fri: 9AM - 6PM (PKT)" },
                  ].map((item) => (
                    <div key={item.label} className="info-item" style={{ marginBottom: "1.25rem", gap: "0.75rem" }}>
                      <div className="info-icon" style={{ width: 36, height: 36 }}>
                        <item.icon style={{ width:18, height:18, color:"var(--green)" }} />
                      </div>
                      <div className="info-text">
                        <div className="info-label" style={{ fontSize: "0.7rem", marginBottom: "0.15rem" }}>{item.label}</div>
                        <div className="info-value" style={{ fontSize: "0.85rem" }}>
                          {item.url ? (
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors underline underline-offset-4" style={{ color: "inherit" }}>
                              {item.value}
                            </a>
                          ) : item.href ? (
                            <a href={item.href} className="hover:text-accent transition-colors underline underline-offset-4" style={{ color: "inherit" }}>
                              {item.value}
                            </a>
                          ) : (
                            item.value
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* USA Office */}
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--textdk)", marginBottom: "1.25rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>USA Office</h3>
                  {[
                    { icon: MapPin, label: "Address", value: "237 N 13th St, Allentown, PA", url: "https://maps.app.goo.gl/hCMk6zYuUSmsp4MK7" },
                    { icon: Phone, label: "Phone", value: "+1 609 635 5116", href: "tel:+16096355116" },
                    { icon: Mail, label: "Email", value: "info@pentapeaks.com", href: "mailto:info@pentapeaks.com" },
                    { icon: Clock, label: "Hours", value: "Mon-Fri: 9AM - 5PM (EST)" },
                  ].map((item) => (
                    <div key={item.label} className="info-item" style={{ marginBottom: "1.25rem", gap: "0.75rem" }}>
                      <div className="info-icon" style={{ width: 36, height: 36 }}>
                        <item.icon style={{ width:18, height:18, color:"var(--green)" }} />
                      </div>
                      <div className="info-text">
                        <div className="info-label" style={{ fontSize: "0.7rem", marginBottom: "0.15rem" }}>{item.label}</div>
                        <div className="info-value" style={{ fontSize: "0.85rem" }}>
                          {item.url ? (
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors underline underline-offset-4" style={{ color: "inherit" }}>
                              {item.value}
                            </a>
                          ) : item.href ? (
                            <a href={item.href} className="hover:text-accent transition-colors underline underline-offset-4" style={{ color: "inherit" }}>
                              {item.value}
                            </a>
                          ) : (
                            item.value
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
                <div>
                  <div className="info-label" style={{ marginBottom: "0.5rem" }}>Pakistan Head Office Map</div>
                  <div className="map-box">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13615.176461421684!2d74.25875225134707!3d31.433604921601614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391901080b110569%3A0x33b0fb0b941e5adf!2sWAPDA%20Town%20Lahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1715800000000!5m2!1sen!2s" width="100%" height="100%" style={{ border:0, borderRadius: "8px" }} allowFullScreen loading="lazy" title="Pakistan Location Map" />
                  </div>
                </div>
                <div>
                  <div className="info-label" style={{ marginBottom: "0.5rem" }}>USA Office Map</div>
                  <div className="map-box">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3029.2280344858455!2d-75.488017!3d40.6027922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c43980dd6376bd%3A0xf3bb86060c44f84e!2s237%20N%2013th%2C%20Allentown%2C%20PA%2018102%2C%20USA!5e0!3m2!1sen!2s!4v1715800000000!5m2!1sen!2s" width="100%" height="100%" style={{ border:0, borderRadius: "8px" }} allowFullScreen loading="lazy" title="USA Location Map" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form Section */}
            <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true, margin:"-60px" }} transition={{ duration:.8 }}>
              {error && (
                <div className="success-box" style={{ background:"rgba(220,38,38,.07)", borderColor:"rgba(220,38,38,.25)", marginBottom:"1rem" }}>
                  <div className="success-title" style={{ color:"#dc2626" }}>Message Failed</div>
                  <div className="success-text" style={{ color:"#7f1d1d" }}>{error}</div>
                </div>
              )}

              {success ? (
                <div className="success-box">
                  <div className="success-title">Message Sent! ✓</div>
                  <div className="success-text">We&apos;ll get back to you within 24 hours.</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="form-box">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Name *</label>
                      <input type="text" required className="form-input" placeholder="Your full name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input type="email" required className="form-input" placeholder="your@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input type="tel" className="form-input" placeholder="+92 300 0000000" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subject *</label>
                      <select className="form-select" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}>
                        {["General Inquiry", "Product Inquiry", "Mentorship", "Company Registration", "Partnership", "Other"].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea required rows={5} className="form-textarea" placeholder="Your message here..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
                  </div>

                  <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? "Sending..." : <>Send Message <Send style={{ width:14, height:14 }} /></>}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
