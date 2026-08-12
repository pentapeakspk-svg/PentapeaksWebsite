"use client"
import { use, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ShoppingCart, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { getProductBySlug, getProductsByCategory } from "@/data/products"

const catImages: Record<string, string> = {
  rice: "/images/product-rice.webp",
  fruits: "/images/product-mangoes.webp",
  vegetables: "/images/product-potatoes.webp",
  grains: "/images/product-corn.webp",
  "animal-feed": "/images/product-corn.webp",
  seeds: "/images/product-salt.webp",
}

export default function OrderProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const product = getProductBySlug(slug)
  const relatedProducts = getProductsByCategory(product?.category || "rice").filter(p => p.slug !== slug).slice(0, 3)

  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    variety: product?.varieties?.[0] || ""
  })

  useEffect(() => {
    if (product?.varieties && product?.images) {
      const index = product.varieties.indexOf(formData.variety)
      if (index !== -1 && product.images[index]) {
        setSelectedImage(product.images[index])
      }
    }
  }, [formData.variety, product])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  if (!product) return notFound()

  // Fake unit price for demonstration purposes
  const unitPrice = 120.00
  const totalPrice = unitPrice * quantity

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.name,
          productSlug: product.slug,
          quantity,
          unitPrice,
          totalPrice,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress: formData.address,
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to place order")
      
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

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

      <div className="sec-wrap pt-32 pb-12">
        <Link href="/our-products" className="inline-flex items-center gap-2 text-primary hover:text-accent font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Specialty Products
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-border-light overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Product Details Side */}
            <div className="p-8 lg:p-12 bg-primary-pale/30 border-b lg:border-b-0 lg:border-r border-border-light">
              <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-4 shadow-md bg-white">
                <Image 
                  src={
                    selectedImage ||
                    ((product.slug === 'premium-leather-gloves' && formData.variety === 'Working Gloves') ? "/images/Products/Gloves.jpeg" :
                    (product.slug === 'premium-leather-gloves' && formData.variety === 'Welding Gloves') ? "/images/Products/Gloves02.jpeg" :
                    (product.slug === 'premium-leather-gloves' && formData.variety === 'Driving Gloves') ? "/images/Products/Gloves04.jpeg" :
                    (product.slug === 'premium-leather-gloves' && formData.variety === 'Winter Gloves') ? "/images/Products/Gloves06.jpeg" :
                    (product.slug === 'premium-leather-gloves' && formData.variety === 'Mechanic Gloves') ? "/images/Products/Gloves08.jpeg" :
                    (product.images[0] || catImages[product.category] || "/images/product-rice.webp"))
                  } 
                  alt={`${product.name} - ${formData.variety || 'Default'}`} 
                  fill 
                  className="object-contain p-4"
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">
                  {product.images.map((img, idx) => {
                    const isSelected = selectedImage === img || (!selectedImage && idx === 0);
                    return (
                      <button 
                        key={idx} 
                        onClick={() => setSelectedImage(img)}
                        className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 transition-all ${isSelected ? 'ring-2 ring-primary ring-offset-1' : 'opacity-70 hover:opacity-100'}`}
                      >
                        <Image src={img} alt={`${product.name} thumbnail ${idx + 1}`} fill className="object-contain bg-white" />
                      </button>
                    )
                  })}
                </div>
              )}
              <span className="inline-block px-3 py-1 bg-white border border-border-light rounded-full text-xs font-bold text-accent tracking-wider uppercase mb-4">
                {product.category.replace("-", " ")}
              </span>
              <h1 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-display)] text-text-dark mb-4">
                {product.name}
              </h1>
              
              <div className="space-y-4 text-text-body">
                <p>{product.description[0]}</p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-light">
                  <div>
                    <span className="block text-xs text-text-muted uppercase tracking-wider font-bold mb-1">HS Code</span>
                    <span className="font-medium text-text-dark">{product.hsCode}</span>
                  </div>
                  {product.moq && (
                    <div>
                      <span className="block text-xs text-text-muted uppercase tracking-wider font-bold mb-1">MOQ</span>
                      <span className="font-medium text-text-dark">{product.moq}</span>
                    </div>
                  )}
                </div>

                {product.slug === 'himalayan-shilajit' && (
                  <div className="mt-8 pt-6 border-t border-border-light">
                    <h3 className="text-lg font-bold text-text-dark mb-3">Lab Test Report</h3>
                    <p className="text-sm text-text-muted mb-4">Certified for purity, heavy metals, and fulvic acid content.</p>
                    <div className="relative w-full h-80 rounded-lg overflow-hidden border border-border-light shadow-sm">
                      <Image 
                        src="/images/shilajit-test-report.jpg" 
                        alt="Shilajit Lab Test Report" 
                        fill 
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Form Side */}
            <div className="p-8 lg:p-12">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-dark mb-6 flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-primary" /> Checkout
              </h2>

              {success ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center h-full flex flex-col justify-center items-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Order Placed!</h3>
                  <p className="text-green-700 mb-6">
                    Thank you, {formData.name}. Your order for {quantity}x {product.name} has been successfully placed. We will contact you shortly regarding shipping and payment details.
                  </p>
                  <button onClick={() => window.location.href = '/our-products'} className="btn-primary">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">{error}</div>}
                  
                  {product.varieties && product.varieties.length > 0 && (
                    <div>
                      <label className="block text-sm font-bold text-text-dark mb-2">Select Variety</label>
                      <select 
                        className="input-field"
                        value={formData.variety}
                        onChange={(e) => setFormData({...formData, variety: e.target.value})}
                        required
                      >
                        {product.varieties.map(v => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-text-dark mb-2">Quantity</label>
                    <div className="flex items-center gap-4">
                      <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg border border-border-light flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">-</button>
                      <input 
                        type="number" 
                        min="1" 
                        value={quantity} 
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 text-center input-field !mb-0"
                      />
                      <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg border border-border-light flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">+</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-text-dark mb-2">Full Name</label>
                      <input required type="text" className="input-field" placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-text-dark mb-2">Email</label>
                      <input required type="email" className="input-field" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text-dark mb-2">Phone Number</label>
                    <input required type="tel" className="input-field" placeholder="+1 234 567 8900" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text-dark mb-2">Shipping Address</label>
                    <textarea required className="input-field min-h-[100px]" placeholder="Full delivery address including country" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
                  </div>

                  <div className="pt-6 border-t border-border-light">
                    <button type="submit" disabled={submitting} className="btn-primary w-full text-lg py-4 flex justify-center items-center gap-2">
                      {submitting ? "Processing..." : (
                        <><ShoppingCart className="w-5 h-5" /> Place Order Securely</>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        
        {product.images && product.images.length > 1 && (
          <div className="mt-12 bg-white rounded-2xl p-6 md:p-10 border border-border-light shadow-sm">
            <h3 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-dark mb-6">Product Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {product.images.map((img, idx) => (
                  <div key={idx} className="relative h-40 md:h-48 rounded-xl overflow-hidden border border-border-light shadow-sm group">
                     <Image src={img} alt={`${product.name} gallery ${idx + 1}`} fill className="object-contain bg-gray-50 group-hover:scale-110 transition-transform duration-500" />
                  </div>
               ))}
            </div>
          </div>
        )}
        </div>

        {/* ══════ RELATED PRODUCTS ══════ */}
        {relatedProducts.length > 0 && (
          <div className="sec-wrap pb-20 mt-12">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-dark mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
              {relatedProducts.map((rp) => (
                <Link key={rp.id} href={`/our-products/${rp.slug}`} className="group bg-white rounded-xl border border-border-light overflow-hidden shadow-sm hover:shadow-md transition-all block hover:-translate-y-1">
                  <div className="relative h-36 md:h-48 w-full overflow-hidden bg-white">
                    <Image 
                      src={rp.images[0] || catImages[rp.category] || "/images/product-rice.webp"} 
                      alt={rp.name} 
                      fill 
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                  <div className="p-4 md:p-6 border-t border-border-light">
                    <span className="text-[0.65rem] font-bold text-accent tracking-wider uppercase mb-1 block">HS: {rp.hsCode}</span>
                    <h3 className="text-sm md:text-lg font-bold text-text-dark mb-2">{rp.name}</h3>
                    <span className="text-primary text-[0.7rem] md:text-xs font-semibold flex items-center gap-1">View Details <ArrowRight className="w-3 h-3" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    )
  }
