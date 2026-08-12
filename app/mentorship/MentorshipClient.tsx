"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { fadeUpVariant, staggerContainer } from "@/lib/animations"
import {
  GraduationCap, BookOpen, Globe, FileText, Truck, Shield,
  CheckCircle, ArrowRight, Send, Users, Clock, Wifi,
  Star, TrendingUp, Lightbulb, Target, PlayCircle, BadgeCheck,
  ChevronLeft, ChevronRight, X, Play, Pause, Volume2, VolumeX,
} from "lucide-react"
import DemoClassSection from "@/components/DemoClassSection"
import VideoGallery from "@/components/VideoGallery"

/* ─── curriculum (unchanged) ─── */
const curriculum = [
  { icon: FileText,      title: "Documentation & Compliance",  desc: "Invoices, packing lists, certificates of origin, phytosanitary certs" },
  { icon: BookOpen,      title: "LC & Payment Terms",          desc: "Letter of Credit, TT, CAD, DP - understanding banking procedures" },
  { icon: Globe,         title: "Incoterms 2020",              desc: "FOB, CIF, CNF, EXW, DDP - cost allocation and risk transfer" },
  { icon: Truck,         title: "Logistics & Shipping",        desc: "Container types, freight rates, port operations, customs clearance" },
  { icon: Shield,        title: "TDAP/RECP/WEBOC",            desc: "Government registrations, export facilitation, compliance portals" },
  { icon: GraduationCap, title: "Real Deal Walkthrough",       desc: "Step-by-step live deal execution from inquiry to shipment" },
]

const howItWorks = [
  { step: "01", title: "Apply Online",       desc: "Fill in the enrollment form below. Takes less than 5 minutes." },
  { step: "02", title: "Seat Confirmation",  desc: "We review your application and confirm your seat within 24 hours." },
  { step: "03", title: "Join Your Cohort",   desc: "Access live sessions, recorded content, and your student dashboard." },
  { step: "04", title: "Execute Real Deals", desc: "Graduate with a live shipment on your CV and an active trade network." },
]

const whoFor = [
  { Icon: TrendingUp, title: "Aspiring Exporters",  desc: "Entrepreneurs who want to start exporting Pakistani products globally." },
  { Icon: Lightbulb,  title: "Fresh Graduates",     desc: "Students who want a career edge in international trade & logistics." },
  { Icon: Target,     title: "Business Owners",     desc: "Manufacturers and farmers looking to reach global buyers directly." },
  { Icon: Globe,      title: "Overseas Pakistanis", desc: "Diaspora who want to bridge Pakistan's supply with global demand." },
]

const testimonials = [
  { name: "Hamza Tariq",  city: "Lahore",  text: "I enrolled with zero export knowledge. Within 15 days I executed my first rice shipment to UAE. The real deal walkthrough is priceless." },
  { name: "Saba Noor",    city: "Karachi", text: "The LC module alone was worth the entire fee. I now handle documentary credits confidently with our bank." },
  { name: "Usman Ghani",  city: "Sialkot", text: "Penta Peaks connected me with verified buyers. My sports goods business now ships to Germany every quarter." },
]

const programDetails = [
  { Icon: Clock,      label: "Duration", value: "Batch: 15 days | Mentorship: 15 days" },
  { Icon: Wifi,       label: "Medium",   value: "Online - Zoom / Google Meet" },
  { Icon: Users,      label: "Cohort",   value: "Max 20 students per batch" },
  { Icon: BadgeCheck, label: "Fee",      value: "Contact us for current pricing" },
]

// Dynamic mentorship videos will be fetched from API

interface Batch { id: string; batchNo: string; title: string; startDate: string | null; status: string; fee: number }

type DemoConfig = { isActive: boolean; heading: string; details: string; whatsappLink: string } | null

interface MentorshipClientProps {
  initialBatches: Batch[]
  initialDemoConfig: DemoConfig
  reviewVideos: string[]
}

