import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/api-auth";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder_key";
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = "blog-images";

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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const uniqueName = `blog-${Date.now()}-${safeName}`;
    
    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(uniqueName, buffer, {
      contentType: file.type,
      upsert: false
    });

    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }

    const fileUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${uniqueName}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
