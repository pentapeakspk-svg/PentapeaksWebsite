"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Send, CheckCircle } from "lucide-react"
import { products } from "@/data/products"

export default function BuyerPage() {
  const [form, setForm] = useState({ buyerName: "", companyName: "", email: "", phone: "", country: "", product: "", quantity: "", unit: "MT", deliveryPort: "", paymentTerms: "", targetPrice: "", message: "" })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/buyer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry")
      }

      setSuccess(true)
    } catch (error) {
      console.error("[buyer page] submit error:", error)
      setError(error instanceof Error ? error.message : "Failed to submit inquiry")
    } finally { setLoading(false) }
  }

  if (success) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        :root {
          --ivory: #FAF8F4; --forest: #0B1A0E; --green: #1C5230; --gold: #C8963E;
          --border: #DDD8CF; --textdk: #16261A; --textmd: #4A5D4C; --textlt: #8A9E8B;
        }
        body { font-family: 'Calibri', sans-serif; background: var(--ivory); margin: 0; }
      `}</style>
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem" }}>
        <motion.div initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:.6 }}
          style={{ background:"#fff", border:"1px solid var(--border)", borderRadius:16, padding:"clamp(2rem,6vw,3.5rem)", textAlign:"center", maxWidth:500, width:"100%", boxShadow:"0 24px 64px rgba(11,26,14,.07)" }}>
          <div style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,var(--green),#2A7A4B)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.5rem" }}>
            <CheckCircle style={{ width:30, height:30, color:"#fff" }} />
          </div>
          <h2 style={{ fontFamily:"'Calibri', sans-serif", fontSize:"clamp(1.4rem,3.5vw,1.8rem)", fontWeight:400, color:"var(--textdk)", marginBottom:".5rem" }}>Inquiry Submitted!</h2>
          <p style={{ color:"var(--textmd)", fontSize:"clamp(.9rem,1.8vw,1rem)" }}>Our team will respond with pricing and availability within 24 hours.</p>
        </motion.div>
      </div>
    </>
  )

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

        .form-container { background:#fff; border:1px solid var(--border); border-radius:14px; padding:clamp(1.75rem,4vw,2.5rem); max-width:680px; margin:0 auto; }
        .form-group { margin-bottom:clamp(1.25rem,3vw,1.75rem); }
        .form-label { display:block; font-size:clamp(.8rem,1.6vw,.88rem); color:var(--textmd); margin-bottom:.5rem; font-weight:500; }
        .form-input, .form-textarea, .form-select { width:100%; padding:clamp(.75rem,2vw,.875rem) 1rem; background:var(--ivory); border:1px solid var(--border); border-radius:8px; font-family:'Calibri', sans-serif; font-size:clamp(.85rem,1.8vw,.95rem); color:var(--textdk); outline:none; transition:all .3s ease; }
        .form-input::placeholder, .form-textarea::placeholder { color:var(--textlt); }
        .form-input:focus, .form-textarea:focus, .form-select:focus { border-color:var(--green); box-shadow:0 0 0 3px rgba(28,82,48,.08); }
        .form-textarea { resize:none; }

        .form-row { display:grid; grid-template-columns:1fr; gap:clamp(.875rem,2vw,1.1rem); }
        @media(min-width:540px){ .form-row { grid-template-columns:1fr 1fr; } }

        .submit-btn { width:100%; background:var(--forest); color:#fff; font-family:'Calibri', sans-serif; font-size:clamp(.65rem,1.4vw,.7rem); font-weight:600; letter-spacing:.18em; text-transform:uppercase; padding:clamp(.85rem,2.5vw,1rem); border-radius:8px; border:none; cursor:pointer; transition:all .3s ease; display:flex; align-items:center; justify-content:center; gap:.5rem; }
        @media(hover:hover){
          .submit-btn:hover:not(:disabled) { background:var(--green); transform:translateY(-2px); }
        }
        .submit-btn:disabled { opacity:.6; cursor:not-allowed; }
      `}</style>

      <section className="sec-pad" style={{ background:"var(--ivory)" }}>
        <div className="sec-wrap">
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} style={{ textAlign:"center", marginBottom:"clamp(2rem,5vw,3.5rem)" }}>
            <p className="pp-tag" style={{ marginBottom:".9rem" }}>Buyer Portal</p>
            <h1 className="pp-section-heading" style={{ marginBottom:".9rem" }}>
              Bulk Buying <em style={{ fontStyle:"italic", color:"var(--green)" }}>Inquiry</em>
            </h1>
            <span className="gold-rule-c" />
            <p className="pp-body" style={{ maxWidth:500, margin:"1rem auto 0", fontSize:".95rem" }}>
              Request a quote for premium Pakistani agricultural products.
            </p>
          </motion.div>

          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:"-60px" }} className="form-container">
            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"clamp(1.1rem,2.5vw,1.5rem)" }}>
              <div className="form-row">
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Your Name / آپ کا نام *</label>
                  <input required className="form-input" value={form.buyerName} onChange={e => setForm(p => ({ ...p, buyerName: e.target.value }))} />
                </div>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Company Name / کمپنی کا نام</label>
                  <input className="form-input" value={form.companyName} onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Email / ای میل *</label>
                  <input type="email" required className="form-input" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Phone / فون نمبر *</label>
                  <input required className="form-input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Country / ملک *</label>
                <input required className="form-input" value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} />
              </div>

              <div className="form-group">
                <label className="form-label">Product Required / مطلوبہ پروڈکٹ *</label>
                <select required className="form-select" value={form.product} onChange={e => setForm(p => ({ ...p, product: e.target.value }))}>
                  <option value="">Select a product</option>
                  {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Quantity / مقدار *</label>
                  <input required className="form-input" placeholder="e.g., 50" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} />
                </div>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Unit / یونٹ *</label>
                  <select className="form-select" value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}>
                    {["MT", "KG", "Tons", "Cartons", "Containers"].map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Port / ڈلیوری پورٹ</label>
                <input className="form-input" placeholder="e.g., Jebel Ali, UAE" value={form.deliveryPort} onChange={e => setForm(p => ({ ...p, deliveryPort: e.target.value }))} />
              </div>

              <div className="form-row">
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Payment Terms / ادائیگی کی شرائط</label>
                  <select className="form-select" value={form.paymentTerms} onChange={e => setForm(p => ({ ...p, paymentTerms: e.target.value }))}>
                    <option value="">Select</option>
                    {["LC", "TT", "CAD", "Others"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Target Price / ٹارگٹ قیمت</label>
                  <input className="form-input" placeholder="per MT/KG" value={form.targetPrice} onChange={e => setForm(p => ({ ...p, targetPrice: e.target.value }))} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Additional Requirements / مزید ضروریات</label>
                <textarea rows={4} className="form-textarea" placeholder="e.g., Need halal certified, phytosanitary cert" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
              </div>

              <button type="submit" disabled={loading} className="submit-btn" style={{ marginTop:"clamp(.5rem,1vw,.75rem)" }}>
                {loading ? "Submitting..." : <>Submit Inquiry <Send style={{ width:14, height:14 }} /></>}
              </button>

              {error && <p style={{ color:"#dc2626", fontSize:".82rem", marginTop:".25rem" }}>{error}</p>}
            </form>
          </motion.div>
        </div>
      </section>
    </>
  )
}
