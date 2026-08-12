"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { fadeUpVariant, staggerContainer } from "@/lib/animations"
import { GraduationCap, Building, Handshake, ArrowRight, CheckCircle, Users, Target, Zap, Package } from "lucide-react"

const services = [
  {
    icon: GraduationCap, title: "Import/Export Mentorship",
    desc: "Learn end-to-end import/export from Pakistan - documentation, LC, logistics, customs, TDAP, RECP, HS codes.",
    details: "Our intensive 15-day mentorship program covers everything from initial market research to shipping logistics. You'll work directly with experienced export professionals and get real deal walkthroughs.",
    features: ["Online classes via Zoom/Google Meet", "Recorded sessions for review", "Hands-on deal walkthroughs", "Certificate of completion", "Lifetime community access"],
    cta: "Enroll Now", href: "/mentorship"
  },
  {
    icon: Building, title: "Company Registration",
    desc: "We register your import/export company in Pakistan from start to finish - NTN, Chamber of Commerce, TDAP, RECP, WEBOC registration.",
    details: "Navigating government registrations can be complex. Our team handles all the paperwork, timelines, and compliance requirements so you can focus on growing your business.",
    features: ["NTN & STRN registration", "Chamber of Commerce membership", "TDAP registration", "RECP licensing", "WEBOC portal setup"],
    cta: "Get Started", href: "/contact"
  },
  {
    icon: Handshake, title: "Buyer Matchmaking",
    desc: "We connect international buyers with verified Pakistani suppliers for premium agro commodities.",
    details: "Access our extensive network of verified Pakistani suppliers. We handle negotiations, quality verification, and export documentation to ensure flawless delivery to your port.",
    features: ["Verified supplier network", "Quality-checked products", "Price negotiation support", "End-to-end logistics", "FOB & CIF delivery"],
    cta: "Submit Query", href: "/buyer"
  },
  {
    icon: Package, title: "Become a Verified Supplier",
    desc: "Join our network of premium agricultural producers and export your products to 15+ global markets.",
    details: "We are constantly partnering with reliable farmers and producers across Pakistan. Work with Penta Peaks to gain direct access to international buyers without the hassle of export logistics.",
    features: ["Access to global buyers", "We handle all export paperwork", "Guaranteed secure payments", "Quality standardization guidance", "Long-term partnerships"],
    cta: "Apply as Supplier", href: "/supplier"
  },
]

const benefits = [
  { icon: Zap, title: "Save Time", desc: "Skip months of research and learning curves with expert guidance" },
  { icon: Target, title: "Direct Access", desc: "Connect with verified buyers and suppliers without intermediaries" },
  { icon: Users, title: "Expert Network", desc: "Join a community of successful exporters and traders" },
]

const faqItems = [
  { q: "How long does company registration take?", a: "Typically 15 days for all registrations including NTN, Chamber, TDAP, and RECP. We handle all paperwork and follow-ups." },
  { q: "Is the mentorship program suitable for beginners?", a: "Absolutely! Our program is designed for beginners with no prior export experience. We start from basics and build up to complex deals." },
  { q: "Can I get a refund if I'm not satisfied?", a: "Yes, we offer a 7-day money-back guarantee for all services if you're not satisfied with our delivery." },
  { q: "What makes your buyer network special?", a: "All our buyers are pre-verified with track records in international trade. We conduct due diligence on every buyer before connections." },
]

