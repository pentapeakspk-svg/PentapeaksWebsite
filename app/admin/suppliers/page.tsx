"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Package, Download, Search } from "lucide-react"
import { prefetch } from "@/lib/admin-cache"

interface Supplier { id: string; companyName: string; contactPerson: string; email: string; phone: string; country: string; products: string; exportCapacity: string; certifications: string | null; createdAt: string }

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const data = await prefetch("/api/supplier")
        setSuppliers(data.suppliers || [])
        setError("")
      } catch (error) {
        console.error("[admin/suppliers] fetch error:", error)
        setError(error instanceof Error ? error.message : "Failed to load supplier submissions")
        setSuppliers([])
      }
    }

    loadSuppliers()
  }, [])

  const filtered = suppliers.filter(s => !search || s.companyName.toLowerCase().includes(search.toLowerCase()) || s.products.toLowerCase().includes(search.toLowerCase()))

  const exportCSV = () => {
    const csv = "Company,Contact,Email,Phone,Country,Products,Capacity,Certifications,Date\n" + filtered.map(s =>
      `"${s.companyName}","${s.contactPerson}",${s.email},${s.phone},${s.country},"${s.products}",${s.exportCapacity},"${s.certifications || ""}",${new Date(s.createdAt).toLocaleDateString()}`
    ).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "suppliers.csv"; a.click()
  }

  return (
    <div className="pt-24 pb-16 bg-gray-bg min-h-screen">
      <div className="max-w-full mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-[clamp(0.75rem,1.5vw,1rem)]">
            <h1 className="text-3xl font-bold font-[family-name:var(--font-display)] text-text-dark"><Package className="w-8 h-8 text-primary inline mr-2" />Supplier Submissions</h1>
            <button onClick={exportCSV} className="btn-outline text-sm"><Download className="w-4 h-4" /> Export CSV</button>
          </div>
          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input className="input-field" style={{ paddingLeft: "2.75rem" }} placeholder="Search by company or product..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <div className="admin-card overflow-x-auto" style={{padding:0}}>
            <table className="table-premium whitespace-nowrap">
              <thead><tr><th>#</th><th>Company</th><th>Contact</th><th>Email</th><th>Phone</th><th>Country</th><th>Products</th><th>Capacity</th><th>Certifications</th><th>Date</th></tr></thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={10} className="text-center py-8 text-text-muted">No supplier submissions yet.</td></tr>
                ) : filtered.map((s, i) => (
                  <tr key={s.id}><td>{i + 1}</td><td className="text-primary">{s.companyName}</td><td>{s.contactPerson}</td><td className="text-text-muted">{s.email}</td><td>{s.phone}</td><td>{s.country}</td><td className="max-w-48 truncate">{s.products}</td><td>{s.exportCapacity}</td><td>{s.certifications || "-"}</td><td className="text-text-muted">{new Date(s.createdAt).toLocaleDateString()}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
