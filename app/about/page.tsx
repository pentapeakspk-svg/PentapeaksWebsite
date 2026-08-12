"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import {
  ArrowRight, ArrowUpRight, Leaf, Globe2, ShieldCheck,
  Truck, Award, Users, Sprout, Package, ChevronDown,
  Ship, Container, Anchor, TrendingUp
} from "lucide-react"


const milestones = [
  { year: "2018", title: "Founded", body: "Penta Peaks was born in Lahore with a singular vision - to bridge Pakistan's agricultural wealth with discerning global buyers." },
  { year: "2019", title: "First Export", body: "Our maiden shipment of premium 1121 Basmati reached the UAE, setting the quality benchmark we still hold today." },
  { year: "2021", title: "15 Countries", body: "Expanded our network across the Gulf, Europe and South-East Asia. Each new market validated our uncompromising quality promise." },
  { year: "2022", title: "Mentorship Launch", body: "We opened our knowledge to aspiring Pakistani exporters - the Penta Peaks Mentorship Programme was born." },
  { year: "2024", title: "500+ Students", body: "Half a thousand entrepreneurs trained, hundreds of deals closed, and a growing alumni network reshaping Pakistani trade." },
]

const values = [
  { icon: Leaf, title: "Farm-to-Port", body: "We control every link of the chain - from Punjab's fields to the world's ports." },
  { icon: ShieldCheck, title: "Zero Compromise", body: "Every consignment passes ISO-grade lab testing before a single carton leaves our facility." },
  { icon: Globe2, title: "Global Vision", body: "Fifteen markets and counting. Our relationships span continents, our paperwork is flawless." },
  { icon: Truck, title: "On-Time, Every Time", body: "98% on-schedule delivery record across five years of international shipping." },
  { icon: Award, title: "Certified Quality", body: "TDAP, RECP, Phytosanitary - fully compliant for every destination market." },
  { icon: Users, title: "People First", body: "We invest in farmers, students and buyers equally - long-term relationships, not one-off deals." },
]

const categories = [
  { label: "Fresh Produce", icon: "🍋", count: "22 SKUs", image: "/images/hero-fruits.webp" },
  { label: "Grains", icon: "🌾", count: "8 SKUs", image: "/images/product-rice.webp" },
  { label: "Spices", icon: "🌿", count: "6 SKUs", image: "/images/product-turmeric.webp" },
  { label: "Minerals", icon: "🪨", count: "4 SKUs", image: "/images/product-salt.webp" },
]

const figures = [
  { value: "150+", label: "Global Buyers" },
  { value: "25+", label: "Export Products" },
  { value: "15+", label: "Countries" },
  { value: "98%", label: "On-Time Rate" },
  { value: "500+", label: "Students Trained" },
  { value: "6", label: "Years of Excellence" },
]

const founders = [
  { name: "Muhammad Sumair Butt", role: "CEO & Founder", image: "/images/Founders/muhammad-sumair-butt-ceo-founder.webp", experience: "10+ Years in Global Trade & Mentorship" },
  { name: "Muhammad Umar", role: "Director Business Development", image: "/images/Founders/muhammad-umar-director-business-development.webp", experience: "Driving Strategic Partnerships & Growth" },
  { name: "Muhammad Atif", role: "Director Operations", image: "/images/Founders/muhammad-atif-director-operations.webp", experience: "Supply Chain & Logistics Expert" },
  { name: "Ahsen Ansari", role: "Director International Trade", image: "/images/Founders/ahsen-ansari-director-international-trade.webp", experience: "Specialist in Global Negotiations" },
]

/* ── Helpers ── */
function Tag({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span style={{
      fontFamily: "'Calibri', sans-serif",
      fontSize: ".6rem", fontWeight: 600,
      letterSpacing: ".28em", textTransform: "uppercase",
      color: light ? "rgba(200,150,62,.85)" : "#C8963E",
      display: "inline-flex", alignItems: "center", gap: ".5rem"
    }}>
      <span style={{ display: "inline-block", width: 16, height: 1, background: "currentColor" }} />
      {children}
    </span>
  )
}

function GoldRule({ center = false }: { center?: boolean }) {
  return <div style={{ width: "2.5rem", height: 1, background: "#C8963E", margin: center ? "0 auto" : undefined }} />
}

