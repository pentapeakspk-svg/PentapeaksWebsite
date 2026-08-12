import { z } from "zod";

// Flexible date validator that accepts DD/Mon/YYYY, MM/DD/YYYY, or ISO format
const flexibleDate = z
  .string()
  .optional()
  .refine((val) => {
    if (!val) return true;
    // Accept ISO datetime format
    if (/^\d{4}-\d{2}-\d{2}T/.test(val)) return true;
    // Accept DD/Mon/YYYY format (e.g., 13/May/2026)
    if (/^\d{1,2}\/[A-Za-z]+\/\d{4}$/.test(val)) return true;
    // Accept MM/DD/YYYY format (e.g., 05/13/2026)
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(val)) return true;
    // Accept YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return true;
    return false;
  }, "Invalid date format. Use DD/Mon/YYYY (e.g., 13/May/2026), MM/DD/YYYY, YYYY-MM-DD, or ISO 8601 format.");

// User/Enrollment
export const enrollmentSchema = z.object({
  name: z.string().min(2, "Name required").max(255),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]{7,}$/, "Invalid phone number"),
  city: z.string().min(2, "City required").max(100),
  education: z.string().max(255).optional(),
  enrollmentType: z.enum(["BATCH", "MENTORSHIP"]),
  batchId: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters").max(255),
});

// Batch management
export const batchSchema = z.object({
  batchNo: z.string().min(1).max(100),
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  status: z.enum(["ACTIVE", "UPCOMING", "COMPLETED"]).optional(),
  startDate: flexibleDate,
  endDate: flexibleDate,
  fee: z.coerce.number().int().nonnegative().default(0),
});

// Supplier inquiry
export const supplierSchema = z.object({
  companyName: z.string().min(2).max(255),
  contactPerson: z.string().min(2).max(255),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]{7,}$/),
  country: z.string().min(2).max(100),
  products: z.string().min(1).max(1000),
  exportCapacity: z.string().min(1).max(500),
  certifications: z.string().max(500).optional(),
  message: z.string().max(2000).optional(),
});

// Buyer inquiry
export const buyerSchema = z.object({
  buyerName: z.string().min(2).max(255),
  companyName: z.string().max(255).optional(),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]{7,}$/),
  country: z.string().min(2).max(100),
  product: z.string().min(1).max(255),
  quantity: z.string().min(1).max(100),
  unit: z.string().min(1).max(50),
  deliveryPort: z.string().max(100).optional(),
  paymentTerms: z.string().max(100).optional(),
  targetPrice: z.string().max(100).optional(),
  message: z.string().max(2000).optional(),
});

// Contact inquiry
export const contactSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]{7,}$/).optional().or(z.literal("")),
  subject: z.string().min(1).max(255),
  message: z.string().min(1).max(5000),
});

// Blog post (admin only)
export const blogSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  excerpt: z.string().min(1).max(500),
  content: z.string().min(1).max(50000),
  coverImage: z.string().url().optional().or(z.literal("")),
  author: z.string().max(255).optional(),
  published: z.boolean().optional(),
});

// Student management (admin)
export const studentSchema = z.object({
  userId: z.string().min(1),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]{7,}$/),
  city: z.string().min(2).max(100),
  education: z.string().max(255).optional(),
  enrollmentType: z.enum(["BATCH", "MENTORSHIP"]),
  batchId: z.string().optional(),
});

// Class link (admin)
export const classLinkSchema = z.object({
  batchId: z.string().min(1),
  link: z.string().url("Invalid URL"),
  title: z.string().min(1).max(255),
  note: z.string().max(500).optional(),
  attachments: z.array(z.string().url("Invalid attachment URL")).optional(),
});

// Attendance (admin)
export const attendanceSchema = z.object({
  studentId: z.string().min(1),
  batchId: z.string().min(1),
  date: z.string().datetime().optional(),
  status: z.enum(["PRESENT", "ABSENT", "LEAVE"]),
  lectureNo: z.number().int().positive().optional(),
});
