"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { fadeUpVariant, staggerContainer } from "@/lib/animations"
import { Building, ArrowRight, CheckCircle } from "lucide-react"

const steps = [
  { step: "01", title: "NTN Registration", desc: "National Tax Number from Federal Board of Revenue" },
  { step: "02", title: "STRN Registration", desc: "Sales Tax Registration Number for tax compliance" },
  { step: "03", title: "Chamber of Commerce", desc: "Membership with local Chamber of Commerce & Industry" },
  { step: "04", title: "TDAP Registration", desc: "Trade Development Authority of Pakistan registration" },
  { step: "05", title: "RECP Licensing", desc: "Registration Cum Membership Certificate" },
  { step: "06", title: "WEBOC Portal", desc: "Web-Based One Customs portal setup for electronic customs clearance" },
]

export default function CompanyRegistrationPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Building className="w-12 h-12 text-primary mx-auto mb-4" />
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold font-[family-name:var(--font-display)]">
            Company <span className="text-primary">Registration</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-text-muted mt-4">
            We register your import/export company in Pakistan from start to finish.
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-6">
            {steps.map((s) => (
              <motion.div key={s.step} variants={fadeUpVariant} className="flex gap-6 items-start bg-white border border-border-light border border-border-light rounded-xl p-6 hover:border-primary/30 transition-all">
                <div className="w-14 h-14 rounded-lg bg-primary-pale flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold font-[family-name:var(--font-display)] text-lg">{s.step}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold font-[family-name:var(--font-display)]">{s.title}</h3>
                  <p className="text-text-muted mt-1">{s.desc}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-12">
            <Link href="/contact" className="btn-primary text-lg px-10 py-4">Get Started <ArrowRight className="w-5 h-5" /></Link>
          </div>
        </div>
      </section>
    </>
  )
}
