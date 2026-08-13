import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/api-auth";
import fs from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// Using a persistent directory in production to survive Next.js standalone rebuilds
const isProduction = process.env.NODE_ENV === "production";
const basePath = isProduction ? "/var/www/pentapeaks/public" : path.join(process.cwd(), "public");
const UPLOAD_DIR = path.join(basePath, "uploads", "gallery-videos");
const PUBLIC_BASE_URL = "/uploads/gallery-videos";

// Helper to ensure directory exists
async function ensureDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const prefix = searchParams.get("prefix"); 

    await ensureDir();
    let files = await fs.readdir(UPLOAD_DIR);
    
    // Filter for video files
    files = files.filter(f => f.match(/\.(mp4|mov)$/i));
    
    if (prefix) {
      files = files.filter(f => f.toLowerCase().startsWith(prefix.toLowerCase()));
    }

    // Sort by creation time (descending)
    const fileStats = await Promise.all(
      files.map(async (file) => {
        const stats = await fs.stat(path.join(UPLOAD_DIR, file));
        return { file, time: stats.mtime.getTime() };
      })
    );
    fileStats.sort((a, b) => b.time - a.time);

    const fileUrls = fileStats.map(f => `${PUBLIC_BASE_URL}/${f.file}`);

    return NextResponse.json({ files: fileUrls });
  } catch (error: any) {
    console.error("GET Gallery Videos error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    const prefix = formData.get("prefix") as string; 
    
    if (!file || !prefix) {
      return NextResponse.json({ error: "File and prefix are required" }, { status: 400 });
    }

    const MAX_SIZE = 1.5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File size exceeds 1.5MB limit" }, { status: 400 });
    }

    await ensureDir();
    const existingFiles = await fs.readdir(UPLOAD_DIR);
    const sectionFiles = existingFiles.filter(f => f.toLowerCase().startsWith(prefix.toLowerCase()));
    
    if (prefix === "home-" && sectionFiles.length >= 3) {
      return NextResponse.json({ error: "Home page limit reached (max 3 videos). Please delete one first." }, { status: 400 });
    }
    
    if (prefix === "mentorship-" && sectionFiles.length >= 2) {
      return NextResponse.json({ error: "Mentorship page limit reached (max 2 videos). Please delete one first." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const uniqueName = `${prefix}${Date.now()}-${safeName}`;
    const filePath = path.join(UPLOAD_DIR, uniqueName);
    
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ success: true, fileName: uniqueName });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await verifyAdminSession();
    if (!auth.isValid) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.error?.includes("Forbidden") ? 403 : 401 });
    }

    const { fileName } = await req.json();
    if (!fileName) {
      return NextResponse.json({ error: "No file name provided" }, { status: 400 });
    }

    const filePath = path.join(UPLOAD_DIR, fileName);
    
    if (existsSync(filePath)) {
      await fs.unlink(filePath);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
