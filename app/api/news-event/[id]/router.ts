import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import slugify from "@sindresorhus/slugify";

export async function GET(_: Request, { params }: any) {
  const news = await prisma.news.findUnique({ where: { id: Number(params.id) } });
  return NextResponse.json(news);
}

export async function PUT(req: Request, { params }: any) {
  try {
    const formData = await req.formData();

    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const content = formData.get("content")?.toString() || null;
    const author = formData.get("author")?.toString() || null;
    const source = formData.get("source")?.toString() || null;
    const isPublished = formData.get("isPublished") === "true";
    const files = formData.getAll("images") as File[];

    const updateData: any = {
      title,
      description,
      content,
      author,
      source,
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    };

    if (title) updateData.slug = slugify(title);

    // Upload images if provided
    if (files.length > 0) {
      const fs = require("fs");
      const path = require("path");
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
      updateData.imageUrls = imageUrls;
    }

    const updated = await prisma.news.update({
      where: { id: Number(params.id) },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: any) {
  try {
    await prisma.news.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
