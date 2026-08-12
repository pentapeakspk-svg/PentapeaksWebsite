"use client"

import { usePathname } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import WhatsAppButton from "@/components/ui/WhatsAppButton"
import { SessionProvider } from "next-auth/react"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  return (
    <SessionProvider>
      <Navbar />
      <main className="flex-1 w-full overflow-x-hidden relative">{children}</main>
      {!isAdmin && <Footer />}
      <WhatsAppButton />
    </SessionProvider>
  )
}