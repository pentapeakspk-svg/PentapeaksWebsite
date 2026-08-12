"use client"

import { useState, useEffect } from "react"
import { Save, Loader2, Presentation } from "lucide-react"
import { prefetch, invalidate } from "@/lib/admin-cache"

export default function DemoClassConfigPage() {
  const [isActive, setIsActive] = useState(false)
  const [heading, setHeading] = useState("")
  const [details, setDetails] = useState("")
  const [detailsRoman, setDetailsRoman] = useState("")
  const [detailsUrdu, setDetailsUrdu] = useState("")
  const [whatsappLink, setWhatsappLink] = useState("")
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const data = await prefetch("/api/demo-class/config")
      if (data.config) {
        setIsActive(data.config.isActive)
        setHeading(data.config.heading)
        setDetails(data.config.details)
        setDetailsRoman(data.config.detailsRoman || "")
        setDetailsUrdu(data.config.detailsUrdu || "")
        setWhatsappLink(data.config.whatsappLink)
      }
    } catch (error) {
      console.error("Failed to fetch demo class config", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage({ text: "", type: "" })
    try {
      const res = await fetch("/api/demo-class/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive, heading, details, detailsRoman, detailsUrdu, whatsappLink })
      })
      
      if (!res.ok) throw new Error("Failed to save configuration")
      setMessage({ text: "Configuration saved successfully!", type: "success" })
      invalidate("/api/demo-class/config")
    } catch (error) {
      console.error(error)
      setMessage({ text: "Failed to update configuration. Please try again.", type: "error" })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 sm:p-8 md:p-12 max-w-7xl mx-auto flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-8 md:p-12 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-text-heading flex items-center gap-3">
          <Presentation className="w-8 h-8 text-primary" />
          Demo Class Configuration
        </h1>
        <p className="text-text-muted">Manage the demo class section shown on the mentorship page.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border-light max-w-3xl">
        <div className="space-y-6">
          
          <div className="flex items-center gap-3 pb-4 border-b border-border-light">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 rounded border-border-light text-primary focus:ring-primary"
            />
            <label htmlFor="isActive" className="text-lg font-medium text-text-heading cursor-pointer">
              Enable Demo Class Section
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-text-body">Heading</label>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none"
              placeholder="e.g. Join our free Demo Class"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-text-body">Details (English)</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-border-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none resize-y"
              placeholder="Enter details about the demo class in English..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-text-body">Details (Roman Urdu)</label>
            <textarea
              value={detailsRoman}
              onChange={(e) => setDetailsRoman(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-border-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none resize-y"
              placeholder="Enter details about the demo class in Roman Urdu..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-text-body">Details (Urdu)</label>
            <textarea
              value={detailsUrdu}
              onChange={(e) => setDetailsUrdu(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-border-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none resize-y text-right"
              dir="rtl"
              placeholder="ڈیمو کلاس کی تفصیلات درج کریں..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-text-body">WhatsApp Community Link</label>
            <input
              type="url"
              value={whatsappLink}
              onChange={(e) => setWhatsappLink(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none"
              placeholder="https://chat.whatsapp.com/..."
            />
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl text-sm font-medium ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isSaving ? "Saving..." : "Save Configuration"}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
