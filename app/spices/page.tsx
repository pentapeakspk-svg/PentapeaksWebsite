"use client"
import { motion } from "framer-motion"
import Image from "next/image"

const spicesList = [
  "Himalayan Pink Salt",
  "Iodized Refined Salt",
  "Turmeric Powder",
  "Chaat Masala",
  "Garam Masala Saabit",
  "Red Chili Powder",
  "Coriander Powder",
  "Garlic Powder",
  "Red Chilli Flakes",
  "Black Pepper Whole",
  "Ginger Powder",
  "Black Pepper Powder",
  "White Cumin Seeds",
  "Kasuri Methi Leaves",
  "Cumin Powder",
  "Garam Masala Powder",
  "Bombay Biryani Masala",
  "Biryani Masala",
  "Karahi Masala",
  "Achar Gosht Masala",
  "Chicken Tikka Masala",
  "Seekh Kabab Masala",
  "Malai Boti Masala",
  "Bihari Kabab Masala",
  "Karahi Gosht Masala",
  "Qorma Masala",
  "Mix Pickle",
  "Vermicelli"
];

const specificImages: Record<string, string> = {
  "Himalayan Pink Salt": "/images/himalayan_pink_salt.png",
  "Iodized Refined Salt": "/images/iodized_refined_salt.png",
  "Turmeric Powder": "/images/turmeric_powder.png",
  "Chaat Masala": "/images/chaat_masala.png",
  "Garam Masala Saabit": "/images/garam_masala_saabit.png",
  "Red Chili Powder": "/images/red_chili_powder.png",
  "Coriander Powder": "/images/coriander_powder.png",
  "Garlic Powder": "/images/garlic_powder.png",
  "Red Chilli Flakes": "/images/red_chilli_flakes.png",
  "Black Pepper Whole": "/images/black_pepper_whole.png",
  "Ginger Powder": "/images/ginger_powder.png",
  "Black Pepper Powder": "/images/black_pepper_powder.png",
  "White Cumin Seeds": "/images/white_cumin_seeds.png",
  "Kasuri Methi Leaves": "/images/kasuri_methi_leaves.png",
  "Cumin Powder": "/images/cumin_powder.png",
  "Garam Masala Powder": "/images/garam_masala_powder.png",
  "Bombay Biryani Masala": "/images/bombay_biryani_masala.png",
  "Biryani Masala": "/images/biryani_masala.png",
  "Karahi Masala": "/images/karahi_masala.png",
  "Achar Gosht Masala": "/images/achar_gosht_masala.png",
  "Chicken Tikka Masala": "/images/chicken_tikka_masala.png",
  "Seekh Kabab Masala": "/images/seekh_kabab_masala.png",
  "Malai Boti Masala": "/images/malai_boti_masala.png",
  "Bihari Kabab Masala": "/images/bihari_kabab_masala.png",
  "Karahi Gosht Masala": "/images/karahi_gosht_masala.png",
  "Qorma Masala": "/images/qorma_masala.png",
  "Mix Pickle": "/images/mix_pickle.png",
  "Vermicelli": "/images/vermicelli.png",
};

const getProductImage = (productName: string, index: number) => {
  if (specificImages[productName]) return specificImages[productName];
  
  const placeholders = [
    "/images/product-turmeric.webp",
    "/images/product-salt.webp",
    "/images/pinksalt.jpg",
    "/images/seasemeseedspreview.webp",
  ];
  return placeholders[index % placeholders.length];
};

