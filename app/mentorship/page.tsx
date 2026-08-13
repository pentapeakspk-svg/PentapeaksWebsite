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

// reviewVideos is now fetched directly by MentorshipClient

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
  }
}

export default async function MentorshipPage() {
  const { batches, demoConfig } = await getInitialData()

  return (
    <MentorshipClient
      initialBatches={batches}
      initialDemoConfig={demoConfig}
    />
  )
}