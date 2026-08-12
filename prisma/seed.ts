import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "admin@pentapeaks.com"
  const adminPassword = process.env.ADMIN_PASSWORD || "PentaPeaks@Admin2026"
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    },
  })
  console.log(`✅ Admin user created: ${admin.email}`)

  // Create Sample Batches
  const batch1 = await prisma.batch.upsert({
    where: { batchNo: "B-001" },
    update: {},
    create: {
      batchNo: "B-001",
      title: "Import Export Fundamentals - Batch 1",
      description: "Comprehensive 8-week course covering all aspects of import/export trade from Pakistan.",
      status: "COMPLETED",
      startDate: new Date("2026-01-15"),
      endDate: new Date("2026-03-15"),
    },
  })

  const batch2 = await prisma.batch.upsert({
    where: { batchNo: "B-002" },
    update: {},
    create: {
      batchNo: "B-002",
      title: "Advanced Export Strategies - Batch 2",
      description: "Advanced batch focusing on LC documentation, buyer negotiations, and real deal execution.",
      status: "ACTIVE",
      startDate: new Date("2026-04-01"),
      endDate: new Date("2026-06-01"),
    },
  })

  const batch3 = await prisma.batch.upsert({
    where: { batchNo: "B-003" },
    update: {},
    create: {
      batchNo: "B-003",
      title: "Summer Export Intensive - Batch 3",
      description: "Intensive summer program for aspiring exporters.",
      status: "UPCOMING",
      startDate: new Date("2026-07-01"),
      endDate: new Date("2026-09-01"),
    },
  })

  console.log(`✅ Batches created: ${batch1.batchNo}, ${batch2.batchNo}, ${batch3.batchNo}`)

  console.log("🎉 Seeding complete!")
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
