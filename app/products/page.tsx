"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { fadeUpVariant, staggerContainer } from "@/lib/animations"
import { categories } from "@/lib/utils"
import { getProductsByCategory } from "@/data/products"
import { ArrowRight, Leaf, ShieldCheck, Globe2, TrendingUp, Award, PackageCheck } from "lucide-react"

/* ─── image map (same as original) ─── */
const catImages: Record<string, string> = {
  rice:         "/images/product-rice.webp",
  "fresh-fruits-and-vegetables": "/images/product-potatoes.webp",
  fruits:       "/images/product-mangoes.webp",
  vegetables:   "/images/product-potatoes.webp",
  grains:       "/images/product-corn.webp",
  "animal-feed":"/images/AnimalFeedBanner.webp",
  seeds:        "/images/product-salt.webp",
  meat:         "/images/Beef03.webp",
  gloves:       "/images/leathergloves.jpg",
  "salt-lamps": "/images/saltlamp.jpg",
  supplements:  "/images/shilajit.webp",
}

/* ─── why-us cards ─── */
const whyUs = [
  { Icon: ShieldCheck, title: "Export Certified",   desc: "Every shipment meets international food safety and phytosanitary requirements." },
  { Icon: Leaf,        title: "Farm to Port",       desc: "Direct sourcing from Punjab & Sindh eliminates middlemen and ensures freshness." },
  { Icon: Globe2,      title: "15+ Countries",      desc: "Trusted partners across the Middle East, Europe, and South-East Asia." },
  { Icon: TrendingUp,  title: "Competitive FOB",    desc: "Volume pricing and flexible Incoterms tailored to every buyer." },
  { Icon: Award,       title: "Grade A Only",       desc: "Rigorous in-house QC lab rejects anything below premium export grade." },
  { Icon: PackageCheck,title: "Custom Packaging",   desc: "Private labelling, retail packs, or bulk - we match your market requirements." },
]

/* ─── spotlight: all categories in alternating layout ─── */
const spotlightSlugs = ["rice", "fresh-fruits-and-vegetables", "grains", "animal-feed", "seeds"]

