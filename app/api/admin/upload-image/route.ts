import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/api-auth";
import fs from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// Using a persistent directory in production to survive Next.js standalone rebuilds
const isProduction = process.env.NODE_ENV === "production";
const basePath = isProduction ? "/var/www/pentapeaks/public" : path.join(process.cwd(), "public");
const UPLOAD_DIR = path.join(basePath, "uploads", "blog-images");
const PUBLIC_BASE_URL = "/uploads/blog-images";

// Helper to ensure directory exists
async function ensureDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminSession();
    if (!auth.isValid) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.error?.includes("Forbidden") ? 403 : 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    // 80KB size limit in bytes
    const MAX_SIZE = 80 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File size exceeds 80KB limit" }, { status: 400 });
    }

    // Check if it's a WebP
    if (file.type !== "image/webp") {
      return NextResponse.json({ error: "Only WebP files are allowed" }, { status: 400 });
    }

    await ensureDir();

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const uniqueName = `blog-${Date.now()}-${safeName}`;
    const filePath = path.join(UPLOAD_DIR, uniqueName);
    
    await fs.writeFile(filePath, buffer);

    const fileUrl = `${PUBLIC_BASE_URL}/${uniqueName}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
