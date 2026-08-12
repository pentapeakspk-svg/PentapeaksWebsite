"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useParams, redirect } from "next/navigation"
import { fadeUpVariant, staggerContainer } from "@/lib/animations"
import { ArrowRight, Globe2 } from "lucide-react"
import { getProductsByCategory } from "@/data/products"
import { categories } from "@/lib/utils"


export default function CategoryPage() {
  const params = useParams()
  const category = params.category as string

  if (category === "fruits" || category === "vegetables") {
    redirect("/products/fresh-fruits-and-vegetables")
  }

  const catInfo = categories.find(c => c.slug === category)
  const catProducts = category === "fresh-fruits-and-vegetables"
    ? [...getProductsByCategory("fruits"), ...getProductsByCategory("vegetables")]
    : getProductsByCategory(category)
  const catName = catInfo?.name || category.charAt(0).toUpperCase() + category.slice(1)

  const catImages: Record<string, string> = {
    rice: "/images/product-rice.webp",
    "fresh-fruits-and-vegetables": "/images/product-potatoes.webp",
    fruits: "/images/product-mangoes.webp",
    vegetables: "/images/product-potatoes.webp",
    grains: "/images/product-corn.webp",
    "animal-feed": "/images/product-corn.webp",
    seeds: "/images/product-salt.webp",
    meat: "/images/Beef03.webp",
    "salt-lamps": "/images/saltlamp.jpg",
    gloves: "/images/leathergloves.jpg",
    supplements: "/images/shilajit.webp",
    "sports-goods-and-apparel": "/images/sports_goods_banner.png",
  }

  const categoryBanners: Record<string, string> = {
    rice: "/images/RiceBanner.webp",
    "animal-feed": "/images/AnimalFeedBanner.webp",
    fruits: "/images/fruitBanner.webp",
    vegetables: "/images/Vegetablebanner.webp",
    "fresh-fruits-and-vegetables": "/images/Vegetablebanner.webp",
    grains: "/images/GrainsBanner.webp",
    seeds: "/images/Seaseamsbanner.webp",
    meat: "/images/Beef Banner.webp",
    "salt-lamps": "/images/saltlamp.jpg",
    gloves: "/images/leathergloves.jpg",
    supplements: "/images/shilajit.webp",
    "sports-goods-and-apparel": "/images/sports_goods_banner.png",
  }
  const bannerImage = categoryBanners[category]


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
          padding: clamp(4rem,9vw,8rem) 0 clamp(3rem,7vw,5rem);
        }
        .hero-grain {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
          background-size: 180px; opacity: .45; pointer-events: none;
        }

        /* ── breadcrumb ── */
        .breadcrumb { display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .breadcrumb a { color: rgba(255,255,255,.65); text-decoration: none; font-size: .82rem; transition: color .2s; }
        .breadcrumb a:hover { color: #fff; }
        .breadcrumb span { color: rgba(255,255,255,.35); }
        .breadcrumb .current { color: var(--gold); }

        /* ── product grid ── */
        .prod-grid { display: grid; gap: clamp(.75rem,2vw,1.5rem);
                     grid-template-columns: repeat(2,1fr); }
        @media(min-width:640px){ .prod-grid { grid-template-columns: repeat(3,1fr); } }
        @media(min-width:1024px){ .prod-grid { grid-template-columns: repeat(3,1fr); } }

        .prod-card { display: block; text-decoration: none; border-radius: 14px;
                     overflow: hidden; border: 1px solid var(--border);
                     background: #fff; transition: box-shadow .35s ease, transform .35s ease; height: 100%; }
        @media(hover:hover){
          .prod-card:hover { transform: translateY(-6px); box-shadow: 0 24px 56px rgba(11,26,14,.11); }
          .prod-card:hover .prod-img { transform: scale(1.06); }
        }
        .prod-img-wrap { position: relative; height: clamp(140px,22vw,220px); overflow: hidden; }
        .prod-img { position: absolute; inset: 0; transition: transform .7s cubic-bezier(.25,.46,.45,.94); }

        .prod-content { padding: clamp(1rem,2.5vw,1.5rem); display: flex; flex-direction: column; }
        .prod-hs { font-size: .68rem; color: var(--gold); font-weight: 600; letter-spacing: .08em; }
        .prod-name { font-family: 'Calibri', sans-serif; font-size: clamp(1.05rem,2.2vw,1.4rem); font-weight: 700; color: var(--dk); margin: .5rem 0 .4rem; transition: color .2s; }
        .prod-card:hover .prod-name { color: var(--green); }
        .prod-sci { font-size: .72rem; color: var(--lt); font-style: italic; margin-bottom: .6rem; }
        .prod-desc { font-size: .8rem; color: var(--md); line-height: 1.5; margin-bottom: .8rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .prod-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; border-top: 1px solid var(--border); padding-top: .8rem; }
        .prod-origin { font-size: .72rem; color: var(--lt); }
        .prod-link { color: var(--green); text-decoration: none; font-size: .82rem; font-weight: 600; display: inline-flex; align-items: center; gap: .3rem; transition: gap .2s; }
        .prod-card:hover .prod-link { gap: .6rem; }

        /* ── CTA ── */
        .btn-dark { display: inline-flex; align-items: center; gap: .5rem;
          background: var(--forest); color: #fff;
          font-size: clamp(.6rem,1.4vw,.68rem); font-weight: 600; letter-spacing: .16em;
          text-transform: uppercase; padding: clamp(.75rem,2vw,.95rem) clamp(1.1rem,3vw,1.8rem);
          border: 1px solid var(--forest); border-radius: 7px; text-decoration: none;
          transition: all .3s ease; white-space: nowrap; }
        @media(hover:hover){ .btn-dark:hover { background: var(--green); border-color: var(--green); transform: translateY(-2px); } }

        /* gold rule */
        .g-rule { display: block; width: 2.25rem; height: 1px; background: var(--gold); }
        .g-rule-c { display: block; width: 2.25rem; height: 1px; background: var(--gold); margin: 0 auto; }

        .empty-state { text-align: center; padding: clamp(2rem,5vw,4rem); }
        .empty-state h2 { font-family: 'Calibri', sans-serif; font-size: clamp(1.8rem,4vw,3rem); color: var(--dk); margin-bottom: 1rem; }
        .empty-state p { color: var(--md); margin-bottom: 2rem; }

        /* ── ORIGIN SPLIT FOR RICE ── */
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
          background:var(--forest);
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

      {/* ══════ HERO ══════ */}
      <section className="hero-bg rice-hero">
        {bannerImage ? (
          <div style={{ position: "absolute", inset: 0 }}>
            <Image src={bannerImage} alt={catName} fill className="object-cover" priority sizes="100vw" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(11,26,14,.9) 0%,rgba(11,26,14,.6) 100%)" }} />
          </div>
        ) : (
          <div className="hero-grain" />
        )}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,#C8963E 40%,transparent)", zIndex:4 }} />
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:"linear-gradient(to bottom,transparent,#C8963E,transparent)", zIndex:4 }} />

        <div className="wrap" style={{ position:"relative", zIndex:5 }}>
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.7 }}>
            <div className="breadcrumb">
              <Link href="/" style={{ color:"rgba(255,255,255,.65)", textDecoration:"none", fontSize:".82rem" }}>Home</Link>
              <span style={{ color:"rgba(255,255,255,.35)" }}>/</span>
              <Link href="/products" style={{ color:"rgba(255,255,255,.65)", textDecoration:"none", fontSize:".82rem" }}>Products</Link>
              <span style={{ color:"rgba(255,255,255,.35)" }}>/</span>
              <span className="current">{catName}</span>
            </div>

            <h1 className="serif" style={{ fontSize:"clamp(2.2rem,7vw,6rem)", fontWeight:300, color:"#fff", letterSpacing:".04em", lineHeight:.95, textTransform:"uppercase", margin:"1rem 0 .75rem" }}>
              {catName}
            </h1>

            <p style={{ fontFamily:"'Calibri', sans-serif", fontSize:"clamp(.82rem,1.5vw,1rem)", color:"rgba(255,255,255,.72)", maxWidth:480, margin:0, lineHeight:1.7 }}>
              {catProducts.length} premium export-grade products available
            </p>
          </motion.div>
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

      {/* ══════ RICE IMPORT EXPORT SECTION ══════ */}
      {category === "rice" && (
        <section className="origin-split" style={{ borderBottom: "1px solid var(--border)" }}>
          {/* text side */}
          <motion.div className="origin-text-side"
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }} transition={{ duration: .85 }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "'Calibri', sans-serif", fontSize: "clamp(6rem,14vw,14rem)", fontWeight: 700, color: "rgba(255,255,255,.02)", whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none", lineHeight: 1 }} aria-hidden>EXPORTS</div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <span style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".6rem", fontWeight: 600, letterSpacing: ".28em", textTransform: "uppercase", color: "#C8963E", display: "inline-flex", alignItems: "center", gap: ".5rem" }}>
                <span style={{ display: "inline-block", width: 16, height: 1, background: "currentColor" }} />
                Direct from Pakistan
              </span>
              <div style={{ height: "1rem" }} />
              <h2 className="serif" style={{ fontSize: "clamp(1.9rem,4vw,3.25rem)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: "1.5rem" }}>
                Global Rice Sourcing <em style={{ fontStyle: "italic", color: "#C8963E" }}><br />& Supply Chain</em>
              </h2>
              <div style={{ width: "2.5rem", height: 1, background: "#C8963E", marginBottom: "1.5rem" }} />
              <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".95rem", color: "rgba(255,255,255,.65)", lineHeight: 1.9, fontWeight: 300, marginBottom: "2rem", maxWidth: 440 }}>
                Penta Peaks is a leading global supplier of premium Pakistani Basmati and Non-Basmati rice. Operating from the heart of Punjab's legendary rice belt, we manage the entire supply chain - from crop procurement and processing to final custom packaging and port delivery.
              </p>

              {/* capabilities pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem", marginBottom: "2.25rem" }}>
                {["1121 Golden Basmati", "Super Kernel Basmati", "IRRI-6 & IRRI-9 Rice", "FOB & CIF Logistics", "SGS Quality Checked"].map(r => (
                  <span key={r} className="region-pill">{r}</span>
                ))}
              </div>

              <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
                <Link href="/contact" className="btn-dark" style={{ background: "#C8963E", borderColor: "#C8963E" }}>Contact Our Team <ArrowRight style={{ width: 13, height: 13 }} /></Link>
                <Link href="/products" className="btn-dark" style={{ background: "transparent", borderColor: "rgba(255,255,255,.2)" }}>View Catalog</Link>
              </div>
            </div>
          </motion.div>

          {/* image side */}
          <div className="origin-map-side">
            <div style={{ position: "absolute", inset: 0 }}>
              <Image src="/images/RiceImportExport.webp" alt="Rice Import Export" fill className="object-cover" sizes="50vw" />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(11,26,14,.8) 0%,rgba(11,26,14,.4) 100%)" }} />
            </div>

            <motion.div initial={{ opacity: 0, scale: .9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }} transition={{ duration: .8 }}
              style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "2rem" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(200,150,62,.15)", border: "1px solid rgba(200,150,62,.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                <Globe2 style={{ width: 32, height: 32, color: "#C8963E" }} />
              </div>
              <p className="serif" style={{ fontSize: "clamp(2rem,5vw,3.75rem)", fontWeight: 300, color: "#fff", lineHeight: 1.1, letterSpacing: ".04em" }}>
                Punjab Crop • Port<br />
                <em style={{ fontStyle: "italic", color: "#C8963E", fontWeight: 300 }}>Milling • Sifting</em><br />
                Global Ports
              </p>
              <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".7rem", fontWeight: 300, color: "rgba(255,255,255,.5)", marginTop: "1rem", letterSpacing: ".12em", textTransform: "uppercase" }}>
                Complete Rice Sourcing Solutions
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════ PRODUCTS ══════ */}
      <section className="sec" style={{ background:"#fff", borderTop:"1px solid #E8E3DC" }}>
        <div className="wrap">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-60px" }} className="prod-grid">
            {catProducts.length > 0 ? catProducts.map((product) => (
              <motion.div key={product.id} variants={fadeUpVariant}>
                <Link href={`/products/${(product.category === "fruits" || product.category === "vegetables") ? "fresh-fruits-and-vegetables" : product.category}/${product.slug}`} className="prod-card">
                  <div className="prod-img-wrap">
                    <div className="prod-img">
                      <Image 
                        src={product.images[0] || catImages[product.category] || "/images/product-rice.webp"} 
                        alt={product.name} 
                        fill 
                        className={["salt-lamps", "gloves", "supplements", "sports-goods-and-apparel"].includes(product.category) ? "object-contain p-2" : "object-cover"} 
                        sizes="(max-width:640px) 50vw,33vw" 
                      />
                    </div>
                  </div>
                  <div className="prod-content">
                    <span className="prod-hs">HS: {product.hsCode}</span>
                    <h3 className="prod-name">{product.name}</h3>
                    {product.scientificName && <p className="prod-sci">{product.scientificName}</p>}
                    <p className="prod-desc">{product.description[0]?.substring(0, 100)}...</p>
                    <div className="prod-footer">
                      <span className="prod-origin">Origin: {product.origin}</span>
                      <span className="prod-link">Details <ArrowRight style={{ width:12, height:12 }} /></span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )) : (
              <div className="empty-state" style={{ gridColumn:"1/-1" }}>
                <h2>No Products Found</h2>
                <p className="body">No products available in this category yet.</p>
                <Link href="/products" className="btn-dark">Back to Products <ArrowRight style={{ width:13, height:13 }} /></Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>



      {/* ══ GLOBAL SEA & AIR LOGISTICS SECTION ══ */}
      <section className="sec" style={{ background: "#FAF8F4", borderTop: "1px solid #E8E3DC" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: "clamp(2rem,5vw,3.75rem)" }}>
            <p className="tag" style={{ marginBottom: ".85rem" }}>Global Delivery Channels</p>
            <h2 className="serif" style={{ fontSize: "clamp(1.7rem,4vw,3.2rem)", fontWeight: 400, color: "var(--dk)", marginBottom: ".9rem" }}>
              {catName} <em style={{ fontStyle: "italic", color: "#1C5230" }}>Logistics</em>
            </h2>
            <span className="g-rule-c" />
            <p className="body" style={{ maxWidth: 420, margin: "1rem auto 0", fontSize: "clamp(.82rem,1.8vw,.92rem)" }}>
              Weekly dispatches from farm silos directly to international seaport and airport destinations under rigorous cold chain compliance.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
            {/* Sea Sourcing Card */}
            <div className="origin-split" style={{ background: "#0B1A0E", borderRadius: 16, overflow: "hidden", display: "grid", gridTemplateColumns: "1fr", minHeight: "unset", border: "1px solid rgba(255,255,255,.05)" }}>
              <style>{`
                @media(min-width:900px){
                  .origin-split.card-grid { grid-template-columns: 1fr 1fr !important; }
                }
              `}</style>
              <div className="origin-split card-grid" style={{ display: "grid", gridTemplateColumns: "1fr" }}>
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .9 }} className="origin-text-side" style={{ padding: "clamp(2rem,4vw,3.5rem)" }}>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <span style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".6rem", fontWeight: 600, letterSpacing: ".28em", textTransform: "uppercase", color: "#C8963E" }}>
                      Port Logistics
                    </span>
                    <div style={{ height: ".5rem" }} />
                    <h3 className="serif" style={{ fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: "1rem" }}>
                      Ocean Container <em style={{ fontStyle: "italic", color: "#C8963E" }}>Freight</em>
                    </h3>
                    <div style={{ width: "2.25rem", height: 1, background: "#C8963E", marginBottom: "1.5rem" }} />
                    <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".9rem", color: "rgba(255,255,255,.7)", lineHeight: 1.8, fontWeight: 300, marginBottom: "1.5rem" }}>
                      {category === "rice" ? "Dispatching weekly dry FCL containers from the ports of Karachi. We secure premium Basmati crops in double-walled export sacks inside pristine ocean containers." : 
                       category === "fruits" ? "Leveraging high-efficiency refrigerated container units (reefers) to preserve fresh mandarins and mangoes at strict temperature thresholds during ocean transit." :
                       category === "vegetables" ? "Utilizing state-of-the-art ventilated ocean dispatches to prevent moisture build-up for bulk potato, onion, and fresh vegetable cargo." :
                       category === "fresh-fruits-and-vegetables" ? "Leveraging high-efficiency refrigerated container units (reefers) and ventilated ocean dispatches to preserve fresh produce, mangoes, citrus, potatoes, and onions at strict thresholds during transit." :
                       category === "meat" ? "Shipping Halal-certified premium meat & poultry via advanced reefer containers (-18°C for frozen, 0-4°C for chilled) to preserve exact freshness and texture during deep ocean transit." :
                       "Bulk ocean logistics with secure tarpaulin container sealing and anti-moisture desiccants to preserve seed, grain, and feed shipments."}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: ".6rem", marginBottom: "1.5rem" }}>
                      {["Weekly dry & reefer dispatches","Custom temperature and humidity logging","Fast customs processing & port handling"].map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: ".6rem", fontSize: ".82rem", color: "rgba(255,255,255,.7)" }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8963E" }} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="/buyer" className="btn-dark" style={{ background: "#C8963E", borderColor: "#C8963E", alignSelf: "flex-start" }}>
                      Ocean Freight Quote <ArrowRight style={{ width: 13, height: 13 }} />
                    </Link>
                  </div>
                </motion.div>
                <div className="origin-map-side" style={{ minHeight: "320px", position: "relative" }}>
                  <Image src={category === "rice" ? "/images/Export5.webp" : category === "fruits" ? "/images/Export6.webp" : category === "vegetables" ? "/images/Export7.webp" : category === "fresh-fruits-and-vegetables" ? "/images/Export7.webp" : "/images/Export8.webp"} alt="Ocean freight cargo" fill className="object-cover" sizes="(max-width:900px) 100vw,50vw" />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, transparent 60%, #0B1A0E)", opacity: .2 }} />
                </div>
              </div>
            </div>

            {/* Air Sourcing Card */}
            <div className="origin-split" style={{ background: "#0B1A0E", borderRadius: 16, overflow: "hidden", display: "grid", gridTemplateColumns: "1fr", minHeight: "unset", border: "1px solid rgba(255,255,255,.05)" }}>
              <div className="origin-split card-grid" style={{ display: "grid", gridTemplateColumns: "1fr" }}>
                <div className="origin-map-side" style={{ minHeight: "320px", position: "relative", order: 2 }}>
                  <Image src={category === "fruits" ? "/images/AirExport2.webp" : category === "vegetables" ? "/images/AirExport3.webp" : category === "fresh-fruits-and-vegetables" ? "/images/AirExport3.webp" : "/images/AirExport1.webp"} alt="Air freight cargo" fill className="object-cover" sizes="(max-width:900px) 100vw,50vw" />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 60%, #0B1A0E)", opacity: .2 }} />
                </div>
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .9 }} className="origin-text-side" style={{ padding: "clamp(2rem,4vw,3.5rem)", order: 1 }}>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <span style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".6rem", fontWeight: 600, letterSpacing: ".28em", textTransform: "uppercase", color: "#C8963E" }}>
                      Express Delivery
                    </span>
                    <div style={{ height: ".5rem" }} />
                    <h3 className="serif" style={{ fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: "1rem" }}>
                      Perishable Air <em style={{ fontStyle: "italic", color: "#C8963E" }}>Freight</em>
                    </h3>
                    <div style={{ width: "2.25rem", height: 1, background: "#C8963E", marginBottom: "1.5rem" }} />
                    <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".9rem", color: "rgba(255,255,255,.7)", lineHeight: 1.8, fontWeight: 300, marginBottom: "1.5rem" }}>
                      {category === "fruits" ? "Our express air freight channels expedite Kinnow mandarins, mangoes and fresh berries directly from airport hubs. Freshly harvested fruits reach buyers in under 48 hours." :
                       category === "vegetables" ? "Time-sensitive fresh-cut chili, gourd, and seasonal vegetable cargo processed with express cold chain air dispatch to avoid weight loss and dehydration." :
                       category === "fresh-fruits-and-vegetables" ? "Our express air freight channels expedite fresh fruits and vegetables directly from airport hubs, ensuring cold-chain delivery within 48 hours." :
                       category === "meat" ? "Express airfreight for chilled mutton, beef, and poultry to high-demand international markets, ensuring 100% freshness and unbroken cold-chain delivery." :
                       "Expedited air cargo slots for sample validation, high-value organic seed shipments, and urgent feed requirements requiring express transit speeds."}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: ".6rem", marginBottom: "1.5rem" }}>
                      {["Next-flight-out express delivery slots","Strict perishable cold-chain dispatches","Rapid customs clearance at destination airports"].map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: ".6rem", fontSize: ".82rem", color: "rgba(255,255,255,.7)" }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8963E" }} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="/buyer" className="btn-dark" style={{ background: "#C8963E", borderColor: "#C8963E", alignSelf: "flex-start" }}>
                      Air Freight Quote <ArrowRight style={{ width: 13, height: 13 }} />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}
