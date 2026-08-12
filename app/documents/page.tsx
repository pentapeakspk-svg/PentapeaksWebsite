import { prisma } from "@/lib/prisma"
import { FileText, Download, Shield, ExternalLink, ArrowRight } from "lucide-react"

export const revalidate = 60 // Revalidate every minute

export default async function DocumentsPage() {
  let documents: any[] = []
  try {
    documents = await prisma.document.findMany({
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("Database not ready yet", error)
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-[#050E1A]">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('/images/hero-banner.webp')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050E1A]/80 to-[#050E1A]"></div>
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-[#C8963E]/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8963E]/40 to-transparent"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <p className="flex items-center justify-center gap-3 text-[0.65rem] font-bold tracking-[0.3em] uppercase text-[#C8963E] mb-6">
            <span className="w-8 h-px bg-[#C8963E]"></span>
            Resource Center
            <span className="w-8 h-px bg-[#C8963E]"></span>
          </p>
          
          <h1 className="font-serif text-4xl md:text-6xl font-light text-white drop-shadow-md mb-6 leading-tight" style={{ color: 'white' }}>
            Import Export <em className="italic text-[#C8963E]">Guide</em>
          </h1>
          
          <p className="text-white/60 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Secure access to important export guides, compliance documentation, and educational resources provided by Penta Peaks.
          </p>
        </div>
      </section>

      {/* Documents List Section */}
      <section className="py-20 bg-[#FAF8F4] min-h-[50vh]">
        <div className="max-w-5xl mx-auto px-6">
          
          {documents.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-[#D8D2C7] shadow-sm">
              <div className="w-20 h-20 bg-[#C8963E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-[#C8963E]" />
              </div>
              <h3 className="font-serif text-2xl text-[#0F1C0B] mb-2">No Documents Available</h3>
              <p className="text-[#7A8E92]">Please check back later for updated resources.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {documents.map((doc, i) => (
                <a 
                  key={doc.id}
                  href={doc.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-white rounded-2xl p-6 md:p-8 border border-[#D8D2C7] hover:border-[#C8963E]/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(200,150,62,0.1)] transition-all duration-300 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1C5230]/10 to-[#1C5230]/5 flex items-center justify-center border border-[#1C5230]/10 group-hover:bg-[#1C5230] transition-colors duration-300">
                      <FileText className="w-6 h-6 text-[#1C5230] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="bg-[#FAF8F4] text-[#7A8E92] text-[0.65rem] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border border-[#D8D2C7]">
                      Google Drive
                    </span>
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-serif text-xl md:text-2xl text-[#0F1C0B] font-medium leading-tight mb-3 group-hover:text-[#1C5230] transition-colors">
                      {doc.title}
                    </h3>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#E8E3DC] flex items-center justify-between text-[#C8963E] font-semibold text-sm tracking-widest uppercase">
                    <span className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" /> View Document
                    </span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
          )}
          
          <div className="mt-16 flex items-center justify-center gap-3 text-sm text-[#7A8E92] bg-white py-4 px-6 rounded-full border border-[#D8D2C7] max-w-max mx-auto shadow-sm">
            <Shield className="w-4 h-4 text-[#1C5230]" />
            <span>Documents are securely hosted on Google Drive</span>
          </div>

        </div>
      </section>
    </>
  )
}
