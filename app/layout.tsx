import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"
import AppShell from "@/components/layout/AppShell"

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Penta Peaks International | Pakistan's Gateway to Global Markets",
    template: "%s | Penta Peaks International",
  },
  description: "Premium Pakistani agricultural commodities exporter - Rice, Fruits, Vegetables, Grains, Animal Feed. Import/Export mentorship and company registration services.",
  keywords: ["Pakistan exporter", "Pakistani rice", "agricultural commodities", "import export mentorship", "basmati rice exporter"],
  icons: {
    icon: [
      { url: "/images/favicon.png", sizes: "32x32" },
      { url: "/images/favicon.png", sizes: "48x48" },
      { url: "/images/favicon.png", sizes: "96x96" },
      { url: "/images/favicon.png", sizes: "128x128" },
      { url: "/images/favicon.png", sizes: "256x256" },
    ],
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pentapeaks.com",
    siteName: "Penta Peaks International",
    title: "Penta Peaks International | Pakistan's Gateway to Global Markets",
    description: "Premium Pakistani agricultural commodities exporter",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrains.variable}`}>
      <body className="min-h-screen flex flex-col font-[family-name:var(--font-body)]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
