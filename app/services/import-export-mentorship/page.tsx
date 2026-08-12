"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { fadeUpVariant, staggerContainer } from "@/lib/animations"
import { GraduationCap, ArrowRight, CheckCircle, BookOpen, Globe, FileText, Truck, Shield } from "lucide-react"

export default function MentorshipServicePage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <GraduationCap className="w-12 h-12 text-primary mx-auto mb-4" />
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold font-[family-name:var(--font-display)]">
            Import Export <span className="text-primary">Mentorship</span>
          </motion.h1>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-text-body text-lg leading-relaxed">Our comprehensive Import/Export Mentorship Program is designed for aspiring traders who want to master international trade from Pakistan. Whether you&apos;re a complete beginner or looking to formalize your knowledge, our program covers every aspect of the import/export business.</p>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: FileText, title: "Documentation", items: ["Commercial Invoice", "Packing List", "Certificate of Origin", "Phytosanitary Certificate", "Bill of Lading"] },
              { icon: BookOpen, title: "Payment Terms", items: ["Letter of Credit (LC)", "Telegraphic Transfer (TT)", "Cash Against Documents", "Document Against Payment"] },
              { icon: Globe, title: "Incoterms 2020", items: ["FOB, CIF, CNF", "EXW, DDP, DAP", "Cost allocation", "Risk transfer points"] },
              { icon: Truck, title: "Logistics", items: ["Container types", "Freight rates", "Port operations", "Customs clearance"] },
              { icon: Shield, title: "Registrations", items: ["TDAP registration", "RECP licensing", "WEBOC portal", "Chamber of Commerce"] },
              { icon: GraduationCap, title: "Live Deals", items: ["Real deal walkthroughs", "Buyer negotiations", "Shipping coordination", "Post-shipment follow-up"] },
            ].map((mod) => (
              <motion.div key={mod.title} variants={fadeUpVariant} className="bg-white border border-border-light border border-border-light rounded-xl p-6">
                <mod.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-bold font-[family-name:var(--font-display)] mb-3">{mod.title}</h3>
                <ul className="space-y-2">{mod.items.map(item => <li key={item} className="flex items-center gap-2 text-sm text-text-muted"><CheckCircle className="w-3 h-3 text-primary" />{item}</li>)}</ul>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center pt-8">
            <Link href="/mentorship" className="btn-primary text-lg px-10 py-4">Enroll Now <ArrowRight className="w-5 h-5" /></Link>
          </div>
        </div>
      </section>
    </>
  )
}
