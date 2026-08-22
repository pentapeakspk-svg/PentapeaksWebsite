"use client"
// Sample comment
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import VideoGallery from "@/components/VideoGallery"
import { useState, useEffect, useRef } from "react"
import { fadeUpVariant, staggerContainer, useCounter } from "@/lib/animations"
import {
  ArrowRight, ChevronLeft, ChevronRight, Star,
  GraduationCap, Building, Package, Users,
  MapPin, Phone, Mail, Ship, Globe, Award, TrendingUp,
  Anchor, Container, BarChart3, CheckCircle2
} from "lucide-react"

/* ── data ── */
const heroSlides = [
  {
    image: "/images/Ship_PortContainer.webp",
    eyebrow: "GLOBAL TRADE & SHIPMENT LOGISTICS",
    title: "Connecting Farms\nto Global Ports\nwith Precision",
    subtitle: "Pakistan's premier agricultural commodities exporter - delivering premium rice, produce, and animal feed to international markets with secure sea freight.",
    tag: "Global Logistics",
    ctaText: "Explore Products",
    ctaHref: "/products",
    stat: { value: "15+", label: "Countries Served" },
  },
  {
    image: "/images/Rice.webp",
    eyebrow: "Premium Agricultural Exports",
    title: "Pakistan's Finest\nBasmati - Ready\nfor Export",
    subtitle: "Premium long-grain rice, IRRI-6, and specialty grains - fully sorted, polished, and container-ready.",
    tag: "Rice & Grains",
    ctaText: "Explore Rice",
    ctaHref: "/products/rice",
    stat: { value: "1121", label: "Basmati Grade" },
  },
  {
    image: "/images/Fruits.webp",
    eyebrow: "Farm to Port",
    title: "Kinnow, Chaunsa\n& Sindhri - Farm\nFresh Markets",
    subtitle: "Export-grade citrus and mangoes with high Brix, perfect color, and extended shelf life.",
    tag: "Fruits & Citrus",
    ctaText: "Export Fruits",
    ctaHref: "/products/fresh-fruits-and-vegetables",
    stat: { value: "A+", label: "Export Grade" },
  },
  {
    image: "/images/salt.webp",
    eyebrow: "Himalayan Minerals",
    title: "Pure Pink Salt\n& Turmeric -\nNaturally Mined",
    subtitle: "Chemical-free, lab-tested, and shipped worldwide in bulk or retail packs.",
    tag: "Salt & Spices",
    ctaText: "Source Spices",
    ctaHref: "/products/seeds",
    stat: { value: "98%", label: "Purity Rate" },
  },
  {
    image: "/images/potato.webp",
    eyebrow: "Year-Round Supply",
    title: "Potatoes, Onions\n& Corn - Steady\nAvailability",
    subtitle: "Direct farm-to-port procurement ensuring consistent quality and competitive pricing.",
    tag: "Fresh Vegetables",
    ctaText: "View Vegetables",
    ctaHref: "/products/fresh-fruits-and-vegetables",
    stat: { value: "365", label: "Days Supply" },
  },
]

const specialProducts = [
  { name: "Rice",      desc: "Export-grade grains", image: "/images/product-rice.webp",     href: "/products/rice" },
  { name: "Pink Salt", desc: "Himalayan quality",   image: "/images/product-salt.webp",     href: "/products/seeds" },
  { name: "Fruits",    desc: "Citrus & mangoes",    image: "/images/product-mangoes.webp",  href: "/products/fresh-fruits-and-vegetables" },
  { name: "Potatoes",  desc: "Fresh produce",       image: "/images/product-potatoes.webp", href: "/products/fresh-fruits-and-vegetables" },
  { name: "Corn",      desc: "Feed & grains",       image: "/images/product-corn.webp",     href: "/products/grains" },
  { name: "Turmeric",  desc: "Spice & seeds",       image: "/images/product-turmeric.webp", href: "/products/fresh-fruits-and-vegetables" },
]

// Dynamic videos will be fetched from Supabase

const productGrid = [
  { name: "PINK SALT", image: "/images/product-salt.webp",     href: "/products/seeds" },
  { name: "RICE",      image: "/images/product-rice.webp",     href: "/products/rice" },
  { name: "MANGOES",   image: "/images/product-mangoes.webp",  href: "/products/fresh-fruits-and-vegetables" },
  { name: "TURMERIC",  image: "/images/product-turmeric.webp", href: "/products/fresh-fruits-and-vegetables" },
  { name: "POTATOES",  image: "/images/product-potatoes.webp", href: "/products/fresh-fruits-and-vegetables" },
  { name: "CORN",      image: "/images/product-corn.webp",     href: "/products/grains" },
]

const corporateImages = [
  "/images/product-rice.webp", "/images/hero-fruits.webp",
  "/images/product-corn.webp", "/images/Nature.webp",
  "/images/product-mangoes.webp", "/images/product-salt.webp",
]

const testimonials = [
  { name: "Ahmad Al-Rashid", country: "UAE",      role: "Import Buyer",   text: "Penta Peaks delivered premium 1121 Basmati rice ahead of schedule. Exceptional quality and communication throughout the entire export process." },
  { name: "Sarah Johnson",   country: "UK",       role: "Trade Partner",  text: "Reliable supplier for Pakistani mangoes. Their packaging and logistics handling is truly top-notch. A trusted partner for three consecutive seasons." },
  { name: "Muhammad Usman",  country: "Pakistan", role: "Graduate Mentee",text: "The mentorship program transformed my understanding of international trade. I registered my export company within 2 months of completing the course." },
]

const founders = [
  { name: "Muhammad Sumair Butt", role: "CEO & Founder", image: "/images/Founders/muhammad-sumair-butt-ceo-founder.png", experience: "10+ Years in Global Trade & Mentorship" },
  { name: "Muhammad Umar", role: "Director Business Development", image: "/images/Founders/muhammad-umar-director-business-development.webp", experience: "Driving Strategic Partnerships & Growth" },
  { name: "Muhammad Atif", role: "Director Operations", image: "/images/Founders/muhammad-atif-director-operations.webp", experience: "Supply Chain & Logistics Expert" },
  { name: "Ahsen Ansari", role: "Director International Trade", image: "/images/Founders/ahsen-ansari-director-international-trade.webp", experience: "Specialist in Global Negotiations" },
]

const stats = [
  { label: "Global Buyers",   value: 150, suffix: "+" },
  { label: "Products",         value: 25,  suffix: "+" },
  { label: "Countries Served", value: 15,  suffix: "+" },
  { label: "Students Trained", value: 500, suffix: "+" },
]

const capabilities = [
  { icon: Ship,       title: "Sea Freight",    desc: "FCL & LCL shipping via Karachi, Port Qasim" },
  { icon: Globe,      title: "Global Reach",   desc: "Active trade routes to 15+ countries" },
  { icon: Award,      title: "Certified",      desc: "TDAP, RECP & ISO compliant exports" },
  { icon: TrendingUp, title: "Market Intel",   desc: "Real-time commodity pricing & trends" },
]

