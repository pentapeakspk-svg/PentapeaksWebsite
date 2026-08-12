"use client"
import { useSession } from "next-auth/react"
import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { fadeUpVariant, staggerContainer } from "@/lib/animations"
import { 
  MessageSquare, Send, ArrowLeft, Shield, RefreshCw, Sparkles, 
  BookOpen, Building, Package, Ship, Globe, Award, Phone, Mail, CheckCircle2 
} from "lucide-react"
import Link from "next/link"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function StudentCounselorPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState<"English" | "Urdu/Hindi" | "Spanish">("English")
  const [initializing, setInitializing] = useState(true)
  const [error, setError] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load welcome message on mount/language change
  useEffect(() => {
    const loadWelcome = async () => {
      setInitializing(true)
      try {
        const res = await fetch(`/api/student/counselor?language=${encodeURIComponent(language)}`, { cache: "no-store" })
        const data = await res.json()
        if (res.ok && data.welcome) {
          setMessages([
            {
              role: "assistant",
              content: data.welcome
            }
          ])
        } else {
          throw new Error(data.error || "Failed to load welcome message.")
        }
      } catch (err: any) {
        console.error("Welcome load error:", err)
        setError("Could not establish connection to the assistant. Please try again.")
      } finally {
        setInitializing(false)
      }
    }

    if (session) {
      loadWelcome()
    }
  }, [language, session])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const handleSend = async (e?: React.FormEvent, customMsg?: string) => {
    e?.preventDefault()
    const textToSend = customMsg || input
    if (!textToSend.trim() || loading) return

    if (!customMsg) setInput("")
    setError("")

    // Add user message
    const userMsg: Message = { role: "user", content: textToSend }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setLoading(true)

    try {
      const res = await fetch("/api/student/counselor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: updatedMessages,
          sessionData: { language }
        })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to retrieve assistant response.")
      }

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: data.reply
        }
      ])
    } catch (err: any) {
      console.error("Message processing error:", err)
      setError(err.message || "Something went wrong. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  if (!session) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F4] px-4">
      <style>{`
        
        .serif-font { font-family: 'Calibri', sans-serif; }
        .sans-font { font-family: 'Calibri', sans-serif; }
      `}</style>
      <div className="text-center bg-white p-8 rounded-2xl border border-[#DDD8CF] shadow-lg max-w-md w-full sans-font">
        <div className="w-16 h-16 rounded-full bg-[#1C5230]/10 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-[#1C5230]" />
        </div>
        <h2 className="text-2xl font-bold mb-3 text-[#0F1C0B] serif-font">Access Restricted</h2>
        <p className="text-sm text-[#3D4F52] mb-6 leading-relaxed">Please log in to the Student Portal to connect with our professional AI Trade & Mentorship Assistant.</p>
        <Link href="/student/login" className="inline-flex items-center justify-center bg-[#1C5230] text-white font-semibold text-xs tracking-wider uppercase px-8 py-3.5 rounded-lg hover:bg-[#0B1A0E] transition-all w-full shadow-md">
          Student Login
        </Link>
      </div>
    </div>
  )

  return (
    <div className="pt-32 pb-20 bg-[#F7F4EE] min-h-screen sans-font">
      <style>{`
        
        .serif-font { font-family: 'Calibri', sans-serif; }
        .sans-font { font-family: 'Calibri', sans-serif; }
        .gold-underline { width: 3rem; height: 2px; background: linear-gradient(90deg, #C9972C, #E8B84B); border-radius: 2px; }
      `}</style>

      <div className="max-w-[1320px] mx-auto px-[clamp(1.25rem,5vw,4.5rem)]">
        
        {/* Cinematic Header Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <Link href="/student/dashboard" className="inline-flex items-center gap-2 text-xs text-[#4A5D4C] hover:text-[#1C5230] font-bold tracking-wider uppercase mb-3 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-semibold text-[#0F1C0B] serif-font flex items-center gap-2">
              AI Trade & Mentorship Assistant <Sparkles className="w-6 h-6 text-[#C9972C] animate-pulse" />
            </h1>
            <div className="gold-underline mt-2.5" />
          </div>

          {/* Language selector matching home-page aesthetics */}
          <div className="flex items-center self-start md:self-center gap-1.5 bg-[#F7F4EE] p-1.5 rounded-xl border border-[#D8D2C7] text-xs shadow-sm">
            {(["English", "Urdu/Hindi", "Spanish"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                  language === lang 
                    ? "bg-[#1C5230] text-white shadow-[0_4px_12px_rgba(28,82,48,0.2)]" 
                    : "text-[#4A5D4C] hover:text-[#0F1C0B]"
                }`}
              >
                {lang === "Urdu/Hindi" ? "Urdu (رومن)" : lang}
              </button>
            ))}
          </div>
        </div>

        {/* Breathtaking Responsive 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* ── Left Sidebar (Corporate Intelligence Overview) - Hidden on Mobile/Tablet ── */}
          <div className="hidden lg:block lg:col-span-4 space-y-6">
            
            {/* Commodity Sourcing Card */}
            <div className="bg-white rounded-2xl border border-[#D8D2C7] p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1C5230] group-hover:bg-[#C9972C] transition-colors" />
              <h3 className="font-bold text-base text-[#0F1C0B] serif-font mb-4 flex items-center gap-2.5">
                <Package className="w-5 h-5 text-[#1C5230]" /> Export Commodities
              </h3>
              <ul className="space-y-3.5">
                {[
                  { title: "Basmati Rice", desc: "Premium 1121 Grain, sorted & polished" },
                  { title: "Himalayan Pink Salt", desc: "98% chemical-free organic mineral" },
                  { title: "Fruits & Citrus", desc: "Kinnow & Chaunsa/Sindhri fresh mangoes" },
                  { title: "Fresh Vegetables", desc: "Potatoes, Onions, and Corn steady supply" }
                ].map(item => (
                  <li key={item.title} className="flex gap-3 items-start text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#1C5230] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#0F1C0B] block">{item.title}</strong>
                      <span className="text-[#7A8E92]">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Corporate Capability Card */}
            <div className="bg-white rounded-2xl border border-[#D8D2C7] p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#C9972C] group-hover:bg-[#1C5230] transition-colors" />
              <h3 className="font-bold text-base text-[#0F1C0B] serif-font mb-4 flex items-center gap-2.5">
                <Ship className="w-5 h-5 text-[#C9972C]" /> Global Logistics
              </h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-[#FAF8F4] rounded-xl border border-[#DDD8CF]">
                  <h4 className="text-xl font-bold text-[#1C5230] serif-font">15+</h4>
                  <p className="text-[10px] uppercase font-bold text-[#7A8E92] tracking-wider">Countries</p>
                </div>
                <div className="p-3 bg-[#FAF8F4] rounded-xl border border-[#DDD8CF]">
                  <h4 className="text-xl font-bold text-[#1C5230] serif-font">150+</h4>
                  <p className="text-[10px] uppercase font-bold text-[#7A8E92] tracking-wider">Global Buyers</p>
                </div>
              </div>
            </div>

            {/* Contact details */}
            <div className="bg-[#1C5230] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-emerald-800/40 rounded-full blur-2xl pointer-events-none" />
              <h3 className="font-bold text-base serif-font mb-4 flex items-center gap-2.5">
                <Globe className="w-5 h-5 text-[#C9972C]" /> Penta Peaks HQ
              </h3>
              <div className="space-y-3.5 text-xs text-emerald-100 font-light">
                <p className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#C9972C]" /> info@pentapeaks.com
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#C9972C]" /> +923086222283
                </p>
              </div>
            </div>

          </div>

          {/* ── Right Column (High-End Chat Interface Box) ── */}
          <div className="col-span-1 lg:col-span-8 flex flex-col">
            
            <div className="bg-white rounded-2xl border border-[#D8D2C7] shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] flex flex-col h-[70vh] min-h-[500px] overflow-hidden relative">
              
              {/* Box Header Banner */}
              <div className="px-6 py-4 bg-[#0F1C0B] text-white border-b border-[#2A7A4B]/20 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-950 flex items-center justify-center border border-emerald-800 relative">
                    <Sparkles className="w-5 h-5 text-[#C9972C]" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#0F1C0B] rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5 serif-font tracking-wide">
                      Penta Peaks AI Trade Advisor <Sparkles className="w-3.5 h-3.5 text-[#C9972C]" />
                    </h3>
                    <p className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">Verified Trade Assistant</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 bg-emerald-950/70 px-3.5 py-1.5 rounded-lg border border-emerald-800/80 text-xs">
                  <Award className="w-4 h-4 text-[#C9972C]" />
                  <span className="text-emerald-300 font-bold tracking-wide">ISO & TDAP Compliant</span>
                </div>
              </div>

              {/* Messages viewport */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-white to-[#FAF8F4]/60">
                {initializing ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <RefreshCw className="w-8 h-8 text-[#1C5230] animate-spin mb-3" />
                    <p className="text-sm text-[#7A8E92] font-semibold">Connecting to commodities database...</p>
                  </div>
                ) : (
                  <>
                    <AnimatePresence initial={false}>
                      {messages.map((msg, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                        >
                          <span className="text-[9px] text-[#7A8E92] mb-1 px-1 font-bold uppercase tracking-wider">
                            {msg.role === "user" ? "You" : "Assistant"}
                          </span>

                          <div
                            className={`rounded-2xl px-5 py-3.5 max-w-[85%] text-xs md:text-sm leading-relaxed shadow-sm ${
                              msg.role === "user"
                                ? "bg-[#1C5230] text-white rounded-tr-none font-medium"
                                : "bg-white border border-[#D8D2C7] text-[#0F1C0B] rounded-tl-none font-normal"
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {loading && (
                      <div className="flex items-center gap-2 text-xs md:text-sm text-[#4A5D4C] italic ml-1 font-semibold">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1C5230] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1C5230]"></span>
                        </span>
                        Assistant is preparing response...
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Dynamic suggestion chips */}
              {!initializing && messages.length < 5 && (
                <div className="px-6 py-3.5 bg-white border-t border-[#FAF8F4] flex flex-wrap gap-2">
                  {[
                    { text: "Tell me about the Import/Export Mentorship Program", label: "Mentorship", icon: BookOpen },
                    { text: "How to register an export company in Pakistan? NTN, WEBOC?", label: "Company Register", icon: Building },
                    { text: "What commodities do you source & export?", label: "Commodities", icon: Package },
                  ].map((item) => (
                    <button
                      key={item.text}
                      onClick={(e) => handleSend(e, item.text)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-emerald-100 hover:border-emerald-300 bg-emerald-50/20 hover:bg-emerald-50 text-[10px] md:text-xs text-emerald-950 font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <item.icon className="w-3.5 h-3.5 text-[#1C5230]" />
                      {item.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Error Alert Box */}
              {error && (
                <div className="px-6 py-2.5 bg-red-50 text-red-800 text-xs font-bold border-t border-red-100 flex items-center justify-between">
                  <span>{error}</span>
                  <button onClick={() => setError("")} className="text-red-900 hover:underline">Dismiss</button>
                </div>
              )}

              {/* Message Input Form */}
              <form onSubmit={handleSend} className="p-4 bg-white border-t border-[#D8D2C7] flex gap-3 items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Rice, Salt, Mentorship, WEBOC..."
                  disabled={initializing || loading}
                  className="flex-1 bg-[#FAF8F4] border border-[#D8D2C7] rounded-xl px-4 py-3 text-xs md:text-sm focus:outline-none focus:border-[#1C5230] transition-colors disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={initializing || loading || !input.trim()}
                  className="bg-[#1C5230] hover:bg-[#0B1A0E] text-white p-3 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>

            {/* Bottom Warning/Help Notice Card */}
            <div className="mt-4 p-4 rounded-2xl bg-white border border-[#D8D2C7] flex items-start gap-3 shadow-sm">
              <MessageSquare className="w-5 h-5 text-[#1C5230] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[#4A5D4C] leading-relaxed">
                <strong>Real-time Trade Intelligence:</strong> This AI advisor integrates live commodities portfolios, company registration rules, and course modules. For administrative questions, manual bookings, or direct human consultancy, write to us at <strong>info@pentapeaks.com</strong> or call our support line at <strong>+923086222283</strong>.
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
