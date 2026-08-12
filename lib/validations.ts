import { z } from "zod"

export const enrollmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is required"),
  city: z.string().min(2, "City is required"),
  education: z.string().optional(),
  enrollmentType: z.enum(["MENTORSHIP", "BATCH"]),
  batchId: z.string().optional(),
  hearAboutUs: z.string().optional(),
  questions: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.enrollmentType === "BATCH" && !data.batchId) {
    return false
  }
  return true
}, {
  message: "Please select a batch",
  path: ["batchId"],
})

export const supplierSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactPerson: z.string().min(2, "Contact person is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(7, "Phone number is required"),
  country: z.string().min(2, "Country is required"),
  products: z.string().min(2, "Products are required"),
  exportCapacity: z.string().min(1, "Export capacity is required"),
  certifications: z.string().optional(),
  message: z.string().optional(),
})

export const buyerSchema = z.object({
  buyerName: z.string().min(2, "Name is required"),
  companyName: z.string().optional(),
  email: z.string().email("Invalid email"),
  phone: z.string().min(7, "Phone number is required"),
  country: z.string().min(2, "Country is required"),
  product: z.string().min(1, "Product is required"),
  quantity: z.string().min(1, "Quantity is required"),
  unit: z.string().min(1, "Unit is required"),
  deliveryPort: z.string().optional(),
  paymentTerms: z.string().optional(),
  targetPrice: z.string().optional(),
  message: z.string().optional(),
})

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export const batchSchema = z.object({
  batchNo: z.string().min(1, "Batch number is required"),
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "UPCOMING", "COMPLETED"]).default("UPCOMING"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export const blogSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  excerpt: z.string().min(10, "Excerpt is required"),
  content: z.string().min(20, "Content is required"),
  coverImage: z.string().optional(),
  author: z.string().default("Penta Peaks Team"),
  published: z.boolean().default(false),
})

export const attendanceSchema = z.object({
  batchId: z.string().min(1, "Batch is required"),
  lectureNo: z.number().int().positive(),
  date: z.string(),
  records: z.array(z.object({
    studentId: z.string(),
    status: z.enum(["PRESENT", "ABSENT", "LEAVE"]),
  })),
})

export const classLinkSchema = z.object({
  batchId: z.string().min(1, "Batch is required"),
  title: z.string().min(2, "Title is required"),
  link: z.string().url("Must be a valid URL"),
  note: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
})
