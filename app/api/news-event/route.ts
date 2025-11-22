import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import slugify from "@sindresorhus/slugify";

export async function GET() {
  const news = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(news);
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const content = formData.get("content")?.toString() || null;
    const author = formData.get("author")?.toString() || null;
    const source = formData.get("source")?.toString() || null;
    const isPublished = formData.get("isPublished") === "true";
    const files = formData.getAll("images") as File[];

    if (!title || !description || files.length === 0) {
      return NextResponse.json({ error: "Title, description, and at least one image are required" }, { status: 400 });
    }

    const slug = slugify(title);

    // Upload images locally
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const imageUrls: string[] = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const filePath = path.join(uploadDir, safeName);
      fs.writeFileSync(filePath, buffer);
      imageUrls.push(`/uploads/${safeName}`);
    }

    const news = await prisma.news.create({
      data: {
        title,
        slug,
        description,
        content,
        author,
        source,
        imageUrls,
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return NextResponse.json(news, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create news" }, { status: 500 });
  }
}
