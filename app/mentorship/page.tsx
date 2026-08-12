import { prisma } from "@/lib/prisma"
import MentorshipClient from "./MentorshipClient"

import fs from "fs"
import path from "path"

// Revalidate every 30 seconds so demo toggle reflects quickly
export const revalidate = 30

async function getInitialData() {
  const [batches, demoConfig] = await Promise.all([
    prisma.batch.findMany({
      where: { status: { in: ["UPCOMING", "ACTIVE"] }, hidden: false },
      orderBy: { createdAt: "desc" },
      select: { id: true, batchNo: true, title: true, startDate: true, status: true, fee: true },
    }).catch(() => []),

    prisma.demoClassConfig.findUnique({ where: { id: "1" } }).catch(() => null),
  ])

  let reviewVideos: string[] = []
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    
    if (supabaseUrl && supabaseKey) {
      // Import dynamically to avoid top-level issues if needed, but fetch is fine
      const res = await fetch(`${supabaseUrl}/storage/v1/object/list/student-reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey
        },
        body: JSON.stringify({
          prefix: "",
          limit: 100,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        }),
        next: { revalidate: 30 }
      });
      
      if (res.ok) {
        const data = await res.json();
        reviewVideos = data
          .filter((file: any) => file.name && file.name.match(/\.(mp4|mov)$/i))
          .map((file: any) => `${supabaseUrl}/storage/v1/object/public/student-reviews/${file.name}`)
      }
    }
  } catch (e) {
    console.error("Error reading review videos from Supabase", e)
  }

  return {
    batches: batches.map(b => ({
      ...b,
      startDate: b.startDate ? b.startDate.toISOString() : null,
    })),
    demoConfig: demoConfig ? {
      isActive: demoConfig.isActive,
      heading: demoConfig.heading,
      details: demoConfig.details,
      whatsappLink: demoConfig.whatsappLink,
    } : null,
    reviewVideos,
  }
}

export default async function MentorshipPage() {
  const { batches, demoConfig, reviewVideos } = await getInitialData()

  return (
    <MentorshipClient
      initialBatches={batches}
      initialDemoConfig={demoConfig}
      reviewVideos={reviewVideos}
    />
  )
}