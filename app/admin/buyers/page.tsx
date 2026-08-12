"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Download, Search } from "lucide-react"
import { prefetch } from "@/lib/admin-cache"

interface Buyer { id: string; buyerName: string; companyName: string | null; email: string; phone: string; country: string; product: string; quantity: string; unit: string; deliveryPort: string | null; paymentTerms: string | null; createdAt: string }

export default function AdminBuyersPage() {
  const [buyers, setBuyers] = useState<Buyer[]>([])
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const loadBuyers = async () => {
      try {
        const data = await prefetch("/api/buyer")
        setBuyers(data.inquiries || [])
        setError("")
      } catch (error) {
        console.error("[admin/buyers] fetch error:", error)
        setError(error instanceof Error ? error.message : "Failed to load buyer inquiries")
        setBuyers([])
      }
    }

    loadBuyers()
  }, [])

  const filtered = buyers.filter(b => !search || b.buyerName.toLowerCase().includes(search.toLowerCase()) || b.product.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="pt-24 pb-16 bg-gray-bg min-h-screen">
      <div className="max-w-full mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-[clamp(0.75rem,1.5vw,1rem)]">
            <h1 className="text-3xl font-bold font-[family-name:var(--font-display)] text-text-dark"><ShoppingCart className="w-8 h-8 text-primary inline mr-2" />Buyer Inquiries</h1>
          </div>
          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input className="input-field" style={{ paddingLeft: "2.75rem" }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <div className="admin-card overflow-x-auto" style={{padding:0}}>
            <table className="table-premium whitespace-nowrap">
              <thead><tr><th>#</th><th>Name</th><th>Company</th><th>Email</th><th>Country</th><th>Product</th><th>Qty</th><th>Unit</th><th>Port</th><th>Payment</th><th>Date</th></tr></thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={11} className="text-center py-8 text-text-muted">No buyer inquiries yet.</td></tr>
                ) : filtered.map((b, i) => (
                  <tr key={b.id}><td>{i + 1}</td><td className="text-primary">{b.buyerName}</td><td>{b.companyName || "-"}</td><td className="text-text-muted">{b.email}</td><td>{b.country}</td><td>{b.product}</td><td>{b.quantity}</td><td>{b.unit}</td><td>{b.deliveryPort || "-"}</td><td>{b.paymentTerms || "-"}</td><td className="text-text-muted">{new Date(b.createdAt).toLocaleDateString()}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