export default function SpicesPage() {
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
        body { font-family: 'Calibri', sans-serif; background: var(--ivory); margin: 0; }
        
        .serif  { font-family: 'Calibri', sans-serif; }
        .tag    { font-size: clamp(.54rem,1.4vw,.62rem); font-weight: 600; letter-spacing: .24em; text-transform: uppercase; color: var(--gold); }
        .body   { color: var(--md); line-height: 1.8; font-weight: 300; }
        .wrap   { max-width: 1300px; margin: 0 auto; padding: 0 clamp(1rem,5vw,4rem); }
        .sec    { padding: clamp(3rem,7vw,6.5rem) 0; }

        .hero-bg {
          background: var(--forest);
          position: relative; overflow: hidden;
          padding: clamp(6rem,14vw,10rem) 0 clamp(3rem,7vw,5rem);
          min-height: 80svh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── TICKER BAND ── */
        .ticker { position:absolute; bottom:0; left:0; right:0; background:#0D2B4A; border-top:1px solid rgba(200,150,62,.2); overflow:hidden; padding:.75rem 0; z-index:5; }
        .ticker-inner { display:flex; gap:0; white-space:nowrap; animation:tickerScroll 28s linear infinite; }
        .ticker-inner:hover { animation-play-state:paused; }
        .ticker-item { display:inline-flex; align-items:center; gap:.75rem; padding:0 2.5rem; font-size:.65rem; font-weight:600; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,.75); }
        .ticker-dot { width:4px; height:4px; border-radius:50%; background:#C8963E; flex-shrink:0; }
        @keyframes tickerScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }

        /* ── spotlight (alternating) ── */
        .spotlight { display: grid; grid-template-columns: 1fr; min-height: 400px; }
        @media(min-width:900px){ .spotlight { grid-template-columns: 1fr 1fr; min-height: 480px; } }
        .spot-img  { position: relative; min-height: clamp(240px,40vw,480px); overflow: hidden; order: 1; }
        .spot-text { display: flex; flex-direction: column; justify-content: center;
                     padding: clamp(2rem,6vw,5rem) clamp(1.5rem,5vw,5rem); position: relative; overflow: hidden; order: 2; }
        @media(min-width:900px){
          .spotlight.alt-row .spot-img  { order: 2; }
          .spotlight.alt-row .spot-text { order: 1; }
        }
        
        .g-rule { display:block; width:2.25rem; height:1px; background:var(--gold); }
        .g-rule-c { display:block; width:2.25rem; height:1px; background:var(--gold); margin:0 auto; }
      `}</style>

      {/* HERO */}
      <section className="hero-bg">
        <div style={{ position: "absolute", inset: 0 }}>
          <Image src="/images/spices_banner.png" alt="Spices Export" fill style={{ objectFit: "cover" }} priority sizes="100vw" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(11,26,14,.88) 0%,rgba(11,26,14,.62) 100%)" }} />
        </div>
        
        {/* gold top accent */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,#C8963E 40%,transparent)", zIndex:4 }} />

        <div className="wrap" style={{ position:"relative", zIndex:5, textAlign:"center" }}>
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:.9, ease:[.22,1,.36,1] }}>
            <p className="tag" style={{ color:"#C8963E", display:"flex", alignItems:"center", justifyContent:"center", gap:".6rem", marginBottom:"1.1rem" }}>
              <span style={{ display:"inline-block", width:22, height:1, background:"#C8963E" }} />
              Premium Export Range
              <span style={{ display:"inline-block", width:22, height:1, background:"#C8963E" }} />
            </p>

            <h1 className="serif" style={{ fontSize:"clamp(2.4rem,8vw,6.5rem)", fontWeight:300, color:"#fff", letterSpacing:".04em", lineHeight:.92, textTransform:"uppercase", marginBottom:"clamp(1rem,2.5vw,1.5rem)" }}>
              Our <em style={{ fontStyle:"italic", color:"#C8963E" }}>Spices &amp; Masalas</em>
            </h1>

            <p style={{ fontFamily:"'Calibri', sans-serif", fontSize:"clamp(.82rem,1.6vw,1.05rem)", color:"rgba(255,255,255,.62)", maxWidth:560, margin:"0 auto", lineHeight:1.8 }}>
              Sourced from the richest soils of Pakistan, our comprehensive range of raw spices, blended masalas, and condiments are processed to international food safety standards for bulk and retail export.
            </p>
          </motion.div>
        </div>

        {/* Moving strip (Marquee) */}
        <div className="ticker">
          <div className="ticker-inner">
            {[...Array(2)].map((_, rep) => (
              ["100% Export Quality", "Bulk Packaging", "ISO Certified", "Pure & Natural", "Global Shipping"].map((item, i) => (
                <span key={`${rep}-${i}`} className="ticker-item">
                  <span className="ticker-dot" />
                  {item}
                </span>
              ))
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS LIST (ALTERNATING) */}
      <section style={{ background:"#FAF8F4" }}>
        {spicesList.map((productName, i) => {
          const isEven = i % 2 === 0;
          return (
            <div key={i} className={`spotlight ${isEven ? "" : "alt-row"}`} style={{ borderBottom:"1px solid #E8E3DC" }}>
              
              {/* IMAGE COLUMN */}
              <motion.div
                initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true, margin:"-80px" }} transition={{ duration:1 }}
                className="spot-img"
                style={{ padding: "clamp(1.5rem, 4vw, 3.5rem)" }}>
                <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "18px", overflow: "hidden", boxShadow: "0 12px 36px rgba(0,0,0,0.06)" }}>
                  <Image src={getProductImage(productName, i)} alt={productName} fill className="object-cover" sizes="(max-width:900px) 100vw,50vw" />
                </div>
                <div style={{ position:"absolute", inset:0, background: isEven
                  ? "linear-gradient(to right, transparent 60%, #FAF8F4)"
                  : "linear-gradient(to left, transparent 60%, #FAF8F4)",
                  opacity:.25, pointerEvents: "none"
                }} />
              </motion.div>

              {/* TEXT COLUMN */}
              <motion.div
                initial={{ opacity:0, x: isEven ? 30 : -30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true, margin:"-80px" }} transition={{ duration:.9, ease:[.22,1,.36,1] }}
                className="spot-text"
                style={{ background: "#FAF8F4" }}>
                
                <div style={{ position:"relative", zIndex:1 }}>
                  <p className="tag" style={{ display:"flex", alignItems:"center", gap:".55rem", marginBottom:"1rem" }}>
                    <span style={{ display:"inline-block", width:16, height:1, background:"#C8963E" }} />
                    Premium Quality
                  </p>
                  <h2 className="serif" style={{ fontSize:"clamp(2rem,4.5vw,3.5rem)", fontWeight:300, color:"var(--dk)", lineHeight:1, marginBottom:"1.1rem" }}>
                    {productName}
                  </h2>
                  <span className="g-rule" style={{ marginBottom:"1.25rem" }} />
                  <p className="body" style={{ fontSize:"clamp(.84rem,1.8vw,.95rem)", marginBottom:"1rem", maxWidth:400 }}>
                    Experience the authentic taste and aroma of our export-grade {productName.toLowerCase()}. Cultivated in ideal conditions and processed with care to preserve natural essential oils and vibrant flavors.
                  </p>
                  <p style={{ fontFamily:"'Calibri', sans-serif", fontSize:"clamp(.78rem,1.6vw,.85rem)", color:"var(--lt)", marginBottom:"1.75rem" }}>
                    Export Certified · Bulk Packaging Available · Secure Fulfillment
                  </p>
                </div>
              </motion.div>
            </div>
          )
        })}
      </section>
    </>
  )
}