export default function MentorshipClient({ initialBatches, initialDemoConfig, reviewVideos }: MentorshipClientProps) {
  const [batches] = useState<Batch[]>(initialBatches)
  const [form, setForm]       = useState({
    name: "", email: "", phone: "", city: "",
    education: "", enrollmentType: "BATCH", batchId: "",
    hearAboutUs: "", questions: "", password: "", confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState("")
  const isDemoActive = initialDemoConfig?.isActive ?? false

  const [mentorshipVideos, setMentorshipVideos] = useState<string[]>([])

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/admin/gallery-videos?prefix=mentorship-")
        const data = await res.json()
        if (res.ok) setMentorshipVideos(data.files || [])
      } catch (err) {
        console.error("Failed to fetch mentorship videos", err)
      }
    }
    fetchVideos()
  }, [])

  /* ── Review Video Carousel State ── */
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const popupVideoRef = useRef<HTMLVideoElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [carouselPage, setCarouselPage] = useState(0)
  const totalPages = Math.ceil(reviewVideos.length / 3)

  const scrollCarousel = useCallback((dir: "left" | "right") => {
    if (!carouselRef.current) return
    const container = carouselRef.current
    const cardWidth = container.querySelector(".review-vid-card")?.clientWidth || 300
    const gap = 20
    const scrollAmount = (cardWidth + gap) * 1
    if (dir === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      setCarouselPage(p => Math.max(0, p - 1))
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
      setCarouselPage(p => Math.min(totalPages - 1, p + 1))
    }
  }, [totalPages])

  const openVideoPopup = (src: string) => {
    setActiveVideo(src)
    setIsPlaying(true)
    setIsMuted(false)
  }

  const closeVideoPopup = () => {
    setActiveVideo(null)
    setIsPlaying(true)
    setIsMuted(false)
  }

  const togglePlay = () => {
    if (!popupVideoRef.current) return
    if (popupVideoRef.current.paused) {
      popupVideoRef.current.play()
      setIsPlaying(true)
    } else {
      popupVideoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    if (!popupVideoRef.current) return
    popupVideoRef.current.muted = !popupVideoRef.current.muted
    setIsMuted(popupVideoRef.current.muted)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { setError("Passwords don't match"); return }
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return }
    if (form.enrollmentType === "BATCH" && !form.batchId) { setError("Please select a batch"); return }
    setLoading(true); setError("")
    try {
      const res  = await fetch("/api/enroll", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      const data = await res.json()
      if (res.ok) { setSuccess(true) } else { setError(data.error || "Enrollment failed") }
    } catch { setError("Something went wrong") } finally { setLoading(false) }
  }

  return (
    <>
      <style>{CSS}</style>

      {/* ══════════════════════════════
          1 ▸ HERO
      ══════════════════════════════ */}
      <section className="hero-bg">
        <div className="hero-grain" />
        {[500,800,1100].map((s,i) => (
          <div key={i} className="hero-ring" style={{ width:s, height:s, top:"50%", left:"50%", transform:"translate(-50%,-50%)" }} />
        ))}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,#C8963E 40%,transparent)", zIndex:4 }} />
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:"linear-gradient(to bottom,transparent,#C8963E,transparent)", zIndex:4 }} />

        <div className="wrap" style={{ position:"relative", zIndex:5, textAlign:"center" }}>
          <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:.9, ease:[.22,1,.36,1] }}>
            <motion.div initial={{ opacity:0, scale:.6 }} animate={{ opacity:1, scale:1 }} transition={{ delay:.15, duration:.7 }}
              style={{ width:68, height:68, borderRadius:18, background:"rgba(200,150,62,.15)", border:"1px solid rgba(200,150,62,.4)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto clamp(1.1rem,3vw,1.5rem)" }}>
              <GraduationCap style={{ width:30, height:30, color:"#C8963E" }} />
            </motion.div>

            <p className="tag" style={{ color:"#C8963E", display:"flex", alignItems:"center", justifyContent:"center", gap:".6rem", marginBottom:"1.2rem", fontSize: "clamp(0.7rem, 2vw, 0.95rem)", letterSpacing: "0.25em" }}>
              <span style={{ display:"inline-block", width:28, height:1, background:"#C8963E" }} />
              Mentorship Programme
              <span style={{ display:"inline-block", width:28, height:1, background:"#C8963E" }} />
            </p>

            <h1 className="serif" style={{ fontSize:"clamp(2rem, 4.4vw, 3.75rem)", fontWeight:500, color:"#fff", letterSpacing:".03em", lineHeight:.92, textTransform:"uppercase", marginBottom:"clamp(.875rem,2vw,1.25rem)" }}>
              Import Export<br /><em style={{ fontStyle:"italic", color:"#C8963E" }}>Mentorship</em>
            </h1>

            <p style={{ fontFamily:"'Calibri', sans-serif", fontSize:"clamp(.82rem,1.6vw,1.05rem)", color:"rgba(255,255,255,.62)", maxWidth:500, margin:"0 auto clamp(1.5rem,3.5vw,2.25rem)", lineHeight:1.8 }}>
              Master international trade from Pakistan&apos;s most experienced professionals - live sessions, real deal walkthroughs, and lifetime community access.
            </p>

            <div style={{ display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap", marginTop: "1rem" }}>
              <a href="#enroll" className="btn-gold" style={{ fontSize: "1.1rem", padding: "1rem 2rem", fontWeight: 600 }}>Enroll Now <ArrowRight style={{ width:18, height:18 }} /></a>
              <a href="#curriculum" className="btn-ghost" style={{ fontSize: "1.1rem", padding: "1rem 2rem", fontWeight: 600 }}>See Curriculum <PlayCircle style={{ width:18, height:18 }} /></a>
              {isDemoActive && (
                <a href="#demo-class" className="btn-ghost" style={{ fontSize: "1.1rem", padding: "1rem 2rem", fontWeight: 600, border: "1px solid #4ade80", color: "#4ade80" }}>
                  Free Demo Class
                </a>
              )}
            </div>
          </motion.div>

          {/* live badge */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.65 }}
            style={{ display:"inline-flex", alignItems:"center", gap:".75rem", marginTop:"clamp(2rem,4vw,3.5rem)", background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.2)", borderRadius:50, padding:".75rem 1.5rem", backdropFilter:"blur(10px)" }}>
            <div style={{ width:12, height:12, borderRadius:"50%", background:"#4ade80", boxShadow:"0 0 12px #4ade80" }} />
            <span style={{ fontFamily:"'Calibri', sans-serif", fontSize:".95rem", fontWeight: 600, color:"#fff", letterSpacing:".05em" }}>Accepting enrollments - new batch starting soon</span>
          </motion.div>

          {/* program details grid */}
          <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:.45 }}
            className="prog-details">
            {programDetails.map(({ Icon, label, value }, i) => (
              <div key={i} className="prog-cell">
                <Icon style={{ width:16, height:16, color:"#C8963E", margin:"0 auto .5rem" }} />
                <p style={{ fontFamily:"'Calibri', sans-serif", fontSize:"clamp(.52rem,1.1vw,.58rem)", fontWeight:600, color:"rgba(255,255,255,.32)", letterSpacing:".2em", textTransform:"uppercase", marginBottom:".3rem" }}>{label}</p>
                <p style={{ fontFamily:"'Calibri', sans-serif", fontSize:"clamp(.7rem,1.4vw,.8rem)", color:"rgba(255,255,255,.78)" }}>{value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <VideoGallery videos={mentorshipVideos} title="Experience Mentorship" subtitle="Watch Our Sessions" />

      {/* ══════════════════════════════════
          5.5 ▸ STUDENT REVIEW VIDEOS
      ══════════════════════════════════ */}
      <section id="student-reviews" style={{ background: "#0B1A0E", position: "relative", overflow: "hidden", padding: "clamp(3rem,7vw,6rem) 0" }}>
        {/* decorative grain overlay */}
        <div className="hero-grain" />
        {/* gold top/bottom rules */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,#C8963E 40%,transparent)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,#C8963E 40%,transparent)" }} />

        <div className="wrap" style={{ position: "relative", zIndex: 2 }}>
          {/* heading */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} style={{ textAlign: "center", marginBottom: "clamp(2rem,5vw,3.5rem)" }}>
            <p className="tag" style={{ color: "#C8963E", marginBottom: ".85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: ".6rem" }}>
              <span style={{ display: "inline-block", width: 28, height: 1, background: "#C8963E" }} />
              Previous Student Reviews
              <span style={{ display: "inline-block", width: 28, height: 1, background: "#C8963E" }} />
            </p>
            <h2 className="serif" style={{ fontSize: "clamp(1.6rem,4vw,3.2rem)", fontWeight: 300, color: "#fff", marginBottom: ".9rem" }}>
              Hear from Our <em style={{ fontStyle: "italic", color: "#C8963E" }}>Graduates</em>
            </h2>
            <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: "clamp(.82rem,1.6vw,1.05rem)", color: "rgba(255,255,255,.55)", maxWidth: 520, margin: "0 auto", lineHeight: 1.8 }}>
              Real video testimonials from students who transformed their careers through our mentorship programme.
            </p>
          </motion.div>

          {/* carousel wrapper */}
          <div style={{ position: "relative" }}>
            {/* left arrow */}
            <button
              onClick={() => scrollCarousel("left")}
              className="carousel-arrow carousel-arrow-left"
              aria-label="Scroll left"
            >
              <ChevronLeft style={{ width: 22, height: 22 }} />
            </button>

            {/* right arrow */}
            <button
              onClick={() => scrollCarousel("right")}
              className="carousel-arrow carousel-arrow-right"
              aria-label="Scroll right"
            >
              <ChevronRight style={{ width: 22, height: 22 }} />
            </button>

            {/* scrollable track */}
            <motion.div
              ref={carouselRef}
              className="review-carousel"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7 }}
            >
              {reviewVideos.map((src, i) => (
                <div
                  key={i}
                  className="review-vid-card"
                  onClick={() => openVideoPopup(src)}
                >
                  <video
                    src={src.includes("#") ? src : `${src}#t=0.001`}
                    muted
                    playsInline
                    preload="metadata"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 16,
                    }}
                  />
                  {/* play overlay */}
                  <div className="review-vid-overlay">
                    <div className="review-vid-play-btn">
                      <PlayCircle style={{ width: 44, height: 44, color: "#fff" }} />
                    </div>
                    <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".78rem", color: "rgba(255,255,255,.85)", fontWeight: 600, letterSpacing: ".05em", marginTop: ".5rem" }}>
                      Watch Review
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* pagination dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1.75rem" }}>
              {reviewVideos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (!carouselRef.current) return
                    const card = carouselRef.current.querySelector(".review-vid-card") as HTMLElement
                    if (!card) return
                    const gap = 20
                    carouselRef.current.scrollTo({ left: i * (card.clientWidth + gap), behavior: "smooth" })
                    setCarouselPage(i)
                  }}
                  style={{
                    width: carouselPage === i ? 28 : 10,
                    height: 10,
                    borderRadius: 5,
                    border: "none",
                    background: carouselPage === i ? "#C8963E" : "rgba(255,255,255,.25)",
                    cursor: "pointer",
                    transition: "all .3s ease",
                    padding: 0,
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VIDEO POPUP MODAL ── */}
      <AnimatePresence>
        {activeVideo && (
          <div style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}>
            {/* backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.85)",
                backdropFilter: "blur(12px)",
              }}
              onClick={closeVideoPopup}
            />

            {/* modal card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                position: "relative",
                zIndex: 10000,
                maxWidth: 480,
                width: "100%",
                borderRadius: 20,
                overflow: "hidden",
                background: "#000",
                boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
              }}
            >
              {/* close button */}
              <button
                onClick={closeVideoPopup}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  zIndex: 10,
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.6)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(8px)",
                  transition: "all .2s",
                }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>

              {/* video */}
              <video
                ref={popupVideoRef}
                src={activeVideo}
                autoPlay
                playsInline
                style={{
                  width: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                  display: "block",
                  background: "#000",
                }}
                onClick={togglePlay}
              />

              {/* controls bar */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                padding: "0.875rem 1.25rem",
                background: "linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.75))",
                borderTop: "1px solid rgba(200,150,62,0.2)",
              }}>
                <button
                  onClick={togglePlay}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "#C8963E",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                    transition: "transform .2s, background .2s",
                    boxShadow: "0 4px 16px rgba(200,150,62,0.35)",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                >
                  {isPlaying ? <Pause style={{ width: 20, height: 20 }} /> : <Play style={{ width: 20, height: 20 }} />}
                </button>

                <button
                  onClick={toggleMute}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#fff",
                    cursor: "pointer",
                    transition: "all .2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                >
                  {isMuted ? <VolumeX style={{ width: 18, height: 18 }} /> : <Volume2 style={{ width: 18, height: 18 }} />}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* ══════════════════════════════
          2 ▸ WHO IS THIS FOR
      ══════════════════════════════ */}
      <section className="sec" style={{ background:"#fff", borderBottom:"1px solid #E8E3DC" }}>
        <div className="wrap">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:"-60px" }} style={{ textAlign:"center", marginBottom:"clamp(2rem,5vw,3.5rem)" }}>
            <p className="tag" style={{ marginBottom:".85rem" }}>Is This For You?</p>
            <h2 className="serif" style={{ fontSize:"clamp(1.6rem,4vw,3.2rem)", fontWeight:400, color:"var(--dk)", marginBottom:".9rem" }}>
              Who Should <em style={{ fontStyle:"italic", color:"#1C5230" }}>Enroll</em>
            </h2>
            <span className="g-rule-c" />
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-60px" }} className="who-grid">
            {whoFor.map(({ Icon, title, desc }, i) => (
              <motion.div key={i} variants={fadeUpVariant}
                style={{ background:"#FAF8F4", border:"1px solid var(--border)", borderRadius:14, padding:"clamp(1.25rem,3vw,1.75rem)", display:"flex", gap:"1rem", alignItems:"flex-start", transition:"transform .3s, box-shadow .3s" }}
                whileHover={{ y:-5, boxShadow:"0 20px 48px rgba(11,26,14,.09)" }}>
                <div style={{ width:44, height:44, borderRadius:10, background:"linear-gradient(135deg,rgba(28,82,48,.12),rgba(42,122,75,.07))", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Icon style={{ width:20, height:20, color:"#1C5230" }} />
                </div>
                <div>
                  <h3 style={{ fontFamily:"'Calibri', sans-serif", fontWeight:600, fontSize:"clamp(.88rem,1.8vw,.95rem)", color:"var(--dk)", marginBottom:".4rem" }}>{title}</h3>
                  <p className="body" style={{ fontSize:"clamp(.78rem,1.6vw,.85rem)", lineHeight:1.75 }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ══════════════════════════════
          3 ▸ CURRICULUM
      ══════════════════════════════ */}
      <section id="curriculum" className="sec" style={{ background:"#FAF8F4", borderBottom:"1px solid #E8E3DC" }}>
        <div className="wrap">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:"-60px" }} style={{ textAlign:"center", marginBottom:"clamp(2rem,5vw,3.5rem)" }}>
            <p className="tag" style={{ marginBottom:".85rem" }}>Programme Modules</p>
            <h2 className="serif" style={{ fontSize:"clamp(1.6rem,4vw,3.2rem)", fontWeight:400, color:"var(--dk)", marginBottom:".9rem" }}>
              What You&apos;ll <em style={{ fontStyle:"italic", color:"#1C5230" }}>Learn</em>
            </h2>
            <span className="g-rule-c" />
            <p className="body" style={{ maxWidth:420, margin:"1rem auto 0", fontSize:"clamp(.82rem,1.8vw,.92rem)" }}>
              Six battle-tested modules built around real Pakistani export deals - from first inquiry to final payment.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-60px" }} className="curr-grid">
            {curriculum.map((c, i) => (
              <motion.div key={c.title} variants={fadeUpVariant}
                style={{ background:"#fff", border:"1px solid var(--border)", borderRadius:14, padding:"clamp(1.25rem,3vw,1.875rem)", position:"relative", overflow:"hidden", transition:"transform .3s, box-shadow .3s" }}
                whileHover={{ y:-5, boxShadow:"0 22px 52px rgba(11,26,14,.1)" }}>
                {/* watermark number */}
                <div style={{ position:"absolute", top:"-0.75rem", right:"1rem", fontFamily:"'Calibri', sans-serif", fontSize:"clamp(3rem,6vw,5rem)", fontWeight:700, color:"rgba(28,82,48,.05)", lineHeight:1, pointerEvents:"none", userSelect:"none" }}>
                  0{i+1}
                </div>
                <div style={{ width:44, height:44, borderRadius:10, background:"linear-gradient(135deg,rgba(28,82,48,.12),rgba(42,122,75,.07))", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1rem" }}>
                  <c.icon style={{ width:20, height:20, color:"#1C5230" }} />
                </div>
                <h3 style={{ fontFamily:"'Calibri', sans-serif", fontWeight:600, fontSize:"clamp(.88rem,1.8vw,.95rem)", color:"var(--dk)", marginBottom:".5rem" }}>{c.title}</h3>
                <p className="body" style={{ fontSize:"clamp(.78rem,1.6vw,.85rem)", lineHeight:1.75 }}>{c.desc}</p>
                <div style={{ width:18, height:1.5, background:"#C8963E", borderRadius:1, marginTop:"1rem" }} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-60px" }} style={{ marginTop: "4rem", background: "#fff", borderRadius: 14, border: "1px solid var(--border)", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <h3 style={{ padding: "1.5rem 2rem", background: "#0B1A0E", color: "#C8963E", fontFamily: "'Calibri', sans-serif", fontSize: "1.5rem", fontWeight: 600, borderBottom: "4px solid #1C5230", margin: 0, display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <BookOpen style={{ width: 22, height: 22 }} /> Detailed Course RoadMap
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#F2EDE4" }}>
                    <th style={{ padding: "1rem 2rem", color: "#16261A", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", width: "15%" }}>Din (Day)</th>
                    <th style={{ padding: "1rem 2rem", color: "#16261A", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Module</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { din: "1", module: "Complete Business Model" },
                    { din: "2", module: "Product Selection Strategy" },
                    { din: "3", module: "Pakistan Sourcing Mastery" },
                    { din: "4", module: "International Buyer Acquisition" },
                    { din: "5", module: "Freight & Container Management" },
                    { din: "6-7", module: "Export Documentation (2 Days)" },
                    { din: "8-9", module: "Payment Methods (2 Days)" },
                    { din: "10", module: "Profit Calculation Models" },
                    { din: "11-12", module: "Real Export Case Studies (2 Days)" },
                    { din: "13", module: "Digital Export & Online Presence (NEW)" },
                    { din: "14-15", module: "Q&A Sessions (2 Days)" },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #E8E3DC", background: i % 2 === 0 ? "#fff" : "#FAF8F4", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#E8F0EA"} onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#FAF8F4"}>
                      <td style={{ padding: "1.25rem 2rem", color: "#1C5230", fontWeight: 700, fontSize: "1.1rem" }}>{row.din}</td>
                      <td style={{ padding: "1.25rem 2rem", color: "#4A5D4C", fontWeight: 500, fontSize: "1.05rem" }}>{row.module}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ══════════════════════════════
          4 ▸ HOW IT WORKS
      ══════════════════════════════ */}
      <section className="sec" style={{ background:"#fff", borderBottom:"1px solid #E8E3DC" }}>
        <div className="wrap">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:"-60px" }} style={{ textAlign:"center", marginBottom:"clamp(2rem,5vw,3.5rem)" }}>
            <p className="tag" style={{ marginBottom:".85rem" }}>Simple Process</p>
            <h2 className="serif" style={{ fontSize:"clamp(1.6rem,4vw,3.2rem)", fontWeight:400, color:"var(--dk)", marginBottom:".9rem" }}>
              How It <em style={{ fontStyle:"italic", color:"#1C5230" }}>Works</em>
            </h2>
            <span className="g-rule-c" />
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-60px" }} className="steps-grid">
            {howItWorks.map((step, i) => (
              <motion.div key={i} variants={fadeUpVariant} style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:"1rem", position:"relative" }}>
                {/* connecting line between steps on desktop */}
                {i < howItWorks.length - 1 && <div className="step-line" />}
                <div style={{ width:64, height:64, borderRadius:"50%", background:"var(--forest)", border:"2.5px solid #C8963E", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, position:"relative", zIndex:2 }}>
                  <span className="serif" style={{ fontSize:"1.35rem", fontWeight:300, color:"#fff" }}>{step.step}</span>
                </div>
                <div>
                  <h3 style={{ fontFamily:"'Calibri', sans-serif", fontWeight:600, fontSize:"clamp(.9rem,1.8vw,1rem)", color:"var(--dk)", marginBottom:".4rem" }}>{step.title}</h3>
                  <p className="body" style={{ fontSize:"clamp(.78rem,1.6vw,.85rem)", maxWidth:190, margin:"0 auto", lineHeight:1.7 }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <DemoClassSection initialConfig={initialDemoConfig} />

      {/* ══════════════════════════════
          5 ▸ TESTIMONIALS (dark)
      ══════════════════════════════ */}
      <section style={{ background:"var(--forest)", position:"relative", overflow:"hidden", padding:"clamp(3rem,7vw,6rem) 0" }}>
        <div style={{ position:"absolute", inset:0, background:"url('/images/about-natural.webp') center/cover no-repeat", opacity:.05 }} />
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,#C8963E 40%,transparent)" }} />
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,#C8963E 40%,transparent)" }} />

        <div className="wrap" style={{ position:"relative", zIndex:2 }}>
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:"-60px" }} style={{ textAlign:"center", marginBottom:"clamp(2rem,5vw,3.5rem)" }}>
            <p className="tag" style={{ color:"#C8963E", marginBottom:".85rem" }}>Student Stories</p>
            <h2 className="serif" style={{ fontSize:"clamp(1.6rem,4vw,3.2rem)", fontWeight:300, color:"#fff" }}>
              Real Results from <em style={{ fontStyle:"italic", color:"#C8963E" }}>Real Students</em>
            </h2>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-60px" }} className="testi-grid">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUpVariant}
                style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:14, padding:"clamp(1.25rem,3vw,2rem)", backdropFilter:"blur(8px)" }}>
                <div style={{ display:"flex", gap:".2rem", marginBottom:".875rem" }}>
                  {Array.from({length:5}).map((_,j) => <Star key={j} style={{ width:12, height:12, fill:"#C8963E", color:"#C8963E" }} />)}
                </div>
                <span style={{ fontFamily:"'Calibri', sans-serif", fontSize:"3.5rem", color:"rgba(200,150,62,.25)", lineHeight:.75, display:"block" }}>"</span>
                <p style={{ fontFamily:"'Calibri', sans-serif", fontSize:"clamp(.82rem,1.8vw,.9rem)", color:"rgba(255,255,255,.72)", lineHeight:1.8, fontStyle:"italic", margin:".5rem 0 1.25rem" }}>{t.text}</p>
                <div style={{ borderTop:"1px solid rgba(255,255,255,.1)", paddingTop:"1rem", display:"flex", alignItems:"center", gap:".75rem" }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#1C5230,#2A7A4B)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span className="serif" style={{ fontSize:".95rem", color:"rgba(255,255,255,.8)", fontStyle:"italic" }}>{t.name[0]}</span>
                  </div>
                  <div>
                    <p style={{ fontFamily:"'Calibri', sans-serif", fontWeight:600, fontSize:".84rem", color:"#fff" }}>{t.name}</p>
                    <p style={{ fontFamily:"'Calibri', sans-serif", fontSize:".7rem", color:"#C8963E", marginTop:".1rem" }}>Graduate ┬╖ {t.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>




      {/* ══════════════════════════════
          6 ▸ ENROLLMENT FORM
      ══════════════════════════════ */}
      <section id="enroll" className="sec" style={{ background:"#FAF8F4", borderTop:"1px solid #E8E3DC" }}>
        <div style={{ maxWidth:720, margin:"0 auto", padding:"0 clamp(1rem,5vw,2rem)" }}>
          <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:"-60px" }} style={{ textAlign:"center", marginBottom:"clamp(2rem,5vw,3rem)" }}>
            <p className="tag" style={{ marginBottom:".85rem" }}>Ready to Start?</p>
            <h2 className="serif" style={{ fontSize:"clamp(1.6rem,4vw,3.2rem)", fontWeight:400, color:"var(--dk)", marginBottom:".9rem" }}>
              Enroll <em style={{ fontStyle:"italic", color:"#1C5230" }}>Now</em>
            </h2>
            <span className="g-rule-c" />
            <p className="body" style={{ maxWidth:360, margin:"1rem auto 0", fontSize:"clamp(.82rem,1.8vw,.9rem)" }}>
              Secure your seat in the next batch. Limited spots available.
            </p>
          </motion.div>

          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:"-60px" }}
            style={{ background:"#fff", border:"1px solid var(--border)", borderRadius:18, overflow:"hidden", boxShadow:"0 24px 64px rgba(11,26,14,.07)" }}>

            {/* form top bar */}
            <div style={{ background:"var(--forest)", padding:"clamp(1.1rem,3.5vw,1.75rem) clamp(1.25rem,4vw,2.25rem)", display:"flex", alignItems:"center", gap:".875rem" }}>
              <div style={{ width:38, height:38, borderRadius:9, background:"rgba(200,150,62,.2)", border:"1px solid rgba(200,150,62,.4)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <GraduationCap style={{ width:17, height:17, color:"#C8963E" }} />
              </div>
              <div>
                <p className="serif" style={{ fontSize:"clamp(.95rem,2.2vw,1.15rem)", fontWeight:400, color:"#fff", margin:0 }}>Enrollment Application</p>
                <p style={{ fontFamily:"'Calibri', sans-serif", fontSize:".65rem", color:"rgba(255,255,255,.4)", marginTop:".15rem", letterSpacing:".1em" }}>Penta Peaks Mentorship Programme</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ padding:"clamp(1.5rem,4vw,2.25rem)", display:"flex", flexDirection:"column", gap:"clamp(1.1rem,2.5vw,1.5rem)" }}>

              {/* personal info */}
              <div>
                <span className="fsec">Personal Information</span>
                <div className="frow2">
                  <div>
                    <label className="flabel">Full Name *</label>
                    <input required className="pp-input" placeholder="Your full name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="flabel">Email Address *</label>
                    <input type="email" required className="pp-input" placeholder="your@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                  </div>
                </div>
              </div>

              <div className="frow2">
                <div>
                  <label className="flabel">Phone Number *</label>
                  <input required className="pp-input" placeholder="+92 300 0000000" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="flabel">City / Country *</label>
                  <input required className="pp-input" placeholder="Lahore, Pakistan" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="flabel">Education Level</label>
                <select className="pp-input" value={form.education} onChange={e => setForm(p => ({ ...p, education: e.target.value }))}>
                  <option value="">Select education level</option>
                  {["Matric","Intermediate","Bachelor's","Master's","PhD","Other"].map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              {/* programme type */}
              <div style={{ borderTop:"1px solid #E8E3DC", paddingTop:"clamp(1rem,2.5vw,1.5rem)" }}>
                <span className="fsec">Programme Type *</span>
                <div className="enroll-grid">
                  {[
                    { val:"BATCH",      label:"Batch-Based Course",  sub:"15 days" },
                    { val:"MENTORSHIP", label:"1-on-1 Mentorship",   sub:"Personalised sessions with an expert" },
                  ].map(opt => (
                    <label key={opt.val}
                      style={{ cursor:"pointer", padding:"clamp(.875rem,2.5vw,1.1rem)", borderRadius:11, border:`1.5px solid ${form.enrollmentType === opt.val ? "#C8963E" : "var(--border)"}`, background: form.enrollmentType === opt.val ? "rgba(200,150,62,.07)" : "#FAF8F4", transition:"all .25s", display:"flex", alignItems:"flex-start", gap:".75rem" }}>
                      <input type="radio" style={{ display:"none" }} value={opt.val} checked={form.enrollmentType === opt.val} onChange={e => setForm(p => ({ ...p, enrollmentType: e.target.value, batchId: "" }))} />
                      <div style={{ width:17, height:17, borderRadius:"50%", border:`2px solid ${form.enrollmentType === opt.val ? "#C8963E" : "var(--border)"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2, transition:"border-color .25s" }}>
                        {form.enrollmentType === opt.val && <div style={{ width:7, height:7, borderRadius:"50%", background:"#C8963E" }} />}
                      </div>
                      <div>
                        <p style={{ fontFamily:"'Calibri', sans-serif", fontWeight:600, fontSize:"clamp(.82rem,1.8vw,.88rem)", color: form.enrollmentType === opt.val ? "var(--dk)" : "var(--md)" }}>{opt.label}</p>
                        <p style={{ fontFamily:"'Calibri', sans-serif", fontSize:".72rem", color:"var(--lt)", marginTop:".2rem" }}>{opt.sub}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {form.enrollmentType === "BATCH" && (
                <div>
                  <label className="flabel">Select Batch *</label>
                  <select required className="pp-input" value={form.batchId} onChange={e => setForm(p => ({ ...p, batchId: e.target.value }))}>
                    <option value="">Choose an active or upcoming batch</option>
                    {batches.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.batchNo} - {b.title} (Live via Zoom){b.status === "ACTIVE" ? " (Active)" : ""}{b.startDate ? ` (Starts: ${new Date(b.startDate).toLocaleDateString()})` : ""}
                      </option>
                    ))}
                  </select>
                  {form.batchId && (() => {
                    const selected = batches.find(b => b.id === form.batchId);
                    if (!selected) return null;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }} 
                        animate={{ opacity: 1, y: 0 }}
                        style={{ marginTop: "0.5rem", padding: "0.75rem 1rem", background: "rgba(28, 82, 48, 0.05)", borderRadius: "8px", border: "1px solid rgba(28, 82, 48, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                      >
                        <span style={{ fontSize: "0.85rem", color: "var(--dk)", fontWeight: 600 }}>Batch Total Fee:</span>
                        <span style={{ fontSize: "0.95rem", color: "#1C5230", fontWeight: 700 }}>Rs. {selected.fee?.toLocaleString() || "0"}</span>
                      </motion.div>
                    );
                  })()}
                </div>
              )}

              {/* background */}
              <div style={{ borderTop:"1px solid #E8E3DC", paddingTop:"clamp(1rem,2.5vw,1.5rem)" }}>
                <span className="fsec">Background</span>
                <div style={{ display:"flex", flexDirection:"column", gap:"clamp(.875rem,2vw,1.1rem)" }}>
                  <div>
                    <label className="flabel">How did you hear about us?</label>
                    <select className="pp-input" value={form.hearAboutUs} onChange={e => setForm(p => ({ ...p, hearAboutUs: e.target.value }))}>
                      <option value="">Select an option</option>
                      {["Social Media","Google","Friend/Referral","YouTube","Other"].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="flabel">Any specific questions or goals?</label>
                    <textarea rows={3} className="pp-input" placeholder="Tell us what you hope to achieve..." style={{ resize:"none" }} value={form.questions} onChange={e => setForm(p => ({ ...p, questions: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* account creation */}
              <div style={{ background:"#FAF8F4", border:"1px solid var(--border)", borderRadius:12, padding:"clamp(1.1rem,3vw,1.75rem)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:".75rem", marginBottom:"1.1rem" }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,rgba(28,82,48,.12),rgba(42,122,75,.07))", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Shield style={{ width:14, height:14, color:"#1C5230" }} />
                  </div>
                  <div>
                    <p style={{ fontFamily:"'Calibri', sans-serif", fontWeight:600, fontSize:"clamp(.84rem,1.8vw,.9rem)", color:"var(--dk)" }}>Create Your Student Account</p>
                    <p style={{ fontFamily:"'Calibri', sans-serif", fontSize:".7rem", color:"var(--lt)", marginTop:".1rem" }}>Used to access your dashboard and course materials</p>
                  </div>
                </div>
                <div className="frow2">
                  <div>
                    <label className="flabel">Password * <span style={{ color:"var(--lt)", fontWeight:300 }}>(min 8 chars)</span></label>
                    <input type="password" required minLength={8} className="pp-input" placeholder="Create a password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
                  </div>
                  <div>
                    <label className="flabel">Confirm Password *</label>
                    <input type="password" required className="pp-input" placeholder="Repeat your password" value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* error */}
              {error && (
                <div style={{ background:"rgba(220,38,38,.07)", border:"1px solid rgba(220,38,38,.25)", borderRadius:8, padding:".875rem 1rem", display:"flex", alignItems:"flex-start", gap:".6rem" }}>
                  <div style={{ width:16, height:16, borderRadius:"50%", background:"rgba(220,38,38,.18)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                    <span style={{ fontFamily:"'Calibri', sans-serif", fontSize:".58rem", fontWeight:700, color:"#dc2626" }}>!</span>
                  </div>
                  <p style={{ fontFamily:"'Calibri', sans-serif", fontSize:".82rem", color:"#dc2626" }}>{error}</p>
                </div>
              )}

              {/* submit */}
              <button type="submit" disabled={loading}
                style={{ width:"100%", background: loading ? "var(--md)" : "var(--forest)", color:"#fff", fontFamily:"'Calibri', sans-serif", fontSize:"clamp(.63rem,1.5vw,.7rem)", fontWeight:600, letterSpacing:".18em", textTransform:"uppercase", padding:"clamp(.9rem,2.5vw,1.1rem)", borderRadius:8, border:"none", cursor: loading ? "not-allowed" : "pointer", transition:"all .3s ease", display:"flex", alignItems:"center", justifyContent:"center", gap:".625rem" }}
                onMouseEnter={e => { if(!loading)(e.currentTarget as HTMLButtonElement).style.background="#C8963E" }}
                onMouseLeave={e => { if(!loading)(e.currentTarget as HTMLButtonElement).style.background="var(--forest)" }}>
                {loading ? "Creating Account..." : <><span>Submit &amp; Create Account</span><Send style={{ width:15, height:15 }} /></>}
              </button>

              <p style={{ fontFamily:"'Calibri', sans-serif", fontSize:".72rem", color:"var(--lt)", textAlign:"center", lineHeight:1.7 }}>
                By submitting you agree to our terms. Your data is handled securely and never shared with third parties.
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Email Verification Modal */}
      <AnimatePresence>
        {success && (
          <div style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.25rem",
          }}>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(11, 26, 14, 0.65)",
                backdropFilter: "blur(8px)",
              }}
              onClick={() => setSuccess(false)}
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              style={{
                position: "relative",
                zIndex: 1010,
                background: "#fff",
                border: "1px solid #E8E3DC",
                borderRadius: 24,
                padding: "clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 4vw, 2.5rem)",
                textAlign: "center",
                maxWidth: 520,
                width: "100%",
                boxShadow: "0 32px 80px rgba(11,26,14,0.18)",
                overflow: "hidden",
              }}
            >
              {/* Gold top highlight bar */}
              <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: 4,
                background: "linear-gradient(90deg, #1C5230, #C8963E, #1C5230)",
              }} />

              {/* Mail icon with subtle zoom micro-animation */}
              <motion.div
                initial={{ scale: 0.6, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                style={{
                  width: 80, height: 80,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #C8963E, #A07830)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.75rem",
                  boxShadow: "0 12px 30px rgba(200,150,62,0.3)",
                }}
              >
                <Send style={{ width: 32, height: 32, color: "#fff" }} />
              </motion.div>

              {/* Title */}
              <h2 className="serif" style={{
                fontSize: "clamp(1.75rem, 5vw, 2.4rem)",
                fontWeight: 400,
                color: "#0B1A0E",
                marginBottom: "1rem",
                letterSpacing: "-0.01em",
              }}>
                Almost There!
              </h2>

              <p className="body" style={{
                fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
                color: "#1C5230",
                fontWeight: 600,
                marginBottom: "1rem",
                lineHeight: 1.5,
              }}>
                Check Your Email to Complete Registration
              </p>

              <p className="body" style={{
                fontSize: "clamp(0.8rem, 1.6vw, 0.88rem)",
                color: "#4A5D4C",
                lineHeight: 1.7,
                marginBottom: "1.5rem",
                maxWidth: 420,
                margin: "0 auto 1.5rem",
              }}>
                We&apos;ve sent a verification link to <strong style={{ color: "#0B1A0E" }}>{form.email}</strong>. 
                Please click the link in the email to verify your account and activate your student dashboard.
              </p>

              <div style={{
                background: "#FAF8F4",
                border: "1px solid #E8E3DC",
                borderRadius: 12,
                padding: "1rem 1.25rem",
                marginBottom: "1.75rem",
                textAlign: "left",
              }}>
                <p style={{
                  fontFamily: "'Calibri', sans-serif",
                  fontSize: "0.78rem",
                  color: "#4A5D4C",
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  <strong style={{ color: "#0B1A0E" }}>Didn&apos;t receive the email?</strong><br />
                  - Check your spam/junk folder<br />
                  - Make sure <strong>{form.email}</strong> is correct<br />
                  - You can request a new link from the login page
                </p>
              </div>

              {/* Login Button */}
              <a
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
                  textTransform: "uppercase" as const,
                  padding: "1rem 2.25rem",
                  borderRadius: 8,
                  textDecoration: "none",
                  boxShadow: "0 10px 25px rgba(28,82,48,0.25)",
                  transition: "all 0.3s ease",
                  width: "100%",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "#C8963E"
                  ;(e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"
                  ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 14px 30px rgba(200,150,62,0.3)"
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "#1C5230"
                  ;(e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"
                  ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 10px 25px rgba(28,82,48,0.25)"
                }}
              >
                <span>Go to Login Page</span>
                <ArrowRight style={{ width: 15, height: 15 }} />
              </a>

              {/* Dismiss link */}
              <button
                onClick={() => setSuccess(false)}
                style={{
                  marginTop: "1.25rem",
                  background: "none",
                  border: "none",
                  color: "#8A9E8B",
                  fontFamily: "'Calibri', sans-serif",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  textDecoration: "underline",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#1C5230"}
                onMouseLeave={e => e.currentTarget.style.color = "#8A9E8B"}
              >
                Close Window
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ══════════════════════════════════════════
   STYLES
══════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  :root {
    --ivory:#FAF8F4; --forest:#0B1A0E; --green:#1C5230; --gold:#C8963E;
    --border:#DDD8CF; --dk:#16261A; --md:#4A5D4C; --lt:#8A9E8B;
  }
  html { -webkit-text-size-adjust:100%; scroll-behavior:smooth; }
  body { font-family:'Calibri', sans-serif; background:var(--ivory); margin:0; overflow-x:hidden; }
  button,a { -webkit-tap-highlight-color:transparent; }

  /* helpers */
  .serif { font-family:'Calibri', sans-serif; }
  .tag   { font-size:clamp(.54rem,1.4vw,.62rem); font-weight:600; letter-spacing:.24em; text-transform:uppercase; color:var(--gold); }
  .body  { color:var(--md); line-height:1.8; font-weight:300; margin:0; }
  .g-rule-c { display:block; width:2.25rem; height:1px; background:var(--gold); margin:0 auto; }

  .wrap { max-width:1280px; margin:0 auto; padding:0 clamp(1rem,5vw,4rem); }
  .sec  { padding:clamp(3rem,7vw,6.5rem) 0; }

  /* ── hero ── */
  .hero-bg    { 
    background-color: #0b1a0e;
    background-image: linear-gradient(rgba(11,26,14,0.8), rgba(11,26,14,0.8)), url('/images/m.webp');
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    position:relative; 
    overflow:hidden; 
    padding:clamp(6rem,14vw,10rem) 0 clamp(2.5rem,6vw,4.5rem); 
  }
  .hero-grain { position:absolute; inset:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E"); background-size:180px; opacity:.4; pointer-events:none; }
  .hero-ring  { position:absolute; border-radius:50%; border:1px solid rgba(200,150,62,.09); pointer-events:none; }

  /* program details strip in hero */
  .prog-details { display:grid; grid-template-columns:repeat(2,1fr); gap:0; margin-top:clamp(2rem,5vw,4rem); border-top:1px solid rgba(255,255,255,.08); border-left:1px solid rgba(255,255,255,.08); }
  @media(min-width:640px){ .prog-details { grid-template-columns:repeat(4,1fr); } }
  .prog-cell  { padding:clamp(.875rem,2.5vw,1.5rem); border-right:1px solid rgba(255,255,255,.08); border-bottom:1px solid rgba(255,255,255,.08); text-align:center; }

  /* ── buttons ── */
  .btn-dark  { display:inline-flex; align-items:center; gap:.5rem; background:var(--forest); color:#fff; font-family:'Calibri', sans-serif; font-size:clamp(.6rem,1.4vw,.68rem); font-weight:600; letter-spacing:.15em; text-transform:uppercase; padding:clamp(.75rem,2vw,.95rem) clamp(1.1rem,3vw,1.8rem); border:1px solid var(--forest); border-radius:7px; text-decoration:none; transition:all .3s ease; white-space:nowrap; }
  .btn-gold  { display:inline-flex; align-items:center; gap:.5rem; background:var(--gold); color:#fff; font-family:'Calibri', sans-serif; font-size:clamp(.6rem,1.4vw,.68rem); font-weight:600; letter-spacing:.15em; text-transform:uppercase; padding:clamp(.75rem,2vw,.95rem) clamp(1.25rem,3vw,2rem); border-radius:7px; text-decoration:none; transition:all .3s ease; white-space:nowrap; }
  .btn-ghost { display:inline-flex; align-items:center; gap:.5rem; background:rgba(255,255,255,.07); color:#fff; font-family:'Calibri', sans-serif; font-size:clamp(.6rem,1.4vw,.68rem); font-weight:600; letter-spacing:.15em; text-transform:uppercase; padding:clamp(.75rem,2vw,.95rem) clamp(1.1rem,3vw,1.8rem); border:1px solid rgba(255,255,255,.2); border-radius:7px; text-decoration:none; transition:all .3s ease; white-space:nowrap; backdrop-filter:blur(8px); }
  @media(hover:hover){
    .btn-dark:hover  { background:var(--green); border-color:var(--green); transform:translateY(-2px); }
    .btn-gold:hover  { background:#b5832e; transform:translateY(-2px); }
    .btn-ghost:hover { background:rgba(255,255,255,.14); transform:translateY(-2px); }
  }

  /* ── form elements ── */
  .fsec  { font-family:'Calibri', sans-serif; font-size:clamp(.52rem,1.2vw,.58rem); font-weight:600; letter-spacing:.22em; text-transform:uppercase; color:var(--gold); display:block; margin-bottom:clamp(.875rem,2vw,1.1rem); }
  .flabel { font-family:'Calibri', sans-serif; display:block; font-size:clamp(.74rem,1.6vw,.82rem); color:var(--md); margin-bottom:.45rem; }
  .pp-input { width:100%; padding:clamp(.7rem,2vw,.875rem) 1rem; background:var(--ivory); border:1px solid var(--border); border-radius:8px; font-family:'Calibri', sans-serif; font-size:clamp(.8rem,1.8vw,.875rem); color:var(--dk); outline:none; transition:border-color .25s, box-shadow .25s; -webkit-appearance:none; }
  .pp-input::placeholder { color:var(--lt); }
  .pp-input:focus { border-color:var(--green); box-shadow:0 0 0 3px rgba(28,82,48,.1); }

  /* 2-col form row */
  .frow2 { display:grid; grid-template-columns:1fr; gap:clamp(.875rem,2vw,1.1rem); }
  @media(min-width:480px){ .frow2 { grid-template-columns:1fr 1fr; } }

  /* enroll type */
  .enroll-grid { display:grid; grid-template-columns:1fr; gap:.75rem; }
  @media(min-width:460px){ .enroll-grid { grid-template-columns:1fr 1fr; } }

  /* ── who-for ── */
  .who-grid { display:grid; gap:clamp(.875rem,2vw,1.25rem); grid-template-columns:1fr; }
  @media(min-width:540px){ .who-grid { grid-template-columns:repeat(2,1fr); } }
  @media(min-width:900px){ .who-grid { grid-template-columns:repeat(4,1fr); } }

  /* ── curriculum ── */
  .curr-grid { display:grid; gap:clamp(.875rem,2vw,1.5rem); grid-template-columns:1fr; }
  @media(min-width:540px){ .curr-grid { grid-template-columns:repeat(2,1fr); } }
  @media(min-width:900px){ .curr-grid { grid-template-columns:repeat(3,1fr); } }

  /* ── steps ── */
  .steps-grid { display:grid; gap:clamp(2rem,4vw,2.5rem); grid-template-columns:1fr; }
  @media(min-width:580px){ .steps-grid { grid-template-columns:repeat(2,1fr); } }
  @media(min-width:900px){ .steps-grid { grid-template-columns:repeat(4,1fr); } }
  .step-line { display:none; }
  @media(min-width:900px){
    .step-line { display:block; position:absolute; top:32px; left:calc(50% + 34px); width:calc(100% - 68px); height:1px; background:linear-gradient(90deg,rgba(200,150,62,.5),rgba(200,150,62,.1)); z-index:0; pointer-events:none; }
  }

  /* ── testimonials ── */
  .testi-grid { display:grid; gap:clamp(.875rem,2vw,1.5rem); grid-template-columns:1fr; }
  @media(min-width:580px){ .testi-grid { grid-template-columns:repeat(2,1fr); } }
  @media(min-width:900px){ .testi-grid { grid-template-columns:repeat(3,1fr); } }

  /* ── review video carousel ── */
  .review-carousel {
    display: flex;
    gap: 20px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding: 0.5rem 0 1rem;
    scrollbar-width: none;
  }
  .review-carousel::-webkit-scrollbar { display: none; }

  .review-vid-card {
    flex: 0 0 calc(90%);
    scroll-snap-align: start;
    aspect-ratio: 9/16;
    max-height: 480px;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    border: 1.5px solid rgba(200,150,62,0.2);
    transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
    background: #111;
  }
  @media(min-width:480px) { .review-vid-card { flex: 0 0 calc(48%); } }
  @media(min-width:768px) { .review-vid-card { flex: 0 0 calc(32%); } }
  @media(min-width:1024px) { .review-vid-card { flex: 0 0 calc(23%); } }

  .review-vid-card:hover {
    transform: translateY(-6px) scale(1.02);
    border-color: rgba(200,150,62,0.6);
    box-shadow: 0 20px 50px rgba(200,150,62,0.15);
  }

  .review-vid-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.3) 100%);
    opacity: 0;
    transition: opacity 0.35s ease;
    border-radius: 16px;
  }
  .review-vid-card:hover .review-vid-overlay { opacity: 1; }

  .review-vid-play-btn {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    background: rgba(200,150,62,0.3);
    border: 2px solid rgba(255,255,255,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
    transition: transform 0.3s ease, background 0.3s ease;
  }
  .review-vid-card:hover .review-vid-play-btn {
    transform: scale(1.1);
    background: rgba(200,150,62,0.55);
  }

  /* carousel arrows */
  .carousel-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: rgba(200,150,62,0.2);
    border: 1px solid rgba(200,150,62,0.4);
    color: #C8963E;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  }
  .carousel-arrow:hover {
    background: rgba(200,150,62,0.45);
    color: #fff;
    transform: translateY(-50%) scale(1.1);
  }
  .carousel-arrow-left  { left: -8px; }
  .carousel-arrow-right { right: -8px; }
  @media(max-width:768px){
    .carousel-arrow-left  { left: 6px; }
    .carousel-arrow-right { right: 6px; }
  }
`
