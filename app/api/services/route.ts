import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET() {
  const services = await prisma.service.findMany();
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;

    if (!file || !name) {
      return NextResponse.json({ error: "Name and image are required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(uploadDir, safeName);

    fs.writeFileSync(filePath, buffer);

    const imageUrl = `/uploads/${safeName}`;

    const newService = await prisma.service.create({
      data: { name, imageUrl },
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