export default function ProductsPage() {
  const allCategories = categories.filter(c => c.slug !== "fruits" && c.slug !== "vegetables")
  const spotlights = spotlightSlugs
    .map(s => categories.find(c => c.slug === s))
    .filter((c): c is (typeof categories)[number] => Boolean(c))

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        :root {
          --ivory:  #FAF8F4; --cream: #F2EDE4; --forest: #0B1A0E;
          --green:  #1C5230; --leaf:  #2A7A4B; --gold:   #C8963E;
          --border: #DDD8CF; --dk:    #16261A; --md:     #4A5D4C; --lt: #8A9E8B;
        }
        html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
        body { font-family: 'Calibri', sans-serif; background: var(--ivory); margin: 0; overflow-x: hidden; }
        button, a { -webkit-tap-highlight-color: transparent; }

        /* ── typography helpers ── */
        .serif  { font-family: 'Calibri', sans-serif; }
        .tag    { font-size: clamp(.54rem,1.4vw,.62rem); font-weight: 600; letter-spacing: .24em; text-transform: uppercase; color: var(--gold); }
        .body   { color: var(--md); line-height: 1.8; font-weight: 300; }

        /* ── section wrapper ── */
        .wrap   { max-width: 1300px; margin: 0 auto; padding: 0 clamp(1rem,5vw,4rem); }
        .sec    { padding: clamp(3rem,7vw,6.5rem) 0; }

        /* ── hero ── */
        .hero-bg {
          background: var(--forest);
          position: relative; overflow: hidden;
          padding: clamp(6rem,14vw,10rem) 0 clamp(3rem,7vw,5rem);
        }
        .hero-grain {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
          background-size: 180px; opacity: .45; pointer-events: none;
        }
        .hero-ring {
          position: absolute; border-radius: 50%;
          border: 1px solid rgba(200,150,62,.12); pointer-events: none;
        }

        /* ── stats strip ── */
        .stats-strip { display: grid; grid-template-columns: repeat(2,1fr); }
        @media(min-width:640px){ .stats-strip { grid-template-columns: repeat(4,1fr); } }
        .stat-item { border-right: 1px solid rgba(255,255,255,.08); }
        .stat-item:nth-child(2n) { border-right: none; }
        .stat-item:nth-child(n+3) { border-top: 1px solid rgba(255,255,255,.08); }
        @media(min-width:640px){
          .stat-item:nth-child(2n) { border-right: 1px solid rgba(255,255,255,.08); }
          .stat-item:nth-child(n+3) { border-top: none; }
          .stat-item:last-child { border-right: none; }
        }

        /* ── spotlight (alternating) ── */
        .spotlight { display: grid; grid-template-columns: 1fr; min-height: 460px; }
        @media(min-width:900px){ .spotlight { grid-template-columns: 1fr 1fr; min-height: 540px; } }
        .spot-img  { position: relative; min-height: clamp(240px,40vw,520px); overflow: hidden; order: 1; }
        .spot-text { display: flex; flex-direction: column; justify-content: center;
                     padding: clamp(2rem,6vw,5rem) clamp(1.5rem,5vw,5rem); position: relative; overflow: hidden; order: 2; }
        @media(min-width:900px){
          .spotlight.alt-row .spot-img  { order: 2; }
          .spotlight.alt-row .spot-text { order: 1; }
        }
        .spot-text .watermark {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
          font-family: 'Calibri', sans-serif;
          font-size: clamp(3.5rem,10vw,8rem); font-weight: 700;
          color: rgba(28,82,48,.05); white-space: nowrap;
          pointer-events: none; user-select: none; letter-spacing: -.05em; z-index: 0;
        }

        /* ── category grid ── */
        .cat-grid { display: grid; gap: clamp(.75rem,2vw,1.5rem);
                    grid-template-columns: repeat(2,1fr); }
        @media(min-width:640px){ .cat-grid { grid-template-columns: repeat(3,1fr); } }
        @media(min-width:1024px){ .cat-grid { grid-template-columns: repeat(3,1fr); } }

        .cat-card { display: block; text-decoration: none; border-radius: 14px;
                    overflow: hidden; border: 1px solid var(--border);
                    background: #fff; transition: box-shadow .35s ease, transform .35s ease; }
        @media(hover:hover){
          .cat-card:hover { transform: translateY(-6px); box-shadow: 0 24px 56px rgba(11,26,14,.11); }
          .cat-card:hover .cat-img-inner { transform: scale(1.06); }
          .cat-card:hover .cat-arrow { transform: translateX(4px); }
        }
        .cat-img-wrap { position: relative; height: clamp(140px,22vw,220px); overflow: hidden; }
        .cat-img-inner { position: absolute; inset: 0; transition: transform .7s cubic-bezier(.25,.46,.45,.94); }

        /* ── why-us grid ── */
        .why-grid { display: grid; gap: clamp(1rem,2.5vw,1.75rem);
                    grid-template-columns: 1fr; }
        @media(min-width:480px){ .why-grid { grid-template-columns: repeat(2,1fr); } }
        @media(min-width:900px){ .why-grid { grid-template-columns: repeat(3,1fr); } }

        /* ── CTA bottom ── */
        .cta-split { display: grid; grid-template-columns: 1fr;
                     gap: clamp(2rem,5vw,4rem); align-items: center; }
        @media(min-width:860px){ .cta-split { grid-template-columns: 1fr 1fr; } }

        /* ── btn ── */
        .btn-dark { display: inline-flex; align-items: center; gap: .5rem;
          background: var(--forest); color: #fff;
          font-size: clamp(.6rem,1.4vw,.68rem); font-weight: 600; letter-spacing: .16em;
          text-transform: uppercase; padding: clamp(.75rem,2vw,.95rem) clamp(1.1rem,3vw,1.8rem);
          border: 1px solid var(--forest); border-radius: 7px; text-decoration: none;
          transition: all .3s ease; white-space: nowrap; }
        @media(hover:hover){ .btn-dark:hover { background: var(--green); border-color: var(--green); transform: translateY(-2px); } }
        .btn-outline { display: inline-flex; align-items: center; gap: .5rem;
          background: transparent; color: var(--forest);
          font-size: clamp(.6rem,1.4vw,.68rem); font-weight: 600; letter-spacing: .16em;
          text-transform: uppercase; padding: clamp(.75rem,2vw,.95rem) clamp(1.1rem,3vw,1.8rem);
          border: 1px solid var(--forest); border-radius: 7px; text-decoration: none;
          transition: all .3s ease; white-space: nowrap; }
        @media(hover:hover){ .btn-outline:hover { background: var(--forest); color: #fff; transform: translateY(-2px); } }
        .btn-gold { display: inline-flex; align-items: center; gap: .5rem;
          background: var(--gold); color: #fff;
          font-size: clamp(.6rem,1.4vw,.68rem); font-weight: 600; letter-spacing: .16em;
          text-transform: uppercase; padding: clamp(.75rem,2vw,.95rem) clamp(1.5rem,3.5vw,2.2rem);
          border-radius: 7px; text-decoration: none; transition: all .3s ease; white-space: nowrap; }
        @media(hover:hover){ .btn-gold:hover { background: #b5832e; transform: translateY(-2px); } }

        @keyframes floatUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .float { animation: floatUp 5s ease-in-out infinite; }

        /* gold rule */
        .g-rule { display:block; width:2.25rem; height:1px; background:var(--gold); }
        .g-rule-c { display:block; width:2.25rem; height:1px; background:var(--gold); margin:0 auto; }

        /* ── RICE PAGES HERO & TICKER ALIGNMENT ── */
        .rice-hero {
          height: 95svh !important;
          min-height: 560px !important;
          max-height: 900px !important;
          display: flex !important;
          align-items: center !important;
          position: relative !important;
          overflow: hidden !important;
          padding: 0 !important;
        }

        .ticker { 
          background: #0D2B4A; 
          border-top: 1px solid rgba(200,150,62,.2); 
          border-bottom: 1px solid rgba(200,150,62,.2); 
          overflow: hidden; 
          padding: .75rem 0; 
          position: relative;
          z-index: 10;
        }
        .ticker-inner { display: flex; gap: 0; white-space: nowrap; animation: tickerScroll 28s linear infinite; }
        .ticker-inner:hover { animation-play-state: paused; }
        .ticker-item { display: inline-flex; align-items: center; gap: .75rem; padding: 0 2.5rem; font-size: .65rem; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,.75); }
        .ticker-dot { width: 4px; height: 4px; border-radius: 50%; background: #C8963E; flex-shrink: 0; }
        @keyframes tickerScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>


      {/* ══════════════════════════════════════
          1 ▸ HERO
      ══════════════════════════════════════ */}
      <section className="hero-bg rice-hero">
        <div style={{ position: "absolute", inset: 0 }}>
          <Image src="/images/Ship_PortContainer.webp" alt="Export Logistics" fill style={{ objectFit: "cover" }} priority sizes="100vw" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(11,26,14,.88) 0%,rgba(11,26,14,.62) 100%)" }} />
        </div>
        <div className="hero-grain" />

        {/* decorative rings */}
        {[600,900,1200].map((s,i) => (
          <div key={i} className="hero-ring" style={{ width:s, height:s, top:"50%", left:"50%", transform:`translate(-50%,-50%)`, animationDelay:`${i*.4}s` }} />
        ))}

        {/* gold top accent */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,#C8963E 40%,transparent)", zIndex:4 }} />
        {/* left gold stripe */}
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:"linear-gradient(to bottom,transparent,#C8963E,transparent)", zIndex:4 }} />

        <div className="wrap" style={{ position:"relative", zIndex:5, textAlign:"center" }}>
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:.9, ease:[.22,1,.36,1] }}>
            <p className="tag" style={{ color:"#C8963E", display:"flex", alignItems:"center", justifyContent:"center", gap:".6rem", marginBottom:"1.1rem" }}>
              <span style={{ display:"inline-block", width:22, height:1, background:"#C8963E" }} />
              Export Catalogue
              <span style={{ display:"inline-block", width:22, height:1, background:"#C8963E" }} />
            </p>

            <h1 className="serif" style={{ fontSize:"clamp(2.4rem,8vw,7.5rem)", fontWeight:300, color:"#fff", letterSpacing:".04em", lineHeight:.92, textTransform:"uppercase", marginBottom:"clamp(1rem,2.5vw,1.5rem)" }}>
              Product{" "}
              <em style={{ fontStyle:"italic", color:"#C8963E" }}>Catalogue</em>
            </h1>

            <p style={{ fontFamily:"'Calibri', sans-serif", fontSize:"clamp(.82rem,1.6vw,1.05rem)", color:"rgba(255,255,255,.62)", maxWidth:520, margin:"0 auto clamp(1.5rem,4vw,2.5rem)", lineHeight:1.8 }}>
              Premium Pakistani agricultural commodities - sourced from the fields of Punjab &amp; Sindh, shipped to global markets.
            </p>

            <div style={{ display:"flex", gap:".75rem", justifyContent:"center", flexWrap:"wrap" }}>
              <Link href="#catalogue" className="btn-gold">Browse All Products <ArrowRight style={{ width:13, height:13 }} /></Link>
              <Link href="/contact" className="btn-outline" style={{ color:"#fff", borderColor:"rgba(255,255,255,.35)" }}>Request a Quote</Link>
            </div>
          </motion.div>

          {/* floating badge */}
          <motion.div initial={{ opacity:0, scale:.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay:.6, duration:.8 }}
            style={{ display:"inline-flex", alignItems:"center", gap:".6rem", marginTop:"clamp(2rem,5vw,3.5rem)", background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.15)", borderRadius:50, padding:".6rem 1.1rem .6rem .75rem", backdropFilter:"blur(10px)" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#4ade80", boxShadow:"0 0 8px #4ade80" }} />
            <span style={{ fontFamily:"'Calibri', sans-serif", fontSize:".68rem", color:"rgba(255,255,255,.7)", letterSpacing:".1em" }}>Accepting new buyers - 15+ countries served</span>
          </motion.div>
        </div>

        {/* stats strip */}
        <div className="wrap" style={{ marginTop:"clamp(2.5rem,6vw,5rem)", position:"relative", zIndex:5 }}>
          <div style={{ borderTop:"1px solid rgba(255,255,255,.08)", borderBottom:"1px solid rgba(255,255,255,.08)" }}>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="stats-strip">
              {[
                { num:"150+", label:"Global Buyers" },
                { num:"25+",  label:"Products" },
                { num:"15+",  label:"Countries" },
                { num:"500+", label:"Students Trained" },
              ].map((s,i) => (
                <motion.div key={i} variants={fadeUpVariant} className="stat-item"
                  style={{ padding:"clamp(1rem,3vw,1.75rem) clamp(.75rem,3vw,1.5rem)", textAlign:"center" }}>
                  <div className="serif" style={{ fontSize:"clamp(1.5rem,4vw,2.75rem)", fontWeight:300, color:"#fff", lineHeight:1 }}>
                    {s.num.replace("+","")}<span style={{ color:"#C8963E" }}>+</span>
                  </div>
                  <div style={{ fontFamily:"'Calibri', sans-serif", fontSize:"clamp(.54rem,1.3vw,.62rem)", fontWeight:600, color:"rgba(255,255,255,.38)", letterSpacing:".22em", textTransform:"uppercase", marginTop:".6rem" }}>{s.label}</div>
                </motion.div>
              ))}
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


      {/* ══ GLOBAL SEA & AIR LOGISTICS SECTION ══ */}
      <section className="sec" style={{ background: "#FAF8F4", borderBottom: "1px solid #E8E3DC" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: "clamp(2rem,5vw,3.75rem)" }}>
            <p className="tag" style={{ marginBottom: ".85rem" }}>Global Delivery Channels</p>
            <h2 className="serif" style={{ fontSize: "clamp(1.7rem,4vw,3.2rem)", fontWeight: 400, color: "var(--dk)", marginBottom: ".9rem" }}>
              Sea &amp; Air <em style={{ fontStyle: "italic", color: "#1C5230" }}>Sourcing</em>
            </h2>
            <span className="g-rule-c" />
            <p className="body" style={{ maxWidth: 420, margin: "1rem auto 0", fontSize: "clamp(.82rem,1.8vw,.92rem)" }}>
              Weekly dispatches from farm silos directly to international seaport and airport destinations under rigorous cold chain compliance.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
            {/* Sea Sourcing Card */}
            <div className="spotlight" style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #E8E3DC", minHeight: "unset" }}>
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .9, ease: [.22, 1, .36, 1] }} className="spot-text" style={{ background: "transparent" }}>
                <div className="watermark" style={{ color: "rgba(28,82,48,.02)" }}>SEA</div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <p className="tag" style={{ display: "flex", alignItems: "center", gap: ".55rem", marginBottom: "1rem" }}>
                    <span style={{ display: "inline-block", width: 16, height: 1, background: "#C8963E" }} />
                    Port Logistics
                  </p>
                  <h3 className="serif" style={{ fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 300, color: "var(--dk)", lineHeight: 1.1, marginBottom: "1rem" }}>
                    Dry &amp; Reefer <em style={{ fontStyle: "italic", color: "#1C5230" }}>Ocean Freight</em>
                  </h3>
                  <span className="g-rule" style={{ marginBottom: "1.25rem" }} />
                  <p className="body" style={{ fontSize: "clamp(.84rem,1.8vw,.95rem)", marginBottom: "1.5rem" }}>
                    Weekly dispatches of FCL dry containers and reefers from Karachi ports. Custom temperature control ensures perfect preservation of perishable crops and fresh produce.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: ".6rem", marginBottom: "1.75rem" }}>
                    {["Weekly scheduled FCL & LCL dispatches","Advanced cold-chain reefer temperature control","Comprehensive customs & terminal clearance"].map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: ".6rem", fontSize: ".82rem", color: "var(--md)" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8963E" }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/buyer" className="btn-dark" style={{ alignSelf: "flex-start" }}>
                    Sea Freight Quote <ArrowRight style={{ width: 13, height: 13 }} />
                  </Link>
                </div>
              </motion.div>
              <div className="spot-img" style={{ minHeight: "320px", order: 2 }}>
                <Image src="/images/Export3.webp" alt="Vessel unloading containers" fill className="object-cover" sizes="(max-width:900px) 100vw,50vw" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, transparent 60%, #fff)", opacity: .15 }} />
              </div>
            </div>

            {/* Air Sourcing Card */}
            <div className="spotlight" style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #E8E3DC", minHeight: "unset" }}>
              <div className="spot-img" style={{ minHeight: "320px", order: 1 }}>
                <Image src="/images/AirExport3.webp" alt="Express air cargo airport payload" fill className="object-cover" sizes="(max-width:900px) 100vw,50vw" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 60%, #fff)", opacity: .15 }} />
              </div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .9, ease: [.22, 1, .36, 1] }} className="spot-text" style={{ background: "transparent", order: 2 }}>
                <div className="watermark" style={{ color: "rgba(28,82,48,.02)", right: "unset", left: "10%" }}>AIR</div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <p className="tag" style={{ display: "flex", alignItems: "center", gap: ".55rem", marginBottom: "1rem" }}>
                    <span style={{ display: "inline-block", width: 16, height: 1, background: "#C8963E" }} />
                    Perishable Cargo
                  </p>
                  <h3 className="serif" style={{ fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 300, color: "var(--dk)", lineHeight: 1.1, marginBottom: "1rem" }}>
                    Time-Critical <em style={{ fontStyle: "italic", color: "#1C5230" }}>Air Freight</em>
                  </h3>
                  <span className="g-rule" style={{ marginBottom: "1.25rem" }} />
                  <p className="body" style={{ fontSize: "clamp(.84rem,1.8vw,.95rem)", marginBottom: "1.5rem" }}>
                    Express dispatches from major Pakistani airports. Sourced at dawn, flying by midday, landing fresh at your destination.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: ".6rem", marginBottom: "1.75rem" }}>
                    {["Next-flight-out express delivery slots","Strict perishable cold-chain dispatches","Rapid customs clearance at destination airports"].map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: ".6rem", fontSize: ".82rem", color: "var(--md)" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8963E" }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/buyer" className="btn-dark" style={{ alignSelf: "flex-start" }}>
                    Air Freight Quote <ArrowRight style={{ width: 13, height: 13 }} />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          2 ▸ SPOTLIGHT (alternating, top 3 categories)
      ══════════════════════════════════════ */}
      <section style={{ background:"#fff" }}>
        {spotlights.map((cat, i) => {
          const products = cat.slug === "fresh-fruits-and-vegetables"
            ? [...getProductsByCategory("fruits"), ...getProductsByCategory("vegetables")]
            : getProductsByCategory(cat.slug)
          const isEven = i % 2 === 0
          return (
            <div key={cat.slug} className={`spotlight ${isEven ? "" : "alt-row"}`} style={{ borderBottom:"1px solid #E8E3DC" }}>

              {/* image - swap order on desktop for even/odd */}
              <motion.div
                initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true, margin:"-80px" }} transition={{ duration:1 }}
                className="spot-img">
                <Image src={catImages[cat.slug] || "/images/product-rice.webp"} alt={cat.name} fill className="object-cover" sizes="(max-width:900px) 100vw,50vw" />
                {/* overlay gradient */}
                <div style={{ position:"absolute", inset:0, background: isEven
                  ? "linear-gradient(to right, transparent 60%, #fff)"
                  : "linear-gradient(to left, transparent 60%, #fff)",
                  opacity:.25
                }} />
                {/* product count pill */}
                <div style={{ position:"absolute", top:"clamp(1rem,3vw,1.75rem)", left:"clamp(1rem,3vw,1.75rem)", background:"rgba(11,26,14,.72)", backdropFilter:"blur(8px)", borderRadius:50, padding:".4rem .875rem", display:"flex", alignItems:"center", gap:".4rem" }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:"#C8963E" }} />
                  <span style={{ fontFamily:"'Calibri', sans-serif", fontSize:".64rem", fontWeight:600, color:"rgba(255,255,255,.85)", letterSpacing:".1em" }}>{products.length} products</span>
                </div>
              </motion.div>

              {/* text */}
              <motion.div
                initial={{ opacity:0, x: isEven ? 30 : -30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true, margin:"-80px" }} transition={{ duration:.9, ease:[.22,1,.36,1] }}
                className="spot-text"
                style={{ background: i % 2 === 1 ? "#FAF8F4" : "#fff" }}>
                <div className="watermark">{cat.name.toUpperCase()}</div>
                <div style={{ position:"relative", zIndex:1 }}>
                  <p className="tag" style={{ display:"flex", alignItems:"center", gap:".55rem", marginBottom:"1rem" }}>
                    <span style={{ display:"inline-block", width:16, height:1, background:"#C8963E" }} />
                    Featured Category
                  </p>
                  <h2 className="serif" style={{ fontSize:"clamp(2rem,4.5vw,4rem)", fontWeight:300, color:"var(--dk)", lineHeight:1, marginBottom:"1.1rem" }}>
                    {cat.name.split(" ")[0]} <em style={{ fontStyle:"italic", color:"#1C5230" }}>{cat.name.split(" ").slice(1).join(" ") || ""}</em>
                  </h2>
                  <span className="g-rule" style={{ marginBottom:"1.25rem" }} />
                  <p className="body" style={{ fontSize:"clamp(.84rem,1.8vw,.95rem)", marginBottom:"1rem", maxWidth:400 }}>
                    Export-grade {cat.name.toLowerCase()} sourced directly from Pakistan&apos;s finest farms - quality-tested, hygienically processed, and ready for international shipment.
                  </p>
                  <p style={{ fontFamily:"'Calibri', sans-serif", fontSize:"clamp(.78rem,1.6vw,.85rem)", color:"var(--lt)", marginBottom:"1.75rem" }}>
                    Available in bulk &amp; retail packaging · Custom labelling · Flexible Incoterms
                  </p>
                  <Link href={`/products/${cat.slug}`} className="btn-dark" style={{ alignSelf:"flex-start" }}>
                    Explore {cat.name} <ArrowRight style={{ width:13, height:13 }} />
                  </Link>
                </div>
              </motion.div>
            </div>
          )
        })}
      </section>


      {/* ══════════════════════════════════════
          3 ▸ ALL CATEGORIES GRID
      ══════════════════════════════════════ */}
      <section id="catalogue" className="sec" style={{ background:"#FAF8F4", borderTop:"1px solid #E8E3DC" }}>
        <div className="wrap">
          {/* heading */}
          <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:"-60px" }}
            style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:"1.5rem", flexWrap:"wrap", marginBottom:"clamp(2rem,5vw,3.5rem)" }}>
            <div>
              <p className="tag" style={{ marginBottom:".9rem" }}>Full Export Range</p>
              <h2 className="serif" style={{ fontSize:"clamp(1.7rem,4vw,3.2rem)", fontWeight:400, color:"var(--dk)", margin:0, lineHeight:1.06 }}>
                All <em style={{ fontStyle:"italic", color:"#1C5230" }}>Categories</em>
              </h2>
            </div>
            <p className="body" style={{ maxWidth:260, fontSize:"clamp(.8rem,1.8vw,.88rem)", marginBottom:0 }}>
              Six premium product lines - each with dedicated export documentation and quality certification.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-60px" }} className="cat-grid">
            {allCategories.map((cat) => {
              const products = cat.slug === "fresh-fruits-and-vegetables"
                ? [...getProductsByCategory("fruits"), ...getProductsByCategory("vegetables")]
                : getProductsByCategory(cat.slug)
              return (
                <motion.div key={cat.slug} variants={fadeUpVariant}>
                  <Link href={`/products/${cat.slug}`} className="cat-card">
                    {/* image */}
                    <div className="cat-img-wrap">
                      <div className="cat-img-inner">
                        <Image src={catImages[cat.slug] || "/images/product-rice.webp"} alt={cat.name} fill className={["salt-lamps", "gloves", "supplements"].includes(cat.slug) ? "object-contain p-2" : "object-cover"} sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw" />
                      </div>
                      {/* overlay */}
                      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(11,26,14,.75) 0%,transparent 55%)" }} />
                      {/* name over image */}
                      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"clamp(.75rem,2vw,1.25rem)" }}>
                        <h3 className="serif" style={{ fontSize:"clamp(1rem,2.5vw,1.4rem)", fontWeight:400, color:"#fff", letterSpacing:".06em", textTransform:"uppercase", marginBottom:".3rem" }}>{cat.name}</h3>
                        <div style={{ width:18, height:1.5, background:"#C8963E", borderRadius:1 }} />
                      </div>
                      {/* product count badge */}
                      <div style={{ position:"absolute", top:"clamp(.6rem,1.5vw,1rem)", right:"clamp(.6rem,1.5vw,1rem)", background:"rgba(200,150,62,.9)", borderRadius:50, padding:".25rem .65rem" }}>
                        <span style={{ fontFamily:"'Calibri', sans-serif", fontSize:".6rem", fontWeight:700, color:"#fff", letterSpacing:".08em" }}>{products.length} items</span>
                      </div>
                    </div>

                    {/* footer row */}
                    <div style={{ padding:"clamp(.75rem,2vw,1.1rem) clamp(.875rem,2.5vw,1.25rem)", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fff", borderTop:"1px solid #E8E3DC" }}>
                      <span style={{ fontFamily:"'Calibri', sans-serif", fontSize:"clamp(.7rem,1.6vw,.78rem)", color:"var(--md)", fontWeight:400 }}>View all {cat.name.toLowerCase()}</span>
                      <div style={{ width:28, height:28, borderRadius:"50%", background:"#FAF8F4", border:"1px solid #E8E3DC", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <ArrowRight className="cat-arrow" style={{ width:12, height:12, color:"#1C5230", transition:"transform .3s ease" }} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          4 ▸ WHY CHOOSE US
      ══════════════════════════════════════ */}
      <section className="sec" style={{ background:"#fff", borderTop:"1px solid #E8E3DC" }}>
        <div className="wrap">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:"-60px" }} style={{ textAlign:"center", marginBottom:"clamp(2rem,5vw,3.75rem)" }}>
            <p className="tag" style={{ marginBottom:".85rem" }}>Why Buyers Trust Us</p>
            <h2 className="serif" style={{ fontSize:"clamp(1.7rem,4vw,3.2rem)", fontWeight:400, color:"var(--dk)", marginBottom:".9rem" }}>
              The Penta Peaks <em style={{ fontStyle:"italic", color:"#1C5230" }}>Promise</em>
            </h2>
            <span className="g-rule-c" />
            <p className="body" style={{ maxWidth:420, margin:"1rem auto 0", fontSize:"clamp(.82rem,1.8vw,.92rem)" }}>
              Six pillars that set every Penta Peaks shipment apart from the rest.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-60px" }} className="why-grid">
            {whyUs.map(({ Icon, title, desc }, i) => (
              <motion.div key={i} variants={fadeUpVariant}
                style={{ background:"#FAF8F4", border:"1px solid var(--border)", borderRadius:14, padding:"clamp(1.25rem,3vw,2rem)", display:"flex", flexDirection:"column", gap:".875rem", transition:"box-shadow .3s, transform .3s" }}
                whileHover={{ y:-5, boxShadow:"0 20px 50px rgba(11,26,14,.09)" }}>
                <div style={{ width:44, height:44, borderRadius:10, background:"linear-gradient(135deg,rgba(28,82,48,.12),rgba(42,122,75,.08))", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
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


      {/* ══════════════════════════════════════
          5 ▸ QUALITY STRIP (dark)
      ══════════════════════════════════════ */}
      <section style={{ background:"var(--forest)", position:"relative", overflow:"hidden", padding:"clamp(2rem,5vw,4rem) 0" }}>
        <div style={{ position:"absolute", inset:0, background:"url('/images/hero-banner.webp') center/cover no-repeat", opacity:.04 }} />
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,#C8963E 40%,transparent)" }} />
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,#C8963E 40%,transparent)" }} />
        <div className="wrap" style={{ position:"relative", zIndex:2 }}>
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:"-60px" }}
            style={{ display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", gap:"1.5rem" }}>
            <div>
              <p className="tag" style={{ color:"#C8963E", marginBottom:".65rem" }}>Quality Assurance</p>
              <h3 className="serif" style={{ fontSize:"clamp(1.4rem,3.5vw,2.6rem)", fontWeight:300, color:"#fff", margin:0, lineHeight:1.1 }}>
                Every batch tested.<br /><em style={{ fontStyle:"italic", color:"#C8963E" }}>Every shipment certified.</em>
              </h3>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:".625rem" }}>
              {["Phytosanitary Certificates", "ISO-compliant Processing", "TDAP / RECP Registered", "Custom Lab Reports on Request"].map((item,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:".625rem" }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:"#C8963E", flexShrink:0 }} />
                  <span style={{ fontFamily:"'Calibri', sans-serif", fontSize:"clamp(.76rem,1.6vw,.84rem)", color:"rgba(255,255,255,.72)" }}>{item}</span>
                </div>
              ))}
            </div>
            <Link href="/contact" className="btn-gold">Get Certified Quote <ArrowRight style={{ width:13, height:13 }} /></Link>
          </motion.div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          6 ▸ CTA BOTTOM
      ══════════════════════════════════════ */}
      <section className="sec" style={{ background:"#FAF8F4", borderTop:"1px solid #E8E3DC" }}>
        <div className="wrap">
          <div className="cta-split">
            {/* image collage */}
            <motion.div initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true, margin:"-60px" }} transition={{ duration:.9, ease:[.22,1,.36,1] }}
              style={{ position:"relative", height:"clamp(260px,40vw,420px)" }}>
              {/* main */}
              <div style={{ position:"absolute", inset:0, borderRadius:18, overflow:"hidden", border:"1px solid var(--border)" }}>
                <Image src="/images/hero-fruits.webp" alt="Fruits" fill className="object-cover" sizes="50vw" />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(11,26,14,.4) 0%,transparent 50%)" }} />
              </div>
              {/* small overlay card */}
              <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:.3 }}
                style={{ position:"absolute", bottom:"clamp(1rem,3vw,1.75rem)", left:"clamp(1rem,3vw,1.75rem)", right:"clamp(1rem,3vw,1.75rem)", background:"rgba(255,255,255,.92)", backdropFilter:"blur(12px)", borderRadius:12, padding:"1rem 1.1rem", display:"flex", alignItems:"center", gap:".875rem", border:"1px solid rgba(255,255,255,.6)" }}>
                <div style={{ width:42, height:42, borderRadius:"50%", background:"linear-gradient(135deg,#1C5230,#2A7A4B)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Globe2 style={{ width:18, height:18, color:"#fff" }} />
                </div>
                <div>
                  <p style={{ fontFamily:"'Calibri', sans-serif", fontWeight:600, fontSize:".85rem", color:"var(--dk)" }}>Shipped to 15+ countries</p>
                  <p style={{ fontFamily:"'Calibri', sans-serif", fontSize:".72rem", color:"var(--lt)", marginTop:".15rem" }}>UAE · UK · Malaysia · Germany · and more</p>
                </div>
              </motion.div>
            </motion.div>

            {/* text */}
            <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true, margin:"-60px" }} transition={{ duration:.9, ease:[.22,1,.36,1] }}>
              <p className="tag" style={{ marginBottom:"1rem" }}>Ready to Export?</p>
              <h2 className="serif" style={{ fontSize:"clamp(1.8rem,4.5vw,3.75rem)", fontWeight:300, color:"var(--dk)", lineHeight:1.05, marginBottom:"1.25rem" }}>
                Start Your Import<br /><em style={{ fontStyle:"italic", color:"#1C5230" }}>Journey Today</em>
              </h2>
              <span className="g-rule" style={{ marginBottom:"1.25rem" }} />
              <p className="body" style={{ fontSize:"clamp(.84rem,1.8vw,.95rem)", maxWidth:400, marginBottom:"1rem" }}>
                Whether you&apos;re a first-time buyer or an established importer, our team handles every step - from farm selection to final delivery.
              </p>
              <p style={{ fontFamily:"'Calibri', sans-serif", fontSize:"clamp(.78rem,1.6vw,.85rem)", color:"var(--lt)", marginBottom:"2rem" }}>
                Sample shipments available · Response within 24 hours
              </p>
              <div style={{ display:"flex", gap:".75rem", flexWrap:"wrap" }}>
                <Link href="/contact" className="btn-dark">Contact Our Team <ArrowRight style={{ width:13, height:13 }} /></Link>
                <Link href="/mentorship" className="btn-outline">Join Mentorship</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}