/* ── Page ── */
export default function AboutPage() {
  const [activeYear, setActiveYear] = useState(0)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --ivory:#FAF8F4; --cream:#F2EDE4; --forest:#0B1A0E;
          --green:#1C5230; --leaf:#2A7A4B; --gold:#C8963E;
          --gold-lt:rgba(200,150,62,.12); --border:#DDD8CF;
          --textdk:#16261A; --textmd:#4A5D4C; --textlt:#8A9E8B;
        }
        html { scroll-behavior: smooth; }
        body { font-family:'Calibri', sans-serif; background:var(--ivory); color:var(--textdk); }

        /* util */
        .serif { font-family:'Calibri', sans-serif; }
        .sec-wrap { max-width:1280px; margin:0 auto; padding:0 clamp(1.25rem,5vw,4rem); }
        .sec-pad  { padding:clamp(4rem,8vw,7rem) 0; }

        /* btn */
        .btn-f {
          display:inline-flex; align-items:center; gap:.55rem;
          background:var(--forest); color:#fff;
          font-size:.65rem; font-weight:600; letter-spacing:.2em; text-transform:uppercase;
          padding:.9rem 1.8rem; border:1px solid var(--forest); border-radius:6px;
          text-decoration:none; transition:all .3s ease; white-space:nowrap;
        }
        .btn-f:hover { background:var(--green); border-color:var(--green); transform:translateY(-2px); }
        .btn-of {
          display:inline-flex; align-items:center; gap:.55rem;
          background:transparent; color:var(--forest);
          font-size:.65rem; font-weight:600; letter-spacing:.2em; text-transform:uppercase;
          padding:.9rem 1.8rem; border:1px solid var(--forest); border-radius:6px;
          text-decoration:none; transition:all .3s ease;
        }
        .btn-of:hover { background:var(--forest); color:#fff; transform:translateY(-2px); }
        .btn-gold {
          display:inline-flex; align-items:center; gap:.55rem;
          background:var(--gold); color:#fff;
          font-size:.65rem; font-weight:600; letter-spacing:.2em; text-transform:uppercase;
          padding:.9rem 2rem; border-radius:6px;
          text-decoration:none; transition:all .3s ease;
        }
        .btn-gold:hover { background:#b5832e; transform:translateY(-2px); }

        /* ── HERO ── */
        .hero-grid {
          display:grid; grid-template-columns:1fr;
          min-height:100svh; overflow:hidden;
        }
        @media(min-width:1024px){
          .hero-grid { grid-template-columns:55fr 45fr; }
        }
        .hero-img-wrap {
          position:relative; overflow:hidden;
          min-height:380px; order:-1;
        }
        @media(min-width:1024px){ .hero-img-wrap { order:1; min-height:unset; } }
        .hero-marquee {
          position:absolute; bottom:0; left:0; right:0; overflow:hidden;
          background:var(--gold); padding:.6rem 0; z-index:5;
        }
        .hero-marquee-inner {
          display:flex; gap:2rem; white-space:nowrap;
          animation:marqueeScroll 18s linear infinite;
        }
        @keyframes marqueeScroll { from { transform:translateX(0) } to { transform:translateX(-50%) } }
        .hero-scroll-cue {
          display:flex; align-items:center; gap:.6rem;
          font-size:.58rem; font-weight:600; letter-spacing:.22em; text-transform:uppercase;
          color:rgba(255,255,255,.35); margin-top:auto;
        }

        /* ── STATEMENT (re-designed split layout matching products spotlight) ── */
        .statement-section {
          display: grid;
          grid-template-columns: 1fr;
          min-height: 460px;
          background: var(--forest);
          overflow: hidden;
          position: relative;
        }
        @media(min-width:900px){
          .statement-section {
            grid-template-columns: 1fr 1fr;
            min-height: 540px;
          }
        }
        .statement-img-col {
          position: relative;
          min-height: clamp(240px,40vw,520px);
          overflow: hidden;
          order: 1;
        }
        .statement-text-col {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(3rem,6vw,5.5rem) clamp(1.5rem,5vw,5rem);
          position: relative;
          overflow: hidden;
          order: 2;
          background: var(--forest);
        }
        @media(min-width:900px){
          .statement-img-col  { order: 2; }
          .statement-text-col { order: 1; }
        }
        .statement-bg-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          font-family: 'Calibri', sans-serif;
          font-size: clamp(3.5rem,10vw,8rem);
          font-weight: 700;
          color: rgba(255, 255, 255, 0.015);
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
          letter-spacing: -.05em;
          z-index: 0;
        }
        .statement-line {
          font-family: 'Calibri', sans-serif;
          font-size: clamp(1.6rem,3.2vw,2.4rem);
          font-weight: 300;
          color: #fff;
          line-height: 1.25;
          letter-spacing: -.01em;
          margin-bottom: 1.5rem;
        }
        .statement-line em { font-style: italic; color: var(--gold); }

        /* ── STORY TIMELINE ── */
        .timeline-shell { display:grid; grid-template-columns:1fr; gap:0; }
        @media(min-width:900px){ .timeline-shell { grid-template-columns:320px 1fr; } }
        .timeline-nav-item {
          padding:1.1rem 1.25rem; cursor:pointer; border-left:2px solid transparent;
          transition:all .35s ease; display:flex; gap:.9rem; align-items:center;
        }
        .timeline-nav-item.active {
          border-left-color:var(--gold); background:linear-gradient(90deg,rgba(200,150,62,.07),transparent);
        }
        .timeline-panel {
          background:#fff; border:1px solid var(--border); border-radius:16px;
          padding:clamp(2rem,4vw,3.5rem); display:flex; flex-direction:column; gap:1.25rem;
          position:relative; overflow:hidden;
        }
        .timeline-panel::before {
          content:''; position:absolute; top:0; left:0; width:3px; height:100%;
          background:linear-gradient(to bottom,var(--gold),transparent);
        }
        .year-badge {
          font-family:'Calibri', sans-serif;
          font-size:clamp(3.5rem,9vw,7rem); font-weight:300;
          color:rgba(28,82,48,.06); line-height:1;
          position:absolute; top:1rem; right:1.5rem;
          pointer-events:none; user-select:none;
        }

        /* ── FIGURES BAND ── */
        .figures-band {
          background:var(--cream); border-top:1px solid var(--border);
          border-bottom:1px solid var(--border); overflow:hidden;
          position:relative;
        }
        .figures-grid {
          display:grid; grid-template-columns:repeat(2,1fr);
        }
        @media(min-width:768px){ .figures-grid { grid-template-columns:repeat(3,1fr); } }
        @media(min-width:1200px){ .figures-grid { grid-template-columns:repeat(6,1fr); } }
        .fig-cell {
          padding:clamp(2rem,4vw,3rem) 1.5rem; text-align:center;
          border-right:1px solid var(--border); border-bottom:1px solid var(--border);
          position:relative; transition:background .3s;
        }
        .fig-cell:hover { background:rgba(200,150,62,.06); }
        .fig-cell::after {
          content:''; position:absolute; bottom:-1px; left:25%; right:25%; height:2px;
          background:var(--gold); transform:scaleX(0); transition:transform .4s ease;
        }
        .fig-cell:hover::after { transform:scaleX(1); }
        @media(min-width:1200px){ .fig-cell:last-child { border-right:none; } }

        /* ── VALUES ── */
        .values-grid {
          display:grid; grid-template-columns:1fr; gap:1px;
          background:var(--border);
        }
        @media(min-width:640px){ .values-grid { grid-template-columns:repeat(2,1fr); } }
        @media(min-width:1024px){ .values-grid { grid-template-columns:repeat(3,1fr); } }
        .val-card {
          background:var(--ivory); padding:clamp(2rem,3.5vw,2.75rem);
          position:relative; overflow:hidden;
          transition:background .35s;
        }
        .val-card:hover { background:#fff; }
        .val-card::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(200,150,62,.06) 0%,transparent 60%);
          opacity:0; transition:opacity .35s;
        }
        .val-card:hover::before { opacity:1; }
        .val-icon-ring {
          width:52px; height:52px; border-radius:14px;
          background:linear-gradient(135deg,rgba(28,82,48,.12),rgba(42,122,75,.06));
          border:1px solid rgba(28,82,48,.15);
          display:flex; align-items:center; justify-content:center;
          margin-bottom:1.1rem; transition:background .35s, transform .35s;
        }
        .val-card:hover .val-icon-ring {
          background:linear-gradient(135deg,var(--green),var(--leaf));
          transform:scale(1.05);
        }
        .val-card:hover .val-icon-ring svg { color:#fff !important; }

        /* ── CATEGORIES SHOWCASE ── */
        .cat-strip {
          display:flex; overflow-x:auto; gap:1rem; scroll-snap-type:x mandatory;
          -webkit-overflow-scrolling:touch; scrollbar-width:none;
          padding-bottom:.5rem;
        }
        .cat-strip::-webkit-scrollbar { display:none; }
        .cat-card {
          flex:0 0 clamp(180px,28vw,260px); scroll-snap-align:start;
          border-radius:16px; overflow:hidden; position:relative;
          height:clamp(260px,38vw,380px); cursor:pointer;
          border:1px solid var(--border);
        }
        @media(min-width:1024px){
          .cat-strip { display:grid; grid-template-columns:repeat(4,1fr); overflow:unset; }
          .cat-card { flex:unset; height:clamp(300px,28vw,400px); }
        }
        .cat-card img { transition:transform .8s cubic-bezier(.25,.46,.45,.94); }
        .cat-card:hover img { transform:scale(1.1); }
        .cat-card-overlay {
          position:absolute; inset:0;
          background:linear-gradient(to top,rgba(11,26,14,.9) 0%,rgba(11,26,14,.2) 50%,transparent 100%);
          transition:opacity .4s;
        }
        .cat-card:hover .cat-card-overlay { opacity:.85; }
        .cat-bottom { position:absolute; bottom:0; left:0; right:0; padding:1.25rem 1rem; }
        .cat-badge {
          display:inline-block; padding:.3rem .75rem;
          background:rgba(200,150,62,.2); border:1px solid rgba(200,150,62,.4);
          border-radius:20px; backdrop-filter:blur(8px);
          font-size:.6rem; font-weight:600; letter-spacing:.15em;
          color:var(--gold); text-transform:uppercase; margin-bottom:.6rem;
        }

        /* ── ORIGIN STRIP ── */
        .origin-split {
          display:grid; grid-template-columns:1fr;
        }
        @media(min-width:1024px){ .origin-split { grid-template-columns:1fr 1fr; min-height:560px; } }
        .origin-map-side {
          background:var(--forest); position:relative;
          overflow:hidden; min-height:340px;
          display:flex; align-items:center; justify-content:center;
        }
        .origin-text-side {
          background:var(--green);
          padding:clamp(3rem,6vw,6rem) clamp(1.5rem,5vw,5rem);
          display:flex; flex-direction:column; justify-content:center;
          position:relative; overflow:hidden;
        }
        .region-pill {
          display:inline-flex; align-items:center; gap:.5rem;
          padding:.45rem 1rem; border-radius:24px;
          background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.15);
          font-size:.65rem; font-weight:500; letter-spacing:.08em;
          color:rgba(255,255,255,.75); transition:background .3s;
          white-space:nowrap;
        }
        .region-pill:hover { background:rgba(200,150,62,.2); border-color:rgba(200,150,62,.4); color:var(--gold); }

        /* ── CTA ── */
        .cta-section {
          background:var(--forest); position:relative;
          padding:clamp(5rem,9vw,8rem) 0; overflow:hidden;
        }
        .cta-grid {
          display:grid; grid-template-columns:1fr; gap:3rem;
          align-items:center;
        }
        @media(min-width:1024px){ .cta-grid { grid-template-columns:1fr 1px 1fr; } }
        .cta-divider { width:1px; height:200px; background:rgba(255,255,255,.12); display:none; }
        @media(min-width:1024px){ .cta-divider { display:block; } }

        /* scroll-reveal utility */
        @keyframes fadeUp { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:none} }

        /* ── ABOUT HERO LOGISTICS ── */
        .about-hero-logistics {
          position: relative;
          min-height: 100svh;
          background: #050E1A;
          overflow: hidden;
          padding: clamp(7rem, 12vh, 10rem) 0 clamp(4rem, 8vh, 6rem);
          display: flex;
          align-items: center;
        }
        @media(min-width:1024px){
          .about-hero-grid-cols {
            grid-template-columns: 55fr 45fr !important;
          }
        }
        .about-logistics-bg {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(to right, rgba(5,14,26,0.92) 0%, rgba(5,14,26,0.6) 50%, rgba(5,14,26,0.85) 100%), url('/images/homesection.webp');
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          opacity: 1;
          z-index: 1;
        }
        .about-logistics-grid-lines {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);
          background-size: 60px 60px;
          z-index: 2;
        }
        .about-logistics-accent {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(800px,90%);
          height: 2px;
          background: linear-gradient(90deg,transparent,#C8963E,transparent);
          z-index: 3;
        }

        .eyebrow-gold {
          font-family: 'Calibri', sans-serif;
          font-size: .65rem;
          font-weight: 600;
          letter-spacing: .35em;
          text-transform: uppercase;
          color: #C8963E;
          display: flex;
          align-items: center;
          gap: .7rem;
        }
        .eyebrow-gold::before {
          content: '';
          display: inline-block;
          width: 24px;
          height: 1px;
          background: #C8963E;
        }

        .serif-title {
          font-family: 'Calibri', sans-serif;
          font-weight: 300;
          letter-spacing: -.02em;
        }

        .about-hero-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(.8rem, 2vw, 1.25rem);
        }
        .about-hero-glass-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: clamp(1.25rem, 2.5vw, 2rem);
          border-radius: 14px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: transform .35s ease, background .35s ease, border-color .35s ease;
        }
        .about-hero-glass-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.07);
          border-color: rgba(200, 150, 62, 0.3);
        }
        .about-hero-card-icon-container {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: rgba(200, 150, 62, 0.1);
          border: 1px solid rgba(200, 150, 62, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.15rem;
        }

        /* Buttons */
        .btn-gold-themed {
          display: inline-flex;
          align-items: center;
          gap: .6rem;
          background: linear-gradient(135deg, #C8963E, #b5832e);
          color: #fff;
          font-size: .68rem;
          font-weight: 600;
          letter-spacing: .18em;
          text-transform: uppercase;
          padding: .95rem 2rem;
          border-radius: 6px;
          text-decoration: none;
          transition: all .35s ease;
          box-shadow: 0 8px 24px rgba(200, 150, 62, 0.2);
        }
        .btn-gold-themed:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(200, 150, 62, 0.3);
        }
        .btn-outline-white {
          display: inline-flex;
          align-items: center;
          gap: .6rem;
          background: transparent;
          color: #fff;
          font-size: .68rem;
          font-weight: 600;
          letter-spacing: .18em;
          text-transform: uppercase;
          padding: .95rem 2rem;
          border-radius: 6px;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.25);
          transition: all .35s ease;
        }
        .btn-outline-white:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: #fff;
          transform: translateY(-2px);
        }

        /* ── TICKER BAND ── */
        .ticker { background:#0D2B4A; border-top:1px solid rgba(200,150,62,.2); border-bottom:1px solid rgba(200,150,62,.2); overflow:hidden; padding:.75rem 0; }
        .ticker-inner { display:flex; gap:0; white-space:nowrap; animation:tickerScroll 28s linear infinite; }
        .ticker-inner:hover { animation-play-state:paused; }
        .ticker-item { display:inline-flex; align-items:center; gap:.75rem; padding:0 2.5rem; font-size:.65rem; font-weight:600; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,.75); }
        .ticker-dot { width:4px; height:4px; border-radius:50%; background:#C8963E; flex-shrink:0; }
        @keyframes tickerScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      `}</style>


      {/* ══ HERO BANNER (LOGISTICS THEME) ══ */}
      <section className="about-hero-logistics">
        <div className="about-logistics-bg" />
        <div className="about-logistics-grid-lines" />
        <div className="about-logistics-accent" />
        <div className="sec-wrap" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', alignItems: 'center', width: '100%' }} className="about-hero-grid-cols">
            {/* Left Side: Text Content */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .8 }}>
              <p className="eyebrow-gold" style={{ marginBottom: '1.25rem' }}>PREMIUM EXPORT & GLOBAL TRADE</p>
              <h1 className="serif" style={{ fontSize: 'clamp(2.5rem,5.5vw,4.25rem)', color: '#fff', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                Connecting <em style={{ fontStyle: 'italic', color: '#C8963E' }}>Pakistan</em> to Global Markets
              </h1>
              <div style={{ width: '2.5rem', height: 2, background: 'linear-gradient(90deg, #C8963E, #E8B84B)', marginBottom: '2rem' }} />
              <p style={{ color: 'rgba(255,255,255,.85)', fontSize: '1.05rem', maxWidth: 540, marginBottom: '2.5rem', fontWeight: 300, lineHeight: 1.85, fontFamily: "'Calibri', sans-serif" }}>
                We are a premier trading house sourcing Pakistan's finest commodities for the world. We procure premium agricultural products in bulk and seamlessly manage the entire export process to ensure flawless delivery to international buyers.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/products" className="btn-gold-themed">
                  Our Products <ArrowRight style={{ width: 13, height: 13 }} />
                </Link>
                <Link href="/contact" className="btn-outline-white">
                  Trade Inquiries
                </Link>
              </div>
            </motion.div>

            {/* Right Side: Grid of 4 Cards */}
            <motion.div initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}
              className="about-hero-cards-grid">
              {[
                { icon: Ship, label: 'Bulk Export', val: 'FCL & LCL Shipments' },
                { icon: Container, label: 'Premium Sourcing', val: 'Verified Quality' },
                { icon: Anchor, label: 'Global Trading', val: 'End-to-End Export' },
                { icon: Globe2, label: 'Global Reach', val: '15+ Countries' }
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="about-hero-glass-card">
                    <div className="about-hero-card-icon-container">
                      <Icon style={{ width: 24, height: 24, color: '#C8963E' }} />
                    </div>
                    <p style={{ color: '#fff', fontWeight: 600, fontSize: '.95rem', marginBottom: '.25rem', fontFamily: "'Calibri', sans-serif" }}>{item.label}</p>
                    <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 500, fontFamily: "'Calibri', sans-serif" }}>{item.val}</p>
                  </div>
                )
              })}
            </motion.div>
          </div>
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


      {/* ══════════════════════════════════════════
          2. BRAND STATEMENT (re-designed split layout)
      ══════════════════════════════════════════ */}
      <section className="statement-section" style={{ borderBottom: "1px solid rgba(255,255,255,.08)" }}>
        {/* gold top line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,#C8963E 40%,transparent)", zIndex: 10 }} />

        {/* Text Column (Left on Desktop) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: .9, ease: [.22, 1, .36, 1] }}
          className="statement-text-col"
        >
          <div className="statement-bg-text">MISSION</div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <p className="eyebrow-gold" style={{ marginBottom: "1.25rem" }}>OUR MISSION</p>
            <h2 className="serif statement-line">
              We exist to place <em style={{ fontStyle: "italic", color: "#C8963E" }}>Pakistan's finest</em> agricultural products on every discerning table - from the Gulf to Northern Europe.
            </h2>
            <div style={{ width: "2.25rem", height: 1, background: "#C8963E", marginBottom: "1.5rem" }} />
            <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: "clamp(.84rem,1.8vw,.95rem)", color: "rgba(255,255,255,.65)", lineHeight: 1.85, fontWeight: 300, marginBottom: "2rem", maxWidth: 480 }}>
              Founded on the belief that Pakistani produce deserves global recognition, Penta Peaks has grown from a single export shipment to a trusted name across 15+ countries - not through volume alone, but through an unshakeable commitment to quality, transparency, and relationship-building.
            </p>
            <Link href="/products" className="btn-gold-themed" style={{ alignSelf: "flex-start" }}>
              View Export Catalogue <ArrowRight style={{ width: 13, height: 13 }} />
            </Link>
          </div>
        </motion.div>

        {/* Image Column (Right on Desktop) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1 }}
          className="statement-img-col"
        >
          <Image src="/images/Port.jpg" alt="We Exist" fill className="object-cover" sizes="(max-width:900px) 100vw,50vw" />
          {/* overlay gradient fading to forest green */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to left, transparent 60%, #0B1A0E)",
            opacity: .85
          }} />
        </motion.div>
      </section>



      {/* ══════════════════════════════════════════
          3. FIGURES BAND
      ══════════════════════════════════════════ */}
      <section className="figures-band">
        <div className="figures-grid">
          {figures.map((f, i) => (
            <motion.div key={f.label} className="fig-cell"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }} transition={{ delay: i * .06 }}>
              <p className="serif" style={{ fontSize: "clamp(2rem,4.5vw,3.5rem)", fontWeight: 300, color: "#0B1A0E", lineHeight: 1, letterSpacing: "-.02em" }}>
                {f.value.replace(/[^0-9]/g, "") !== f.value
                  ? <>{f.value.replace(/[0-9]/g, "")}<span style={{ color: "#1C5230" }}>{f.value.match(/[0-9]+/)}</span>{f.value.replace(/[0-9]+/, "").slice(1)}</>
                  : <span style={{ color: "#1C5230" }}>{f.value}</span>
                }
              </p>
              <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".58rem", fontWeight: 600, letterSpacing: ".22em", textTransform: "uppercase", color: "#8A9E8B", marginTop: ".65rem" }}>
                {f.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>


      {/* ══════════════════════════════════════════
          4. OUR STORY - interactive timeline
      ══════════════════════════════════════════ */}
      <section className="sec-pad" style={{ background: "#FAF8F4", borderBottom: "1px solid #DDD8CF" }}>
        <div className="sec-wrap">

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            style={{ marginBottom: "clamp(2.5rem,5vw,4.5rem)" }}>
            <Tag>Our Journey</Tag>
            <div style={{ height: ".9rem" }} />
            <h2 className="serif" style={{ fontSize: "clamp(2rem,4.5vw,3.75rem)", fontWeight: 300, color: "#16261A", lineHeight: 1.05, marginBottom: "1rem" }}>
              A Story of <em style={{ fontStyle: "italic", color: "#1C5230" }}>Growth</em>
            </h2>
            <GoldRule />
          </motion.div>

          <div className="timeline-shell">

            {/* year nav */}
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              style={{ borderRight: "1px solid #DDD8CF", paddingRight: 0 }}>
              {milestones.map((m, i) => (
                <div key={m.year}
                  className={`timeline-nav-item${activeYear === i ? " active" : ""}`}
                  onClick={() => setActiveYear(i)}
                  style={{ borderLeftColor: activeYear === i ? "#C8963E" : "transparent" }}>
                  <div>
                    <p className="serif" style={{ fontSize: "clamp(1.1rem,2.5vw,1.5rem)", fontWeight: activeYear === i ? 600 : 300, color: activeYear === i ? "#C8963E" : "#8A9E8B", lineHeight: 1, transition: "all .3s" }}>
                      {m.year}
                    </p>
                    <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".75rem", fontWeight: 600, color: activeYear === i ? "#16261A" : "#8A9E8B", marginTop: ".2rem", transition: "color .3s" }}>
                      {m.title}
                    </p>
                  </div>
                  {activeYear === i && (
                    <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#C8963E", flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </motion.div>

            {/* panel */}
            <motion.div key={activeYear}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .55, ease: [.22, 1, .36, 1] }}
              style={{ padding: "clamp(1.5rem,3vw,2.5rem) clamp(1.25rem,3vw,2.5rem)" }}>
              <div className="timeline-panel">
                <div className="year-badge">{milestones[activeYear].year}</div>
                <div style={{ display: "flex", alignItems: "center", gap: ".75rem", position: "relative", zIndex: 1 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#1C5230,#2A7A4B)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Sprout style={{ width: 18, height: 18, color: "#fff" }} />
                  </div>
                  <Tag>Milestone - {milestones[activeYear].year}</Tag>
                </div>
                <h3 className="serif" style={{ fontSize: "clamp(1.75rem,4vw,3rem)", fontWeight: 300, color: "#16261A", lineHeight: 1.1, position: "relative", zIndex: 1 }}>
                  {milestones[activeYear].title}
                </h3>
                <div style={{ width: "2.5rem", height: 1, background: "#C8963E" }} />
                <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: "clamp(.9rem,1.5vw,1.05rem)", color: "#4A5D4C", lineHeight: 1.85, fontWeight: 300, maxWidth: 520, position: "relative", zIndex: 1 }}>
                  {milestones[activeYear].body}
                </p>

                {/* progress dots */}
                <div style={{ display: "flex", gap: ".4rem", marginTop: ".5rem" }}>
                  {milestones.map((_, i) => (
                    <div key={i}
                      onClick={() => setActiveYear(i)}
                      style={{ width: i === activeYear ? 24 : 8, height: 8, borderRadius: 4, background: i === activeYear ? "#C8963E" : "#DDD8CF", cursor: "pointer", transition: "all .4s ease" }} />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          5. VALUES
      ══════════════════════════════════════════ */}
      <section style={{ background: "#fff" }}>
        <div className="sec-wrap sec-pad">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            style={{ textAlign: "center", marginBottom: "clamp(2.5rem,5vw,4.5rem)" }}>
            <Tag>What We Stand For</Tag>
            <div style={{ height: ".9rem" }} />
            <h2 className="serif" style={{ fontSize: "clamp(1.9rem,4.5vw,3.75rem)", fontWeight: 300, color: "#16261A", marginBottom: "1rem" }}>
              Our <em style={{ fontStyle: "italic", color: "#1C5230" }}>Core Values</em>
            </h2>
            <GoldRule center />
          </motion.div>
        </div>

        <motion.div
          variants={{ hidden: {}, visible: { transition: { staggerChildren: .07 } } }}
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
          className="values-grid">
          {values.map((v) => {
            const Icon = v.icon
            return (
              <motion.div key={v.title}
                variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: .6 } } }}
                className="val-card">
                <div className="val-icon-ring">
                  <Icon style={{ width: 20, height: 20, color: "#1C5230" }} />
                </div>
                <h3 style={{ fontFamily: "'Calibri', sans-serif", fontSize: "clamp(1.1rem,2vw,1.4rem)", fontWeight: 400, color: "#16261A", marginBottom: ".6rem" }}>
                  {v.title}
                </h3>
                <GoldRule />
                <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".875rem", color: "#4A5D4C", lineHeight: 1.8, fontWeight: 300, marginTop: ".85rem" }}>
                  {v.body}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </section>


      {/* ══ GLOBAL SEA & AIR LOGISTICS SECTION ══ */}
      <section className="sec-pad" style={{ background: "#fff", borderBottom: "1px solid #DDD8CF" }}>
        <div className="sec-wrap">
          <div style={{ textAlign: "center", marginBottom: "clamp(2.5rem,5vw,4.5rem)" }}>
            <Tag>Global Dispatch</Tag>
            <div style={{ height: ".9rem" }} />
            <h2 className="serif" style={{ fontSize: "clamp(1.9rem,4.5vw,3.75rem)", fontWeight: 300, color: "#16261A", marginBottom: "1rem" }}>
              Sea &amp; Air <em style={{ fontStyle: "italic", color: "#1C5230" }}>Dispatches</em>
            </h2>
            <GoldRule center />
            <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: "clamp(.84rem,1.8vw,.95rem)", color: "#4A5D4C", lineHeight: 1.85, fontWeight: 300, maxWidth: 480, margin: "1.5rem auto 0" }}>
              Facilitating robust import-export dispatches with verified temperature management. We orchestrate complex routes across oceans and skies.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
            {/* Sea Dispatch */}
            <div className="statement-section" style={{ background: "#FAF8F4", borderRadius: 16, border: "1px solid #DDD8CF", minHeight: "unset" }}>
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: .9 }} className="statement-text-col" style={{ background: "transparent" }}>
                <div className="statement-bg-text" style={{ color: "rgba(28,82,48,.02)" }}>VESSEL</div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <span style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".6rem", fontWeight: 600, letterSpacing: ".28em", textTransform: "uppercase", color: "#C8963E", display: "inline-flex", alignItems: "center", gap: ".5rem" }}>
                    <span style={{ display: "inline-block", width: 16, height: 1, background: "currentColor" }} />
                    Ocean Sourcing
                  </span>
                  <div style={{ height: ".75rem" }} />
                  <h3 className="serif" style={{ fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 300, color: "#16261A", lineHeight: 1.1, marginBottom: "1rem" }}>
                    FCL Ocean <em style={{ fontStyle: "italic", color: "#1C5230" }}>Vessels</em>
                  </h3>
                  <div style={{ width: "2.25rem", height: 1, background: "#C8963E", marginBottom: "1.5rem" }} />
                  <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".9rem", color: "#4A5D4C", lineHeight: 1.8, fontWeight: 300, marginBottom: "1.5rem" }}>
                    Operating regular bulk dispatches from the ports of Karachi. Perfect for moving large consignments of premium Basmati, long-grain rice, and bulk Himalayan mineral salt to world ports.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: ".6rem", marginBottom: "1.5rem" }}>
                    {["Full Container Load (FCL) cargo management", "Temperature controlled reefer monitoring", "FOB & CIF logistics handling"].map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: ".6rem", fontSize: ".82rem", color: "#4A5D4C" }}>
                        <ShieldCheck style={{ width: 14, height: 14, color: "#1C5230", flexShrink: 0 }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/buyer" className="btn-f" style={{ alignSelf: "flex-start" }}>
                    Ocean Sourcing <ArrowRight style={{ width: 13, height: 13 }} />
                  </Link>
                </div>
              </motion.div>
              <div className="statement-img-col" style={{ minHeight: "320px", order: 2 }}>
                <Image src="/images/Export2.webp" alt="Bulk ocean freight vessel" fill className="object-cover" sizes="(max-width:900px) 100vw,50vw" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, transparent 60%, #FAF8F4)", opacity: .2 }} />
              </div>
            </div>

            {/* Air Dispatch */}
            <div className="statement-section" style={{ background: "#FAF8F4", borderRadius: 16, border: "1px solid #DDD8CF", minHeight: "unset" }}>
              <div className="statement-img-col" style={{ minHeight: "320px", order: 1 }}>
                <Image src="/images/AirExport2.webp" alt="Express air cargo airplane" fill className="object-cover" sizes="(max-width:900px) 100vw,50vw" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 60%, #FAF8F4)", opacity: .2 }} />
              </div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: .9 }} className="statement-text-col" style={{ background: "transparent", order: 2 }}>
                <div className="statement-bg-text" style={{ color: "rgba(28,82,48,.02)", right: "unset", left: "10%" }}>AIRCRAFT</div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <span style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".6rem", fontWeight: 600, letterSpacing: ".28em", textTransform: "uppercase", color: "#C8963E", display: "inline-flex", alignItems: "center", gap: ".5rem" }}>
                    <span style={{ display: "inline-block", width: 16, height: 1, background: "currentColor" }} />
                    Express Flight
                  </span>
                  <div style={{ height: ".75rem" }} />
                  <h3 className="serif" style={{ fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 300, color: "#16261A", lineHeight: 1.1, marginBottom: "1rem" }}>
                    Air Freight <em style={{ fontStyle: "italic", color: "#1C5230" }}>Logistics</em>
                  </h3>
                  <div style={{ width: "2.25rem", height: 1, background: "#C8963E", marginBottom: "1.5rem" }} />
                  <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".9rem", color: "#4A5D4C", lineHeight: 1.8, fontWeight: 300, marginBottom: "1.5rem" }}>
                    Designed for fresh-cut agricultural goods, specialty Kinnow mandarins, and time-critical shipments. Our direct air transport secures peak freshness at arrival airports.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: ".6rem", marginBottom: "1.5rem" }}>
                    {["Next-flight-out express delivery slots", "Strict perishable cold-chain dispatches", "Rapid customs clearance at destination airports"].map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: ".6rem", fontSize: ".82rem", color: "#4A5D4C" }}>
                        <ShieldCheck style={{ width: 14, height: 14, color: "#1C5230", flexShrink: 0 }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/buyer" className="btn-f" style={{ alignSelf: "flex-start" }}>
                    Air Sourcing <ArrowRight style={{ width: 13, height: 13 }} />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CORE TEAM
      ══════════════════════════════════════════ */}
      <section style={{ background: "#fff", borderTop: "1px solid #DDD8CF" }}>
        <div className="sec-wrap sec-pad">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            style={{ textAlign: "center", marginBottom: "clamp(2.5rem,5vw,4.5rem)" }}>
            <Tag>The Driving Force</Tag>
            <div style={{ height: ".9rem" }} />
            <h2 className="serif" style={{ fontSize: "clamp(1.9rem,4.5vw,3.75rem)", fontWeight: 300, color: "#16261A", marginBottom: "1rem" }}>
              Meet Our <em style={{ fontStyle: "italic", color: "#1C5230" }}>Core Team</em>
            </h2>
            <GoldRule center />
            <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: "clamp(.84rem,1.8vw,.95rem)", color: "#4A5D4C", lineHeight: 1.85, fontWeight: 300, maxWidth: 540, margin: "1.5rem auto 0" }}>
              The visionaries driving Penta Peaks&apos; commitment to global excellence and unmatched quality in international trade.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            {founders.map((founder, i) => (
              <motion.div key={founder.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -8 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: i * 0.1 }} 
                style={{ background: '#fff', borderRadius: '20px', padding: '1.25rem', border: '1px solid #DDD8CF', boxShadow: '0 10px 40px rgba(0,0,0,.03)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1.15', borderRadius: '14px', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <Image src={founder.image} alt={founder.name} fill style={{ objectFit: 'cover', objectPosition: 'top' }} sizes="(max-width: 768px) 100vw, 350px" />
                </div>
                <h3 className="serif" style={{ fontSize: '1.35rem', fontWeight: 500, color: '#16261A', marginBottom: '.5rem', textAlign: 'center' }}>{founder.name}</h3>
                <div style={{ width: '2rem', height: '2px', background: '#C8963E', marginBottom: '.75rem', borderRadius: '2px' }} />
                <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: '.8rem', color: '#C8963E', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.4, marginBottom: '.5rem' }}>{founder.role}</p>
                <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: '.85rem', color: '#4A5D4C', textAlign: 'center', lineHeight: 1.5, padding: '0 0.5rem' }}>{founder.experience}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          6. PRODUCT CATEGORIES SHOWCASE
      ══════════════════════════════════════════ */}
      <section className="sec-pad" style={{ background: "#FAF8F4", borderTop: "1px solid #DDD8CF" }}>
        <div className="sec-wrap">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem", marginBottom: "clamp(2rem,4vw,3.5rem)" }}>
            <div>
              <Tag>What We Export</Tag>
              <div style={{ height: ".9rem" }} />
              <h2 className="serif" style={{ fontSize: "clamp(1.9rem,4.5vw,3.75rem)", fontWeight: 300, color: "#16261A", lineHeight: 1.05 }}>
                Four <em style={{ fontStyle: "italic", color: "#1C5230" }}>Categories,</em><br />Endless Possibilities
              </h2>
            </div>
            <Link href="/products" className="btn-of" style={{ alignSelf: "flex-end" }}>
              Full Catalogue <ArrowRight style={{ width: 13, height: 13 }} />
            </Link>
          </motion.div>

          <motion.div className="cat-strip"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: .08 } } }}
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            {categories.map((c) => (
              <motion.div key={c.label} className="cat-card"
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: .65 } } }}>
                <Image src={c.image} alt={c.label} fill className="object-cover" sizes="260px" />
                <div className="cat-card-overlay" />
                <div className="cat-bottom">
                  <div className="cat-badge">{c.count}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: ".5rem" }}>
                    <span style={{ fontSize: "1.4rem" }}>{c.icon}</span>
                    <p className="serif" style={{ fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 400, color: "#fff", letterSpacing: ".04em" }}>
                      {c.label}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          7. PAKISTAN ORIGIN - dark split
      ══════════════════════════════════════════ */}
      <section className="origin-split">

        {/* map / visual side */}
        <div className="origin-map-side">
          <div style={{ position: "absolute", inset: 0 }}>
            <Image src="/images/hero-banner.webp" alt="Pakistan farms" fill className="object-cover" sizes="50vw" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(11,26,14,.85) 0%,rgba(11,26,14,.5) 100%)" }} />
          </div>

          <motion.div initial={{ opacity: 0, scale: .9 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }} transition={{ duration: .8 }}
            style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "2rem" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(200,150,62,.15)", border: "1px solid rgba(200,150,62,.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
              <Globe2 style={{ width: 34, height: 34, color: "#C8963E" }} />
            </div>
            <p className="serif" style={{ fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 300, color: "#fff", lineHeight: 1, letterSpacing: ".04em" }}>
              Punjab<br />
              <em style={{ fontStyle: "italic", color: "#C8963E", fontWeight: 300 }}>Sindh</em><br />
              KPK
            </p>
            <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".7rem", fontWeight: 300, color: "rgba(255,255,255,.5)", marginTop: "1rem", letterSpacing: ".12em", textTransform: "uppercase" }}>
              Pakistan's Agricultural Heartlands
            </p>
          </motion.div>
        </div>

        {/* text side */}
        <motion.div className="origin-text-side"
          initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: .85 }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "'Calibri', sans-serif", fontSize: "clamp(6rem,14vw,14rem)", fontWeight: 700, color: "rgba(255,255,255,.03)", whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none", lineHeight: 1 }} aria-hidden>ORIGIN</div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <Tag light>Source of Excellence</Tag>
            <div style={{ height: "1rem" }} />
            <h2 className="serif" style={{ fontSize: "clamp(1.9rem,4vw,3.25rem)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: "1.5rem" }}>
              Rooted in the <em style={{ fontStyle: "italic", color: "#C8963E" }}>Richest<br />Soils</em> on Earth
            </h2>
            <div style={{ width: "2.5rem", height: 1, background: "#C8963E", marginBottom: "1.5rem" }} />
            <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".95rem", color: "rgba(255,255,255,.65)", lineHeight: 1.9, fontWeight: 300, marginBottom: "2rem", maxWidth: 440 }}>
              Every product we export originates from Pakistan's legendary agricultural provinces. The Indus River system, centuries of farming expertise, and a climate ideal for tropical and subtropical crops make our produce extraordinary.
            </p>

            {/* region pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem", marginBottom: "2rem" }}>
              {["Lahore Rice Belt", "Sindh Mango Orchards", "Himalayan Salt Mines", "Punjab Citrus Farms", "KPK Spice Fields"].map(r => (
                <span key={r} className="region-pill">{r}</span>
              ))}
            </div>

            <Link href="/products" className="btn-gold">Discover Our Products <ArrowRight style={{ width: 13, height: 13 }} /></Link>
          </div>
        </motion.div>
      </section>


      {/* ══════════════════════════════════════════
          8. CERTIFICATIONS STRIP
      ══════════════════════════════════════════ */}
      <section style={{ background: "#fff", borderTop: "1px solid #DDD8CF", borderBottom: "1px solid #DDD8CF", padding: "clamp(2.5rem,5vw,4rem) 0" }}>
        <div className="sec-wrap">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <Tag>Compliance & Standards</Tag>
            <div style={{ height: ".75rem" }} />
            <h2 className="serif" style={{ fontSize: "clamp(1.5rem,3vw,2.5rem)", fontWeight: 300, color: "#16261A" }}>
              Certified for <em style={{ fontStyle: "italic", color: "#1C5230" }}>Every Market</em>
            </h2>
          </motion.div>

          <motion.div
            variants={{ hidden: {}, visible: { transition: { staggerChildren: .08 } } }}
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "1px", background: "#DDD8CF", border: "1px solid #DDD8CF", borderRadius: 16, overflow: "hidden" }}>
            {[
              { badge: "TDAP", full: "Trade Development Authority" },
              { badge: "RECP", full: "Registration & Export Compliance" },
              { badge: "ISO", full: "Quality Management Systems" },
              { badge: "HACCP", full: "Food Safety Standards" },
              { badge: "Phyto", full: "Phytosanitary Certification" },
            ].map((c, i) => (
              <motion.div key={c.badge}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: .5 } } }}
                style={{ background: "#fff", padding: "1.75rem 1.25rem", textAlign: "center" }}>
                <div style={{ width: 50, height: 50, borderRadius: 12, background: "linear-gradient(135deg,rgba(28,82,48,.08),rgba(42,122,75,.04))", border: "1px solid rgba(28,82,48,.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto .9rem" }}>
                  <Award style={{ width: 20, height: 20, color: "#1C5230" }} />
                </div>
                <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: "1.15rem", fontWeight: 600, color: "#16261A" }}>{c.badge}</p>
                <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".68rem", color: "#8A9E8B", marginTop: ".3rem", lineHeight: 1.5 }}>{c.full}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          9. MENTORSHIP CALLOUT
      ══════════════════════════════════════════ */}
      <section className="sec-pad" style={{ background: "#FAF8F4" }}>
        <div className="sec-wrap">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            style={{ background: "#fff", border: "1px solid #DDD8CF", borderRadius: 20, padding: "clamp(2.5rem,5vw,4.5rem)", display: "grid", gridTemplateColumns: "1fr", gap: "2.5rem", position: "relative", overflow: "hidden" }}>
            {/* accent */}
            <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: "linear-gradient(to bottom,#C8963E,transparent)" }} />
            <div style={{ position: "absolute", top: 0, right: 0, width: "35%", height: "100%", background: "linear-gradient(to left,rgba(28,82,48,.03),transparent)", pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(200,150,62,.1)", border: "1px solid rgba(200,150,62,.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Package style={{ width: 22, height: 22, color: "#C8963E" }} />
                </div>
                <Tag>Mentorship Programme</Tag>
              </div>
              <h2 className="serif" style={{ fontSize: "clamp(1.8rem,4.5vw,3.5rem)", fontWeight: 300, color: "#16261A", lineHeight: 1.1, marginBottom: "1rem" }}>
                Learn Export Trade <em style={{ fontStyle: "italic", color: "#1C5230" }}>from the Inside</em>
              </h2>
              <GoldRule />
              <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: "clamp(.88rem,1.4vw,1rem)", color: "#4A5D4C", lineHeight: 1.85, fontWeight: 300, maxWidth: 580, marginTop: "1.25rem", marginBottom: "2rem" }}>
                500+ graduates. Real documentations, LC structures, Incoterms, customs walkthroughs, and live deal simulations. If you want to enter the trade, this is where it begins.
              </p>
              <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
                <Link href="/mentorship" className="btn-f">Enroll Now <ArrowRight style={{ width: 13, height: 13 }} /></Link>
                <Link href="/mentorship" className="btn-of">Learn More</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>




      {/* ══════════════════════════════════════════
          11. IMPORTERS CALLOUT - split layout
      ══════════════════════════════════════════ */}
      <section className="origin-split" style={{ borderTop: "1px solid rgba(255,255,255,.08)" }}>

        {/* text side (Left on Desktop) */}
        <motion.div className="origin-text-side"
          initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: .85 }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "'Calibri', sans-serif", fontSize: "clamp(6rem,14vw,14rem)", fontWeight: 700, color: "rgba(255,255,255,.03)", whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none", lineHeight: 1 }} aria-hidden>IMPORTS</div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <Tag light>For Global Importers</Tag>
            <div style={{ height: "1rem" }} />
            <h2 className="serif" style={{ fontSize: "clamp(1.9rem,4vw,3.25rem)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: "1.5rem" }}>
              Ready to Source <em style={{ fontStyle: "italic", color: "#C8963E" }}>Premium<br />Produce?</em>
            </h2>
            <div style={{ width: "2.5rem", height: 1, background: "#C8963E", marginBottom: "1.5rem" }} />
            <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".95rem", color: "rgba(255,255,255,.65)", lineHeight: 1.9, fontWeight: 300, marginBottom: "2rem", maxWidth: 440 }}>
              Browse our complete farm-to-table portfolio or coordinate directly with our trade desks for tailored bulk private-label packaging, customized shipping terms, and highly competitive FOB or CIF pricing.
            </p>

            {/* capabilities pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem", marginBottom: "2.25rem" }}>
              {["FOB & CIF Shipping", "Direct Farm Sourcing", "SGS Inspected", "Custom Packaging", "Port Logistics"].map(r => (
                <span key={r} className="region-pill">{r}</span>
              ))}
            </div>

            <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
              <Link href="/products" className="btn-gold">Browse Products <ArrowRight style={{ width: 13, height: 13 }} /></Link>
              <Link href="/contact" className="btn-of" style={{ color: "#fff", borderColor: "rgba(255,255,255,.3)" }}>Contact Us</Link>
            </div>
          </div>
        </motion.div>

        {/* image / visual side (Right on Desktop) */}
        <div className="origin-map-side">
          <div style={{ position: "absolute", inset: 0 }}>
            <Image src="/images/Fruits.webp" alt="Premium Produce" fill className="object-cover" sizes="50vw" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(11,26,14,.85) 0%,rgba(11,26,14,.55) 100%)" }} />
          </div>

          <motion.div initial={{ opacity: 0, scale: .9 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }} transition={{ duration: .8 }}
            style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "2rem" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(200,150,62,.15)", border: "1px solid rgba(200,150,62,.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
              <Package style={{ width: 32, height: 32, color: "#C8963E" }} />
            </div>
            <p className="serif" style={{ fontSize: "clamp(2rem,5vw,3.75rem)", fontWeight: 300, color: "#fff", lineHeight: 1.1, letterSpacing: ".04em" }}>
              Basmati • Salt<br />
              <em style={{ fontStyle: "italic", color: "#C8963E", fontWeight: 300 }}>Citrus • Mango</em><br />
              Potatoes
            </p>
            <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".7rem", fontWeight: 300, color: "rgba(255,255,255,.5)", marginTop: "1rem", letterSpacing: ".12em", textTransform: "uppercase" }}>
              Premium Pakistan Commodities
            </p>
          </motion.div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          11. ENTREPRENEURS CALLOUT - split layout
      ══════════════════════════════════════════ */}
      <section className="origin-split" style={{ borderTop: "1px solid rgba(255,255,255,.08)" }}>

        {/* image / visual side (Left on Desktop) */}
        <div className="origin-map-side">
          <div style={{ position: "absolute", inset: 0 }}>
            <Image src="/images/Mentorship.webp" alt="Mentorship Program" fill className="object-cover" sizes="50vw" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(11,26,14,.85) 0%,rgba(11,26,14,.55) 100%)" }} />
          </div>

          <motion.div initial={{ opacity: 0, scale: .9 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }} transition={{ duration: .8 }}
            style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "2rem" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(200,150,62,.15)", border: "1px solid rgba(200,150,62,.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
              <TrendingUp style={{ width: 32, height: 32, color: "#C8963E" }} />
            </div>
            <p className="serif" style={{ fontSize: "clamp(2rem,5vw,3.75rem)", fontWeight: 300, color: "#fff", lineHeight: 1.1, letterSpacing: ".04em" }}>
              Learn • Trade<br />
              <em style={{ fontStyle: "italic", color: "#C8963E", fontWeight: 300 }}>Succeed • Grow</em><br />
              Scale
            </p>
            <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".7rem", fontWeight: 300, color: "rgba(255,255,255,.5)", marginTop: "1rem", letterSpacing: ".12em", textTransform: "uppercase" }}>
              Practical Mentorship Syllabus
            </p>
          </motion.div>
        </div>

        {/* text side (Right on Desktop) */}
        <motion.div className="origin-text-side"
          initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: .85 }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "'Calibri', sans-serif", fontSize: "clamp(6rem,14vw,14rem)", fontWeight: 700, color: "rgba(255,255,255,.03)", whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none", lineHeight: 1 }} aria-hidden>ACADEMY</div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <Tag light>For Future Exporters</Tag>
            <div style={{ height: "1rem" }} />
            <h2 className="serif" style={{ fontSize: "clamp(1.9rem,4vw,3.25rem)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: "1.5rem" }}>
              Start Your <em style={{ fontStyle: "italic", color: "#C8963E" }}>Export<br />Journey</em>
            </h2>
            <div style={{ width: "2.5rem", height: 1, background: "#C8963E", marginBottom: "1.5rem" }} />
            <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".95rem", color: "rgba(255,255,255,.65)", lineHeight: 1.9, fontWeight: 300, marginBottom: "2rem", maxWidth: 440 }}>
              Join the elite mentorship cohort that has launched hundreds of successful Pakistani exporters. Master Letter of Credits, Incoterms, logistics coordination, and live customs procedures directly from active export industry practitioners.
            </p>

            {/* capabilities pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem", marginBottom: "2.25rem" }}>
              {["1-on-1 Mentorship", "Customs WebOC Tour", "LC Contract Review", "Active Exporters Circle", "TDAP Guide"].map(r => (
                <span key={r} className="region-pill">{r}</span>
              ))}
            </div>

            <Link href="/mentorship" className="btn-gold">Enroll in Mentorship <ArrowUpRight style={{ width: 14, height: 14 }} /></Link>
          </div>
        </motion.div>
      </section>
    </>
  )
}