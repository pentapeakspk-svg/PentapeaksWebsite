import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { products } from "@/data/products"

const catImages: Record<string, string> = {
  rice: "/images/product-rice.webp",
  fruits: "/images/product-mangoes.webp",
  vegetables: "/images/product-potatoes.webp",
  grains: "/images/product-corn.webp",
  "animal-feed": "/images/product-corn.webp",
  seeds: "/images/product-salt.webp",
}

export default function OurProductsPage() {
  return (
    <div className="bg-gray-bg min-h-screen">
      <style>{`
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
          <Image src="/images/Export5.webp" alt="Shipment Logistics" fill style={{ objectFit: "cover" }} priority sizes="100vw" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(5,14,26,.85) 0%,rgba(5,14,26,.65) 100%)" }} />
        </div>
        <div className="relative z-10 sec-wrap" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
          <span className="inline-block px-3 py-1 bg-accent/20 border border-accent/40 rounded-full text-xs font-bold text-accent tracking-wider uppercase mb-4">
            Secure Direct Orders
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-[family-name:var(--font-display)] mb-4" style={{ color: "#ffffff" }}>
            Specialty <span className="font-normal italic serif" style={{ color: "#C9972C" }}>Products</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Select from our premium, certified natural compounds and specialized agricultural products to place a direct export order.
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

      <div className="sec-wrap py-16">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.filter(p => ['supplements', 'salt-lamps', 'gloves'].includes(p.category)).map(product => (
            <div key={product.id} className="bg-white border border-border-light rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group flex flex-col max-w-md">
              <div className="relative h-72 overflow-hidden">
                <Image 
                  src={product.images[0] || "/images/product-rice.webp"} 
                  alt={product.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-accent tracking-wider uppercase">{product.category.replace("-", " ")}</span>
                  <span className="text-xs text-text-muted">HS: {product.hsCode}</span>
                </div>
                <h3 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-dark mb-3">{product.name}</h3>
                <p className="text-sm text-text-muted line-clamp-4 mb-8 flex-1 leading-relaxed">
                  {product.description[0]}
                </p>
                
                <Link 
                  href={`/our-products/${product.slug}`}
                  className="btn-primary w-full flex justify-center items-center gap-2 py-4"
                >
                  <ShoppingCart className="w-5 h-5" /> Order Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
