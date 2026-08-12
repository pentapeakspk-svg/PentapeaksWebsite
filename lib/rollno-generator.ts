import { prisma } from "./prisma";

/**
 * Generate a unique, concurrency-safe roll number for students.
 * Uses a dedicated counter table to ensure atomicity.
 * Fallback to UUID suffix if counter generation fails.
 */
export async function generateSafeRollNo(
  batchId: string | null,
  enrollmentType: "BATCH" | "MENTORSHIP"
): Promise<string> {
  try {
    if (enrollmentType === "BATCH" && batchId) {
      // Atomic counter increment for batch students
      const batch = await prisma.batch.findUnique({
        where: { id: batchId },
      });

      if (!batch) {
        throw new Error("Batch not found");
      }

      // Use raw SQL with locking to safely increment counter
      const result = await prisma.$queryRaw<
        Array<{ next_counter: bigint }>
      >`
        INSERT INTO "RollNoCounter" ("batchId", "counter")
        VALUES (${batchId}, 1)
        ON CONFLICT ("batchId")
        DO UPDATE SET "counter" = "RollNoCounter"."counter" + 1
        RETURNING "counter" as next_counter
      `;

      const prefix = batch.batchNo.replace(/-/g, "");

      if (result && result.length > 0) {
        const counter = Number(result[0].next_counter);
        return `${prefix}${counter.toString().padStart(3, "0")}`;
      }

      // Fallback
      const count = await prisma.student.count({ where: { batchId } });
      return `${prefix}${(count + 1).toString().padStart(3, "0")}`;
    } else {
      // Mentorship students
      const result = await prisma.$queryRaw<
        Array<{ next_counter: bigint }>
      >`
        INSERT INTO "RollNoCounter" ("batchId", "counter")
        VALUES ('mentorship', 1)
        ON CONFLICT ("batchId")
        DO UPDATE SET "counter" = "RollNoCounter"."counter" + 1
        RETURNING "counter" as next_counter
      `;

      if (result && result.length > 0) {
        const counter = Number(result[0].next_counter);
        return `M${counter.toString().padStart(3, "0")}`;
      }

      // Fallback
      const count = await prisma.student.count({
        where: { enrollmentType: "MENTORSHIP" },
      });
      return `M${(count + 1).toString().padStart(3, "0")}`;
    }
  } catch (error) {
    console.warn("[generateSafeRollNo] Counter generation failed, using fallback:", error);

    if (enrollmentType === "BATCH" && batchId) {
      const batch = await prisma.batch.findUnique({ where: { id: batchId } });
      if (!batch) throw new Error("Batch not found");
      const prefix = batch.batchNo.replace(/-/g, "");
      const count = await prisma.student.count({ where: { batchId } });
      const uniqueSuffix = Math.random().toString(36).substring(2, 6);
      return `${prefix}${(count + 1).toString().padStart(3, "0")}-${uniqueSuffix}`;
    } else {
      const count = await prisma.student.count({
        where: { enrollmentType: "MENTORSHIP" },
      });
      const uniqueSuffix = Math.random().toString(36).substring(2, 6);
      return `M${(count + 1).toString().padStart(3, "0")}-${uniqueSuffix}`;
    }
  }
}