export default function ServicesPage() {
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

        .service-card { background:#fff; border:1px solid var(--border); border-radius:16px; padding:clamp(1.75rem,4vw,2.5rem); transition:all .35s ease; }
        @media(hover:hover){
          .service-card:hover { transform:translateY(-6px); box-shadow:0 24px 56px rgba(11,26,14,.11); border-color:var(--green); }
        }
        .service-grid { display:grid; grid-template-columns:1fr; gap:clamp(1.5rem,4vw,2.5rem); margin-top:clamp(2.5rem,5vw,4rem); }
        @media(min-width:1024px){ .service-grid { grid-template-columns:1fr; } }

        .svc-content { display:grid; grid-template-columns:1fr; gap:clamp(2rem,4vw,3rem); }
        @media(min-width:1024px){ .svc-content { grid-template-columns:1fr 1fr; } }

        .svc-icon { width:52px; height:52px; border-radius:12px; background:linear-gradient(135deg,rgba(28,82,48,.12),rgba(42,122,75,.08)); display:flex; align-items:center; justify-content:center; margin-bottom:1.25rem; }
        .svc-title { font-family:'Calibri', sans-serif; font-size:clamp(1.4rem,3vw,2rem); font-weight:400; color:var(--textdk); margin-bottom:.875rem; }
        .svc-desc { color:var(--textmd); font-size:clamp(.88rem,1.8vw,.95rem); line-height:1.8; margin-bottom:1rem; }
        .svc-details { color:var(--textmd); font-size:clamp(.82rem,1.6vw,.88rem); line-height:1.7; margin-bottom:1.5rem; }
        .svc-link { display:inline-flex; align-items:center; gap:.5rem; background:var(--forest); color:#fff; font-size:clamp(.65rem,1.4vw,.7rem); font-weight:600; letter-spacing:.15em; text-transform:uppercase; padding:clamp(.75rem,2vw,.9rem) clamp(1.25rem,3vw,1.75rem); border-radius:7px; text-decoration:none; transition:all .3s ease; white-space:nowrap; }
        @media(hover:hover){
          .svc-link:hover { background:var(--green); transform:translateY(-2px); }
        }

        .features-section { padding-top:clamp(1.5rem,3vw,2rem); }
        .features-title { font-size:clamp(.62rem,1.4vw,.68rem); font-weight:600; letter-spacing:.22em; text-transform:uppercase; color:var(--gold); display:block; margin-bottom:clamp(1rem,2.5vw,1.5rem); }
        .features-list { display:flex; flex-direction:column; gap:clamp(.875rem,2vw,1.1rem); }
        .feature-item { display:flex; align-items:flex-start; gap:.75rem; }
        .feature-check { width:18px; height:18px; color:var(--green); flex-shrink:0; margin-top:.125rem; }
        .feature-text { font-size:clamp(.82rem,1.8vw,.9rem); color:var(--textmd); line-height:1.6; }

        .benefits-grid { display:grid; grid-template-columns:1fr; gap:clamp(1.5rem,3vw,2rem); margin-top:clamp(2rem,4vw,3rem); }
        @media(min-width:640px){ .benefits-grid { grid-template-columns:repeat(3,1fr); } }
        .benefit-card { background:#fff; border:1px solid var(--border); border-radius:12px; padding:clamp(1.5rem,3vw,2rem); text-align:center; }
        .benefit-icon { width:48px; height:48px; border-radius:50%; background:var(--gold); display:flex; align-items:center; justify-content:center; margin:0 auto clamp(.875rem,2vw,1.25rem); }
        .benefit-title { font-weight:600; font-size:clamp(.95rem,1.8vw,1.05rem); color:var(--textdk); margin-bottom:.5rem; }
        .benefit-desc { font-size:.88rem; color:var(--textmd); line-height:1.6; }

        .faq-section { background:#fff; border-radius:12px; overflow:hidden; }
        .faq-item { border-bottom:1px solid var(--border); }
        .faq-item:last-child { border-bottom:none; }
        .faq-question { padding:clamp(1.5rem,3vw,2rem); cursor:pointer; display:flex; align-items:center; justify-content:space-between; gap:1rem; transition:all .3s; }
        @media(hover:hover){
          .faq-question:hover { background:var(--ivory); }
        }
        .faq-q-text { font-weight:600; font-size:clamp(.9rem,1.8vw,.95rem); color:var(--textdk); }
        .faq-answer { max-height:0; overflow:hidden; transition:max-height .35s ease; }
        .faq-answer.open { max-height:400px; }
        .faq-a-text { padding:0 clamp(1.5rem,3vw,2rem) clamp(1rem,2vw,1.5rem); font-size:.88rem; color:var(--textmd); line-height:1.7; }

        .ticker { background: #0D2B4A; border-top: 1px solid rgba(200,150,62,0.2); border-bottom: 1px solid rgba(200,150,62,0.2); overflow: hidden; padding: 0.75rem 0; }
        .ticker-inner { display: flex; gap: 0; white-space: nowrap; animation: tickerScroll 28s linear infinite; }
        .ticker-inner:hover { animation-play-state: paused; }
        .ticker-item { display: inline-flex; align-items: center; gap: 0.75rem; padding: 0 2.5rem; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.75); }
        .ticker-dot { width: 4px; height: 4px; border-radius: 50%; background: #C8963E; flex-shrink: 0; }
        @keyframes tickerScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>

      {/* Header */}
      <section style={{ position: "relative", height: "95svh", minHeight: "560px", maxHeight: "900px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#050E1A", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <Image src="/images/Export.webp" alt="Shipment Logistics Services" fill style={{ objectFit: "cover" }} priority sizes="100vw" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(5,14,26,.85) 0%,rgba(5,14,26,.65) 100%)" }} />
        </div>
        <div className="relative z-10 sec-wrap" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
          <span className="inline-block px-3 py-1 bg-accent/20 border border-accent/40 rounded-full text-xs font-bold text-accent tracking-wider uppercase mb-4">
            Professional Export Services
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-[family-name:var(--font-display)] mb-4" style={{ color: "#ffffff" }}>
            How We <span className="font-normal italic serif" style={{ color: "#C9972C" }}>Help You</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            From professional NTN/WEBOC company registrations to hands-on export mentorship programs, we bridge Pakistan&apos;s trade potentials globally.
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

      {/* Services */}
      <section style={{ background:"#fff", borderBottom:"1px solid var(--border)" }}>
        <div className="sec-wrap" style={{ paddingTop:"clamp(2rem,4vw,3.5rem)", paddingBottom:"clamp(2rem,4vw,3.5rem)" }}>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-60px" }} className="service-grid">
            {services.map((s) => (
              <motion.div key={s.title} variants={fadeUpVariant} className="service-card">
                <div className="svc-content">
                  <div>
                    <div className="svc-icon">
                      <s.icon style={{ width:24, height:24, color:"var(--green)" }} />
                    </div>
                    <h2 className="svc-title">{s.title}</h2>
                    <p className="svc-desc">{s.desc}</p>
                    <p className="svc-details">{s.details}</p>
                    <Link href={s.href} className="svc-link">
                      {s.cta} <ArrowRight style={{ width:14, height:14 }} />
                    </Link>
                  </div>

                  <div className="features-section">
                    <span className="features-title">What&apos;s Included</span>
                    <div className="features-list">
                      {s.features.map((f) => (
                        <div key={f} className="feature-item">
                          <CheckCircle className="feature-check" style={{ width:18, height:18 }} />
                          <span className="feature-text">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="sec-pad" style={{ background:"var(--ivory)" }}>
        <div className="sec-wrap">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:"-60px" }} style={{ textAlign:"center", marginBottom:"clamp(1.5rem,3vw,2.5rem)" }}>
            <p className="pp-tag" style={{ marginBottom:".75rem" }}>Why Choose Us</p>
            <h2 className="pp-section-heading" style={{ marginBottom:".75rem" }}>
              The <em style={{ fontStyle:"italic", color:"var(--green)" }}>Penta Peaks</em> Advantage
            </h2>
            <span className="gold-rule-c" />
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-60px" }} className="benefits-grid">
            {benefits.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={i} variants={fadeUpVariant} className="benefit-card">
                <div className="benefit-icon">
                  <Icon style={{ width:24, height:24, color:"#fff" }} />
                </div>
                <h3 className="benefit-title">{title}</h3>
                <p className="benefit-desc">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sec-pad" style={{ background:"#fff" }}>
        <div className="sec-wrap">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:"-60px" }} style={{ textAlign:"center", marginBottom:"clamp(2rem,4vw,3rem)" }}>
            <p className="pp-tag" style={{ marginBottom:".75rem" }}>Common Questions</p>
            <h2 className="pp-section-heading">
              <em style={{ fontStyle:"italic", color:"var(--green)" }}>FAQ</em>
            </h2>
            <span className="gold-rule-c" />
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-60px" }} className="faq-section">
            {faqItems.map((item, i) => (
              <motion.div key={i} variants={fadeUpVariant} className="faq-item">
                <FAQ question={item.q} answer={item.a} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <div className="faq-question" onClick={() => setOpen(!open)}>
        <span className="faq-q-text">{question}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ArrowRight style={{ width: 20, height: 20, color: "var(--green)" }} />
        </motion.div>
      </div>
      <motion.div className={`faq-answer ${open ? "open" : ""}`} animate={{ maxHeight: open ? 400 : 0 }} transition={{ duration: 0.35 }}>
        <p className="faq-a-text">{answer}</p>
      </motion.div>
    </>
  )
}

import React from "react"
