import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Safe filename: replace spaces + append timestamp to prevent duplicates
    const timestamp = Date.now();
    const safeFileName = `${file.name.replace(/\s+/g, "-")}-${timestamp}`;

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Full file path
    const filePath = path.join(uploadDir, safeFileName);

    // Write file to disk
    fs.writeFileSync(filePath, buffer);

    // Public URL
    const url = `/uploads/${safeFileName}`;

    // Save record in database
    const newImage = await prisma.heroImage.create({ data: { url } });

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error("Error creating image:", error);
    return NextResponse.json({ error: "Failed to create image" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const images = await prisma.heroImage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}
  