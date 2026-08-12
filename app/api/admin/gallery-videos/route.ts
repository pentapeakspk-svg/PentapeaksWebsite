import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/api-auth";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = "gallery-videos";

export async function GET(req: NextRequest) {
  try {
    // Both admin and public might need this, but for upload/delete it's admin only
    // Let's make GET public so the frontend can fetch it easily without auth overhead
    
    const { searchParams } = new URL(req.url);
    const prefix = searchParams.get("prefix"); // "home-" or "mentorship-"

    const { data, error } = await supabase.storage.from(BUCKET_NAME).list("", {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (error) {
      console.error("Supabase list error:", error);
      return NextResponse.json({ files: [] }); 
    }

    let files = data.filter(f => f.name.match(/\.(mp4|mov)$/i));
    
    if (prefix) {
      files = files.filter(f => f.name.toLowerCase().startsWith(prefix.toLowerCase()));
    }

    const fileUrls = files.map(f => `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${f.name}`);

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
    const prefix = formData.get("prefix") as string; // "home-" or "mentorship-"
    
    if (!file || !prefix) {
      return NextResponse.json({ error: "File and prefix are required" }, { status: 400 });
    }

    // 1.5MB size limit in bytes
    const MAX_SIZE = 1.5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File size exceeds 1.5MB limit" }, { status: 400 });
    }

    // Check limits
    const { data: existingFiles } = await supabase.storage.from(BUCKET_NAME).list("");
    const sectionFiles = (existingFiles || []).filter(f => f.name.toLowerCase().startsWith(prefix.toLowerCase()));
    
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
    
    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(uniqueName, buffer, {
      contentType: file.type || "video/mp4",
      upsert: false
    });

    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }

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

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([fileName]);

    if (error) {
      throw new Error(`Supabase delete failed: ${error.message}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
