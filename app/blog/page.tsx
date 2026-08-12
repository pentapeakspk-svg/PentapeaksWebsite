"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { fadeUpVariant, staggerContainer } from "@/lib/animations"
import { Calendar, ArrowRight, Search, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string | null
  author: string
  published: boolean
  createdAt: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await fetch("/api/blog", { cache: 'no-store' })
        const data = await res.json()
        if (data.posts) {
          // Regular users only see published posts
          setPosts(data.posts.filter((p: any) => p.published))
        }
      } catch (err) {
        console.error("Failed to load blogs:", err)
      } finally {
        setLoading(false)
      }
    }
    loadBlogs()
  }, [])

  // Filter dynamic posts by search query
  const filteredPosts = posts.filter(post => {
    const query = searchTerm.toLowerCase()
    return post.title.toLowerCase().includes(query) || post.excerpt.toLowerCase().includes(query)
  })

  // Dynamic layout setup
  const featuredPost = filteredPosts[0] || null
  const gridPosts = filteredPosts.slice(1)

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

        .featured-card { background:linear-gradient(135deg,#fff,#FAF8F4); border:1px solid var(--border); border-radius:16px; overflow:hidden; display:grid; grid-template-columns:1fr; gap:0; }
        @media(min-width:1024px){ .featured-card { grid-template-columns:1fr 1fr; } }
        .featured-img { height:clamp(240px,40vw,360px); background:linear-gradient(135deg,var(--green),var(--leaf)); display:flex; align-items:center; justify-content:center; font-size:4rem; overflow:hidden; position:relative; }
        .featured-content { padding:clamp(2rem,4vw,3rem); display:flex; flex-direction:column; justify-content:center; }
        .featured-tag { font-size:.68rem; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:var(--gold); margin-bottom:.75rem; }
        .featured-title { font-family:'Calibri', sans-serif; font-size:clamp(1.6rem,3.5vw,2.4rem); font-weight:400; color:var(--textdk); margin:0 0 1rem; line-height:1.2; }
        .featured-excerpt { color:var(--textmd); font-size:clamp(.9rem,1.6vw,1rem); margin-bottom:1.5rem; line-height:1.7; }
        .featured-meta { display:flex; align-items:center; gap:1.5rem; flex-wrap:wrap; font-size:.85rem; color:var(--textlt); }

        .search-box { display:flex; align-items:center; gap:.75rem; background:#fff; border:1px solid var(--border); border-radius:10px; padding:clamp(.75rem,2vw,.9rem) clamp(1rem,2vw,1.25rem); margin-bottom:clamp(2rem,4vw,3rem); }
        .search-input { flex:1; border:none; background:none; font-family:'Calibri', sans-serif; font-size:clamp(.88rem,1.8vw,.95rem); color:var(--textdk); outline:none; }
        .search-input::placeholder { color:var(--textlt); }

        .blog-grid { display:grid; grid-template-columns:1fr; gap:clamp(1.25rem,3vw,2rem); }
        @media(min-width:640px){ .blog-grid { grid-template-columns:repeat(2,1fr); } }
        @media(min-width:1024px){ .blog-grid { grid-template-columns:repeat(3,1fr); } }

        .blog-card { display:flex; flex-direction:column; background:#fff; border:1px solid var(--border); border-radius:14px; overflow:hidden; transition:all .35s ease; text-decoration:none; }
        @media(hover:hover){
          .blog-card:hover { transform:translateY(-6px); box-shadow:0 24px 56px rgba(11,26,14,.11); border-color:var(--green); }
        }
        .blog-img { height:clamp(140px,22vw,200px); background:linear-gradient(135deg,var(--green),var(--leaf)); display:flex; align-items:center; justify-content:center; font-size:2.5rem; overflow:hidden; position:relative; }
        .blog-content { padding:clamp(1.25rem,3vw,1.75rem); flex:1; display:flex; flex-direction:column; }
        .blog-meta { display:flex; align-items:center; gap:.75rem; font-size:.75rem; color:var(--textlt); margin-bottom:.875rem; flex-wrap:wrap; }
        .blog-category { font-size:.68rem; background:var(--gold); color:#fff; padding:.25rem .6rem; border-radius:4px; font-weight:600; }
        .blog-title { font-family:'Calibri', sans-serif; font-size:clamp(1.1rem,2.2vw,1.4rem); font-weight:400; color:var(--textdk); margin:0 0 .75rem; line-height:1.2; }
        .blog-excerpt { font-size:.9rem; color:var(--textmd); margin-bottom:1rem; flex:1; line-height:1.6; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .blog-link { color:var(--green); font-size:.9rem; font-weight:600; display:flex; align-items:center; gap:.4rem; transition:gap .3s; }
        @media(hover:hover){
          .blog-card:hover .blog-link { gap:.7rem; }
        }

        .cta-section { background:var(--forest); color:#fff; border-radius:14px; padding:clamp(2rem,5vw,3.5rem); text-align:center; margin-top:clamp(2rem,4vw,4rem); }
        .cta-title { font-family:'Calibri', sans-serif; font-size:clamp(1.4rem,3.5vw,2.2rem); fontWeight:400; margin:0 0 1rem; }
        .cta-text { font-size:clamp(.9rem,1.8vw,1rem); color:rgba(255,255,255,.8); margin-bottom:1.5rem; max-width:500px; margin-left:auto; margin-right:auto; }
        .cta-btn { display:inline-flex; align-items:center; gap:.5rem; background:var(--gold); color:#fff; font-size:clamp(.65rem,1.4vw,.7rem); font-weight:600; letter-spacing:.15em; text-transform:uppercase; padding:clamp(.75rem,2vw,.9rem) clamp(1.25rem,3vw,1.75rem); border-radius:7px; text-decoration:none; transition:all .3s ease; }
        @media(hover:hover){
          .cta-btn:hover { background:#b5832e; transform:translateY(-2px); }
        }

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
          <Image src="/images/Export9.webp" alt="Shipment Logistics Blog" fill style={{ objectFit: "cover" }} priority sizes="100vw" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(5,14,26,.85) 0%,rgba(5,14,26,.65) 100%)" }} />
        </div>
        <div className="relative z-10 sec-wrap" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
          <span className="inline-block px-3 py-1 bg-accent/20 border border-accent/40 rounded-full text-xs font-bold text-accent tracking-wider uppercase mb-4">
            Global Trade Insights
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-[family-name:var(--font-display)] mb-4" style={{ color: "#ffffff" }}>
            Our <span className="font-normal italic serif" style={{ color: "#C9972C" }}>Blog</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Latest analysis, step-by-step guides, regulatory updates, and market perspectives on shipping agricultural commodities worldwide.
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

      {loading ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 bg-white">
          <Loader2 className="w-10 h-10 animate-spin text-accent" />
          <p className="text-text-muted font-medium">Loading articles...</p>
        </div>
      ) : posts.length === 0 ? (
        <section className="sec-pad bg-white">
          <div className="sec-wrap text-center py-16">
            <h2 className="pp-section-heading mb-4">No Articles Published</h2>
            <p className="pp-body max-w-md mx-auto mb-8">
              Check back soon! We are regular trade experts and will publish our premium import/export insights soon.
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* Featured Post */}
          {featuredPost && (
            <section style={{ background:"#fff", borderBottom:"1px solid var(--border)" }}>
              <div className="sec-wrap" style={{ paddingTop:"clamp(2rem,4vw,3.5rem)", paddingBottom:"clamp(2rem,4vw,3.5rem)" }}>
                <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:"-60px" }}>
                  <p className="pp-tag" style={{ marginBottom:"1rem" }}>Featured Article</p>
                  <Link href={`/blog/${featuredPost.slug}`} className="featured-card" style={{ textDecoration:"none", color:"inherit" }}>
                    <div className="featured-img">
                      {featuredPost.coverImage ? (
                        <Image src={featuredPost.coverImage} alt={featuredPost.title} fill style={{ objectFit: "cover" }} />
                      ) : (
                        "📚"
                      )}
                    </div>
                    <div className="featured-content">
                      <span className="featured-tag">Trade Export</span>
                      <h2 className="featured-title">{featuredPost.title}</h2>
                      <p className="featured-excerpt">{featuredPost.excerpt}</p>
                      <div className="featured-meta">
                        <span style={{ display:"flex", alignItems:"center", gap:".4rem" }}>
                          <Calendar style={{ width:14, height:14 }} />
                          {new Date(featuredPost.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                        <span>By {featuredPost.author}</span>
                        <span style={{ marginLeft:"auto" }}>
                          <ArrowRight style={{ width:16, height:16 }} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </section>
          )}

          {/* Search Box */}
          <section style={{ background:"var(--ivory)" }}>
            <div className="sec-wrap" style={{ paddingTop:"clamp(2rem,4vw,3.5rem)", paddingBottom:0 }}>
              <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:"-60px" }}>
                <div className="search-box">
                  <Search style={{ width:18, height:18, color:"var(--textlt)", flexShrink:0 }} />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* Blog Grid */}
          <section className="sec-pad" style={{ background:"var(--ivory)" }}>
            <div className="sec-wrap">
              {gridPosts.length > 0 ? (
                <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-60px" }} className="blog-grid">
                  {gridPosts.map((post) => (
                    <motion.div key={post.slug} variants={fadeUpVariant}>
                      <Link href={`/blog/${post.slug}`} className="blog-card">
                        <div className="blog-img">
                          {post.coverImage ? (
                            <Image src={post.coverImage} alt={post.title} fill style={{ objectFit: "cover" }} />
                          ) : (
                            "📝"
                          )}
                        </div>
                        <div className="blog-content">
                          <div className="blog-meta">
                            <span className="blog-category">Trade</span>
                            <Calendar style={{ width:14, height:14 }} />
                            {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                          </div>
                          <h3 className="blog-title">{post.title}</h3>
                          <p className="blog-excerpt">{post.excerpt}</p>
                          <span className="blog-link">
                            Read More <ArrowRight style={{ width:14, height:14 }} />
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                searchTerm && (
                  <div style={{ textAlign:"center", padding:"clamp(2rem,5vw,4rem) 0" }}>
                    <p className="pp-body" style={{ fontSize:"1rem" }}>No matching articles found. Try another search query.</p>
                  </div>
                )
              )}
            </div>
          </section>
        </>
      )}

      {/* CTA Section */}
      <section className="sec-pad" style={{ background:"var(--ivory)" }}>
        <div className="sec-wrap">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:"-60px" }} className="cta-section">
            <h2 className="cta-title">Start Your Export Journey Today</h2>
            <p className="cta-text">
              Get expert guidance from our mentorship program and learn how to successfully export Pakistani products globally.
            </p>
            <Link href="/mentorship" className="cta-btn">
              Explore Mentorship <ArrowRight style={{ width:13, height:13 }} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