/* ── counter card ── */
function CounterCard({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const { count, ref } = useCounter(value, 2000)
  return (
    <div ref={ref} className="stat-cell">
      <div className="stat-number">{count}<span className="stat-suffix">{suffix}</span></div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [homeVideos, setHomeVideos] = useState<string[]>([])
  const heroRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()
  const goToSlide = (idx: number) => {
    setIsTransitioning(true)
    setTimeout(() => { setCurrentSlide(idx); setIsTransitioning(false) }, 300)
  }
  const nextSlide = () => goToSlide((currentSlide + 1) % heroSlides.length)
  const prevSlide = () => goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length)

  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide((currentSlide + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [currentSlide])

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/admin/gallery-videos?prefix=home-")
        const data = await res.json()
        if (res.ok) setHomeVideos(data.files || [])
      } catch (err) {
        console.error("Failed to fetch home videos", err)
      }
    }
    fetchVideos()
  }, [])

  return (
    <>
      <style>{`
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --navy: #050E1A;
          --navy2: #0A1E33;
          --ocean: #0D2B4A;
          --teal: #0E4D6B;
          --gold: #C9972C;
          --gold-lt: #E8B84B;
          --ivory: #F7F4EE;
          --cream: #EDE9E1;
          --white: #FFFFFF;
          --border: #D8D2C7;
          --textdk: #0F1C0B;
          --textmd: #3D4F52;
          --textlt: #7A8E92;
          --accent: #1A5F7A;
        }

        body { font-family: 'Calibri', sans-serif; background: var(--ivory); }

        /* ── Typography ── */
        .serif { font-family: 'Calibri', sans-serif; }
        .eyebrow {
          font-size: .6rem; font-weight: 600; letter-spacing: .35em;
          text-transform: uppercase; color: var(--gold);
          display: flex; align-items: center; gap: .65rem;
        }
        .eyebrow::before { content:''; display:inline-block; width:22px; height:1px; background:var(--gold); }
        .section-title {
          font-family: 'Calibri', sans-serif;
          font-size: clamp(2rem, 4.5vw, 3.5rem);
          font-weight: 500; line-height: 1.06; letter-spacing: -.015em; color: var(--textdk);
        }
        .body-text { color: var(--textmd); line-height: 1.85; font-weight: 300; font-size: .95rem; }

        /* ── Gold divider ── */
        .gold-bar { width: 2.5rem; height: 2px; background: linear-gradient(90deg, var(--gold), var(--gold-lt)); border-radius: 2px; }
        .gold-bar-c { width: 2.5rem; height: 2px; background: linear-gradient(90deg, var(--gold), var(--gold-lt)); border-radius: 2px; margin: 0 auto; }

        /* ── Buttons ── */
        .btn-primary {
          display: inline-flex; align-items: center; gap: .55rem;
          background: var(--ocean); color: #fff;
          font-size: .68rem; font-weight: 600; letter-spacing: .16em; text-transform: uppercase;
          padding: .95rem 2rem; border-radius: 4px; text-decoration: none;
          border: 1px solid var(--ocean);
          transition: all .35s cubic-bezier(.25,.46,.45,.94);
          position: relative; overflow: hidden;
        }
        .btn-primary::after {
          content:''; position:absolute; inset:0;
          background: linear-gradient(135deg, rgba(201,151,44,.15) 0%, transparent 60%);
          opacity:0; transition: opacity .35s;
        }
        .btn-primary:hover { background: var(--teal); border-color: var(--teal); transform: translateY(-2px); box-shadow: 0 12px 32px rgba(13,43,74,.3); }
        .btn-primary:hover::after { opacity: 1; }

        .btn-outline {
          display: inline-flex; align-items: center; gap: .55rem;
          background: transparent; color: var(--textdk);
          font-size: .68rem; font-weight: 600; letter-spacing: .16em; text-transform: uppercase;
          padding: .95rem 2rem; border-radius: 4px; text-decoration: none;
          border: 1.5px solid var(--textdk); transition: all .35s ease;
        }
        .btn-outline:hover { background: var(--textdk); color: #fff; transform: translateY(-2px); }

        .btn-ghost-white {
          display: inline-flex; align-items: center; gap: .55rem;
          background: rgba(255,255,255,.08); color: #fff;
          font-size: .68rem; font-weight: 600; letter-spacing: .16em; text-transform: uppercase;
          padding: .95rem 2rem; border-radius: 4px; text-decoration: none;
          border: 1px solid rgba(255,255,255,.25); backdrop-filter: blur(8px);
          transition: all .35s ease;
        }
        .btn-ghost-white:hover { background: rgba(255,255,255,.18); transform: translateY(-2px); }

        .btn-gold {
          display: inline-flex; align-items: center; gap: .6rem;
          background: linear-gradient(135deg, var(--gold), var(--gold-lt));
          color: #fff; font-size: .7rem; font-weight: 600; letter-spacing: .16em; text-transform: uppercase;
          padding: 1.1rem 2.75rem; border-radius: 4px; text-decoration: none;
          transition: all .35s ease; box-shadow: 0 8px 24px rgba(201,151,44,.35);
        }
        .btn-gold:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(201,151,44,.45); }

        /* ── HERO ── */
        .hero { position: relative; height: calc(95svh - 24px); min-height: 560px; max-height: 900px; overflow: hidden; background: var(--navy); border-radius: 24px; margin: 12px; margin-top: 8px; }

        .slide-wrap { position: absolute; inset: 0; transition: opacity 1.4s cubic-bezier(.4,0,.2,1), transform 1.4s cubic-bezier(.4,0,.2,1); }
        .slide-wrap.inactive { opacity: 0; pointer-events: none; visibility: hidden; }
        .slide-wrap.active { opacity: 1; z-index: 2; visibility: visible; }
        .slide-wrap.inactive:first-child { visibility: visible; } /* Ensure first slide image always loads */

        /* Layered overlay for cinematic look */
        .hero-overlay-1 { position:absolute;inset:0; background:linear-gradient(to bottom,rgba(5,14,26,.2) 0%,rgba(5,14,26,.05) 35%,rgba(5,14,26,.75) 100%); }
        .hero-overlay-2 { position:absolute;inset:0; background:linear-gradient(110deg,rgba(5,14,26,.7) 0%,rgba(5,14,26,.15) 55%,transparent 80%); }
        .hero-overlay-3 { position:absolute;inset:0; background:radial-gradient(ellipse at 20% 80%, rgba(13,43,74,.4) 0%, transparent 60%); }

        /* Left accent stripe */
        .hero-stripe {
          position:absolute; left:0; top:0; bottom:0; width:3px; z-index:10;
          background:linear-gradient(to bottom, transparent 10%, var(--gold) 50%, transparent 90%);
        }

        /* Top line */
        .hero-top-line {
          position:absolute; top:0; left:0; right:0; height:1px; z-index:10;
          background:linear-gradient(90deg, transparent, rgba(201,151,44,.6) 30%, rgba(201,151,44,.6) 70%, transparent);
        }

        .hero-content {
          position: relative; z-index: 10; height: 100%;
          display: flex; align-items: flex-end;
          padding-bottom: clamp(5rem,10vh,10vh);
          padding-left: clamp(1.5rem, 7vw, 10rem);
          padding-right: clamp(1.5rem, 5vw, 5rem);
        }

        .hero-text-block { max-width: 860px; }

        .hero-eyebrow {
          font-size: .6rem; font-weight: 600; letter-spacing: .35em; text-transform: uppercase;
          color: var(--gold); display: flex; align-items: center; gap: .7rem; margin-bottom: 1.1rem;
        }
        .hero-eyebrow::before { content:''; width:28px; height:1px; background:var(--gold); flex-shrink:0; }

        .hero-title {
          font-family: 'Calibri', sans-serif;
          font-size: clamp(2rem, 4.4vw, 3.75rem);
          font-weight: 500; color: #fff; line-height: 1.05;
          letter-spacing: .02em; text-transform: uppercase;
          white-space: pre-line; margin-bottom: 1.1rem;
        }

        .hero-subtitle {
          font-size: clamp(.82rem, 1.2vw, .95rem); color: rgba(255,255,255,.65);
          font-weight: 300; max-width: 420px; margin-bottom: 2rem; line-height: 1.8;
        }

        .hero-cta-row { display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; }

        /* Stat badge */
        .hero-stat {
          position: absolute; right: clamp(1.5rem,5vw,6rem); bottom: clamp(5rem,10vh,10vh);
          z-index: 12; text-align: right;
        }
        .hero-stat-num {
          font-family: 'Calibri', sans-serif;
          font-size: clamp(2rem,4vw,3.25rem); font-weight: 400; color: #fff; line-height: 1;
        }
        .hero-stat-label { font-size: .58rem; color: rgba(255,255,255,.4); letter-spacing: .22em; text-transform: uppercase; margin-top: .4rem; }

        /* Slide controls */
        .slide-dots { position:absolute; bottom:clamp(2rem,4vh,4rem); left:50%; transform:translateX(-50%); z-index:12; display:flex; align-items:center; gap:.5rem; }
        .slide-dot-btn { width:6px; height:6px; border-radius:3px; background:rgba(255,255,255,.3); border:none; cursor:pointer; padding:0; transition:all .4s ease; }
        .slide-dot-btn.active { width:28px; background:var(--gold); }

        .hero-arrow {
          display:none; position:absolute; top:50%; transform:translateY(-50%); z-index:12;
          width:48px; height:48px; border-radius:50%;
          background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.2);
          color:#fff; cursor:pointer; backdrop-filter:blur(8px);
          align-items:center; justify-content:center;
          transition:all .3s ease;
        }
        @media(min-width:640px){ .hero-arrow { display:flex; } }
        .hero-arrow:hover { background:var(--gold); border-color:var(--gold); }

        /* Scrollbar cue */
        .scroll-cue { position:absolute; bottom:1.5rem; left:clamp(1.5rem,7vw,10rem); z-index:12; display:flex; align-items:center; gap:.75rem; }
        .scroll-cue-line { width:40px; height:1px; background:rgba(255,255,255,.3); position:relative; overflow:hidden; }
        .scroll-cue-line::after { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:var(--gold); animation:scrollLine 2.2s ease infinite; }
        @keyframes scrollLine { 0%{left:-100%} 100%{left:100%} }
        .scroll-cue-text { font-size:.58rem; color:rgba(255,255,255,.35); letter-spacing:.22em; text-transform:uppercase; }

        /* ── TICKER BAND ── */
        .ticker { background:var(--ocean); border-top:1px solid rgba(201,151,44,.2); border-bottom:1px solid rgba(201,151,44,.2); overflow:hidden; padding:.75rem 0; }
        .ticker-inner { display:flex; gap:0; white-space:nowrap; animation:tickerScroll 28s linear infinite; }
        .ticker-inner:hover { animation-play-state:paused; }
        .ticker-item { display:inline-flex; align-items:center; gap:.75rem; padding:0 2.5rem; font-size:.65rem; font-weight:600; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,.7); }
        .ticker-dot { width:4px; height:4px; border-radius:50%; background:var(--gold); flex-shrink:0; }
        @keyframes tickerScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }

        /* ── CAPABILITIES ── */
        .caps-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1px; background:var(--border); border:1px solid var(--border); border-radius:12px; overflow:hidden; }
        @media(min-width:768px){ .caps-grid { grid-template-columns:repeat(4,1fr); } }
        .cap-card { background:var(--white); padding:clamp(1.5rem,3vw,2.25rem) clamp(1.25rem,2.5vw,1.75rem); transition:background .3s ease; }
        .cap-card:hover { background:var(--ivory); }
        .cap-icon { width:44px; height:44px; border-radius:10px; background:linear-gradient(135deg,rgba(13,43,74,.08),rgba(13,43,74,.04)); border:1px solid rgba(13,43,74,.12); display:flex; align-items:center; justify-content:center; margin-bottom:1.1rem; }

        /* ── SPECIAL PRODUCTS ── */
        .sp-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:clamp(.75rem,2.5vw,1.75rem); }
        @media(min-width:640px){ .sp-grid { grid-template-columns:repeat(6,1fr); } }

        .sp-card { display:flex; flex-direction:column; align-items:center; text-decoration:none; gap:.85rem; }
        .sp-ring {
          width:clamp(110px,16vw,160px); height:clamp(110px,16vw,160px);
          border-radius:50%; overflow:hidden; position:relative;
          border:2px solid var(--cream);
          box-shadow:0 10px 30px rgba(5,14,26,.12);
          transition:transform .45s cubic-bezier(.34,1.56,.64,1), box-shadow .45s ease;
        }
        .sp-card:hover .sp-ring { transform:translateY(-7px); box-shadow:0 16px 36px rgba(5,14,26,.18); }

        /* ── ABOUT ── */
        .about-grid { display:grid; grid-template-columns:1fr; }
        @media(min-width:1024px){ .about-grid { grid-template-columns:1fr 1fr; min-height:640px; } }

        .about-img-col { position:relative; min-height:clamp(300px,45vw,620px); order:1; }
        .about-img-badge { position:absolute; bottom:2.5rem; right:-1.5rem; z-index:10; background:var(--white); border:1px solid var(--border); border-radius:12px; padding:1.1rem 1.5rem; box-shadow:0 20px 50px rgba(5,14,26,.12); min-width:160px; }
        @media(max-width:1023px){ .about-img-badge { right:.875rem; } }

        .about-text-col { padding:clamp(3rem,6vw,7rem) clamp(1.75rem,5vw,6rem); display:flex; flex-direction:column; justify-content:center; position:relative; overflow:hidden; order:2; }
        .about-watermark { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-family:'Calibri', sans-serif; font-size:clamp(5rem,14vw,12rem); font-weight:700; color:rgba(13,43,74,.04); white-space:nowrap; pointer-events:none; user-select:none; letter-spacing:-.05em; }
        .about-checks { display:flex; flex-direction:column; gap:.75rem; margin:1.5rem 0 2rem; }
        .about-check { display:flex; align-items:center; gap:.75rem; font-size:.88rem; color:var(--textmd); }

        /* ── LOGISTICS SPLIT ── */
        .logistics-split-grid { display:grid; grid-template-columns:1fr; background:#fff; }
        @media(min-width:1024px){ .logistics-split-grid { grid-template-columns:1fr 1fr; min-height:640px; } }

        .logistics-img-col { position:relative; min-height:clamp(300px,45vw,620px); order:1; }
        @media(min-width:1024px){ .logistics-img-col { order:2; } }
        .logistics-img-badge { position:absolute; bottom:2.5rem; left:-1.5rem; z-index:10; background:var(--white); border:1px solid var(--border); border-radius:12px; padding:1.1rem 1.5rem; box-shadow:0 20px 50px rgba(5,14,26,.12); min-width:160px; }
        @media(max-width:1023px){ .logistics-img-badge { left:.875rem; } }

        .logistics-text-col { padding:clamp(3rem,6vw,7rem) clamp(1.75rem,5vw,6rem); display:flex; flex-direction:column; justify-content:center; position:relative; overflow:hidden; order:2; }
        @media(min-width:1024px){ .logistics-text-col { order:1; } }
        .logistics-watermark { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-family:'Calibri', sans-serif; font-size:clamp(5rem,14vw,12rem); font-weight:700; color:rgba(13,43,74,.04); white-space:nowrap; pointer-events:none; user-select:none; letter-spacing:-.05em; }

        /* ── STATS ── */
        .stats-section { background:var(--navy2); position:relative; overflow:hidden; }
        .stats-bg-img { position:absolute; inset:0; background:url('/images/hero-banner.webp') center/cover no-repeat; opacity:.05; }
        .stats-top-line { position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,var(--gold) 40%,transparent); }
        .stats-btm-line { position:absolute; bottom:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,var(--gold) 40%,transparent); }
        .stats-grid { display:grid; grid-template-columns:repeat(2,1fr); border-top:1px solid rgba(255,255,255,.08); }
        @media(min-width:768px){ .stats-grid { grid-template-columns:repeat(4,1fr); } }
        .stat-cell { padding:clamp(2rem,4vw,3rem) 1rem; text-align:center; border-right:1px solid rgba(255,255,255,.08); }
        .stats-grid .stat-cell:nth-child(2n) { border-right:none; }
        .stats-grid .stat-cell:nth-child(n+3) { border-top:1px solid rgba(255,255,255,.08); }
        @media(min-width:768px){
          .stats-grid .stat-cell:nth-child(2n) { border-right:1px solid rgba(255,255,255,.08); }
          .stats-grid .stat-cell:nth-child(n+3) { border-top:none; }
          .stats-grid .stat-cell:last-child { border-right:none; }
        }
        .stat-number { font-family:'Calibri', sans-serif; font-size:clamp(2.5rem,5vw,4.5rem); font-weight:400; color:#fff; line-height:1; }
        .stat-suffix { color:var(--gold); }
        .stat-label { font-size:.6rem; font-weight:600; letter-spacing:.24em; text-transform:uppercase; color:rgba(255,255,255,.4); margin-top:.75rem; }

        /* ── GALLERY ── */
        .gal-desk { display:none; }
        @media(min-width:768px){ .gal-desk { display:grid; grid-template-columns:repeat(12,1fr); grid-template-rows:repeat(2,230px); gap:1rem; } }
        .gal-mob { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; }
        @media(min-width:768px){ .gal-mob { display:none; } }
        .gal-cell { overflow:hidden; border-radius:10px; position:relative; }
        .gal-cell img { transition:transform .9s ease; }
        .gal-cell:hover img { transform:scale(1.06); }

        /* ── PRODUCTS ── */
        .prod-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:.875rem; }
        @media(min-width:768px){ .prod-grid { grid-template-columns:repeat(3,1fr); gap:1.25rem; } }
        .prod-card { overflow:hidden; border-radius:10px; display:block; position:relative; text-decoration:none; }
        .prod-card::before { content:''; position:absolute; inset:0; z-index:1; background:linear-gradient(to top,rgba(5,14,26,.9) 0%,rgba(5,14,26,.15) 55%,transparent 100%); transition:opacity .4s ease; }
        .prod-card:hover::before { opacity:.95; }
        .prod-card img { transition:transform .85s cubic-bezier(.25,.46,.45,.94); }
        .prod-card:hover img { transform:scale(1.08); }
        .prod-card-overlay { position:absolute; bottom:0; left:0; right:0; padding:clamp(.875rem,2vw,1.5rem); z-index:2; }
        .prod-card-name { font-family:'Calibri', sans-serif; font-size:clamp(1rem,2.5vw,1.4rem); font-weight:500; color:#fff; letter-spacing:.08em; text-transform:uppercase; margin-bottom:.5rem; }
        .prod-card-bar { width:18px; height:2px; background:linear-gradient(90deg,var(--gold),var(--gold-lt)); border-radius:1px; transition:width .4s ease; }
        .prod-card:hover .prod-card-bar { width:36px; }

        /* ── TESTIMONIALS ── */
        .testi-grid { display:grid; grid-template-columns:1fr; gap:1.1rem; }
        @media(min-width:640px){ .testi-grid { grid-template-columns:repeat(2,1fr); } }
        @media(min-width:1024px){ .testi-grid { grid-template-columns:repeat(3,1fr); gap:1.5rem; } }
        .testi-card { background:var(--white); border:1px solid var(--border); border-radius:12px; padding:clamp(1.5rem,3vw,2.25rem); position:relative; overflow:hidden; transition:transform .35s ease, box-shadow .35s ease; }
        .testi-card:hover { transform:translateY(-6px); box-shadow:0 24px 56px rgba(5,14,26,.1); }
        .testi-quote-mark { position:absolute; top:-12px; right:16px; font-family:'Calibri', sans-serif; font-size:8rem; font-weight:700; color:rgba(13,43,74,.05); line-height:1; pointer-events:none; user-select:none; }
        .testi-avatar { width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg,var(--ocean),var(--teal)); display:flex; align-items:center; justify-content:center; flex-shrink:0; }

        /* ── MENTORSHIP ── */
        .mentor-section { background:var(--navy); position:relative; overflow:hidden; padding:clamp(5rem,9vw,8rem) 0; }
        .mentor-bg { position:absolute; inset:0; background:url('/images/about-natural.webp') center/cover no-repeat; opacity:.25; }
        .mentor-grid-lines { position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px); background-size:60px 60px; }
        .mentor-top-accent { position:absolute; top:0; right:0; width:min(500px,60%); height:3px; background:linear-gradient(90deg,transparent,var(--gold)); }
        .mentor-btm-accent { position:absolute; bottom:0; left:0; width:min(500px,60%); height:3px; background:linear-gradient(90deg,var(--gold),transparent); }



        /* ── LOCATIONS ── */
        .loc-grid { display:grid; grid-template-columns:1fr; gap:3rem; }
        @media(min-width:1024px){ .loc-grid { grid-template-columns:repeat(2,1fr); gap:3.5rem; } }
        .loc-map { border-radius:12px; overflow:hidden; height:clamp(220px,28vw,300px); border:1px solid var(--border); }
        .loc-info-card { background:var(--white); border:1px solid var(--border); border-radius:10px; padding:1.35rem; display:flex; flex-direction:column; gap:.85rem; margin-top:1.1rem; }
        .loc-info-row { display:flex; align-items:center; gap:.75rem; }

        /* ── CONTACT ── */
        .contact-section { background:var(--navy2); padding:clamp(4.5rem,8vw,7rem) 0; position:relative; overflow:hidden; }
        .contact-bg { position:absolute; inset:0; background:url('/images/hero-banner.webp') center/cover no-repeat; opacity:.04; }
        .contact-form-wrap { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); border-radius:14px; padding:clamp(1.75rem,4vw,3rem); backdrop-filter:blur(12px); display:flex; flex-direction:column; gap:1rem; }
        .form-row { display:grid; grid-template-columns:1fr; gap:1rem; }
        @media(min-width:540px){ .form-row { grid-template-columns:1fr 1fr; } }
        .pp-input {
          width:100%; padding:.9rem 1.1rem; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1);
          border-radius:6px; font-family:'Calibri', sans-serif; font-size:.875rem; color:#fff; outline:none;
          transition:border-color .25s, background .25s, box-shadow .25s;
        }
        .pp-input::placeholder { color:rgba(255,255,255,.32); }
        .pp-input:focus { border-color:var(--gold); background:rgba(255,255,255,.09); box-shadow:0 0 0 3px rgba(201,151,44,.15); }
        .contact-channels { display:grid; grid-template-columns:1fr; gap:.75rem; margin-top:1.75rem; }
        @media(min-width:540px){ .contact-channels { grid-template-columns:repeat(2,1fr); } }
        @media(min-width:768px){ .contact-channels { grid-template-columns:repeat(4,1fr); } }
        .channel-card { display:flex; flex-direction:column; align-items:center; gap:.65rem; padding:1.35rem .875rem; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); border-radius:10px; text-decoration:none; transition:background .3s, transform .3s; }
        .channel-card:hover { background:rgba(255,255,255,.1); transform:translateY(-3px); }
        .channel-icon { width:42px; height:42px; border-radius:50%; background:rgba(201,151,44,.15); display:flex; align-items:center; justify-content:center; }

        /* ── SECTION PAD ── */
        .sec-pad { padding: clamp(4rem,7vw,6.5rem) 0; }
        .sec-wrap { max-width: 1320px; margin: 0 auto; padding: 0 clamp(1.25rem,5vw,4.5rem); }
        .sec-wrap-sm { max-width: 760px; margin: 0 auto; padding: 0 clamp(1.25rem,5vw,4.5rem); }

        /* ── Submit btn hover ── */
        .submit-btn {
          background:var(--ocean); color:#fff; font-family:'Calibri', sans-serif; font-size:.7rem; font-weight:600;
          letter-spacing:.18em; text-transform:uppercase; padding:1.05rem; border-radius:6px; border:none; cursor:pointer;
          transition:all .35s ease; margin-top:.25rem;
        }
        .submit-btn:hover { background:var(--gold); transform:translateY(-1px); }

        /* ── Tag badge ── */
        .tag-badge { display:inline-flex; align-items:center; gap:.45rem; font-size:.6rem; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:var(--textmd); background:var(--cream); border:1px solid var(--border); border-radius:100px; padding:.35rem .9rem; }
        .tag-badge-gold { background:rgba(201,151,44,.12); border-color:rgba(201,151,44,.3); color:var(--gold); }

        /* ── Horizontal divider ── */
        .h-divider { width:100%; height:1px; background:var(--border); }
      `}</style>


      {/* ══ HERO ══ */}
      <section className="hero" ref={heroRef}>
        {heroSlides.map((slide, i) => (
          <div key={i} className={`slide-wrap ${i === currentSlide ? 'active' : 'inactive'}`}>
            <div style={{ position:'absolute', inset:0 }}>
              <Image src={slide.image} alt={slide.title} fill style={{ objectFit:'cover' }} priority={i===0} sizes="100vw" quality={85} />
            </div>
            <div className="hero-overlay-1" />
            <div className="hero-overlay-2" />
            <div className="hero-overlay-3" />
          </div>
        ))}

        <div className="hero-stripe" />
        <div className="hero-top-line" />

        {/* Content */}
        <div className="hero-content">
          <div className="hero-text-block">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: .35, ease: "easeInOut" }}
              >
                {/* Eyebrow */}
                <motion.p
                  className="hero-eyebrow"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: .45, delay: .05, ease: [.25,.1,.25,1] }}
                >
                  {heroSlides[currentSlide].eyebrow}
                </motion.p>

                {/* Title */}
                <motion.h1
                  className="hero-title serif"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: .5, delay: .12, ease: [.25,.1,.25,1] }}
                >
                  {heroSlides[currentSlide].title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  className="hero-subtitle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: .45, delay: .2, ease: [.25,.1,.25,1] }}
                >
                  {heroSlides[currentSlide].subtitle}
                </motion.p>

                {/* CTAs */}
                <motion.div
                  className="hero-cta-row"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: .4, delay: .28, ease: [.25,.1,.25,1] }}
                >
                  <Link href={heroSlides[currentSlide].ctaHref} className="btn-primary">
                    {heroSlides[currentSlide].ctaText} <ArrowRight style={{width:13,height:13}} />
                  </Link>
                  <Link href="/contact" className="btn-ghost-white">
                    Get a Quote
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Stat badge */}
        <AnimatePresence mode="wait">
          <motion.div key={`stat-${currentSlide}`} className="hero-stat"
            initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
            transition={{duration:.4,delay:.18,ease:[.25,.1,.25,1]}}>
            <div className="hero-stat-num serif">{heroSlides[currentSlide].stat.value}</div>
            <div className="hero-stat-label">{heroSlides[currentSlide].stat.label}</div>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="slide-dots">
          {heroSlides.map((_,i) => (
            <button key={i} onClick={() => goToSlide(i)} aria-label={`Slide ${i+1}`}
              className={`slide-dot-btn ${i===currentSlide?'active':''}`} />
          ))}
        </div>

        {/* Arrows */}
        <button onClick={prevSlide} aria-label="Previous" className="hero-arrow" style={{left:'clamp(1.5rem,4vw,5rem)'}}>
          <ChevronLeft style={{width:18,height:18}} />
        </button>
        <button onClick={nextSlide} aria-label="Next" className="hero-arrow" style={{right:'clamp(1.5rem,4vw,5rem)'}}>
          <ChevronRight style={{width:18,height:18}} />
        </button>

        {/* Scroll cue */}
        <div className="scroll-cue">
          <div className="scroll-cue-line" />
          <span className="scroll-cue-text">Scroll</span>
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




      {/* ══ CAPABILITIES ══ */}
      <section className="sec-pad" style={{background:'#fff', borderBottom:'1px solid var(--border)'}}>
        <div className="sec-wrap">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{once:true,margin:"-60px"}} className="caps-grid">
            {capabilities.map(cap => {
              const Icon = cap.icon
              return (
                <motion.div key={cap.title} variants={fadeUpVariant} className="cap-card">
                  <div className="cap-icon">
                    <Icon style={{width:18,height:18,color:'var(--ocean)'}} />
                  </div>
                  <p style={{fontFamily:'Calibri,serif',fontSize:'1rem',fontWeight:500,color:'var(--textdk)',marginBottom:'.4rem'}} className="serif">{cap.title}</p>
                  <p style={{fontSize:'.8rem',color:'var(--textlt)',lineHeight:1.7,fontWeight:300}}>{cap.desc}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>


      {/* ══ GLOBAL SEA & AIR LOGISTICS SECTION ══ */}
      <section style={{background:'#FAF8F4', borderBottom:'1px solid var(--border)'}} className="sec-pad">
        <div className="sec-wrap">
          <div style={{textAlign:'center', marginBottom:'clamp(2.5rem,5vw,4rem)'}}>
            <p className="eyebrow" style={{justifyContent:'center', marginBottom:'1rem'}}>Global Infrastructure</p>
            <h2 className="section-title serif" style={{marginBottom:'1rem'}}>
              Sea &amp; Air <em style={{fontStyle:'italic',color:'var(--accent)'}}>Exports</em>
            </h2>
            <div className="gold-bar-c" style={{marginBottom:'1.1rem'}} />
            <p className="body-text" style={{maxWidth:480,margin:'0 auto',fontSize:'.9rem'}}>
              Uncompromising delivery precision. We procure in bulk from deep agricultural hubs and manage reliable sea and air dispatches for our international buyers.
            </p>
          </div>

          <div style={{display:'flex', flexDirection:'column', gap:'4rem'}}>
            {/* Card 1: Sea Freight */}
            <div className="logistics-split-grid" style={{background:'#fff', borderRadius:16, overflow:'hidden', border:'1px solid var(--border)'}}>
              <motion.div initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true,margin:"-60px"}} transition={{duration:.9}} className="logistics-text-col" style={{padding:'clamp(2rem,4vw,3.5rem)'}}>
                <div className="logistics-watermark" aria-hidden style={{fontSize:'clamp(4rem,8vw,6rem)'}}>OCEAN</div>
                <div style={{position:'relative',zIndex:1}}>
                  <p className="eyebrow" style={{marginBottom:'1.1rem'}}>Active Ocean Routes</p>
                  <h3 className="serif" style={{fontSize:'clamp(1.8rem,3.5vw,2.5rem)',fontWeight:400,color:'var(--textdk)',lineHeight:1.1,marginBottom:'1rem'}}>
                    Bulk &amp; FCL <em style={{fontStyle:'italic',color:'var(--accent)'}}>Sea Freight</em>
                  </h3>
                  <div className="gold-bar" style={{marginBottom:'1.5rem'}} />
                  <p className="body-text" style={{marginBottom:'1rem'}}>
                    Weekly dry and reefer containers from Karachi and Port Qasim, ideal for high-volume commodities like rice, maize, and salt.
                  </p>
                  <div className="about-checks" style={{marginBottom:'1.5rem'}}>
                    {["Weekly scheduled FCL & LCL container dispatches","Reefer temperature control for fresh fruits & produce","End-to-end export documentation & customs clearance"].map((item,i) => (
                      <div key={i} className="about-check">
                        <CheckCircle2 style={{width:14,height:14,color:'var(--accent)',flexShrink:0}} />
                        <span style={{fontSize:'.82rem'}}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/buyer" className="btn-primary">
                    Ocean Sourcing <ArrowRight style={{width:13,height:13}} />
                  </Link>
                </div>
              </motion.div>
              <div className="logistics-img-col" style={{position:'relative', minHeight:'320px'}}>
                <Image src="/images/Export4.webp" alt="Global Sea Freight Cargo Ship" fill style={{objectFit:'cover'}} sizes="(max-width:1024px) 100vw,50vw" />
                <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(10,30,51,.15),transparent 60%)'}} />
                <div className="logistics-img-badge">
                  <p style={{fontSize:'.55rem',fontWeight:600,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--textlt)'}}>Port Sourced</p>
                  <p className="serif" style={{fontSize:'1.5rem',fontWeight:500,color:'var(--textdk)'}}>100%</p>
                  <p style={{fontSize:'.65rem',color:'var(--textlt)'}}>Secure Cargo</p>
                </div>
              </div>
            </div>

            {/* Card 2: Air Freight */}
            <div className="logistics-split-grid" style={{background:'#fff', borderRadius:16, overflow:'hidden', border:'1px solid var(--border)', direction:'rtl'}}>
              <motion.div initial={{opacity:0,x:30}} whileInView={{opacity:1,x:0}} viewport={{once:true,margin:"-60px"}} transition={{duration:.9}} className="logistics-text-col" style={{padding:'clamp(2rem,4vw,3.5rem)', direction:'ltr'}}>
                <div className="logistics-watermark" aria-hidden style={{fontSize:'clamp(4rem,8vw,6rem)', right:'unset', left:20}}>AIRCRAFT</div>
                <div style={{position:'relative',zIndex:1}}>
                  <p className="eyebrow" style={{marginBottom:'1.1rem'}}>Express Air Freight</p>
                  <h3 className="serif" style={{fontSize:'clamp(1.8rem,3.5vw,2.5rem)',fontWeight:400,color:'var(--textdk)',lineHeight:1.1,marginBottom:'1rem'}}>
                    Time-Critical <em style={{fontStyle:'italic',color:'var(--accent)'}}>Air Cargo</em>
                  </h3>
                  <div className="gold-bar" style={{marginBottom:'1.5rem'}} />
                  <p className="body-text" style={{marginBottom:'1rem'}}>
                    Premium air freight guarantees fresh global arrivals for delicate goods, fresh produce, and high-value supplements.
                  </p>
                  <div className="about-checks" style={{marginBottom:'1.5rem'}}>
                    {["Next-flight-out dispatch from major airports","Strict cold-chain control for farm freshness","Swift international airport customs clearance"].map((item,i) => (
                      <div key={i} className="about-check">
                        <CheckCircle2 style={{width:14,height:14,color:'var(--accent)',flexShrink:0}} />
                        <span style={{fontSize:'.82rem'}}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/buyer" className="btn-primary">
                    Air Sourcing <ArrowRight style={{width:13,height:13}} />
                  </Link>
                </div>
              </motion.div>
              <div className="logistics-img-col" style={{position:'relative', minHeight:'320px'}}>
                <Image src="/images/AirExport1.webp" alt="Global Air Freight Shipment" fill style={{objectFit:'cover'}} sizes="(max-width:1024px) 100vw,50vw" />
                <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(10,30,51,.15),transparent 60%)'}} />
                <div className="logistics-img-badge" style={{left:'clamp(1rem,3vw,1.5rem)', right:'unset'}}>
                  <p style={{fontSize:'.55rem',fontWeight:600,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--textlt)'}}>Express delivery</p>
                  <p className="serif" style={{fontSize:'1.5rem',fontWeight:500,color:'var(--textdk)'}}>24/48h</p>
                  <p style={{fontSize:'.65rem',color:'var(--textlt)'}}>Transit Target</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ══ SPECIAL PRODUCTS ══ */}
      <section className="sec-pad" style={{background:'var(--ivory)',borderBottom:'1px solid var(--border)'}}>
        <div className="sec-wrap">
          <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-60px"}}
            style={{textAlign:'center', marginBottom:'clamp(2.5rem,5vw,4rem)'}}>
            <p className="eyebrow" style={{justifyContent:'center', marginBottom:'1rem'}}>What We Export</p>
            <h2 className="section-title serif" style={{marginBottom:'1rem'}}>
              Our <em style={{fontStyle:'italic',color:'var(--accent)'}}>Commodities</em>
            </h2>
            <div className="gold-bar-c" style={{marginBottom:'1.1rem'}} />
            <p className="body-text" style={{maxWidth:440,margin:'0 auto',fontSize:'.9rem'}}>
              Premium export-grade agricultural commodities sourced directly from Pakistan&apos;s finest farms.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{once:true,margin:"-60px"}} className="sp-grid">
            {specialProducts.map(product => (
              <motion.div key={product.name} variants={fadeUpVariant}>
                <Link href={product.href} className="sp-card">
                  <div className="sp-ring">
                    <Image src={product.image} alt={product.name} fill style={{objectFit:'cover'}} sizes="160px" />
                  </div>
                  <div style={{textAlign:'center'}}>
                    <p style={{fontSize:'.85rem',fontWeight:600,letterSpacing:'.16em',textTransform:'uppercase',color:'var(--textdk)',marginBottom:'.3rem'}}>{product.name}</p>
                    <p style={{fontSize:'.9rem',color:'var(--textlt)'}}>{product.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <VideoGallery videos={homeVideos} title="Watch Us in Action" subtitle="Operational Excellence" />

      {/* ══ CORE TEAM ══ */}
      <section className="sec-pad" style={{ background: '#fff', borderBottom: '1px solid var(--border)' }}>
        <div className="sec-wrap">
          <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-60px"}}
            style={{textAlign:'center', marginBottom:'clamp(2.5rem,5vw,4rem)'}}>
            <p className="eyebrow" style={{justifyContent:'center', marginBottom:'1rem'}}>The Driving Force</p>
            <h2 className="section-title serif" style={{marginBottom:'1rem'}}>
              Meet Our <em style={{fontStyle:'italic',color:'var(--accent)'}}>Core Team</em>
            </h2>
            <div className="gold-bar-c" style={{marginBottom:'1.1rem'}} />
            <p className="body-text" style={{maxWidth:540,margin:'0 auto',fontSize:'.9rem'}}>
              The visionaries driving Penta Peaks&apos; commitment to global excellence and unmatched quality in international trade.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            {founders.map((founder, i) => (
              <motion.div key={founder.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -8 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: i * 0.1 }} 
                style={{ background: '#fff', borderRadius: '20px', padding: '1.25rem', border: '1px solid var(--border)', boxShadow: '0 10px 40px rgba(0,0,0,.03)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1.15', borderRadius: '14px', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <Image src={founder.image} alt={founder.name} fill style={{ objectFit: 'cover', objectPosition: 'top' }} sizes="(max-width: 768px) 100vw, 350px" />
                </div>
                <h3 className="serif" style={{ fontSize: '1.35rem', fontWeight: 500, color: 'var(--textdk)', marginBottom: '.5rem', textAlign: 'center' }}>{founder.name}</h3>
                <div style={{ width: '2rem', height: '2px', background: 'var(--gold)', marginBottom: '.75rem', borderRadius: '2px' }} />
                <p style={{ fontSize: '.8rem', color: 'var(--gold)', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.4, marginBottom: '.5rem' }}>{founder.role}</p>
                <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: '.85rem', color: 'var(--textlt)', textAlign: 'center', lineHeight: 1.5, padding: '0 0.5rem' }}>{founder.experience}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ABOUT ══ */}
      <section style={{background:'#fff'}}>
        <div className="about-grid">
          {/* Image */}
          <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true,margin:"-60px"}} transition={{duration:1}} className="about-img-col">
            <Image src="/images/Nature.webp" alt="Natural Products" fill style={{objectFit:'cover'}} sizes="(max-width:1024px) 100vw,50vw" loading="eager" />
            {/* overlay tint */}
            <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(10,30,51,.15),transparent 60%)'}} />
            {/* Accent stripe */}
            <div style={{position:'absolute',top:48,right:0,width:3,height:110,background:'linear-gradient(to bottom,var(--gold),transparent)'}} />
            {/* Badge */}
            <div className="about-img-badge">
              <p style={{fontSize:'.58rem',fontWeight:600,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--textlt)',marginBottom:'.4rem'}}>Since</p>
              <p className="serif" style={{fontSize:'1.75rem',fontWeight:500,color:'var(--textdk)',lineHeight:1}}>2018</p>
              <p style={{fontSize:'.72rem',color:'var(--textlt)',marginTop:'.3rem'}}>Trusted Exporter</p>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div initial={{opacity:0,x:30}} whileInView={{opacity:1,x:0}} viewport={{once:true,margin:"-60px"}} transition={{duration:.9,ease:[.22,1,.36,1]}} className="about-text-col">
            <div className="about-watermark" aria-hidden>NATURAL</div>
            <div style={{position:'relative',zIndex:1}}>
              <p className="eyebrow" style={{marginBottom:'1.1rem'}}>About Penta Peaks</p>
              <h2 className="serif" style={{fontSize:'clamp(2.2rem,5vw,4rem)',fontWeight:400,color:'var(--textdk)',lineHeight:1.02,marginBottom:'1rem'}}>
                100%&nbsp;<em style={{fontStyle:'italic',color:'var(--accent)'}}>Natural</em>
              </h2>
              <div className="gold-bar" style={{marginBottom:'1.5rem'}} />
              <p className="body-text" style={{marginBottom:'1rem'}}>
                We harness the power of nature, sourcing premium products directly from Punjab and Sindh to ensure export-grade quality.
              </p>
              <div className="about-checks">
                {["Rigorous quality checks before every shipment","Complete supply chain transparency","Direct farm-to-port procurement","Custom packaging & private labeling"].map((item,i) => (
                  <div key={i} className="about-check">
                    <CheckCircle2 style={{width:15,height:15,color:'var(--accent)',flexShrink:0}} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/about" className="btn-outline" style={{alignSelf:'flex-start'}}>
                Discover Our Story <ArrowRight style={{width:13,height:13}} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ══ STATS ══ */}
      <section className="stats-section">
        <div className="stats-bg-img" />
        <div className="stats-top-line" />
        <div className="stats-btm-line" />
        <div className="sec-wrap" style={{position:'relative',zIndex:1}}>
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-60px"}}
            style={{textAlign:'center',padding:'clamp(2.5rem,5vw,4.5rem) 0 1.5rem'}}>
            <p style={{fontSize:'.6rem',fontWeight:600,letterSpacing:'.35em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'.75rem',display:'flex',alignItems:'center',justifyContent:'center',gap:'.65rem'}}>
              <span style={{width:22,height:1,background:'var(--gold)',display:'inline-block'}} />Our Reach<span style={{width:22,height:1,background:'var(--gold)',display:'inline-block'}} />
            </p>
            <h2 className="serif" style={{fontSize:'clamp(1.75rem,3.5vw,3rem)',fontWeight:400,color:'#fff',letterSpacing:'.06em',textTransform:'uppercase'}}>
              Trusted by Global Markets
            </h2>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{once:true,margin:"-60px"}} className="stats-grid">
            {stats.map((s) => (
              <motion.div key={s.label} variants={fadeUpVariant}><CounterCard {...s} /></motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ══ GALLERY ══ */}
      <section className="sec-pad" style={{background:'var(--ivory)',borderTop:'1px solid var(--border)'}}>
        <div className="sec-wrap">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-60px"}}
            style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:'clamp(2rem,4vw,3rem)',gap:'1.5rem',flexWrap:'wrap'}}>
            <div>
              <p className="eyebrow" style={{marginBottom:'.9rem'}}>Our Operations</p>
              <h2 className="section-title serif">Corporate <em style={{fontStyle:'italic',color:'var(--accent)'}}>Responsibility</em></h2>
            </div>
            <p className="body-text" style={{maxWidth:300,fontSize:'.88rem'}}>A glimpse into our operations, products, and global partnerships.</p>
          </motion.div>

          {/* Desktop masonry */}
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{once:true,margin:"-60px"}} className="gal-desk">
            <motion.div variants={fadeUpVariant} className="gal-cell" style={{gridColumn:'span 5',gridRow:'span 2'}}>
              <Image src={corporateImages[0]} alt="Corp 1" fill style={{objectFit:'cover'}} sizes="45vw" />
              <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(5,14,26,.4) 0%,transparent 55%)'}} />
            </motion.div>
            {[1,2].map(idx => (
              <motion.div key={idx} variants={fadeUpVariant} className="gal-cell" style={{gridColumn:idx===1?'span 4':'span 3'}}>
                <Image src={corporateImages[idx]} alt={`Corp ${idx+1}`} fill style={{objectFit:'cover'}} sizes="30vw" />
              </motion.div>
            ))}
            {[3,4,5].map(idx => (
              <motion.div key={idx} variants={fadeUpVariant} className="gal-cell" style={{gridColumn:'span 2'}}>
                <Image src={corporateImages[idx]} alt={`Corp ${idx+1}`} fill style={{objectFit:'cover'}} sizes="20vw" />
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile */}
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{once:true,margin:"-60px"}} className="gal-mob">
            {corporateImages.slice(0,6).map((img,i) => (
              <motion.div key={i} variants={fadeUpVariant} className="gal-cell"
                style={{height:i===0?210:155,gridColumn:i===0?'span 2':'span 1'}}>
                <Image src={img} alt={`Corp ${i+1}`} fill style={{objectFit:'cover'}} sizes="(max-width:640px) 100vw,50vw" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>




      {/* ══ PRODUCTS ══ */}
      <section className="sec-pad" style={{background:'#fff',borderTop:'1px solid var(--border)'}}>
        <div className="sec-wrap">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-60px"}}
            style={{textAlign:'center',marginBottom:'clamp(2rem,4vw,3.5rem)'}}>
            <p className="eyebrow" style={{justifyContent:'center',marginBottom:'1rem'}}>Export Catalogue</p>
            <h2 className="section-title serif" style={{marginBottom:'1rem'}}>
              Our <em style={{fontStyle:'italic',color:'var(--accent)'}}>Products</em>
            </h2>
            <div className="gold-bar-c" style={{marginBottom:'1.1rem'}} />
            <p className="body-text" style={{maxWidth:440,margin:'0 auto',fontSize:'.9rem'}}>
              Explore our range of premium Pakistani agricultural commodities available for export worldwide.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{once:true,margin:"-60px"}} className="prod-grid">
            {productGrid.map(product => (
              <motion.div key={product.name} variants={fadeUpVariant}>
                <Link href={product.href} className="prod-card" style={{height:'clamp(150px,28vw,280px)',display:'block'}}>
                  <Image src={product.image} alt={product.name} fill style={{objectFit:'cover'}} sizes="(max-width:640px) 50vw,33vw" />
                  <div className="prod-card-overlay">
                    <p className="prod-card-name">{product.name}</p>
                    <div className="prod-card-bar" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div style={{textAlign:'center',marginTop:'clamp(2rem,4vw,3rem)'}}>
            <Link href="/products" className="btn-outline">View All Products <ArrowRight style={{width:13,height:13}} /></Link>
          </div>
        </div>
      </section>


      {/* ══ TESTIMONIALS ══ */}
      <section className="sec-pad" style={{background:'var(--ivory)',borderTop:'1px solid var(--border)'}}>
        <div className="sec-wrap">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-60px"}}
            style={{textAlign:'center',marginBottom:'clamp(2.5rem,5vw,4rem)'}}>
            <p className="eyebrow" style={{justifyContent:'center',marginBottom:'1rem'}}>Testimonials</p>
            <h2 className="section-title serif" style={{marginBottom:'1rem'}}>
              People Say About <em style={{fontStyle:'italic',color:'var(--accent)'}}>Penta Peaks</em>
            </h2>
            <div className="gold-bar-c" style={{marginBottom:'1.1rem'}} />
            <p className="body-text" style={{maxWidth:400,margin:'0 auto',fontSize:'.9rem'}}>What our buyers, suppliers, and students say about working with us.</p>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{once:true,margin:"-60px"}} className="testi-grid">
            {testimonials.map((t,i) => (
              <motion.div key={i} variants={fadeUpVariant} className="testi-card">
                <div className="testi-quote-mark serif">&ldquo;</div>
                <div style={{display:'flex',gap:'.2rem',marginBottom:'1.1rem'}}>
                  {Array.from({length:5}).map((_,j) => <Star key={j} style={{width:13,height:13,fill:'var(--gold)',color:'var(--gold)'}} />)}
                </div>
                <p className="body-text" style={{fontSize:'.88rem',fontStyle:'italic',marginBottom:'1.5rem',lineHeight:1.85,position:'relative',zIndex:1}}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{borderTop:'1px solid var(--border)',paddingTop:'1.1rem',display:'flex',alignItems:'center',gap:'.875rem'}}>
                  <div className="testi-avatar">
                    <span className="serif" style={{fontSize:'1rem',color:'rgba(255,255,255,.85)',fontStyle:'italic'}}>{t.name[0]}</span>
                  </div>
                  <div>
                    <p style={{fontWeight:600,fontSize:'.85rem',color:'var(--textdk)'}}>{t.name}</p>
                    <p style={{fontSize:'.72rem',color:'var(--gold)',marginTop:'.15rem'}}>{t.role} · {t.country}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ══ MENTORSHIP CTA ══ */}
      <section className="mentor-section">
        <div className="mentor-bg" />
        <div className="mentor-grid-lines" />
        <div className="mentor-top-accent" />
        <div className="mentor-btm-accent" />
        <div className="sec-wrap-sm" style={{position:'relative',zIndex:2,textAlign:'center'}}>
          <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-60px"}} transition={{duration:.8}}>
            <div style={{width:64,height:64,borderRadius:16,background:'rgba(201,151,44,.15)',border:'1px solid rgba(201,151,44,.35)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1.75rem'}}>
              <GraduationCap style={{width:28,height:28,color:'var(--gold)'}} />
            </div>
            <p style={{fontSize:'.6rem',fontWeight:600,letterSpacing:'.35em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'1.1rem',display:'flex',alignItems:'center',justifyContent:'center',gap:'.65rem'}}>
              <span style={{width:22,height:1,background:'var(--gold)',display:'inline-block'}} />
              Mentorship Programme
              <span style={{width:22,height:1,background:'var(--gold)',display:'inline-block'}} />
            </p>
            <h2 className="serif" style={{fontSize:'clamp(2rem,5.5vw,4.5rem)',fontWeight:400,color:'#fff',marginBottom:'1.25rem',lineHeight:1.06}}>
              Learn Import Export<br />
              <em style={{fontStyle:'italic',color:'var(--gold-lt)'}}>from Pakistan&apos;s Experts</em>
            </h2>
            <p style={{fontSize:'clamp(.88rem,1.5vw,1rem)',color:'rgba(255,255,255,.58)',maxWidth:500,margin:'0 auto 2.25rem',lineHeight:1.85,fontWeight:300}}>
              Master documentation, LC terms, Incoterms, logistics, customs clearance, TDAP/RECP registration, and real deal walkthroughs.
            </p>
            <Link href="/mentorship" className="btn-gold">
              Enroll Now <ArrowRight style={{width:13,height:13}} />
            </Link>
          </motion.div>
        </div>
      </section>




      {/* ══ LOCATIONS ══ */}
      <section className="sec-pad" style={{background:'var(--ivory)'}}>
        <div className="sec-wrap">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-60px"}}
            style={{textAlign:'center',marginBottom:'clamp(2.5rem,5vw,4rem)'}}>
            <p className="eyebrow" style={{justifyContent:'center',marginBottom:'.85rem'}}>Where We Are</p>
            <h2 className="section-title serif">Our Global <em style={{fontStyle:'italic',color:'var(--accent)'}}>Locations</em></h2>
          </motion.div>

          <div className="loc-grid">
            {/* Pakistan Head Office */}
            <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-50px"}} transition={{duration:.7}}>
              <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'1.4rem'}}>
                <div style={{width:38,height:38,borderRadius:9,background:'rgba(13,43,74,.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <Building style={{width:16,height:16,color:'var(--ocean)'}} />
                </div>
                <div>
                  <p style={{fontSize:'.58rem',fontWeight:600,letterSpacing:'.2em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'.1rem'}}>Corporate</p>
                  <h3 className="serif" style={{fontSize:'clamp(1.2rem,2.5vw,1.5rem)',fontWeight:500,color:'var(--textdk)'}}>Pakistan Head Office</h3>
                </div>
              </div>
              <div className="loc-map" style={{ height: '300px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13615.176461421684!2d74.25875225134707!3d31.433604921601614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391901080b110569%3A0x33b0fb0b941e5adf!2sWAPDA%20Town%20Lahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1715800000000!5m2!1sen!2s" width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" title="Pakistan Office Location" />
              </div>
              <div className="loc-info-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1.5rem', background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem' }}>
                {[
                  { icon:<MapPin style={{width:14,height:14,color:'var(--ocean)',flexShrink:0}} />, text:"WAPDA Town Lahore, Punjab, Pakistan", isLink: true, url: "https://www.google.com/maps/place/WAPDA+Town+Lahore,+Pakistan/@31.427302,74.261013,14.6z/data=!4m6!3m5!1s0x391901080b110569:0x33b0fb0b941e5adf!8m2!3d31.4311985!4d74.2643582!16zL20vMGNzM2h2?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D" },
                  { icon:<Phone style={{width:14,height:14,color:'var(--ocean)',flexShrink:0}} />, text:"+92 308 6222283", isLink: false },
                  { icon:<Mail style={{width:14,height:14,color:'var(--ocean)',flexShrink:0}} />, text:"info@pentapeaks.com", isLink: false },
                ].map((item,i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {item.icon}
                    {item.isLink ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize:'.85rem', color:'var(--textmd)', textDecoration:'none' }} className="hover:text-accent transition-colors underline underline-offset-4">
                        {item.text}
                      </a>
                    ) : (
                      <span style={{fontSize:'.85rem',color:'var(--textmd)'}}>{item.text}</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* USA Branch Office */}
            <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-50px"}} transition={{duration:.7, delay: 0.15}}>
              <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'1.4rem'}}>
                <div style={{width:38,height:38,borderRadius:9,background:'rgba(13,43,74,.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <Building style={{width:16,height:16,color:'var(--ocean)'}} />
                </div>
                <div>
                  <p style={{fontSize:'.58rem',fontWeight:600,letterSpacing:'.2em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'.1rem'}}>International</p>
                  <h3 className="serif" style={{fontSize:'clamp(1.2rem,2.5vw,1.5rem)',fontWeight:500,color:'var(--textdk)'}}>USA Office</h3>
                </div>
              </div>
              <div className="loc-map" style={{ height: '300px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3029.2280344858455!2d-75.488017!3d40.6027922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c43980dd6376bd%3A0xf3bb86060c44f84e!2s237%20N%2013th%20St%2C%20Allentown%2C%20PA%2018102%2C%20USA!5e0!3m2!1sen!2s!4v1715800000000!5m2!1sen!2s" width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" title="USA Office Location" />
              </div>
              <div className="loc-info-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1.5rem', background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem' }}>
                {[
                  { icon:<MapPin style={{width:14,height:14,color:'var(--ocean)',flexShrink:0}} />, text:"237 N 13th St, Allentown, PA 18102, USA", isLink: true, url: "https://maps.app.goo.gl/hCMk6zYuUSmsp4MK7" },
                  { icon:<Phone style={{width:14,height:14,color:'var(--ocean)',flexShrink:0}} />, text:"+1 609 635 5116", isLink: false },
                  { icon:<Mail style={{width:14,height:14,color:'var(--ocean)',flexShrink:0}} />, text:"info@pentapeaks.com", isLink: false },
                ].map((item,i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {item.icon}
                    {item.isLink ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize:'.85rem', color:'var(--textmd)', textDecoration:'none' }} className="hover:text-accent transition-colors underline underline-offset-4">
                        {item.text}
                      </a>
                    ) : (
                      <span style={{fontSize:'.85rem',color:'var(--textmd)'}}>{item.text}</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ══ CONTACT ══ */}
      <section className="contact-section">
        <div className="contact-bg" />
        <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(201,151,44,.5) 50%,transparent)'}} />
        <div className="sec-wrap-sm" style={{position:'relative',zIndex:1}}>
          <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-60px"}} transition={{duration:.8}}>
            <div style={{textAlign:'center',marginBottom:'clamp(2rem,4vw,3rem)'}}>
              <p style={{fontSize:'.6rem',fontWeight:600,letterSpacing:'.35em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'1rem',display:'flex',alignItems:'center',justifyContent:'center',gap:'.65rem'}}>
                <span style={{width:22,height:1,background:'var(--gold)',display:'inline-block'}} />Let&apos;s Talk<span style={{width:22,height:1,background:'var(--gold)',display:'inline-block'}} />
              </p>
              <h2 className="serif" style={{fontSize:'clamp(2rem,4.5vw,3.75rem)',fontWeight:400,color:'#fff',marginBottom:'1rem',lineHeight:1.1}}>
                Get In <em style={{fontStyle:'italic',color:'var(--gold)'}}>Touch</em>
              </h2>
              <div className="gold-bar-c" style={{marginBottom:'1.1rem'}} />
              <p style={{fontSize:'.9rem',color:'rgba(255,255,255,.48)',lineHeight:1.85,fontWeight:300}}>
                Have questions about our products or services? We&apos;d love to hear from you.
              </p>
            </div>

            <form className="contact-form-wrap" suppressHydrationWarning>
              <div className="form-row">
                <input type="text" placeholder="Your Name" className="pp-input" suppressHydrationWarning />
                <input type="email" placeholder="Your Email" className="pp-input" suppressHydrationWarning />
              </div>
              <input type="text" placeholder="Subject" className="pp-input" suppressHydrationWarning />
              <textarea rows={5} placeholder="Your Message" className="pp-input" style={{resize:'none'}} suppressHydrationWarning />
              <button type="submit" className="submit-btn">Send Message</button>
            </form>

            <div className="contact-channels">
              {[
                { href:"tel:+923086222283", Icon:Phone, label:"Call PK", value:"+92 308 6222283" },
                { href:"tel:+16096355116", Icon:Phone, label:"Call USA", value:"+1 609 635 5116" },
                { href:"mailto:info@pentapeaks.com", Icon:Mail, label:"Email Us", value:"info@pentapeaks.com" },
                { href:"https://wa.me/923086222283", Icon:Users, label:"WhatsApp", value:"Chat With Us" },
              ].map(({ href, Icon, label, value }) => (
                <a key={label} href={href} className="channel-card">
                  <div className="channel-icon">
                    <Icon style={{width:16,height:16,color:'var(--gold)'}} />
                  </div>
                  <div style={{textAlign:'center'}}>
                    <p style={{fontSize:'.6rem',color:'rgba(255,255,255,.38)',marginBottom:'.2rem',letterSpacing:'.1em',textTransform:'uppercase'}}>{label}</p>
                    <p style={{fontSize:'.8rem',fontWeight:500,color:'#fff'}}>{value}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}