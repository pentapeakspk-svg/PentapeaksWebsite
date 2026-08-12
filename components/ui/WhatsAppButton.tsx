"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { Send, X, Shield, RefreshCw, BookOpen, Building, Package } from "lucide-react"

/* ── WhatsApp SVG ── */
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-7 md:h-7">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
)

/* ── Navy/Gold Robot Icon ── */
const RobotIcon = () => (
  <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" aria-hidden="true">
    <defs>
      <linearGradient id="rBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1A3F5C" />
        <stop offset="100%" stopColor="#0D2B4A" />
      </linearGradient>
      <linearGradient id="rFaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0A1E33" />
        <stop offset="100%" stopColor="#050E1A" />
      </linearGradient>
    </defs>
    {/* Antenna post */}
    <rect x="20.5" y="1" width="3" height="6.5" rx="1.5" fill="#C9972C" opacity=".9" />
    {/* Antenna ball */}
    <circle cx="22" cy="1.5" r="2.4" fill="#C9972C" />
    <circle cx="22" cy="1.5" r="1.1" fill="#fff" opacity=".75" />
    {/* Head */}
    <rect x="7" y="8" width="30" height="20" rx="7" fill="url(#rBodyGrad)" stroke="rgba(201,151,44,.45)" strokeWidth=".8" />
    {/* Face panel */}
    <rect x="10" y="11" width="24" height="14" rx="4.5" fill="url(#rFaceGrad)" />
    {/* Left eye */}
    <circle cx="17" cy="18" r="3.6" fill="#0E4D6B" />
    <circle cx="17" cy="18" r="2.2" fill="#C9972C" opacity=".9" />
    <circle cx="17" cy="18" r="1.1" fill="#fff" opacity=".9" />
    <circle cx="18" cy="17" r=".45" fill="#fff" opacity=".6" />
    {/* Right eye */}
    <circle cx="27" cy="18" r="3.6" fill="#0E4D6B" />
    <circle cx="27" cy="18" r="2.2" fill="#C9972C" opacity=".9" />
    <circle cx="27" cy="18" r="1.1" fill="#fff" opacity=".9" />
    <circle cx="28" cy="17" r=".45" fill="#fff" opacity=".6" />
    {/* Ear tabs */}
    <rect x="4" y="13" width="3.5" height="8" rx="1.75" fill="#C9972C" opacity=".8" />
    <circle cx="5.75" cy="17" r="1" fill="#fff" opacity=".5" />
    <rect x="36.5" y="13" width="3.5" height="8" rx="1.75" fill="#C9972C" opacity=".8" />
    <circle cx="38.25" cy="17" r="1" fill="#fff" opacity=".5" />
    {/* Brow lines */}
    <line x1="14" y1="13" x2="20" y2="13" stroke="rgba(201,151,44,.55)" strokeWidth=".8" strokeLinecap="round" />
    <line x1="24" y1="13" x2="30" y2="13" stroke="rgba(201,151,44,.55)" strokeWidth=".8" strokeLinecap="round" />
    {/* Neck */}
    <rect x="18" y="28" width="8" height="4" rx="2" fill="#0D2B4A" stroke="rgba(201,151,44,.3)" strokeWidth=".6" />
    {/* Body */}
    <rect x="9" y="32" width="26" height="10" rx="4" fill="url(#rBodyGrad)" stroke="rgba(201,151,44,.35)" strokeWidth=".7" />
    {/* Chest panel */}
    <rect x="13" y="34" width="18" height="6" rx="2.5" fill="url(#rFaceGrad)" />
    {/* Chest dots */}
    <circle cx="17" cy="37" r="1.2" fill="#C9972C" opacity=".9" />
    <circle cx="22" cy="37" r="1.2" fill="#E8B84B" opacity=".75" />
    <circle cx="27" cy="37" r="1.2" fill="#C9972C" opacity=".9" />
  </svg>
)

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState<"English" | "Urdu/Hindi" | "Spanish" | "Chinese" | "Arabic">("English")
  const [initializing, setInitializing] = useState(false)
  const [error, setError] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  /* ── welcome message ── */
  useEffect(() => {
    if (!isOpen) return
    const loadWelcome = async () => {
      setInitializing(true)
      try {
        const res = await fetch(`/api/student/counselor?language=${encodeURIComponent(language)}`, { cache: "no-store" })
        const data = await res.json()
        if (res.ok && data.welcome) {
          setMessages([{ role: "assistant", content: data.welcome }])
        } else {
          throw new Error(data.error || "Failed to load welcome message.")
        }
      } catch (err: any) {
        setError("Could not connect to the assistant server.")
      } finally {
        setInitializing(false)
      }
    }
    loadWelcome()
  }, [language, isOpen])

  /* ── scroll to bottom ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  /* ── send message ── */
  const handleSend = async (e?: React.FormEvent, customMsg?: string) => {
    e?.preventDefault()
    const textToSend = customMsg || input
    if (!textToSend.trim() || loading) return
    if (!customMsg) setInput("")
    setError("")
    const userMsg: Message = { role: "user", content: textToSend }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setLoading(true)
    try {
      const res = await fetch("/api/student/counselor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, history: updatedMessages, sessionData: { language } })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to retrieve support response.")
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }])
    } catch (err: any) {
      setError(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Outfit:wght@300;400;500;600&display=swap');

        .pp-chat-drawer {
          font-family: 'Outfit', sans-serif;
        }

        /* ── Scrollbar ── */
        .pp-messages::-webkit-scrollbar { width: 4px; }
        .pp-messages::-webkit-scrollbar-track { background: transparent; }
        .pp-messages::-webkit-scrollbar-thumb { background: rgba(201,151,44,.25); border-radius: 4px; }
        .pp-messages::-webkit-scrollbar-thumb:hover { background: rgba(201,151,44,.45); }

        /* ── Pulse ring animation ── */
        @keyframes ppRing {
          0%   { transform: scale(1);    opacity: .45; }
          65%  { transform: scale(1.65); opacity: 0; }
          100% { transform: scale(1.65); opacity: 0; }
        }
        .pp-ring-1 { animation: ppRing 2.8s ease-in-out infinite; }
        .pp-ring-2 { animation: ppRing 2.8s ease-in-out infinite; animation-delay: .55s; }

        /* ── Status dot blink ── */
        @keyframes ppBlink {
          0%,100% { opacity: 1; box-shadow: 0 0 6px rgba(74,222,128,.7); }
          50%      { opacity: .45; box-shadow: 0 0 2px rgba(74,222,128,.3); }
        }
        .pp-status { animation: ppBlink 2.2s ease-in-out infinite; }

        /* ── Gold accent lines on header ── */
        .pp-header-stripe {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,151,44,.6) 40%, rgba(201,151,44,.6) 60%, transparent);
        }

        /* ── Chip button hover ── */
        .pp-chip {
          display: flex; align-items: center; gap: 5px;
          padding: 5px 10px; border-radius: 100px;
          border: 1px solid rgba(13,43,74,.15);
          background: rgba(13,43,74,.04);
          font-size: 10px; font-weight: 600;
          color: #0D2B4A; cursor: pointer;
          transition: all .25s ease;
          font-family: 'Outfit', sans-serif;
        }
        .pp-chip:hover {
          border-color: rgba(201,151,44,.5);
          background: rgba(201,151,44,.08);
          color: #8B6214;
          transform: translateY(-1px);
        }

        /* ── Input focus glow ── */
        .pp-input:focus {
          outline: none;
          border-color: #C9972C !important;
          box-shadow: 0 0 0 3px rgba(201,151,44,.12);
        }

        /* ── Send button ── */
        .pp-send {
          background: linear-gradient(135deg, #0D2B4A, #0E4D6B);
          color: #fff;
          border: none; border-radius: 8px;
          padding: 8px 10px; cursor: pointer;
          transition: all .3s ease;
          display: flex; align-items: center; justify-content: center;
        }
        .pp-send:hover { background: linear-gradient(135deg, #C9972C, #E8B84B); transform: translateY(-1px); }
        .pp-send:disabled { opacity: .4; cursor: not-allowed; transform: none; }

        /* ── Language tab active ── */
        .pp-lang-active {
          background: linear-gradient(135deg, #0D2B4A, #0E4D6B) !important;
          color: #fff !important;
          border-color: transparent !important;
        }

        /* ── Typing dots ── */
        @keyframes ppDot {
          0%,80%,100% { transform: scale(.6); opacity:.4; }
          40%          { transform: scale(1);  opacity:1; }
        }
        .pp-dot { display:inline-block; width:5px; height:5px; border-radius:50%; background:#C9972C; animation: ppDot 1.4s ease-in-out infinite; }
        .pp-dot:nth-child(2) { animation-delay:.2s; }
        .pp-dot:nth-child(3) { animation-delay:.4s; }
      `}</style>

      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex flex-col items-end justify-end pointer-events-none">

        {/* ══ CHAT DRAWER ══ */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 28, scale: .95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 28, scale: .95 }}
              transition={{ type: "spring", duration: .55, bounce: .22 }}
              className="pp-chat-drawer w-[95vw] sm:w-[420px] max-w-[420px] h-[600px] max-h-[85vh] sm:h-[600px] rounded-2xl flex flex-col overflow-hidden relative mb-4 pointer-events-auto"
              style={{
                background: "#fff",
                border: "1px solid #D8D2C7",
                boxShadow: "0 20px 60px -15px rgba(5,14,26,.28), 0 4px 20px rgba(5,14,26,.12)",
              }}
            >
              {/* ── Header ── */}
              <div className="relative px-4 py-3.5 flex items-center justify-between"
                style={{ background: "linear-gradient(135deg, #050E1A 0%, #0D2B4A 60%, #0E4D6B 100%)" }}>
                <div className="pp-header-stripe" />

                {/* Left: robot avatar + name */}
                <div className="flex items-center gap-3">
                  {/* Avatar circle */}
                  <div className="relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(13,43,74,.8)", border: "1.5px solid rgba(201,151,44,.4)" }}>
                    <RobotIcon />
                    {/* status dot */}
                    <span className="pp-status absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
                      style={{ background: "#4ade80", borderColor: "#050E1A" }} />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: ".9rem", fontWeight: 500, color: "#fff", lineHeight: 1.1 }}>
                        Penta Peaks
                      </h3>
                      {/* gold star */}
                      <svg width="11" height="11" viewBox="0 0 10 10" fill="#C9972C"><polygon points="5,1 6.2,4 9.5,4 6.8,6.3 7.8,9.5 5,7.5 2.2,9.5 3.2,6.3 0.5,4 3.8,4" /></svg>
                    </div>
                    <p style={{ fontSize: ".6rem", color: "rgba(201,151,44,.85)", fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", marginTop: "1px" }}>
                      Online · Trade & Mentorship
                    </p>
                  </div>
                </div>

                {/* Close button */}
                <button onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-7 h-7 rounded-full transition-all"
                  style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", color: "rgba(255,255,255,.75)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,151,44,.25)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,.08)")}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* ── Language bar ── */}
              <div className="px-4 py-2 flex items-center justify-between"
                style={{ background: "#F7F4EE", borderBottom: "1px solid #EDE9E1" }}>
                <div className="flex items-center gap-1.5" style={{ color: "#4A5D4C", fontSize: ".6rem", fontWeight: 600 }}>
                  <Shield className="w-3 h-3" />
                  <span style={{ letterSpacing: ".1em", textTransform: "uppercase" }}>Language</span>
                </div>
                <div className="flex flex-wrap gap-1 justify-end max-w-[75%]">
                  {(["English", "Urdu/Hindi", "Spanish", "Chinese", "Arabic"] as const).map(lang => (
                    <button key={lang} onClick={() => setLanguage(lang)}
                      className={`pp-chip transition-all ${language === lang ? "pp-lang-active" : ""}`}
                      style={{ fontSize: "8.5px", padding: "4px 8px" }}>
                      {lang === "Urdu/Hindi"
                        ? "Urdu"
                        : lang === "Chinese"
                        ? "中文"
                        : lang === "Arabic"
                        ? "العربية"
                        : lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Messages ── */}
              <div className="pp-messages flex-1 overflow-y-auto p-4 space-y-3"
                style={{ background: "linear-gradient(to bottom, #fff 0%, #FAF8F4 100%)" }}>
                {initializing ? (
                  <div className="h-full flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(13,43,74,.06)", border: "1px solid rgba(201,151,44,.2)" }}>
                      <RefreshCw className="w-4 h-4 animate-spin" style={{ color: "#C9972C" }} />
                    </div>
                    <p style={{ fontSize: ".72rem", color: "#7A8E92", fontWeight: 400 }}>Connecting to trade database...</p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                        {msg.role === "assistant" && (
                          <div className="w-5 h-5 rounded-full mb-1 flex items-center justify-center flex-shrink-0"
                            style={{ background: "linear-gradient(135deg,#0D2B4A,#0E4D6B)", border: "1px solid rgba(201,151,44,.3)" }}>
                            <svg viewBox="0 0 20 20" width="12" height="12" aria-hidden="true">
                              <circle cx="7.5" cy="10" r="2" fill="#C9972C" opacity=".9" />
                              <circle cx="12.5" cy="10" r="2" fill="#C9972C" opacity=".9" />
                              <rect x="8.5" y="3" width="3" height="3" rx="1.5" fill="#C9972C" opacity=".7" />
                            </svg>
                          </div>
                        )}
                        <div className="rounded-2xl max-w-[85%] text-xs md:text-sm leading-relaxed"
                          style={msg.role === "user" ? {
                            background: "linear-gradient(135deg, #0D2B4A, #0E4D6B)",
                            color: "#fff",
                            borderTopRightRadius: "4px",
                            fontWeight: 500,
                            padding: "10px 14px",
                            boxShadow: "0 2px 12px rgba(13,43,74,.2)",
                          } : {
                            background: "#fff",
                            color: "#0F1C0B",
                            borderTopLeftRadius: "4px",
                            border: "1px solid #EDE9E1",
                            padding: "10px 14px",
                            boxShadow: "0 2px 8px rgba(5,14,26,.06)",
                          }}>
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))}

                    {loading && (
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: "linear-gradient(135deg,#0D2B4A,#0E4D6B)", border: "1px solid rgba(201,151,44,.3)" }}>
                          <svg viewBox="0 0 20 20" width="12" height="12" aria-hidden="true">
                            <circle cx="7.5" cy="10" r="2" fill="#C9972C" opacity=".9" />
                            <circle cx="12.5" cy="10" r="2" fill="#C9972C" opacity=".9" />
                          </svg>
                        </div>
                        <div className="rounded-2xl px-3.5 py-3 flex items-center gap-1.5"
                          style={{ background: "#fff", border: "1px solid #EDE9E1", borderTopLeftRadius: "4px", boxShadow: "0 2px 8px rgba(5,14,26,.06)" }}>
                          <span className="pp-dot" />
                          <span className="pp-dot" />
                          <span className="pp-dot" />
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* ── Quick chip prompts ── */}
              {!initializing && messages.length < 4 && (
                <div className="px-3.5 py-2.5 flex flex-wrap gap-1.5"
                  style={{ background: "#fff", borderTop: "1px solid #F7F4EE" }}>
                  {[
                    { text: "Tell me about the Import/Export Mentorship Program", label: "Mentorship", icon: BookOpen },
                    { text: "How to register an export company in Pakistan? NTN, WEBOC?", label: "Company Register", icon: Building },
                    { text: "What commodities do you source & export?", label: "Commodities", icon: Package },
                  ].map(item => (
                    <button key={item.text} onClick={e => handleSend(e, item.text)} className="pp-chip">
                      <item.icon style={{ width: 10, height: 10, color: "#C9972C" }} />
                      {item.label}
                    </button>
                  ))}
                </div>
              )}

              {/* ── Error bar ── */}
              {error && (
                <div className="px-4 py-1.5 flex items-center justify-between"
                  style={{ background: "#FEF2F2", borderTop: "1px solid #FECACA" }}>
                  <span style={{ fontSize: ".68rem", color: "#991B1B", fontWeight: 500 }}>{error}</span>
                  <button onClick={() => setError("")}
                    style={{ fontSize: ".65rem", color: "#7F1D1D", fontWeight: 600, textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>
                    Dismiss
                  </button>
                </div>
              )}

              {/* ── Input bar ── */}
              <form onSubmit={handleSend} className="flex gap-2 items-center p-3"
                style={{ background: "#fff", borderTop: "1px solid #EDE9E1" }}>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about Rice, Salt, Mentorship, WEBOC..."
                  disabled={initializing || loading}
                  className="pp-input flex-1 text-xs rounded-lg px-3 py-2"
                  style={{
                    background: "#F7F4EE",
                    border: "1px solid #D8D2C7",
                    fontFamily: "'Outfit', sans-serif",
                    color: "#0F1C0B",
                    transition: "border-color .2s, box-shadow .2s",
                    opacity: (initializing || loading) ? .6 : 1,
                  }}
                />
                <button type="submit" disabled={initializing || loading || !input.trim()} className="pp-send">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* ── Watermark ── */}
              <div className="text-center py-1" style={{ background: "#F7F4EE", borderTop: "1px solid #EDE9E1" }}>
                <span style={{ fontSize: "8.5px", color: "#7A8E92", letterSpacing: ".08em" }}>
                  Powered by <strong style={{ color: "#C9972C", fontWeight: 600 }}>Penta Peaks</strong> International · Real-time AI Advisor
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ FLOATING BUTTON ROW ══ */}
        <div className="flex items-center justify-center gap-3.5 md:gap-4 pointer-events-auto">

          {/* ── AI Assistant button ── */}
          <div className="relative">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Penta Peaks AI Assistant"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.4 }}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: .93 }}
              className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full group cursor-pointer"
              style={{
                background: "linear-gradient(145deg, #0D2B4A 0%, #050E1A 100%)",
                border: "1.5px solid rgba(201,151,44,.4)",
                boxShadow: "0 8px 32px rgba(5,14,26,.55), 0 0 0 1px rgba(201,151,44,.12), inset 0 1px 0 rgba(255,255,255,.06)",
              }}
            >
              {/* pulse rings */}
              {!isOpen && (
                <>
                  <span className="pp-ring-1 absolute inset-0 rounded-full"
                    style={{ background: "rgba(13,43,74,.5)", zIndex: -1 }} />
                  <span className="pp-ring-2 absolute inset-0 rounded-full"
                    style={{ background: "rgba(13,43,74,.3)", zIndex: -1 }} />
                </>
              )}

              {/* gold star badge */}
              {!isOpen && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center z-10"
                  style={{ background: "linear-gradient(135deg,#C9972C,#E8B84B)", border: "2px solid #050E1A", boxShadow: "0 2px 8px rgba(201,151,44,.4)" }}>
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="#fff"><polygon points="5,1 6.2,4 9.5,4 6.8,6.3 7.8,9.5 5,7.5 2.2,9.5 3.2,6.3 0.5,4 3.8,4" /></svg>
                </span>
              )}

              {/* status dot */}
              <span className="pp-status absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border-2"
                style={{ background: "#4ade80", borderColor: "#050E1A" }} />

              {isOpen
                ? <X className="w-5 h-5 md:w-6 md:h-6" style={{ color: "rgba(255,255,255,.85)" }} />
                : <RobotIcon />
              }

              {/* Tooltip */}
              <span className="absolute right-full mr-3.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  fontFamily: "'Outfit',sans-serif", fontSize: ".68rem", fontWeight: 600,
                  background: "#050E1A", color: "#F7F4EE",
                  border: "1px solid rgba(201,151,44,.3)",
                  boxShadow: "0 4px 16px rgba(5,14,26,.4)",
                }}>
                <span style={{ color: "#C9972C" }}>✦</span> {isOpen ? "Close Assistant" : "AI Trade Advisor"}
              </span>
            </motion.button>
          </div>

          {/* ── WhatsApp button ── */}
          <motion.a
            href="https://wa.me/923086222283"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.0 }}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: .93 }}
            className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full group"
            style={{
              background: "linear-gradient(145deg, #1C5230 0%, #0f3320 100%)",
              border: "1.5px solid rgba(37,211,102,.3)",
              boxShadow: "0 8px 32px rgba(5,14,26,.45), 0 0 0 1px rgba(37,211,102,.1), inset 0 1px 0 rgba(255,255,255,.05)",
              color: "#fff",
            }}
          >
            {/* pulse rings */}
            <motion.span
              animate={{ scale: [1, 1.5, 1], opacity: [.45, 0, .45] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full"
              style={{ background: "#25D366", zIndex: -1 }}
            />
            <motion.span
              animate={{ scale: [1, 1.75, 1], opacity: [.25, 0, .25] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: .5 }}
              className="absolute inset-0 rounded-full"
              style={{ background: "#25D366", zIndex: -1 }}
            />

            <WhatsAppIcon />

            {/* Tooltip */}
            <span className="absolute right-full mr-3.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300"
              style={{
                fontFamily: "'Outfit',sans-serif", fontSize: ".68rem", fontWeight: 600,
                background: "#050E1A", color: "#F7F4EE",
                border: "1px solid rgba(37,211,102,.25)",
                boxShadow: "0 4px 16px rgba(5,14,26,.4)",
              }}>
              <span style={{ color: "#25D366" }}>●</span> Chat on WhatsApp
            </span>
          </motion.a>

        </div>
      </div>
    </>
  )
}