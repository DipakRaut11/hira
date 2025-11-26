// app/api/heroimages/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id?: string }> } // params is now a Promise
) {
  try {
    console.log("DELETE request received for url:", req.url);
    
    // Await the params Promise first
    const resolvedParams = await params;
    console.log("params:", resolvedParams);

    if (!resolvedParams?.id) {
      console.error("Missing params.id");
      return NextResponse.json({ error: "Invalid image ID - missing param" }, { status: 400 });
    }

    // Ensure we decode any encoded parts and strip trailing/leading whitespace
    const rawId = decodeURIComponent(resolvedParams.id).trim();

    // If id contains non-numeric things (like "1.jpg" or "1/"), try to extract
    const numericId = Number(rawId);
    const imageId = Number.isFinite(numericId) ? numericId : parseInt(rawId, 10);

    console.log("rawId:", rawId, "resolved imageId:", imageId, "type:", typeof imageId);

    if (!Number.isFinite(imageId) || Number.isNaN(imageId)) {
      console.error("ID is not a valid number:", rawId);
      return NextResponse.json({ error: "Invalid image ID - not a number", receivedId: rawId }, { status: 400 });
    }

    const image = await prisma.heroImage.findUnique({ where: { id: imageId } });
    console.log("DB lookup result for id", imageId, ":", image);

    if (!image) {
      console.warn("No image found for ID:", imageId);
      return NextResponse.json({ error: "Image not found", id: imageId }, { status: 404 });
    }

    // Build safe path for the file stored in public/
    if (image.url) {
      // keep folder structure in url: remove leading slash only
      const relativePath = image.url.startsWith("/") ? image.url.slice(1) : image.url;
      const filePath = path.join(process.cwd(), "public", relativePath);

      console.log("Attempting to delete file at:", filePath);

      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("File deleted successfully:", filePath);
        } else {
          console.warn("File does not exist:", filePath);
        }
      } catch (fileErr) {
        // Return a 500 with the file error details so client can see it
        console.error("File deletion error:", fileErr);
        return NextResponse.json(
          { error: "File deletion error", details: (fileErr as Error).message || String(fileErr) },
          { status: 500 }
        );
      }
    }

    // Delete DB record
    const deletedImage = await prisma.heroImage.delete({ where: { id: imageId } });
    console.log("Deleted image record:", deletedImage);

    return NextResponse.json({ success: true, deletedImage }, { status: 200 });
  } catch (err: any) {
    console.error("Unexpected error in DELETE route:", err);
    return NextResponse.json(
      { error: "Failed to delete image", details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}